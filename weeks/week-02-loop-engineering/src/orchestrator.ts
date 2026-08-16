import { createHash } from "node:crypto";
import type {
  EvaluationVerdict,
  TaskSpec,
  VerificationVerdict,
  WorkResult,
} from "./contracts.js";
import type { Evaluator } from "./evaluator.js";
import { verifyWorkResult } from "./verifier.js";

export interface Planner {
  plan(goal: string): Promise<TaskSpec>;
}

export interface Worker {
  execute(
    spec: TaskSpec,
    attempt: number,
    feedback: readonly string[],
  ): Promise<WorkResult>;
}

export type HarnessAttempt = Readonly<{
  attempt: number;
  result: WorkResult;
  verification: VerificationVerdict;
  evaluation: EvaluationVerdict;
  failureSignature: string | null;
}>;

export type HarnessOutcome = Readonly<{
  status: "passed" | "repeated_failure" | "repair_limit";
  spec: TaskSpec;
  attempts: readonly HarnessAttempt[];
}>;

function signature(reasons: readonly string[]): string {
  return createHash("sha256")
    .update([...reasons].sort().join("\n"), "utf8")
    .digest("hex");
}

export async function runHarness(input: {
  goal: string;
  planner: Planner;
  worker: Worker;
  evaluator: Evaluator;
}): Promise<HarnessOutcome> {
  const spec = await input.planner.plan(input.goal);
  if (
    !Number.isInteger(spec.maxRepairs) ||
    spec.maxRepairs < 0 ||
    spec.maxRepairs > 2
  ) {
    throw new Error("maxRepairs는 0~2의 정수여야 합니다.");
  }

  const attempts: HarnessAttempt[] = [];
  let previousSignature: string | null = null;
  let feedback: readonly string[] = [];

  for (let attempt = 1; attempt <= spec.maxRepairs + 1; attempt += 1) {
    const result = await input.worker.execute(spec, attempt, feedback);
    const verification = verifyWorkResult(spec, result);
    const evaluation = await input.evaluator.evaluate(
      spec,
      result,
      verification,
    );
    const reasons = [
      ...verification.failures.map(
        (failure) => `${failure.code}:${failure.detail}`,
      ),
      ...(evaluation.decision === "FAIL" ? evaluation.reasons : []),
    ];
    const failureSignature = reasons.length > 0 ? signature(reasons) : null;
    attempts.push({
      attempt,
      result,
      verification,
      evaluation,
      failureSignature,
    });

    if (verification.passed && evaluation.decision === "PASS") {
      return { status: "passed", spec, attempts };
    }
    if (failureSignature !== null && failureSignature === previousSignature) {
      return { status: "repeated_failure", spec, attempts };
    }
    if (attempt === spec.maxRepairs + 1) {
      return { status: "repair_limit", spec, attempts };
    }
    previousSignature = failureSignature;
    feedback = reasons;
  }

  throw new Error("도달할 수 없는 실행 상태입니다.");
}
