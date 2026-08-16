import { describe, expect, it } from "vitest";
import type { TaskSpec, WorkResult } from "../src/contracts.js";
import { verifyWorkResult } from "../src/verifier.js";

const spec: TaskSpec = {
  id: "task-1",
  goal: "제목 검증",
  allowedPaths: [
    "weeks/week-01-foundations/src",
    "weeks/week-01-foundations/tests",
  ],
  criteria: [{ id: "AC-01", description: "경계값", severity: "required" }],
  maxRepairs: 1,
};

function result(overrides: Partial<WorkResult> = {}): WorkResult {
  return {
    summary: "제목 검증 경계와 테스트 증거를 추가했습니다.",
    changedFiles: ["weeks/week-01-foundations/src/request.ts"],
    evidence: [
      {
        kind: "test",
        reference: "request.test.ts",
        passed: true,
        criterionId: "AC-01",
        detail: "통과",
      },
    ],
    ...overrides,
  };
}

describe("verifyWorkResult", () => {
  it("소유 경로와 required evidence를 검증한다", () => {
    expect(verifyWorkResult(spec, result()).passed).toBe(true);
  });

  it("소유권 밖 파일과 민감 경로를 거부한다", () => {
    const verdict = verifyWorkResult(
      spec,
      result({ changedFiles: [".env.production"] }),
    );
    expect(verdict.passed).toBe(false);
    expect(verdict.failures.map((failure) => failure.code)).toEqual(
      expect.arrayContaining(["SENSITIVE_PATH", "PATH_OUT_OF_SCOPE"]),
    );
  });

  it("required criterion의 누락·실패 증거를 거부한다", () => {
    expect(
      verifyWorkResult(spec, result({ evidence: [] })).failures[0]?.code,
    ).toBe("MISSING_EVIDENCE");
    expect(
      verifyWorkResult(
        spec,
        result({
          evidence: [
            {
              kind: "test",
              reference: "test",
              passed: false,
              criterionId: "AC-01",
              detail: "실패",
            },
          ],
        }),
      ).failures[0]?.code,
    ).toBe("FAILED_EVIDENCE");
  });
});
