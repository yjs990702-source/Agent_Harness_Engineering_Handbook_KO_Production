import { describe, expect, it } from "vitest";
import type { AgentContext, AgentResult } from "../src/contracts.js";
import { createTeachingPlan } from "../src/planner.js";
import { verifyCollaboration } from "../src/verifier.js";
import { successfulResult } from "./fixtures.js";

function contextFor(nodeId: string): AgentContext {
  const plan = createTeachingPlan("검증 fixture");
  const node = plan.nodes.find((candidate) => candidate.id === nodeId);
  if (!node) throw new Error(nodeId);
  return { request: "검증 fixture", plan, node, dependencyResults: [] };
}

function completeResults(): AgentResult[] {
  return ["ui", "logic", "tests", "review"].map((id) =>
    successfulResult(contextFor(id)),
  );
}

describe("독립 Verifier", () => {
  it("완전한 evidence와 handoff를 통과시킨다", () => {
    const plan = createTeachingPlan("검증 fixture");
    expect(verifyCollaboration(plan, completeResults())).toEqual({
      passed: true,
      failures: [],
    });
  });

  it("결과 누락을 탐지한다", () => {
    const plan = createTeachingPlan("검증 fixture");
    const verdict = verifyCollaboration(
      plan,
      completeResults().filter((result) => result.nodeId !== "logic"),
    );
    expect(
      verdict.failures.some((failure) => failure.code === "MISSING_RESULT"),
    ).toBe(true);
  });

  it("소유 범위 밖 변경을 탐지한다", () => {
    const plan = createTeachingPlan("검증 fixture");
    const results = completeResults().map((result) =>
      result.nodeId === "ui"
        ? { ...result, changedFiles: ["src/logic/leak.ts"] }
        : result,
    );
    expect(
      verifyCollaboration(plan, results).failures.some(
        (failure) => failure.code === "PATH_OUT_OF_SCOPE",
      ),
    ).toBe(true);
  });

  it("실패 evidence를 탐지한다", () => {
    const plan = createTeachingPlan("검증 fixture");
    const results = completeResults().map((result) =>
      result.nodeId === "logic"
        ? {
            ...result,
            evidence: result.evidence.map((evidence) => ({
              ...evidence,
              passed: false,
            })),
          }
        : result,
    );
    expect(
      verifyCollaboration(plan, results).failures.some(
        (failure) => failure.code === "FAILED_EVIDENCE",
      ),
    ).toBe(true);
  });

  it("base revision이 다른 handoff를 탐지한다", () => {
    const plan = createTeachingPlan("검증 fixture");
    const results = completeResults().map((result) =>
      result.nodeId === "tests"
        ? {
            ...result,
            handoff: { ...result.handoff, baseRevision: "stale-revision" },
          }
        : result,
    );
    expect(
      verifyCollaboration(plan, results).failures.some(
        (failure) => failure.code === "INVALID_HANDOFF",
      ),
    ).toBe(true);
  });
});
