import type {
  EvaluationVerdict,
  TaskSpec,
  VerificationVerdict,
  WorkResult,
} from "./contracts.js";

export interface Evaluator {
  evaluate(
    spec: TaskSpec,
    result: WorkResult,
    verification: VerificationVerdict,
  ): Promise<EvaluationVerdict>;
}

export class EvidenceQualityEvaluator implements Evaluator {
  async evaluate(
    spec: TaskSpec,
    result: WorkResult,
    verification: VerificationVerdict,
  ): Promise<EvaluationVerdict> {
    if (!verification.passed) {
      return {
        decision: "FAIL",
        score: 0,
        reasons: ["결정론적 Verifier 실패"],
      };
    }

    const distinctKinds = new Set(
      result.evidence.filter((item) => item.passed).map((item) => item.kind),
    );
    const summaryPoints = result.summary.trim().length >= 12 ? 20 : 0;
    const evidencePoints = Math.min(40, distinctKinds.size * 20);
    const criterionPoints = Math.min(40, spec.criteria.length * 20);
    const score = summaryPoints + evidencePoints + criterionPoints;
    const reasons = [];
    if (summaryPoints === 0)
      reasons.push("변경 요약이 독립 검토에 충분하지 않음");
    if (distinctKinds.size < 2)
      reasons.push("서로 다른 종류의 증거가 2개 미만");

    return {
      decision: score >= 80 ? "PASS" : "FAIL",
      score,
      reasons: reasons.length > 0 ? reasons : ["목적·증거 다양성 기준 충족"],
    };
  }
}
