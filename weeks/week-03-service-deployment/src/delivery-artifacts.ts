import type { ServiceSpec } from "./contracts.js";

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
  completed: readonly string[];
  pending: readonly string[];
  decisions: readonly string[];
  nextSafeAction: string;
}>;

function nonEmpty(value: string, field: string): string {
  const normalized = value.trim();
  if (normalized.length < 3)
    throw new TypeError(`${field}가 유효하지 않습니다.`);
  return normalized;
}

function safeRelativePath(path: string): boolean {
  const normalized = path.replaceAll("\\", "/");
  return (
    normalized.length > 0 &&
    !normalized.startsWith("/") &&
    !/^[a-zA-Z]:\//.test(normalized) &&
    !normalized.split("/").includes("..")
  );
}

export function createDelegationBrief(
  spec: ServiceSpec,
  input: Omit<DelegationBrief, "acceptanceCriteria" | "returnSchema">,
): DelegationBrief {
  if (
    input.ownedPaths.length < 1 ||
    input.ownedPaths.some((path) => !safeRelativePath(path))
  ) {
    throw new Error("ownedPaths에는 안전한 상대 경로가 필요합니다.");
  }
  return Object.freeze({
    goal: nonEmpty(input.goal, "goal"),
    nonGoals: Object.freeze([...input.nonGoals]),
    ownedPaths: Object.freeze([...input.ownedPaths]),
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
  ) {
    throw new RangeError("실행 budget이 허용 범위를 벗어났습니다.");
  }
  return Object.freeze({
    allowedTools: Object.freeze([...input.allowedTools]),
    deniedPaths: Object.freeze([...input.deniedPaths]),
    approvalRequiredFor: Object.freeze([...input.approvalRequiredFor]),
    budgets: Object.freeze({ ...input.budgets }),
  });
}

export function buildEvidencePack(
  spec: ServiceSpec,
  input: Omit<EvidencePack, "specId">,
): EvidencePack {
  if (!/^[0-9a-f]{7,40}$/i.test(input.commitSha)) {
    throw new TypeError("commitSha 형식이 유효하지 않습니다.");
  }
  if (input.changedFiles.some((path) => !safeRelativePath(path))) {
    throw new Error("변경 파일은 안전한 상대 경로여야 합니다.");
  }
  const allowedCriteria = new Set<string>(spec.acceptanceCriteria);
  if (input.evidence.some((item) => !allowedCriteria.has(item.criterionId))) {
    throw new Error("알 수 없는 수용 기준 Evidence가 있습니다.");
  }
  return Object.freeze({
    specId: spec.id,
    commitSha: input.commitSha,
    changedFiles: Object.freeze([...input.changedFiles]),
    evidence: Object.freeze([...input.evidence]),
    knownRisks: Object.freeze([...input.knownRisks]),
    rollback: nonEmpty(input.rollback, "rollback"),
  });
}

export function assessShipReadiness(
  spec: ServiceSpec,
  pack: EvidencePack,
): Readonly<{ ready: boolean; failures: readonly string[] }> {
  const failures: string[] = [];
  for (const criterionId of spec.acceptanceCriteria) {
    const passing = pack.evidence.some(
      (item) => item.criterionId === criterionId && item.passed,
    );
    if (!passing) failures.push(`MISSING_PASSING_EVIDENCE:${criterionId}`);
  }
  if (!pack.evidence.some((item) => item.kind === "security" && item.passed)) {
    failures.push("MISSING_SECURITY_EVIDENCE");
  }
  if (pack.changedFiles.length === 0) failures.push("EMPTY_CHANGESET");
  return Object.freeze({
    ready: failures.length === 0,
    failures: Object.freeze(failures),
  });
}

export function createContinuationPack(
  input: ContinuationPack,
): ContinuationPack {
  if (!/^[0-9a-f]{7,40}$/i.test(input.baseCommit)) {
    throw new TypeError("baseCommit 형식이 유효하지 않습니다.");
  }
  return Object.freeze({
    ...input,
    completed: Object.freeze([...input.completed]),
    pending: Object.freeze([...input.pending]),
    decisions: Object.freeze([...input.decisions]),
    nextSafeAction: nonEmpty(input.nextSafeAction, "nextSafeAction"),
  });
}
