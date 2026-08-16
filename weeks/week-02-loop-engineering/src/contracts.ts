export type Criterion = Readonly<{
  id: string;
  description: string;
  severity: "required" | "advisory";
}>;

export type TaskSpec = Readonly<{
  id: string;
  goal: string;
  allowedPaths: readonly string[];
  criteria: readonly Criterion[];
  maxRepairs: number;
}>;

export type Evidence = Readonly<{
  kind: "test" | "diff" | "security" | "review";
  reference: string;
  passed: boolean;
  criterionId?: string;
  detail: string;
}>;

export type WorkResult = Readonly<{
  summary: string;
  changedFiles: readonly string[];
  evidence: readonly Evidence[];
}>;

export type VerificationFailure = Readonly<{
  code:
    | "PATH_OUT_OF_SCOPE"
    | "SENSITIVE_PATH"
    | "MISSING_EVIDENCE"
    | "FAILED_EVIDENCE";
  detail: string;
}>;

export type VerificationVerdict = Readonly<{
  passed: boolean;
  failures: readonly VerificationFailure[];
}>;

export type EvaluationVerdict = Readonly<{
  decision: "PASS" | "FAIL";
  score: number;
  reasons: readonly string[];
}>;
