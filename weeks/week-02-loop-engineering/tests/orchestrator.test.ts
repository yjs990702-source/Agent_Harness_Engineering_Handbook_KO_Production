import { describe, expect, it } from "vitest";
import type { TaskSpec, WorkResult } from "../src/contracts.js";
import { EvidenceQualityEvaluator } from "../src/evaluator.js";
import { runHarness, type Planner, type Worker } from "../src/orchestrator.js";

const spec: TaskSpec = {
  id: "task-1",
  goal: "요청 검증",
  allowedPaths: ["src", "tests"],
  criteria: [{ id: "AC-01", description: "test", severity: "required" }],
  maxRepairs: 2,
};

const planner: Planner = { plan: async () => spec };

function validResult(): WorkResult {
  return {
    summary: "요청 검증과 회귀 테스트를 독립 증거로 확인했습니다.",
    changedFiles: ["src/request.ts", "tests/request.test.ts"],
    evidence: [
      {
        kind: "test",
        reference: "vitest",
        passed: true,
        criterionId: "AC-01",
        detail: "10 tests",
      },
      {
        kind: "diff",
        reference: "git diff",
        passed: true,
        detail: "owned paths only",
      },
    ],
  };
}

describe("runHarness", () => {
  it("Verifier와 Evaluator를 모두 통과해야 완료한다", async () => {
    const worker: Worker = { execute: async () => validResult() };
    const outcome = await runHarness({
      goal: "검증",
      planner,
      worker,
      evaluator: new EvidenceQualityEvaluator(),
    });
    expect(outcome.status).toBe("passed");
    expect(outcome.attempts).toHaveLength(1);
  });

  it("첫 실패 feedback을 repair 시도에 전달한다", async () => {
    const feedbackSeen: string[][] = [];
    const worker: Worker = {
      execute: async (_task, attempt, feedback) => {
        feedbackSeen.push([...feedback]);
        return attempt === 1
          ? { ...validResult(), evidence: [] }
          : validResult();
      },
    };
    const outcome = await runHarness({
      goal: "검증",
      planner,
      worker,
      evaluator: new EvidenceQualityEvaluator(),
    });
    expect(outcome.status).toBe("passed");
    expect(feedbackSeen[1]?.join(" ")).toMatch(/MISSING_EVIDENCE/);
  });

  it("같은 실패 signature가 반복되면 repair cap 전에 중단한다", async () => {
    const worker: Worker = {
      execute: async () => ({ ...validResult(), evidence: [] }),
    };
    const outcome = await runHarness({
      goal: "검증",
      planner,
      worker,
      evaluator: new EvidenceQualityEvaluator(),
    });
    expect(outcome.status).toBe("repeated_failure");
    expect(outcome.attempts).toHaveLength(2);
  });

  it("비정상 repair 예산을 거부한다", async () => {
    await expect(
      runHarness({
        goal: "검증",
        planner: { plan: async () => ({ ...spec, maxRepairs: 3 }) },
        worker: { execute: async () => validResult() },
        evaluator: new EvidenceQualityEvaluator(),
      }),
    ).rejects.toThrow(/0~2/);
  });
});
