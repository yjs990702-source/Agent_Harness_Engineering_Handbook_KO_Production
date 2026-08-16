export type DeepInterviewInput = Readonly<{
  problem: unknown;
  targetUser: unknown;
  successMetric: unknown;
  coreFlow: unknown;
  outOfScope: unknown;
}>;

export type ServiceSpec = Readonly<{
  id: "SPEC-W3";
  problem: string;
  targetUser: string;
  successMetric: string;
  coreFlow: readonly string[];
  outOfScope: readonly string[];
  acceptanceCriteria: readonly [
    "AC-01-health",
    "AC-02-create-request",
    "AC-03-reject-invalid-input",
    "AC-04-security-boundary",
    "AC-05-deployment-evidence",
  ];
}>;

export type WorkRequest = Readonly<{
  id: string;
  tenantId: string;
  title: string;
  status: "open";
}>;

export type ParameterizedQuery = Readonly<{
  text: string;
  values: readonly [string, string];
}>;

export type DeploymentEnvironment = "local" | "preview" | "production";

export type DeploymentManifest = Readonly<{
  service: "request-tracker-lab";
  specId: ServiceSpec["id"];
  commitSha: string;
  environment: DeploymentEnvironment;
  requiredVariableNames: readonly string[];
  verificationCommand: "npm run verify:week3";
  acceptanceCriteria: ServiceSpec["acceptanceCriteria"];
  rollbackCondition: string;
  secretValuesIncluded: false;
  approval: Readonly<{ approvedBy: string; approvedAt: string }> | null;
}>;

export type ContestScores = Readonly<{
  specification: number;
  harness: number;
  loopAndEvaluation: number;
  functionality: number;
  deploymentAndSecurity: number;
  prAndDemo: number;
}>;
