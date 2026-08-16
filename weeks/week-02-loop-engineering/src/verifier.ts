import type {
  TaskSpec,
  VerificationFailure,
  VerificationVerdict,
  WorkResult,
} from "./contracts.js";

function normalizePath(value: string): string {
  return value.replaceAll("\\", "/").replace(/^\.\//, "");
}

function isOwnedPath(file: string, allowedPath: string): boolean {
  const normalizedFile = normalizePath(file);
  const normalizedAllowed = normalizePath(allowedPath).replace(/\/$/, "");
  return (
    normalizedFile === normalizedAllowed ||
    normalizedFile.startsWith(`${normalizedAllowed}/`)
  );
}

function isSensitivePath(file: string): boolean {
  const normalized = normalizePath(file).toLowerCase();
  return (
    /(^|\/)\.env(?:\.|$)/.test(normalized) ||
    normalized.startsWith(".git/") ||
    normalized.startsWith(".github/workflows/") ||
    /(?:^|\/)(?:id_rsa|credentials\.json|service-account\.json)$/.test(
      normalized,
    )
  );
}

export function verifyWorkResult(
  spec: TaskSpec,
  result: WorkResult,
): VerificationVerdict {
  const failures: VerificationFailure[] = [];

  for (const file of result.changedFiles) {
    if (isSensitivePath(file)) {
      failures.push({
        code: "SENSITIVE_PATH",
        detail: `민감 경로 변경: ${file}`,
      });
    }
    if (
      !spec.allowedPaths.some((allowedPath) => isOwnedPath(file, allowedPath))
    ) {
      failures.push({
        code: "PATH_OUT_OF_SCOPE",
        detail: `소유권 밖 변경: ${file}`,
      });
    }
  }

  for (const criterion of spec.criteria.filter(
    (item) => item.severity === "required",
  )) {
    const evidence = result.evidence.filter(
      (item) => item.criterionId === criterion.id,
    );
    if (evidence.length === 0) {
      failures.push({
        code: "MISSING_EVIDENCE",
        detail: `${criterion.id} 증거 누락`,
      });
    } else if (evidence.some((item) => !item.passed)) {
      failures.push({
        code: "FAILED_EVIDENCE",
        detail: `${criterion.id} 실패 증거 존재`,
      });
    }
  }

  return Object.freeze({ passed: failures.length === 0, failures });
}
