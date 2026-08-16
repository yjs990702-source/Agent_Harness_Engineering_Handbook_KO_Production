import { describe, expect, it } from "vitest";
import { createInterviewDraft } from "../src/interview.js";

const completeAnswers = {
  role: "내부 운영 담당자",
  usageContext: "업무 시간에 매일 요청을 분류한다",
  problem: "메신저에 흩어진 요청이 누락된다",
  coreFlow: ["요청을 등록한다", "담당자가 목록을 확인한다"],
  failureRecovery: "저장 실패를 표시하고 안전하게 다시 시도한다",
  dataBoundary: "합성 요청만 사용하고 고객 정보는 금지한다",
  permissionBoundary: "조회만 기본 허용하고 배포는 사람 승인을 받는다",
  successMetric: "합성 회귀 시나리오에서 요청 누락 0건",
  outOfScope: ["실제 고객 데이터", "Production 자동 배포"],
} as const;

describe("Deep Interview 압축", () => {
  it("확정된 답변을 고정 AC ID가 있는 ServiceSpec으로 압축한다", () => {
    const draft = createInterviewDraft(completeAnswers);
    expect(draft.openQuestions).toEqual([]);
    expect(draft.spec).toMatchObject({
      id: "SPEC-W3",
      targetUser: "내부 운영 담당자 — 업무 시간에 매일 요청을 분류한다",
    });
    expect(draft.spec?.acceptanceCriteria).toContain("AC-04-security-boundary");
    expect(draft.spec).toMatchObject({
      dataBoundary: completeAnswers.dataBoundary,
      permissionBoundary: completeAnswers.permissionBoundary,
      failureRecovery: completeAnswers.failureRecovery,
    });
  });

  it("불완전한 답변을 추측하지 않고 열린 질문으로 남긴다", () => {
    const draft = createInterviewDraft({
      ...completeAnswers,
      permissionBoundary: "",
      successMetric: undefined,
    });
    expect(draft.spec).toBeNull();
    expect(draft.openQuestions).toEqual([
      "허용 권한과 사람 승인이 필요한 행동은 무엇입니까?",
      "성공을 판정할 측정 가능한 지표는 무엇입니까?",
    ]);
    expect(draft.confirmedAnswers.problem).toBe(completeAnswers.problem);
  });
});
