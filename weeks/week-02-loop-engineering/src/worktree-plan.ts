export type OwnershipTask = Readonly<{
  taskId: string;
  branch: string;
  ownedPaths: readonly string[];
}>;

export type WorktreePlan = Readonly<{
  taskId: string;
  directory: string;
  branch: string;
  command: readonly string[];
}>;

function safeIdentifier(value: string, label: string): string {
  if (!/^[a-z0-9][a-z0-9/_-]*$/i.test(value) || value.includes("..")) {
    throw new Error(`${label}에 안전하지 않은 값이 있습니다: ${value}`);
  }
  return value;
}

function normalizeOwnedPath(value: string): string {
  const normalized = value
    .replaceAll("\\", "/")
    .replace(/^\.\//, "")
    .replace(/\/$/, "");
  if (!normalized || normalized.startsWith("/") || normalized.includes("..")) {
    throw new Error(`안전하지 않은 owned path: ${value}`);
  }
  return normalized;
}

function overlaps(left: string, right: string): boolean {
  return (
    left === right ||
    left.startsWith(`${right}/`) ||
    right.startsWith(`${left}/`)
  );
}

export function buildWorktreePlan(
  baseCommit: string,
  tasks: readonly OwnershipTask[],
): readonly WorktreePlan[] {
  safeIdentifier(baseCommit, "base commit");
  const ownership = tasks.map((task) => ({
    ...task,
    taskId: safeIdentifier(task.taskId, "task id"),
    branch: safeIdentifier(task.branch, "branch"),
    ownedPaths: task.ownedPaths.map(normalizeOwnedPath),
  }));

  for (let leftIndex = 0; leftIndex < ownership.length; leftIndex += 1) {
    for (
      let rightIndex = leftIndex + 1;
      rightIndex < ownership.length;
      rightIndex += 1
    ) {
      const left = ownership[leftIndex];
      const right = ownership[rightIndex];
      if (!left || !right) continue;
      for (const leftPath of left.ownedPaths) {
        for (const rightPath of right.ownedPaths) {
          if (overlaps(leftPath, rightPath)) {
            throw new Error(
              `파일 소유권 충돌: ${left.taskId}:${leftPath} ↔ ${right.taskId}:${rightPath}`,
            );
          }
        }
      }
    }
  }

  return ownership.map((task) => ({
    taskId: task.taskId,
    directory: `../worktrees/${task.taskId}`,
    branch: task.branch,
    command: [
      "git",
      "worktree",
      "add",
      `../worktrees/${task.taskId}`,
      "-b",
      task.branch,
      baseCommit,
    ],
  }));
}
