import type { CollaborationNode, PlanFailure } from "./contracts.js";
import { validateOwnership } from "./ownership.js";

function roleCount(
  nodes: readonly CollaborationNode[],
  role: CollaborationNode["role"],
): number {
  return nodes.filter((node) => node.role === role).length;
}

export function buildExecutionWaves(
  nodes: readonly CollaborationNode[],
): readonly (readonly string[])[] {
  const remaining = new Map(nodes.map((node) => [node.id, node]));
  const completed = new Set<string>();
  const waves: string[][] = [];

  while (remaining.size > 0) {
    const ready = [...remaining.values()]
      .filter((node) =>
        node.dependsOn.every((dependency) => completed.has(dependency)),
      )
      .map((node) => node.id);
    if (ready.length === 0) throw new Error("DAG에 cycle이 있습니다.");
    waves.push(ready);
    for (const id of ready) {
      remaining.delete(id);
      completed.add(id);
    }
  }
  return waves;
}

export function validatePlan(
  nodes: readonly CollaborationNode[],
): PlanFailure[] {
  const failures: PlanFailure[] = [];
  const ids = new Set<string>();
  for (const node of nodes) {
    if (ids.has(node.id))
      failures.push({ code: "DUPLICATE_NODE", detail: node.id });
    ids.add(node.id);
  }
  for (const node of nodes) {
    for (const dependency of node.dependsOn) {
      if (!ids.has(dependency))
        failures.push({
          code: "MISSING_DEPENDENCY",
          detail: `${node.id} → ${dependency}`,
        });
    }
  }

  failures.push(...validateOwnership(nodes));
  if (
    roleCount(nodes, "ui_worker") !== 1 ||
    roleCount(nodes, "logic_worker") !== 1 ||
    roleCount(nodes, "test_worker") !== 1 ||
    roleCount(nodes, "reviewer") !== 1
  )
    failures.push({
      code: "INVALID_ROLE_GRAPH",
      detail: "각 교육용 역할이 정확히 하나씩 필요합니다.",
    });

  const ui = nodes.find((node) => node.role === "ui_worker");
  const logic = nodes.find((node) => node.role === "logic_worker");
  const test = nodes.find((node) => node.role === "test_worker");
  const reviewer = nodes.find((node) => node.role === "reviewer");
  if (
    ui &&
    logic &&
    test &&
    reviewer &&
    (!test.dependsOn.includes(ui.id) ||
      !test.dependsOn.includes(logic.id) ||
      !reviewer.dependsOn.includes(test.id) ||
      !reviewer.readOnly)
  )
    failures.push({
      code: "INVALID_ROLE_GRAPH",
      detail: "UI·Logic → Test → read-only Reviewer 순서가 필요합니다.",
    });

  if (
    !failures.some(
      (failure) =>
        failure.code === "DUPLICATE_NODE" ||
        failure.code === "MISSING_DEPENDENCY",
    )
  ) {
    try {
      buildExecutionWaves(nodes);
    } catch {
      failures.push({ code: "CYCLE", detail: "dependency cycle" });
    }
  }
  return failures;
}
