export type HarnessKind = "rule" | "skill" | "hook" | "evaluator";
export type HarnessScope = "global" | "path" | "on-demand";
export type DietDecision =
  | "Keep"
  | "Move"
  | "Merge"
  | "Narrow"
  | "Enforce"
  | "Delete";

export type HarnessInventoryItem = Readonly<{
  id: string;
  kind: HarnessKind;
  owner: string;
  lastUsedAt: string;
  preventedFailures: number;
  scope: HarnessScope;
  recommendedScope: HarnessScope;
  enforceable: boolean;
  obsolete: boolean;
  duplicateOf?: string;
  reason: string;
  removalCondition: string;
}>;

export type ClassifiedHarnessItem = HarnessInventoryItem &
  Readonly<{
    decision: DietDecision;
  }>;

function required(value: string, field: string): void {
  if (value.trim().length < 3) throw new Error(`${field} 근거가 필요합니다.`);
}

function classify(item: HarnessInventoryItem): DietDecision {
  if (item.obsolete && item.preventedFailures === 0) return "Delete";
  if (item.duplicateOf) return "Merge";
  if (item.enforceable && (item.kind === "rule" || item.kind === "skill"))
    return "Enforce";
  if (item.scope === "global" && item.recommendedScope === "path")
    return "Narrow";
  if (item.scope !== item.recommendedScope) return "Move";
  return "Keep";
}

export function createHarnessDietReport(
  items: readonly HarnessInventoryItem[],
): Readonly<{
  items: readonly ClassifiedHarnessItem[];
  beforeCount: number;
  afterCount: number;
  missingVerificationRateBefore: number;
  missingVerificationRateAfter: number;
}> {
  if (items.length === 0) throw new Error("하네스 인벤토리가 비어 있습니다.");
  const ids = new Set<string>();
  for (const item of items) {
    required(item.id, "id");
    required(item.owner, "owner");
    required(item.reason, "reason");
    required(item.removalCondition, "removalCondition");
    if (ids.has(item.id)) throw new Error(`중복 인벤토리 ID: ${item.id}`);
    ids.add(item.id);
    if (!Number.isFinite(Date.parse(item.lastUsedAt)))
      throw new Error(`lastUsedAt이 유효하지 않습니다: ${item.id}`);
    if (
      !Number.isInteger(item.preventedFailures) ||
      item.preventedFailures < 0
    ) {
      throw new Error(`preventedFailures가 유효하지 않습니다: ${item.id}`);
    }
  }
  for (const item of items) {
    if (item.duplicateOf && !ids.has(item.duplicateOf)) {
      throw new Error(`병합 대상이 없습니다: ${item.id}`);
    }
  }
  const classified = items.map((item) =>
    Object.freeze({ ...item, decision: classify(item) }),
  );
  const afterCount = classified.filter(
    (item) => item.decision !== "Delete" && item.decision !== "Merge",
  ).length;
  const missingBefore =
    items.filter((item) => !item.enforceable).length / items.length;
  const remaining = classified.filter(
    (item) => item.decision !== "Delete" && item.decision !== "Merge",
  );
  const missingAfter = remaining.filter(
    (item) => item.decision !== "Enforce" && !item.enforceable,
  ).length;
  return Object.freeze({
    items: Object.freeze(classified),
    beforeCount: items.length,
    afterCount,
    missingVerificationRateBefore: missingBefore,
    missingVerificationRateAfter:
      remaining.length === 0 ? 0 : missingAfter / remaining.length,
  });
}
