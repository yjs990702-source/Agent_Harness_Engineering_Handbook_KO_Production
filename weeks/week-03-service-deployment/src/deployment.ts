import type {
  DeploymentEnvironment,
  DeploymentManifest,
  ServiceSpec,
} from "./contracts.js";

type ManifestInput = Readonly<{
  commitSha: unknown;
  environment: DeploymentEnvironment;
  requiredVariableNames: readonly string[];
  rollbackCondition: unknown;
  approval?: Readonly<{ approvedBy: unknown; approvedAt: unknown }>;
}>;

function text(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length < 3) {
    throw new TypeError(`${field}가 유효하지 않습니다.`);
  }
  return value.trim();
}

export function createDeploymentManifest(
  spec: ServiceSpec,
  input: ManifestInput,
): DeploymentManifest {
  const commitSha = text(input.commitSha, "commitSha");
  if (!/^[0-9a-f]{7,40}$/i.test(commitSha)) {
    throw new TypeError("commitSha 형식이 유효하지 않습니다.");
  }
  const requiredVariableNames = Object.freeze(
    input.requiredVariableNames.map((name) => {
      if (!/^[A-Z][A-Z0-9_]*$/.test(name)) {
        throw new TypeError(`환경변수 이름이 유효하지 않습니다: ${name}`);
      }
      return name;
    }),
  );
  const approval = input.approval
    ? Object.freeze({
        approvedBy: text(input.approval.approvedBy, "approvedBy"),
        approvedAt: text(input.approval.approvedAt, "approvedAt"),
      })
    : null;
  if (input.environment === "production" && approval === null) {
    throw new Error("Production manifest에는 사람 승인이 필요합니다.");
  }
  return Object.freeze({
    service: "request-tracker-lab",
    commitSha,
    environment: input.environment,
    requiredVariableNames,
    verificationCommand: "npm run verify:week3",
    acceptanceCriteria: spec.acceptanceCriteria,
    rollbackCondition: text(input.rollbackCondition, "rollbackCondition"),
    secretValuesIncluded: false,
    approval,
  });
}

export function missingVariableNames(
  manifest: DeploymentManifest,
  availableNames: ReadonlySet<string>,
): readonly string[] {
  return manifest.requiredVariableNames.filter(
    (name) => !availableNames.has(name),
  );
}
