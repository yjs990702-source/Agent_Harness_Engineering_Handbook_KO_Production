import { normalizeRelativePath, pathIsOwned } from "./ownership.js";

export type MultiAgentTopology =
  | "shared-central"
  | "isolated-central"
  | "shared-peer"
  | "isolated-peer";

export type TopologyDecision = Readonly<{
  useMultipleAgents: boolean;
  topology: MultiAgentTopology | null;
  reasons: readonly string[];
}>;

export function chooseTopology(
  input: Readonly<{
    independentSubtasks: number;
    requiresIndependentEvaluation: boolean;
    contextsConflict: boolean;
    remoteOrganizationBoundary: boolean;
    baseline?: Readonly<{ singleWorkerScore: number; candidateScore: number }>;
  }>,
): TopologyDecision {
  if (
    !Number.isInteger(input.independentSubtasks) ||
    input.independentSubtasks < 0
  ) {
    throw new RangeError("independentSubtasks는 0 이상의 정수여야 합니다.");
  }
  const reasons: string[] = [];
  if (
    input.baseline &&
    input.baseline.candidateScore <= input.baseline.singleWorkerScore
  ) {
    return {
      useMultipleAgents: false,
      topology: null,
      reasons: ["멀티 에이전트 후보가 단일 worker 기준선을 넘지 못했습니다."],
    };
  }
  if (input.independentSubtasks < 2 && !input.requiresIndependentEvaluation) {
    return {
      useMultipleAgents: false,
      topology: null,
      reasons: ["단일 worker 기준선으로 충분합니다."],
    };
  }
  if (input.independentSubtasks > 4) {
    reasons.push(
      "첫 fan-out은 2~4개로 제한하고 나머지는 다음 wave로 이동합니다.",
    );
  }
  if (input.requiresIndependentEvaluation) {
    reasons.push("독립 evaluator의 컨텍스트를 worker와 격리합니다.");
  }
  if (input.remoteOrganizationBoundary) {
    reasons.push("원격 조직 경계에서만 peer/A2A 방식을 검토합니다.");
  }

  const isolated =
    input.contextsConflict || input.requiresIndependentEvaluation;
  const peer = input.remoteOrganizationBoundary;
  const topology: MultiAgentTopology = isolated
    ? peer
      ? "isolated-peer"
      : "isolated-central"
    : peer
      ? "shared-peer"
      : "shared-central";
  return { useMultipleAgents: true, topology, reasons: Object.freeze(reasons) };
}

export function validateFanOut(
  workers: readonly Readonly<{ id: string; ownedPaths: readonly string[] }>[],
): readonly string[] {
  const failures: string[] = [];
  if (workers.length < 2 || workers.length > 4) {
    failures.push("WORKER_COUNT_OUT_OF_RANGE");
  }
  const assignments: { path: string; owner: string }[] = [];
  for (const worker of workers) {
    for (const candidate of worker.ownedPaths) {
      const normalized = normalizeRelativePath(
        candidate.replaceAll("\\", "/").replace(/\/+$/, ""),
      );
      if (!normalized) {
        failures.push(`INVALID_OWNED_PATH:${worker.id}:${candidate}`);
        continue;
      }
      for (const assignment of assignments) {
        if (
          assignment.owner !== worker.id &&
          (pathIsOwned(normalized, assignment.path) ||
            pathIsOwned(assignment.path, normalized))
        ) {
          const shared =
            normalized.length <= assignment.path.length
              ? normalized
              : assignment.path;
          failures.push(
            `OWNED_PATH_CONFLICT:${shared}:${assignment.owner}:${worker.id}`,
          );
        }
      }
      assignments.push({ path: normalized, owner: worker.id });
    }
  }
  return Object.freeze(failures);
}
