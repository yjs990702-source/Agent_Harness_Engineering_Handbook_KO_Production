import { describe, expect, it } from "vitest";
import {
  compareWithBaseline,
  scoreEvaluation,
  type EvaluationMetrics,
} from "../src/evaluation-portfolio.js";

const baseline: EvaluationMetrics = {
  result: { passedCriteria: 3, totalCriteria: 3 },
  process: { changedFiles: 4, retries: 1 },
  safety: { policyViolations: 0, securityTestsPassed: true },
  cost: { modelCalls: 4, latencyMs: 4_000, humanInterventions: 0 },
};

describe("evaluation portfolio", () => {
  it("결과·과정·안전·비용을 분리해 계산한다", () => {
    const score = scoreEvaluation(baseline);
    expect(score.axes).toEqual({
      result: 40,
      process: 17,
      safety: 25,
      cost: 14,
    });
    expect(score.total).toBe(96);
    expect(score.gatePassed).toBe(true);
  });

  it("안전 위반이 있으면 총점과 무관하게 승격하지 않는다", () => {
    const comparison = compareWithBaseline({
      baseline: {
        ...baseline,
        result: { passedCriteria: 2, totalCriteria: 3 },
      },
      candidate: {
        ...baseline,
        safety: { policyViolations: 1, securityTestsPassed: true },
        process: { changedFiles: 2, retries: 0 },
      },
    });
    expect(comparison.promote).toBe(false);
    expect(comparison.candidate.gatePassed).toBe(false);
  });

  it("후보가 안전 Gate와 최소 개선 폭을 모두 만족할 때만 승격한다", () => {
    const comparison = compareWithBaseline({
      baseline: {
        ...baseline,
        process: { changedFiles: 8, retries: 2 },
        cost: { modelCalls: 8, latencyMs: 11_000, humanInterventions: 1 },
      },
      candidate: baseline,
      minimumImprovement: 3,
    });
    expect(comparison.promote).toBe(true);
  });
});
