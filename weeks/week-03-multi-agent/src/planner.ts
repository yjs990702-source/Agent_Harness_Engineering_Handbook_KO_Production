import type { CollaborationPlan, Planner } from "./contracts.js";

export function createTeachingPlan(
  request: string,
  baseRevision = "week3-start",
): CollaborationPlan {
  const requestId = `lab-${
    request
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9가-힣]+/g, "-")
      .replace(/^-|-$/g, "") || "request"
  }`;
  return {
    requestId,
    goal: request.trim(),
    baseRevision,
    nodes: [
      {
        id: "ui",
        role: "ui_worker",
        dependsOn: [],
        ownedPaths: ["src/ui"],
        readOnly: false,
      },
      {
        id: "logic",
        role: "logic_worker",
        dependsOn: [],
        ownedPaths: ["src/logic"],
        readOnly: false,
      },
      {
        id: "tests",
        role: "test_worker",
        dependsOn: ["ui", "logic"],
        ownedPaths: ["tests/integration"],
        readOnly: false,
      },
      {
        id: "review",
        role: "reviewer",
        dependsOn: ["tests"],
        ownedPaths: [],
        readOnly: true,
      },
    ],
  };
}

export class TeachingPlanner implements Planner {
  async plan(request: string): Promise<CollaborationPlan> {
    if (request.trim().length < 3)
      throw new Error("요청은 3자 이상이어야 합니다.");
    return createTeachingPlan(request);
  }
}
