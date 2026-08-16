import { describe, expect, it } from "vitest";
import {
  assessShipReadiness,
  buildEvidencePack,
  createAutonomyPolicy,
  createContinuationPack,
  createDelegationBrief,
} from "../src/delivery-artifacts.js";
import { buildServiceSpec } from "../src/spec.js";

const spec = buildServiceSpec({
  problem: "팀 요청이 메신저에 흩어진다",
  targetUser: "내부 운영 담당자",
  successMetric: "요청 누락을 0건으로 유지한다",
  coreFlow: ["요청 등록", "목록 확인"],
  outOfScope: ["실제 고객 데이터", "Production 자동 배포"],
});

describe("delivery artifacts", () => {
  it("위임 범위와 자율권 budget을 명시한다", () => {
    const brief = createDelegationBrief(spec, {
      goal: "업무요청 트래커 Preview 준비",
      nonGoals: ["Production 자동 배포"],
      ownedPaths: ["src/", "tests/"],
    });
    const policy = createAutonomyPolicy({
      allowedTools: ["read_file", "run_tests"],
      deniedPaths: [".env", ".github/workflows"],
      approvalRequiredFor: ["deploy_preview"],
      budgets: { maxMinutes: 45, maxRepairs: 2, maxModelCalls: 12 },
    });
    expect(brief.returnSchema).toBe("EvidencePack");
    expect(policy.budgets.maxRepairs).toBe(2);
  });

  it("모든 수용 기준과 보안 증거가 있을 때 출고 준비로 판정한다", () => {
    const pack = buildEvidencePack(spec, {
      commitSha: "0123456",
      changedFiles: ["src/service.ts", "tests/security.test.ts"],
      evidence: spec.acceptanceCriteria.map((criterionId, index) => ({
        id: `EV-${String(index + 1).padStart(2, "0")}`,
        criterionId,
        kind: criterionId === "AC-04-security-boundary" ? "security" : "test",
        passed: true,
        reference: `tests:${criterionId}`,
      })),
      knownRisks: ["실제 클라우드 Preview는 선택 경로"],
      rollback: "이전 검증 commit으로 되돌린다",
    });
    expect(assessShipReadiness(spec, pack)).toEqual({
      ready: true,
      failures: [],
    });
  });

  it("인계는 다음 안전 행동과 미완료 항목을 분리한다", () => {
    const pack = createContinuationPack({
      baseCommit: "0123456",
      status: "blocked",
      completed: ["로컬 verify"],
      pending: ["사람의 Preview 승인"],
      decisions: ["Production 자동 배포 제외"],
      nextSafeAction: "승인자에게 EvidencePack을 전달한다",
    });
    expect(pack.pending).toEqual(["사람의 Preview 승인"]);
  });
});
