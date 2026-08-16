import { describe, expect, it } from "vitest";

import { scoreContestSubmission } from "../src/contest.js";

describe("Contest Day 점수", () => {
  it("100점 루브릭과 Gate를 분리한다", () => {
    const result = scoreContestSubmission({
      specification: 15,
      harness: 20,
      loopAndEvaluation: 20,
      functionality: 20,
      deploymentAndSecurity: 15,
      prAndDemo: 10,
    });
    expect(result).toMatchObject({ eligible: true, total: 100 });
  });

  it("Secret 노출이 있으면 점수와 무관하게 선정 대상에서 제외한다", () => {
    const result = scoreContestSubmission(
      {
        specification: 15,
        harness: 20,
        loopAndEvaluation: 20,
        functionality: 20,
        deploymentAndSecurity: 15,
        prAndDemo: 10,
      },
      ["SECRET_EXPOSURE"],
    );
    expect(result).toMatchObject({ eligible: false, total: 100 });
  });
});
