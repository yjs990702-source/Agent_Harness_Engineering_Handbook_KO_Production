export type WorktreePlanInput = Readonly<{
  baseBranch: string;
  baseSha: string;
  baseConfirmed: boolean;
  branchName: string;
  targetPath: string;
  ownedPaths: readonly string[];
}>;

export type ExistingWorktreeState = Readonly<{
  branches: readonly string[];
  targetPaths: readonly string[];
  assignments: readonly Readonly<{
    branchName: string;
    ownedPaths: readonly string[];
  }>[];
}>;

export type WorktreePlan = Readonly<{
  mode: "dry-run";
  baseRevision: string;
  branchName: string;
  targetPath: string;
  ownedPaths: readonly string[];
  command: Readonly<{ program: "git"; args: readonly string[] }>;
}>;

function relativePath(value: string, field: string): string {
  let normalized = value.trim().replaceAll("\\", "/");
  if (normalized.startsWith("./")) normalized = normalized.slice(2);
  const parts = normalized.split("/");
  if (
    !normalized ||
    normalized.startsWith("/") ||
    /^[A-Za-z]:\//.test(normalized) ||
    parts.some((part) => !part || part === "." || part === "..")
  ) {
    throw new Error(`${field}에는 안전한 프로젝트 상대 경로가 필요합니다.`);
  }
  return parts.join("/");
}

function branch(value: string, field: string): string {
  const normalized = value.trim();
  if (
    !/^[a-z0-9][a-z0-9._/-]{1,99}$/i.test(normalized) ||
    normalized.includes("..")
  ) {
    throw new Error(`${field} 이름이 유효하지 않습니다.`);
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

export function createWorktreePlan(
  input: WorktreePlanInput,
  existing: ExistingWorktreeState,
): WorktreePlan {
  if (!input.baseConfirmed || !/^[0-9a-f]{7,40}$/i.test(input.baseSha)) {
    throw new Error("확정된 base SHA가 필요합니다.");
  }
  const baseBranch = branch(input.baseBranch, "baseBranch");
  const branchName = branch(input.branchName, "branchName");
  if (existing.branches.includes(branchName))
    throw new Error("이미 존재하는 branch입니다.");
  const targetPath = relativePath(input.targetPath, "targetPath");
  if (
    existing.targetPaths
      .map((path) => relativePath(path, "existing targetPath"))
      .includes(targetPath)
  ) {
    throw new Error("이미 사용 중인 worktree 경로입니다.");
  }
  const ownedPaths = input.ownedPaths.map((path) =>
    relativePath(path, "ownedPath"),
  );
  if (ownedPaths.length === 0)
    throw new Error("owned path가 하나 이상 필요합니다.");
  for (let index = 0; index < ownedPaths.length; index += 1) {
    for (let other = index + 1; other < ownedPaths.length; other += 1) {
      if (overlaps(ownedPaths[index]!, ownedPaths[other]!)) {
        throw new Error("계획 내부의 owned path가 겹칩니다.");
      }
    }
  }
  for (const assignment of existing.assignments) {
    for (const assigned of assignment.ownedPaths.map((path) =>
      relativePath(path, "assigned ownedPath"),
    )) {
      const collision = ownedPaths.find((candidate) =>
        overlaps(candidate, assigned),
      );
      if (collision) {
        throw new Error(
          `owned path 충돌: ${collision} ↔ ${assignment.branchName}:${assigned}`,
        );
      }
    }
  }
  return Object.freeze({
    mode: "dry-run",
    baseRevision: `${baseBranch}@${input.baseSha}`,
    branchName,
    targetPath,
    ownedPaths: Object.freeze(ownedPaths),
    command: Object.freeze({
      program: "git",
      args: Object.freeze([
        "worktree",
        "add",
        targetPath,
        "-b",
        branchName,
        input.baseSha,
      ]),
    }),
  });
}
