import type { DeploymentManifest, ServiceSpec } from "./contracts.js";

export type DelegationBrief = Readonly<{
  goal: string;
  nonGoals: readonly string[];
  ownedPaths: readonly string[];
  acceptanceCriteria: ServiceSpec["acceptanceCriteria"];
  returnSchema: "EvidencePack";
}>;

export type AutonomyPolicy = Readonly<{
  allowedTools: readonly string[];
  deniedPaths: readonly string[];
  approvalRequiredFor: readonly string[];
  budgets: Readonly<{
    maxMinutes: number;
    maxRepairs: number;
    maxModelCalls: number;
  }>;
}>;

export type CriterionEvidence = Readonly<{
  id: string;
  criterionId: ServiceSpec["acceptanceCriteria"][number];
  kind: "test" | "security" | "deployment" | "review";
  passed: boolean;
  reference: string;
}>;

export type EvidencePack = Readonly<{
  specId: ServiceSpec["id"];
  commitSha: string;
  changedFiles: readonly string[];
  evidence: readonly CriterionEvidence[];
  knownRisks: readonly string[];
  rollback: string;
}>;

export type ContinuationPack = Readonly<{
  baseCommit: string;
  status: "ready_to_ship" | "blocked";
  shipReadiness: "PASS" | "FAIL";
  completed: readonly string[];
  pending: readonly string[];
  decisions: readonly string[];
  nextSafeAction: string;
}>;

export type ReleaseIdentity = Readonly<{
  specId: ServiceSpec["id"];
  commitSha: string;
  environment: DeploymentManifest["environment"];
  changedFiles: readonly string[];
  evidenceIds: readonly string[];
  approvalReference: string;
  rollback: string;
}>;

function nonEmpty(value: string, field: string): string {
  const normalized = value.trim();
  if (normalized.length < 3)
    throw new TypeError(`${field}가 유효하지 않습니다.`);
  return normalized;
}

function safeRelativePath(value: string): string | null {
  // 절대 경로와 상위 이동을 제거해 Evidence가 저장소 밖 파일을 가리키지 못하게 합니다.
  let normalized = value.trim().replaceAll("\\", "/").replace(/\/+$/, "");
  if (normalized.startsWith("./")) normalized = normalized.slice(2);
  if (
    !normalized ||
    normalized.startsWith("/") ||
    /^[a-zA-Z]:\//.test(normalized) ||
    normalized.split("/").some((part) => !part || part === "." || part === "..")
  )
    return null;
  return normalized;
}

function normalizeUnique(
  values: readonly string[],
  field: string,
  pathMode = false,
): readonly string[] {
  // 비교 전에 표기를 정규화해야 대소문자나 구분자 차이로 중복 검사를 우회하지 못합니다.
  const normalized = values.map((value) => {
    const result = pathMode
      ? safeRelativePath(value)
      : value.trim().toLowerCase();
    if (!result || (!pathMode && !/^[a-z][a-z0-9_]{2,63}$/.test(result))) {
      throw new Error(`${field} 값이 유효하지 않습니다: ${value}`);
    }
    return result;
  });
  if (new Set(normalized).size !== normalized.length)
    throw new Error(`${field}에 중복 값이 있습니다.`);
  if (pathMode) {
    for (let left = 0; left < normalized.length; left += 1) {
      for (let right = left + 1; right < normalized.length; right += 1) {
        const a = normalized[left]!;
        const b = normalized[right]!;
        if (a.startsWith(`${b}/`) || b.startsWith(`${a}/`)) {
          throw new Error(`${field}에 중첩 경로 충돌이 있습니다.`);
        }
      }
    }
  }
  return Object.freeze(normalized);
}

export function createDelegationBrief(
  spec: ServiceSpec,
  input: Omit<DelegationBrief, "acceptanceCriteria" | "returnSchema">,
): DelegationBrief {
  // worker는 목표뿐 아니라 비목표·소유 경로·수용 기준·반환 schema를 함께 받습니다.
  const ownedPaths = normalizeUnique(input.ownedPaths, "ownedPaths", true);
  if (ownedPaths.length < 1)
    throw new Error("ownedPaths가 하나 이상 필요합니다.");
  return Object.freeze({
    goal: nonEmpty(input.goal, "goal"),
    nonGoals: Object.freeze(
      input.nonGoals.map((value) => nonEmpty(value, "nonGoal")),
    ),
    ownedPaths,
    acceptanceCriteria: spec.acceptanceCriteria,
    returnSchema: "EvidencePack",
  });
}

export function createAutonomyPolicy(input: AutonomyPolicy): AutonomyPolicy {
  if (
    input.budgets.maxMinutes < 1 ||
    input.budgets.maxRepairs < 0 ||
    input.budgets.maxRepairs > 2 ||
    input.budgets.maxModelCalls < 1
  )
    throw new RangeError("실행 budget이 허용 범위를 벗어났습니다.");
  const allowedTools = normalizeUnique(input.allowedTools, "allowedTools");
  const approvalRequiredFor = normalizeUnique(
    input.approvalRequiredFor,
    "approvalRequiredFor",
  );
  if (approvalRequiredFor.some((tool) => !allowedTools.includes(tool))) {
    throw new Error("승인 대상 도구는 allowedTools에도 선언되어야 합니다.");
  }
  return Object.freeze({
    allowedTools,
    deniedPaths: normalizeUnique(input.deniedPaths, "deniedPaths", true),
    approvalRequiredFor,
    budgets: Object.freeze({ ...input.budgets }),
  });
}

