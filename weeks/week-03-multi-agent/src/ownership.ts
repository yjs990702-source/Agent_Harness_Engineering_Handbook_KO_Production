import path from "node:path";
import type { CollaborationNode, PlanFailure } from "./contracts.js";

export function normalizeRelativePath(input: string): string | null {
  const candidate = input.trim().replaceAll("\\", "/");
  if (
    !candidate ||
    path.posix.isAbsolute(candidate) ||
    /^[A-Za-z]:\//.test(candidate)
  )
    return null;
  const normalized = path.posix
    .normalize(candidate)
    .replace(/^\.\//, "")
    .replace(/\/$/, "");
  if (
    !normalized ||
    normalized === "." ||
    normalized === ".." ||
    normalized.startsWith("../")
  )
    return null;
  return normalized;
}

export function pathIsOwned(changedFile: string, ownedPath: string): boolean {
  const changed = normalizeRelativePath(changedFile);
  const owned = normalizeRelativePath(ownedPath);
  if (!changed || !owned) return false;
  return changed === owned || changed.startsWith(`${owned}/`);
}

export function validateOwnership(
  nodes: readonly CollaborationNode[],
): PlanFailure[] {
  const failures: PlanFailure[] = [];
  const writers = nodes.filter((node) => !node.readOnly);

  for (const node of nodes) {
    for (const ownedPath of node.ownedPaths) {
      if (!normalizeRelativePath(ownedPath))
        failures.push({
          code: "INVALID_PATH",
          detail: `${node.id}: ${ownedPath}`,
        });
    }
    if (node.readOnly && node.ownedPaths.length > 0)
      failures.push({
        code: "INVALID_PATH",
        detail: `${node.id}: read-only agent는 owned path를 가질 수 없습니다.`,
      });
  }

  for (let leftIndex = 0; leftIndex < writers.length; leftIndex += 1) {
    const left = writers[leftIndex];
    if (!left) continue;
    for (
      let rightIndex = leftIndex + 1;
      rightIndex < writers.length;
      rightIndex += 1
    ) {
      const right = writers[rightIndex];
      if (!right) continue;
      for (const leftPath of left.ownedPaths) {
        for (const rightPath of right.ownedPaths) {
          if (
            pathIsOwned(leftPath, rightPath) ||
            pathIsOwned(rightPath, leftPath)
          )
            failures.push({
              code: "OWNERSHIP_CONFLICT",
              detail: `${left.id}:${leftPath} ↔ ${right.id}:${rightPath}`,
            });
        }
      }
    }
  }
  return failures;
}
