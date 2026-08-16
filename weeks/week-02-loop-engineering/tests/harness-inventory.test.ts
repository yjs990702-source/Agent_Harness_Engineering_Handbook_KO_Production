import { describe, expect, it } from "vitest";
import {
  createHarnessDietReport,
  type HarnessInventoryItem,
} from "../src/harness-inventory.js";

const base: HarnessInventoryItem = {
  id: "rule-security",
  kind: "rule",
  owner: "platform-team",
  lastUsedAt: "2026-08-01T00:00:00.000Z",
  preventedFailures: 3,
  scope: "global",
  recommendedScope: "global",
  enforceable: true,
  obsolete: false,
  reason: "민감 경로 변경을 예방한다",
  removalCondition: "동등한 Hook과 회귀 테스트가 대체한다",
};

describe("하네스 다이어트 인벤토리", () => {
  it("Keep·Move·Merge·Narrow·Enforce·Delete를 근거 기반으로 분류한다", () => {
    const report = createHarnessDietReport([
      { ...base, id: "keep", kind: "hook" },
      {
        ...base,
        id: "move",
        kind: "skill",
        scope: "path",
        recommendedScope: "on-demand",
        enforceable: false,
      },
      { ...base, id: "merge", kind: "rule", duplicateOf: "keep" },
      {
        ...base,
        id: "narrow",
        kind: "hook",
        scope: "global",
        recommendedScope: "path",
        enforceable: false,
      },
      { ...base, id: "enforce", kind: "rule" },
      {
        ...base,
        id: "delete",
        kind: "skill",
        obsolete: true,
        preventedFailures: 0,
      },
    ]);
    expect(report.items.map((item) => item.decision)).toEqual([
      "Keep",
      "Move",
      "Merge",
      "Narrow",
      "Enforce",
      "Delete",
    ]);
    expect(report.afterCount).toBe(4);
  });

  it("소유자·근거·최근 사용·제거 조건이 없는 유지 후보를 거부한다", () => {
    expect(() => createHarnessDietReport([{ ...base, owner: "" }])).toThrow(
      /owner/,
    );
    expect(() =>
      createHarnessDietReport([{ ...base, lastUsedAt: "unknown" }]),
    ).toThrow(/lastUsedAt/);
    expect(() =>
      createHarnessDietReport([{ ...base, removalCondition: "" }]),
    ).toThrow(/removalCondition/);
  });

  it("존재하지 않는 병합 대상과 중복 ID를 거부한다", () => {
    expect(() =>
      createHarnessDietReport([{ ...base, duplicateOf: "missing" }]),
    ).toThrow(/병합 대상/);
    expect(() => createHarnessDietReport([base, base])).toThrow(/중복/);
  });
});
