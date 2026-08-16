import { describe, expect, it } from "vitest";
import {
  buildExecutionWaves,
  validatePlan,
  validateRequestSpec,
} from "../src/dag.js";
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

  it("빈 계획과 중복 dependency를 거부한다", () => {
    expect(validatePlan([]).map((failure) => failure.code)).toContain(
      "EMPTY_PLAN",
    );
    const plan = createTeachingPlan("합성 요청");
    const nodes = plan.nodes.map((node) =>
      node.id === "tests"
        ? { ...node, dependsOn: ["ui", "logic", "logic"] }
        : node,
    );
    expect(validatePlan(nodes).map((failure) => failure.code)).toContain(
      "DUPLICATE_DEPENDENCY",
    );
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
    expect(normalizeRelativePath("src/ui/../logic/leak.ts")).toBeNull();
    expect(normalizeRelativePath("src//ui/panel.tsx")).toBeNull();
  });

  it("파일이 owned directory 아래인지 판정한다", () => {
    expect(pathIsOwned("src/ui/panel.tsx", "src/ui")).toBe(true);
    expect(pathIsOwned("src/logic/policy.ts", "src/ui")).toBe(false);
  });

  it("중복 criterion ID가 있는 RequestSpec을 거부한다", () => {
    const request = createTeachingPlan("합성 요청").request;
    expect(
      validateRequestSpec({
        ...request,
        criteria: [request.criteria[0]!, request.criteria[0]!],
      }).map((failure) => failure.code),
    ).toContain("INVALID_REQUEST");
  });
});
