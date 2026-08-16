import type {
  AgentResult,
  CollaborationPlan,
  VerificationFailure,
  VerificationVerdict,
} from "./contracts.js";
import { pathIsOwned } from "./ownership.js";

export function verifyCollaboration(
  plan: CollaborationPlan,
  results: readonly AgentResult[],
): VerificationVerdict {
  const failures: VerificationFailure[] = [];
  const byNode = new Map(results.map((result) => [result.nodeId, result]));

  for (const node of plan.nodes) {
    const result = byNode.get(node.id);
    if (!result) {
      failures.push({ code: "MISSING_RESULT", detail: node.id });
      continue;
    }
    if (node.readOnly && result.changedFiles.length > 0)
      failures.push({
        code: "READ_ONLY_WRITE",
        detail: `${node.id}: ${result.changedFiles.join(", ")}`,
      });
    if (!node.readOnly) {
      for (const changedFile of result.changedFiles) {
        if (
          !node.ownedPaths.some((ownedPath) =>
            pathIsOwned(changedFile, ownedPath),
          )
        )
          failures.push({
            code: "PATH_OUT_OF_SCOPE",
            detail: `${node.id}: ${changedFile}`,
          });
      }
    }
    if (result.evidence.length === 0)
      failures.push({ code: "MISSING_EVIDENCE", detail: node.id });
    for (const evidence of result.evidence) {
      if (!evidence.passed)
        failures.push({
          code: "FAILED_EVIDENCE",
          detail: `${node.id}: ${evidence.id}`,
        });
    }
    const evidenceIds = new Set(result.evidence.map((evidence) => evidence.id));
    if (
      result.handoff.from !== node.id ||
      result.handoff.baseRevision !== plan.baseRevision ||
      result.handoff.to.length === 0 ||
      result.handoff.evidenceIds.some((id) => !evidenceIds.has(id))
    )
      failures.push({ code: "INVALID_HANDOFF", detail: node.id });
  }

  const review = results.find((result) => result.role === "reviewer");
  if (
    !review ||
    !review.evidence.some(
      (evidence) => evidence.kind === "review" && evidence.passed,
    )
  )
    failures.push({
      code: "MISSING_REVIEW",
      detail: "통과한 읽기 전용 review evidence가 필요합니다.",
    });
  return { passed: failures.length === 0, failures };
}
