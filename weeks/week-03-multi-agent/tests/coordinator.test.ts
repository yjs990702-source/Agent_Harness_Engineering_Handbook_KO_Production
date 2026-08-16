import { describe, expect, it } from "vitest";
import type { AgentContext } from "../src/contracts.js";
import { runCollaboration } from "../src/coordinator.js";
import { createTeachingPlan, TeachingPlanner } from "../src/planner.js";
import {
  StaticPlanner,
  successfulAgents,
  successfulResult,
} from "./fixtures.js";

describe("멀티 에이전트 Coordinator", () => {
  it("정상 결과를 passed로 fan-in한다", async () => {
    const outcome = await runCollaboration({
      request: "업무요청 패널 구현",
      planner: new TeachingPlanner(),
      agents: successfulAgents(),
    });
    expect(outcome.status).toBe("passed");
    expect(outcome.results).toHaveLength(4);
    expect(outcome.verification.passed).toBe(true);
  });

  it("UI와 Logic을 같은 병렬 wave로 실행한다", async () => {
    let activeImplementers = 0;
    let maximumActive = 0;
    const agents = successfulAgents(async (context) => {
      if (
        context.node.role === "ui_worker" ||
        context.node.role === "logic_worker"
      ) {
        activeImplementers += 1;
        maximumActive = Math.max(maximumActive, activeImplementers);
        await new Promise((resolve) => setTimeout(resolve, 5));
        activeImplementers -= 1;
      }
    });
    await runCollaboration({
      request: "병렬 실행 확인",
      planner: new StaticPlanner(),
      agents,
    });
    expect(maximumActive).toBe(2);
  });

  it("Test Worker에게 두 구현 결과를 전달한다", async () => {
    let testDependencies = 0;
    const agents = successfulAgents((context) => {
      if (context.node.role === "test_worker")
        testDependencies = context.dependencyResults.length;
    });
    await runCollaboration({
      request: "인계 확인",
      planner: new StaticPlanner(),
      agents,
    });
    expect(testDependencies).toBe(2);
  });

  it("ownership 충돌이 있으면 Agent를 실행하지 않는다", async () => {
    const plan = createTeachingPlan("충돌 확인");
    const invalidPlan = {
      ...plan,
      nodes: plan.nodes.map((node) =>
        node.id === "logic" ? { ...node, ownedPaths: ["src/ui"] } : node,
      ),
    };
    let calls = 0;
    const outcome = await runCollaboration({
      request: "충돌 확인",
      planner: new StaticPlanner(invalidPlan),
      agents: successfulAgents(() => {
        calls += 1;
      }),
    });
    expect(outcome.status).toBe("planning_failed");
    expect(calls).toBe(0);
  });

  it("Agent 결과의 역할 계약이 다르면 실행 실패한다", async () => {
    const agents = successfulAgents();
    const outcome = await runCollaboration({
      request: "역할 계약 확인",
      planner: new StaticPlanner(),
      agents: {
        ...agents,
        ui_worker: {
          async execute(context: AgentContext) {
            return { ...successfulResult(context), role: "logic_worker" };
          },
        },
      },
    });
    expect(outcome.status).toBe("execution_failed");
    expect(outcome.executionError).toContain("계약 불일치");
  });

  it("Reviewer가 파일을 고치면 verification_failed가 된다", async () => {
    const agents = successfulAgents();
    const outcome = await runCollaboration({
      request: "읽기 전용 검토",
      planner: new StaticPlanner(),
      agents: {
        ...agents,
        reviewer: {
          async execute(context: AgentContext) {
            return {
              ...successfulResult(context),
              changedFiles: ["src/ui/reviewer-fix.ts"],
            };
          },
        },
      },
    });
    expect(outcome.status).toBe("verification_failed");
    expect(
      outcome.verification.failures.some(
        (failure) => failure.code === "READ_ONLY_WRITE",
      ),
    ).toBe(true);
  });
});
