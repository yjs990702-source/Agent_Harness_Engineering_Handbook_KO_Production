import type { DeepInterviewInput, ServiceSpec } from "./contracts.js";

function requiredText(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length < 3) {
    throw new TypeError(`${field}는 3자 이상의 문자열이어야 합니다.`);
  }
  return value.trim();
}

function requiredTextList(value: unknown, field: string): readonly string[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new TypeError(`${field}는 비어 있지 않은 문자열 배열이어야 합니다.`);
  }
  return Object.freeze(value.map((item) => requiredText(item, field)));
}

export function buildServiceSpec(input: DeepInterviewInput): ServiceSpec {
  return Object.freeze({
    id: "SPEC-W3",
    problem: requiredText(input.problem, "problem"),
    targetUser: requiredText(input.targetUser, "targetUser"),
    successMetric: requiredText(input.successMetric, "successMetric"),
    coreFlow: requiredTextList(input.coreFlow, "coreFlow"),
    outOfScope: requiredTextList(input.outOfScope, "outOfScope"),
    acceptanceCriteria: Object.freeze([
      "AC-01-health",
      "AC-02-create-request",
      "AC-03-reject-invalid-input",
      "AC-04-security-boundary",
      "AC-05-deployment-evidence",
    ] as const),
  });
}
