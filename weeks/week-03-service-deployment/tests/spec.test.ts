import { describe, expect, it } from "vitest";

import { buildServiceSpec } from "../src/spec.js";

describe("Deep Interview → 서비스 명세", () => {
  it("명세와 고정 수용 기준 ID를 만든다", () => {
    const spec = buildServiceSpec({
      problem: "팀 요청이 메신저에 흩어진다",
      targetUser: "내부 운영 담당자",
      successMetric: "요청 누락을 0건으로 유지한다",
      coreFlow: ["요청 등록", "목록 확인"],
      outOfScope: ["실제 고객 데이터", "Production 자동 배포"],
    });

    expect(spec.id).toBe("SPEC-W3");
    expect(spec.acceptanceCriteria).toContain("AC-05-deployment-evidence");
  });

  it("모호하거나 빈 답변을 거부한다", () => {
    expect(() =>
      buildServiceSpec({
        problem: "",
        targetUser: "운영자",
        successMetric: "누락 감소",
        coreFlow: [],
        outOfScope: ["운영 데이터"],
      }),
    ).toThrow(/problem/);
  });
});