export function buildEvidencePack(
  spec: ServiceSpec,
  input: Omit<EvidencePack, "specId">,
): EvidencePack {
  // Evidence는 현재 spec과 commit의 수용 기준에 대응하는 포인터여야 합니다.
  if (!/^[0-9a-f]{7,40}$/i.test(input.commitSha))
    throw new TypeError("commitSha 형식이 유효하지 않습니다.");
  const changedFiles = normalizeUnique(
    input.changedFiles,
    "changedFiles",
    true,
  );
  const allowedCriteria = new Set<string>(spec.acceptanceCriteria);
  const evidenceIds = new Set<string>();
  const criterionIds = new Set<string>();
  for (const item of input.evidence) {
    if (!allowedCriteria.has(item.criterionId))
      throw new Error("알 수 없는 수용 기준 Evidence가 있습니다.");
    if (evidenceIds.has(item.id))
      throw new Error(`중복 Evidence ID: ${item.id}`);
    if (criterionIds.has(item.criterionId))
      throw new Error(`중복 criterion Evidence: ${item.criterionId}`);
    if (item.passed && item.reference.trim().length < 3)
      throw new Error(`통과 Evidence reference 누락: ${item.id}`);
    evidenceIds.add(item.id);
    criterionIds.add(item.criterionId);
  }
  return Object.freeze({
    specId: spec.id,
    commitSha: input.commitSha,
    changedFiles,
    evidence: Object.freeze(
      input.evidence.map((item) =>
        Object.freeze({ ...item, reference: item.reference.trim() }),
      ),
    ),
    knownRisks: Object.freeze([...input.knownRisks]),
    rollback: nonEmpty(input.rollback, "rollback"),
  });
}

export function assessShipReadiness(
  spec: ServiceSpec,
  pack: EvidencePack,
): Readonly<{ ready: boolean; failures: readonly string[] }> {
  // 평균 점수로 상쇄하지 않고 빠진 기준과 보안 Evidence를 각각 오류 코드로 남깁니다.
  const failures: string[] = [];
  if (pack.specId !== spec.id) failures.push("SPEC_ID_MISMATCH");
  for (const criterionId of spec.acceptanceCriteria) {
    if (
      !pack.evidence.some(
        (item) => item.criterionId === criterionId && item.passed,
      )
    ) {
      failures.push(`MISSING_PASSING_EVIDENCE:${criterionId}`);
    }
  }
  if (!pack.evidence.some((item) => item.kind === "security" && item.passed))
    failures.push("MISSING_SECURITY_EVIDENCE");
  if (pack.changedFiles.length === 0) failures.push("EMPTY_CHANGESET");
  return Object.freeze({
    ready: failures.length === 0,
    failures: Object.freeze(failures),
  });
}

export function createContinuationPack(
  input: ContinuationPack,
): ContinuationPack {
  if (!/^[0-9a-f]{7,40}$/i.test(input.baseCommit))
    throw new TypeError("baseCommit 형식이 유효하지 않습니다.");
  if (
    input.status === "ready_to_ship" &&
    (input.pending.length > 0 || input.shipReadiness !== "PASS")
  ) {
    throw new Error(
      "ready_to_ship에는 pending 0개와 ship readiness PASS가 필요합니다.",
    );
  }
  if (input.status === "blocked" && input.pending.length === 0)
    throw new Error("blocked 상태에는 미완료 항목이 필요합니다.");
  const overlap = input.completed.find((item) => input.pending.includes(item));
  if (overlap) throw new Error(`완료·미완료 항목 충돌: ${overlap}`);
  return Object.freeze({
    ...input,
    completed: Object.freeze([...input.completed]),
    pending: Object.freeze([...input.pending]),
    decisions: Object.freeze([...input.decisions]),
    nextSafeAction: nonEmpty(input.nextSafeAction, "nextSafeAction"),
  });
}

export function createReleaseIdentity(
  spec: ServiceSpec,
  pack: EvidencePack,
  continuation: ContinuationPack,
  manifest: DeploymentManifest,
  approvalReference: string,
): ReleaseIdentity {
  // pack·handoff·manifest가 같은 commit을 가리키는지 마지막 Gate에서 교차 확인합니다.
  if (!assessShipReadiness(spec, pack).ready)
    throw new Error("EvidencePack이 출고 준비 상태가 아닙니다.");
  if (
    continuation.status !== "ready_to_ship" ||
    continuation.shipReadiness !== "PASS"
  )
    throw new Error("ContinuationPack이 출고 준비 상태가 아닙니다.");
  if (
    pack.commitSha !== continuation.baseCommit ||
    pack.commitSha !== manifest.commitSha
  )
    throw new Error("release commit identity가 일치하지 않습니다.");
  if (
    manifest.specId !== spec.id ||
    manifest.acceptanceCriteria.join("|") !== spec.acceptanceCriteria.join("|")
  ) {
    throw new Error("release spec identity가 일치하지 않습니다.");
  }
  for (const kind of ["security", "review", "deployment"] as const) {
    if (!pack.evidence.some((item) => item.kind === kind && item.passed))
      throw new Error(`${kind} Evidence가 필요합니다.`);
  }
  return Object.freeze({
    specId: spec.id,
    commitSha: pack.commitSha,
    environment: manifest.environment,
    changedFiles: pack.changedFiles,
    evidenceIds: Object.freeze(pack.evidence.map((item) => item.id)),
    approvalReference: nonEmpty(approvalReference, "approvalReference"),
    rollback: `${pack.rollback}; ${manifest.rollbackCondition}`,
  });
}
