import { describe, expect, it } from "vitest";
import { buildExecutionWaves, validatePlan } from "../src/dag.js";
import { normalizeRelativePath, pathIsOwned } from "../src/ownership.js";
import { createTeachingPlan } from "../src/planner.js";

describe("DAG와 ownership", () => {
  it("병렬 구현과 순차 fan-in wave를 만든다", () => {
    expect(buildExecutionWaves(createTeachingPlan("합성 요청").nodes)).toEqual([
      ["ui", "logic"],
      ["tests"],
      ["review"],
    ]);
  });

  it("중복 node ID를 거부한다", () => {
    const plan = createTeachingPlan("합성 요청");
    const nodes = [...plan.nodes, { ...plan.nodes[0]! }];
    expect(
      validatePlan(nodes).some((failure) => failure.code === "DUPLICATE_NODE"),
    ).toBe(true);
  });

  it("없는 dependency를 거부한다", () => {
    const plan = createTeachingPlan("합성 요청");
    const nodes = plan.nodes.map((node) =>
      node.id === "tests" ? { ...node, dependsOn: ["ui", "missing"] } : node,
    );
    expect(
      validatePlan(nodes).some(
        (failure) => failure.code === "MISSING_DEPENDENCY",
      ),
    ).toBe(true);
  });

  it("cycle을 거부한다", () => {
    const plan = createTeachingPlan("합성 요청");
    const nodes = plan.nodes.map((node) =>
      node.id === "ui" ? { ...node, dependsOn: ["review"] } : node,
    );
    expect(
      validatePlan(nodes).some((failure) => failure.code === "CYCLE"),
    ).toBe(true);
  });

  it("상하위 owned path 충돌을 거부한다", () => {
    const plan = createTeachingPlan("합성 요청");
    const nodes = plan.nodes.map((node) =>
      node.id === "logic"
        ? { ...node, ownedPaths: ["src/ui/components"] }
        : node,
    );
    expect(
      validatePlan(nodes).some(
        (failure) => failure.code === "OWNERSHIP_CONFLICT",
      ),
    ).toBe(true);
  });

  it("절대 경로와 상위 이동을 거부한다", () => {
    expect(normalizeRelativePath("C:/secret.txt")).toBeNull();
    expect(normalizeRelativePath("../secret.txt")).toBeNull();
  });

  it("파일이 owned directory 아래인지 판정한다", () => {
    expect(pathIsOwned("src/ui/panel.tsx", "src/ui")).toBe(true);
    expect(pathIsOwned("src/logic/policy.ts", "src/ui")).toBe(false);
  });
});
