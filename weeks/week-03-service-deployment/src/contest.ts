import type { ContestScores } from "./contracts.js";

const MAXIMUMS: ContestScores = Object.freeze({
  specification: 15,
  harness: 20,
  loopAndEvaluation: 20,
  functionality: 20,
  deploymentAndSecurity: 15,
  prAndDemo: 10,
});

export function scoreContestSubmission(
  scores: ContestScores,
  gateViolations: readonly string[] = [],
): Readonly<{
  eligible: boolean;
  total: number;
  gateViolations: readonly string[];
}> {
  const total = Object.entries(MAXIMUMS).reduce((sum, [key, maximum]) => {
    const score = scores[key as keyof ContestScores];
    if (!Number.isInteger(score) || score < 0 || score > maximum) {
      throw new RangeError(`${key} 점수가 0~${maximum} 범위를 벗어났습니다.`);
    }
    return sum + score;
  }, 0);
  return Object.freeze({
    eligible: gateViolations.length === 0,
    total,
    gateViolations: Object.freeze([...gateViolations]),
  });
}
