import { describe, expect, it } from "vitest";
import {
  assessShipReadiness,
  buildEvidencePack,
  createAutonomyPolicy,
  createContinuationPack,
  createDelegationBrief,
  createReleaseIdentity,
  type CriterionEvidence,
} from "../src/delivery-artifacts.js";
import { createDeploymentManifest } from "../src/deployment.js";
import { buildServiceSpec } from "../src/spec.js";

const spec = buildServiceSpec({
  problem: "팀 요청이 메신저에 흩어진다",
  targetUser: "내부 운영 담당자",
  successMetric: "요청 누락을 0건으로 유지한다",
  coreFlow: ["요청 등록", "목록 확인"],
  outOfScope: ["실제 고객 데이터", "Production 자동 배포"],
});

function completeEvidence(): CriterionEvidence[] {
  const kinds = ["review", "test", "test", "security", "deployment"] as const;
  return spec.acceptanceCriteria.map((criterionId, index) => ({
    id: `EV-${String(index + 1).padStart(2, "0")}`,
    criterionId,
    kind: kinds[index]!,
    passed: true,
    reference: `tests:${criterionId}`,
  }));
}

function completePack() {
  return buildEvidencePack(spec, {
    commitSha: "0123456",
    changedFiles: ["src/service.ts", "tests/security.test.ts"],
    evidence: completeEvidence(),
    knownRisks: ["실제 클라우드 Preview는 선택 경로"],
    rollback: "이전 검증 commit으로 되돌린다",
  });
}

describe("delivery artifacts", () => {
  it("위임 범위와 정규화된 자율권 budget을 명시한다", () => {
    const brief = createDelegationBrief(spec, {
      goal: "업무요청 트래커 Preview 준비",
      nonGoals: ["Production 자동 배포"],
      ownedPaths: ["src/", "tests/"],
    });
    const policy = createAutonomyPolicy({
      allowedTools: ["READ_FILE", "run_tests", "deploy_preview"],
      deniedPaths: [".env", ".github/workflows"],
      approvalRequiredFor: ["DEPLOY_PREVIEW"],
      budgets: { maxMinutes: 45, maxRepairs: 2, maxModelCalls: 12 },
    });
    expect(brief.returnSchema).toBe("EvidencePack");
    expect(policy.allowedTools).toContain("deploy_preview");
    expect(policy.budgets.maxRepairs).toBe(2);
  });

  it("중복 도구·경로와 허용되지 않은 승인 도구를 거부한다", () => {
    expect(() =>
      createAutonomyPolicy({
        allowedTools: ["read_file", "READ_FILE"],
        deniedPaths: [".env"],
        approvalRequiredFor: [],
        budgets: { maxMinutes: 10, maxRepairs: 1, maxModelCalls: 3 },
      }),
    ).toThrow(/중복/);
    expect(() =>
      createAutonomyPolicy({
        allowedTools: ["read_file"],
        deniedPaths: ["private", "private/secrets"],
        approvalRequiredFor: ["deploy_preview"],
        budgets: { maxMinutes: 10, maxRepairs: 1, maxModelCalls: 3 },
      }),
    ).toThrow();
  });

  it("모든 수용 기준과 보안 증거가 있을 때 출고 준비로 판정한다", () => {
    expect(assessShipReadiness(spec, completePack())).toEqual({
      ready: true,
      failures: [],
    });
  });

  it("Evidence ID·criterion 중복과 빈 통과 reference를 거부한다", () => {
    const evidence = completeEvidence();
    expect(() =>
      buildEvidencePack(spec, {
        commitSha: "0123456",
        changedFiles: ["src/service.ts"],
        evidence: [evidence[0]!, { ...evidence[1]!, id: evidence[0]!.id }],
        knownRisks: [],
        rollback: "이전 commit으로 되돌린다",
      }),
    ).toThrow(/중복 Evidence ID/);
    expect(() =>
      buildEvidencePack(spec, {
        commitSha: "0123456",
        changedFiles: ["src/service.ts"],
        evidence: [
          evidence[0]!,
          { ...evidence[1]!, criterionId: evidence[0]!.criterionId },
        ],
        knownRisks: [],
        rollback: "이전 commit으로 되돌린다",
      }),
    ).toThrow(/중복 criterion/);
    expect(() =>
      buildEvidencePack(spec, {
        commitSha: "0123456",
        changedFiles: ["src/service.ts"],
        evidence: [{ ...evidence[0]!, reference: "" }],
        knownRisks: [],
        rollback: "이전 commit으로 되돌린다",
      }),
    ).toThrow(/reference/);
  });

  it("ready_to_ship과 blocked 상태의 교차 불변식을 적용한다", () => {
    expect(() =>
      createContinuationPack({
        baseCommit: "0123456",
        status: "ready_to_ship",
        shipReadiness: "PASS",
        completed: ["로컬 verify"],
        pending: ["사람의 Preview 승인"],
        decisions: [],
        nextSafeAction: "승인 결과를 기록한다",
      }),
    ).toThrow(/pending 0개/);
    const blocked = createContinuationPack({
      baseCommit: "0123456",
      status: "blocked",
      shipReadiness: "FAIL",
      completed: ["로컬 verify"],
      pending: ["사람의 Preview 승인"],
      decisions: ["Production 자동 배포 제외"],
      nextSafeAction: "승인자에게 EvidencePack을 전달한다",
    });
    expect(blocked.pending).toEqual(["사람의 Preview 승인"]);
  });

  it("spec·commit·Evidence·승인·rollback을 하나의 release identity로 묶는다", () => {
    const pack = completePack();
    const continuation = createContinuationPack({
      baseCommit: "0123456",
      status: "ready_to_ship",
      shipReadiness: "PASS",
      completed: ["수용 기준과 보안 검증"],
      pending: [],
      decisions: ["로컬 manifest를 대체 증거로 사용"],
      nextSafeAction: "검증된 Preview 후보를 사람에게 전달한다",
    });
    const manifest = createDeploymentManifest(spec, {
      commitSha: "0123456",
      environment: "preview",
      requiredVariableNames: ["APP_ENV"],
      rollbackCondition: "health check가 실패한다",
    });
    expect(
      createReleaseIdentity(spec, pack, continuation, manifest, "APPROVAL-001"),
    ).toMatchObject({
      specId: "SPEC-W3",
      commitSha: "0123456",
      environment: "preview",
    });
    expect(() =>
      createReleaseIdentity(
        spec,
        pack,
        { ...continuation, baseCommit: "abcdef0" },
        manifest,
        "APPROVAL-001",
      ),
    ).toThrow(/commit identity/);
  });
});
