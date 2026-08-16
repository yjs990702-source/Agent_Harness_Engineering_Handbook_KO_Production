import type {
  AgentContext,
  AgentExecutor,
  AgentResult,
  AgentRole,
  CollaborationPlan,
  Planner,
} from "../src/contracts.js";
import { createTeachingPlan } from "../src/planner.js";

const changedFiles: Readonly<Record<AgentRole, readonly string[]>> = {
  ui_worker: ["src/ui/request-panel.tsx"],
  logic_worker: ["src/logic/request-policy.ts"],
  test_worker: ["tests/integration/request-flow.test.ts"],
  reviewer: [],
};

const nextNodes: Readonly<Record<AgentRole, readonly string[]>> = {
  ui_worker: ["tests"],
  logic_worker: ["tests"],
  test_worker: ["review"],
  reviewer: ["verifier"],
};

export function successfulResult(context: AgentContext): AgentResult {
  const evidenceId = `${context.node.id}-evidence`;
  const criterionId: Readonly<Record<AgentRole, string>> = {
    ui_worker: "AC-UI",
    logic_worker: "AC-LOGIC",
    test_worker: "AC-TEST",
    reviewer: "AC-REVIEW",
  };
  return {
    nodeId: context.node.id,
    role: context.node.role,
    summary: `${context.node.role} 완료`,
    changedFiles: changedFiles[context.node.role],
    evidence: [
      {
        id: evidenceId,
        kind:
          context.node.role === "reviewer"
            ? "review"
            : context.node.role === "test_worker"
              ? "test"
              : "diff",
        passed: true,
        criterionIds: [criterionId[context.node.role]],
        detail: "합성 fixture 검증 통과",
      },
    ],
    handoff: {
      from: context.node.id,
      to: nextNodes[context.node.role],
      baseRevision: context.plan.baseRevision,
      summary: "다음 역할이 재현할 수 있는 인계",
      evidenceIds: [evidenceId],
      inputEvidenceIds: context.dependencyResults.flatMap((result) =>
        result.evidence.map((evidence) => evidence.id),
      ),
      unresolvedRisks: [],
    },
  };
}

export function successfulAgents(
  observe?: (context: AgentContext) => void | Promise<void>,
): Readonly<Record<AgentRole, AgentExecutor>> {
  const executor: AgentExecutor = {
    async execute(context) {
      await observe?.(context);
      return successfulResult(context);
    },
  };
  return {
    ui_worker: executor,
    logic_worker: executor,
    test_worker: executor,
    reviewer: executor,
  };
}

export class StaticPlanner implements Planner {
  constructor(
    private readonly value: CollaborationPlan = createTeachingPlan("합성 요청"),
  ) {}

  async plan(): Promise<CollaborationPlan> {
    return this.value;
  }
}
