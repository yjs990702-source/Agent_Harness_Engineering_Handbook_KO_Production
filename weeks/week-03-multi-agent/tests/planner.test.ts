import { describe, expect, it } from "vitest";
import { createTeachingPlan, TeachingPlanner } from "../src/planner.js";

describe("교육용 Planner", () => {
  it("UI·Logic을 첫 wave에 둘 수 있는 계획을 만든다", () => {
    const plan = createTeachingPlan("업무요청 패널 구현");
    expect(
      plan.nodes
        .filter((node) => node.dependsOn.length === 0)
        .map((node) => node.id),
    ).toEqual(["ui", "logic"]);
  });

  it("Test가 두 구현 Worker에 의존한다", () => {
    const testNode = createTeachingPlan("업무요청 패널 구현").nodes.find(
      (node) => node.id === "tests",
    );
    expect(testNode?.dependsOn).toEqual(["ui", "logic"]);
  });

  it("Reviewer를 읽기 전용으로 만든다", () => {
    const reviewer = createTeachingPlan("업무요청 패널 구현").nodes.find(
      (node) => node.role === "reviewer",
    );
    expect(reviewer).toMatchObject({ readOnly: true, ownedPaths: [] });
  });

  it("지나치게 짧은 요청을 거부한다", async () => {
    await expect(new TeachingPlanner().plan("  a ")).rejects.toThrow(
      "3자 이상",
    );
  });
});
