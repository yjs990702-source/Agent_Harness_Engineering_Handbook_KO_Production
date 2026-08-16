import { describe, expect, it } from "vitest";
import { buildWorktreePlan } from "../src/worktree-plan.js";

describe("buildWorktreePlan", () => {
  it("겹치지 않는 작업의 인자 배열을 만든다", () => {
    const plan = buildWorktreePlan("week1-solution", [
      { taskId: "ui", branch: "agent/ui", ownedPaths: ["src/components"] },
      { taskId: "api", branch: "agent/api", ownedPaths: ["src/app/api"] },
    ]);
    expect(plan).toHaveLength(2);
    expect(plan[0]?.command).toEqual([
      "git",
      "worktree",
      "add",
      "../worktrees/ui",
      "-b",
      "agent/ui",
      "week1-solution",
    ]);
  });

  it("부모·자식 path 소유권이 겹치면 거부한다", () => {
    expect(() =>
      buildWorktreePlan("week1-solution", [
        { taskId: "web", branch: "agent/web", ownedPaths: ["src/app"] },
        { taskId: "api", branch: "agent/api", ownedPaths: ["src/app/api"] },
      ]),
    ).toThrow(/소유권 충돌/);
  });

  it("경로 탈출·shell metacharacter를 거부한다", () => {
    expect(() =>
      buildWorktreePlan("week1-solution", [
        { taskId: "bad;rm", branch: "agent/bad", ownedPaths: ["../outside"] },
      ]),
    ).toThrow(/안전하지 않은/);
  });
});
