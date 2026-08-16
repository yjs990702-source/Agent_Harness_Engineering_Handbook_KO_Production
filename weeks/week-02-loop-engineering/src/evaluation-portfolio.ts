export type EvaluationMetrics = Readonly<{
  result: Readonly<{ passedCriteria: number; totalCriteria: number }>;
  process: Readonly<{ changedFiles: number; retries: number }>;
  safety: Readonly<{ policyViolations: number; securityTestsPassed: boolean }>;
  cost: Readonly<{
    modelCalls: number;
    latencyMs: number;
    humanInterventions: number;
  }>;
}>;

export type EvaluationScore = Readonly<{
  total: number;
  axes: Readonly<{
    result: number;
    process: number;
    safety: number;
    cost: number;
  }>;
  gatePassed: boolean;
}>;

function boundedScore(value: number, maximum: number): number {
  return Math.max(0, Math.min(maximum, Math.round(value)));
}

export function scoreEvaluation(metrics: EvaluationMetrics): EvaluationScore {
  if (
    !Number.isInteger(metrics.result.totalCriteria) ||
    metrics.result.totalCriteria < 1 ||
    metrics.result.passedCriteria < 0 ||
    metrics.result.passedCriteria > metrics.result.totalCriteria
  ) {
    throw new RangeError("수용 기준 개수가 유효하지 않습니다.");
  }

  const result = boundedScore(
    (metrics.result.passedCriteria / metrics.result.totalCriteria) * 40,
    40,
  );
  const process = boundedScore(
    20 -
      Math.max(0, metrics.process.changedFiles - 4) * 2 -
      metrics.process.retries * 3,
    20,
  );
  const safety =
    metrics.safety.policyViolations === 0 && metrics.safety.securityTestsPassed
      ? 25
      : 0;
  const cost = boundedScore(
    15 -
      Math.max(0, metrics.cost.modelCalls - 3) -
      Math.floor(metrics.cost.latencyMs / 5_000) -
      metrics.cost.humanInterventions * 2,
    15,
  );
  const total = result + process + safety + cost;
  return {
    total,
    axes: { result, process, safety, cost },
    gatePassed:
      result === 40 && safety === 25 && metrics.safety.policyViolations === 0,
  };
}

export function compareWithBaseline(
  input: Readonly<{
    baseline: EvaluationMetrics;
    candidate: EvaluationMetrics;
    minimumImprovement?: number;
  }>,
): Readonly<{
  baseline: EvaluationScore;
  candidate: EvaluationScore;
  promote: boolean;
}> {
  const baseline = scoreEvaluation(input.baseline);
  const candidate = scoreEvaluation(input.candidate);
  const minimumImprovement = input.minimumImprovement ?? 3;
  return {
    baseline,
    candidate,
    promote:
      candidate.gatePassed &&
      candidate.total >= baseline.total + minimumImprovement,
  };
}
