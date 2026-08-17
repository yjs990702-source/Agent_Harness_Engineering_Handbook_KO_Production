import type {
  AgentExecutor,
  AgentResult,
  AgentRole,
  CollaborationOutcome,
  Planner,
} from "./contracts.js";
import {
  buildExecutionWaves,
  validatePlan,
  validateRequestSpec,
} from "./dag.js";
import { verifyCollaboration } from "./verifier.js";

const emptyVerification = { passed: false, failures: [] } as const;

async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
): Promise<T> {
  // 개별 worker가 멈춰도 전체 orchestration이 무한 대기하지 않게 시간 상한을 둡니다.
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () => reject(new Error(`Agent 실행 시간 초과: ${timeoutMs}ms`)),
      timeoutMs,
    );
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export async function runCollaboration(input: {
  request: string;
  planner: Planner;
  agents: Readonly<Record<AgentRole, AgentExecutor>>;
  timeoutMs?: number;
}): Promise<CollaborationOutcome> {
  // planner 출력도 신뢰하지 않는 입력입니다. 실행 전에 DAG와 요청 계약을 검증합니다.
  const timeoutMs = input.timeoutMs ?? 5_000;
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > 60_000) {
    throw new RangeError("timeoutMs는 1~60000 범위의 정수여야 합니다.");
  }
  let plan;
  try {
    plan = await input.planner.plan(input.request);
  } catch (error) {
    return {
      status: "planning_failed",
      waves: [],
      results: [],
      planFailures: [
        {
          code: "INVALID_ROLE_GRAPH",
          detail: error instanceof Error ? error.message : "planner error",
        },
      ],
      verification: emptyVerification,
    };
  }

  const planFailures = [
    ...validateRequestSpec(plan.request),
    ...validatePlan(plan.nodes),
  ];
  if (planFailures.length > 0)
    return {
      status: "planning_failed",
      plan,
      waves: [],
      results: [],
      planFailures,
      verification: emptyVerification,
    };

  // 의존성이 없는 node만 같은 wave에 배치해 불필요한 fan-out을 제한합니다.
  const waves = buildExecutionWaves(plan.nodes);
  const results = new Map<string, AgentResult>();
  try {
    for (const wave of waves) {
      // 한 wave 안에서만 병렬 실행하고, 다음 wave에는 검증된 dependency 결과만 넘깁니다.
      const completed = await Promise.all(
        wave.map(async (nodeId) => {
          const node = plan.nodes.find((candidate) => candidate.id === nodeId);
          if (!node) throw new Error(`계획 노드를 찾을 수 없습니다: ${nodeId}`);
          const dependencyResults = node.dependsOn.map((dependency) => {
            const result = results.get(dependency);
            if (!result)
              throw new Error(`dependency 결과가 없습니다: ${dependency}`);
            return result;
          });
          const result = await withTimeout(
            input.agents[node.role].execute({
              request: plan.request,
              plan,
              node,
              dependencyResults,
            }),
            timeoutMs,
          );
          // worker의 자기 보고가 배정 계약과 일치하는지 coordinator가 다시 확인합니다.
          if (result.nodeId !== node.id || result.role !== node.role)
            throw new Error(`Agent 결과 계약 불일치: ${node.id}`);
          return result;
        }),
      );
      for (const result of completed) results.set(result.nodeId, result);
    }
  } catch (error) {
    return {
      status: "execution_failed",
      plan,
      waves,
      results: [...results.values()],
      planFailures: [],
      verification: emptyVerification,
      executionError:
        error instanceof Error ? error.message : "execution error",
    };
  }

  const orderedResults = plan.nodes
    .map((node) => results.get(node.id))
    .filter((result): result is AgentResult => Boolean(result));
  // worker 성공 응답과 별개로 독립 verifier가 fan-in Evidence를 최종 판정합니다.
  const verification = verifyCollaboration(plan, orderedResults);
  return {
    status: verification.passed ? "passed" : "verification_failed",
    plan,
    waves,
    results: orderedResults,
    planFailures: [],
    verification,
  };
}
