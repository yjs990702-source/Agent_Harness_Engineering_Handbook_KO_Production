import { describe, expect, it } from "vitest";
import { chooseTopology, validateFanOut } from "../src/topology.js";

describe("multi-agent topology gate", () => {
  it("독립 작업과 독립 평가가 없으면 단일 worker를 유지한다", () => {
    expect(
      chooseTopology({
        independentSubtasks: 1,
        requiresIndependentEvaluation: false,
        contextsConflict: false,
        remoteOrganizationBoundary: false,
      }),
    ).toMatchObject({ useMultipleAgents: false, topology: null });
  });

  it("독립 evaluator는 중앙 조정·격리 컨텍스트를 선택한다", () => {
    expect(
      chooseTopology({
        independentSubtasks: 2,
        requiresIndependentEvaluation: true,
        contextsConflict: true,
        remoteOrganizationBoundary: false,
      }),
    ).toMatchObject({ useMultipleAgents: true, topology: "isolated-central" });
  });

  it("첫 fan-out을 2~4개로 제한하고 경로 충돌을 거부한다", () => {
    expect(
      validateFanOut([
        { id: "ui", ownedPaths: ["src/ui"] },
        { id: "api", ownedPaths: ["src/api"] },
      ]),
    ).toEqual([]);
    expect(
      validateFanOut([
        { id: "a", ownedPaths: ["src/shared"] },
        { id: "b", ownedPaths: ["src/shared/"] },
      ]),
    ).toContain("OWNED_PATH_CONFLICT:src/shared:a:b");
    expect(
      validateFanOut([
        { id: "ui", ownedPaths: ["src/ui"] },
        { id: "components", ownedPaths: ["src/ui/components"] },
      ]),
    ).toContain("OWNED_PATH_CONFLICT:src/ui:ui:components");
  });

  it("멀티 에이전트 후보가 단일 worker 기준선을 넘지 못하면 승격하지 않는다", () => {
    expect(
      chooseTopology({
        independentSubtasks: 3,
        requiresIndependentEvaluation: true,
        contextsConflict: true,
        remoteOrganizationBoundary: false,
        baseline: { singleWorkerScore: 84, candidateScore: 82 },
      }),
    ).toMatchObject({ useMultipleAgents: false, topology: null });
  });
});
