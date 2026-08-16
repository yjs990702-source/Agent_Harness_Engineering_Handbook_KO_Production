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

export async function runCollaboration(input: {
  request: string;
  planner: Planner;
  agents: Readonly<Record<AgentRole, AgentExecutor>>;
}): Promise<CollaborationOutcome> {
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

  const waves = buildExecutionWaves(plan.nodes);
  const results = new Map<string, AgentResult>();
  try {
    for (const wave of waves) {
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
          const result = await input.agents[node.role].execute({
            request: plan.request,
            plan,
            node,
            dependencyResults,
          });
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
