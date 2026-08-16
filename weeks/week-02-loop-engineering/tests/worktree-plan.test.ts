import { describe, expect, it } from "vitest";
import { createWorktreePlan } from "../src/worktree-plan.js";

const existing = {
  branches: ["lab/existing"],
  targetPaths: [".worktrees/existing"],
  assignments: [{ branchName: "lab/ui", ownedPaths: ["src/ui"] }],
} as const;

describe("Worktree dry-run preflight", () => {
  it("Git을 실행하지 않고 검토 가능한 argv 계획을 만든다", () => {
    const plan = createWorktreePlan(
      {
        baseBranch: "main",
        baseSha: "0123456",
        baseConfirmed: true,
        branchName: "lab/api",
        targetPath: ".worktrees/api",
        ownedPaths: ["src/api", "tests/api"],
      },
      existing,
    );
    expect(plan.mode).toBe("dry-run");
    expect(plan.command).toEqual({
      program: "git",
      args: ["worktree", "add", ".worktrees/api", "-b", "lab/api", "0123456"],
    });
  });

  it.each(["../outside", "C:\\temp\\worktree", "/tmp/worktree"])(
    "위험한 대상 경로 %s을 거부한다",
    (targetPath) => {
      expect(() =>
        createWorktreePlan(
          {
            baseBranch: "main",
            baseSha: "0123456",
            baseConfirmed: true,
            branchName: "lab/api",
            targetPath,
            ownedPaths: ["src/api"],
          },
          existing,
        ),
      ).toThrow(/상대 경로/);
    },
  );

  it("미확정 base와 중복 branch를 거부한다", () => {
    expect(() =>
      createWorktreePlan(
        {
          baseBranch: "main",
          baseSha: "0123456",
          baseConfirmed: false,
          branchName: "lab/api",
          targetPath: ".worktrees/api",
          ownedPaths: ["src/api"],
        },
        existing,
      ),
    ).toThrow(/base SHA/);
    expect(() =>
      createWorktreePlan(
        {
          baseBranch: "main",
          baseSha: "0123456",
          baseConfirmed: true,
          branchName: "lab/existing",
          targetPath: ".worktrees/api",
          ownedPaths: ["src/api"],
        },
        existing,
      ),
    ).toThrow(/branch/);
  });

  it("부모–자식 owned path 충돌을 실행 전에 거부한다", () => {
    expect(() =>
      createWorktreePlan(
        {
          baseBranch: "main",
          baseSha: "0123456",
          baseConfirmed: true,
          branchName: "lab/components",
          targetPath: ".worktrees/components",
          ownedPaths: ["src/ui/components"],
        },
        existing,
      ),
    ).toThrow(/owned path 충돌/);
  });
});
