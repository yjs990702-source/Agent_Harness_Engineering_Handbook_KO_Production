import type {
  AgentResult,
  CollaborationPlan,
  VerificationFailure,
  VerificationVerdict,
} from "./contracts.js";
import { normalizeRelativePath, pathIsOwned } from "./ownership.js";

export function verifyCollaboration(
  plan: CollaborationPlan,
  results: readonly AgentResult[],
): VerificationVerdict {
  const failures: VerificationFailure[] = [];
  const planNodeIds = new Set(plan.nodes.map((node) => node.id));
  const byNode = new Map<string, AgentResult>();
  for (const result of results) {
    if (!planNodeIds.has(result.nodeId)) {
      failures.push({ code: "UNEXPECTED_RESULT", detail: result.nodeId });
      continue;
    }
    if (byNode.has(result.nodeId)) {
      failures.push({ code: "DUPLICATE_RESULT", detail: result.nodeId });
      continue;
    }
    byNode.set(result.nodeId, result);
  }
  const validCriterionIds = new Set(
    plan.request.criteria.map((criterion) => criterion.id),
  );
  const passedCriterionIds = new Set<string>();

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
        const normalized = normalizeRelativePath(changedFile);
        if (
          !normalized ||
          !node.ownedPaths.some((ownedPath) =>
            pathIsOwned(normalized, ownedPath),
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
      if (
        evidence.criterionIds.length === 0 ||
        new Set(evidence.criterionIds).size !== evidence.criterionIds.length ||
        evidence.criterionIds.some((id) => !validCriterionIds.has(id))
      )
        failures.push({
          code: "INVALID_EVIDENCE_CRITERION",
          detail: `${node.id}: ${evidence.id}`,
        });
      else if (evidence.passed)
        for (const id of evidence.criterionIds) passedCriterionIds.add(id);
    }
    const evidenceIdList = result.evidence.map((evidence) => evidence.id);
    const evidenceIds = new Set(evidenceIdList);
    const handoffIds = new Set(result.handoff.evidenceIds);
    const expectedInputIdList = node.dependsOn.flatMap(
      (dependency) =>
        byNode.get(dependency)?.evidence.map((evidence) => evidence.id) ?? [],
    );
    const expectedInputIds = new Set(expectedInputIdList);
    const inputIds = new Set(result.handoff.inputEvidenceIds);
    if (
      result.handoff.from !== node.id ||
      result.handoff.baseRevision !== plan.baseRevision ||
      result.handoff.to.length === 0 ||
      evidenceIds.size !== evidenceIdList.length ||
      handoffIds.size !== result.handoff.evidenceIds.length ||
      handoffIds.size !== evidenceIds.size ||
      [...handoffIds].some((id) => !evidenceIds.has(id)) ||
      [...evidenceIds].some((id) => !handoffIds.has(id)) ||
      inputIds.size !== result.handoff.inputEvidenceIds.length ||
      inputIds.size !== expectedInputIds.size ||
      [...inputIds].some((id) => !expectedInputIds.has(id)) ||
      [...expectedInputIds].some((id) => !inputIds.has(id))
    )
      failures.push({ code: "INVALID_HANDOFF", detail: node.id });
  }

  for (const criterion of plan.request.criteria) {
    if (!passedCriterionIds.has(criterion.id))
      failures.push({
        code: "MISSING_CRITERION_EVIDENCE",
        detail: criterion.id,
      });
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
