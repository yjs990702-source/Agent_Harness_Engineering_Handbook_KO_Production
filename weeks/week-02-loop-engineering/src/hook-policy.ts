type UnknownRecord = Record<string, unknown>;

export type HookInput = Readonly<{
  toolName: string;
  filePath: string | null;
  command: string | null;
}>;

export type HookDecision = Readonly<{
  decision: "allow" | "block";
  reason: string;
}>;

function asRecord(value: unknown): UnknownRecord {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Hook 입력은 JSON object여야 합니다.");
  }
  return value as UnknownRecord;
}

function optionalString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

export function parseHookInput(value: unknown): HookInput {
  const root = asRecord(value);
  const toolInput = asRecord(root.tool_input ?? {});
  const toolName = optionalString(root.tool_name);
  if (!toolName) throw new Error("tool_name이 필요합니다.");
  return {
    toolName,
    filePath: optionalString(toolInput.file_path ?? toolInput.path),
    command: optionalString(toolInput.command),
  };
}

export function normalizeSafeRelativePath(value: string): string | null {
  let candidate = value.trim().replaceAll("\\", "/");
  if (candidate.startsWith("./")) candidate = candidate.slice(2);
  if (
    !candidate ||
    candidate.includes("\0") ||
    candidate.startsWith("/") ||
    /^[A-Za-z]:\//.test(candidate)
  )
    return null;
  const segments = candidate.split("/");
  if (
    segments.some((segment) => !segment || segment === "." || segment === "..")
  )
    return null;
  return segments.join("/").toLowerCase();
}

function sensitivePathReason(filePath: string): string | null {
  const normalized = normalizeSafeRelativePath(filePath);
  if (!normalized) return "안전한 프로젝트 상대 경로만 허용";
  if (/(^|\/)\.env[^/]*(?:\/|$)/.test(normalized))
    return "환경변수 파일 변경 금지";
  if (/(^|\/)\.git(?:\/|$)/.test(normalized))
    return "Git 내부 데이터 변경 금지";
  if (/(^|\/)\.github\/workflows(?:\/|$)/.test(normalized))
    return "GitHub Actions workflow 변경 금지";
  if (
    /(?:^|\/)(?:id_rsa|credentials\.json|service-account\.json)$/.test(
      normalized,
    )
  ) {
    return "credential 파일 변경 금지";
  }
  return null;
}

function commandPolicyReason(command: string): string | null {
  const normalized = command.trim();
  const localVerification =
    /^npm(?:\.cmd)?\s+run\s+(?:verify(?::week[123])?|format:check|lint|typecheck|test|build)(?:\s+--workspace=@handbook\/week-0[123]-[a-z0-9-]+)?(?:\s+--\s+[a-z0-9@_./:=+-]+(?:\s+[a-z0-9@_./:=+-]+)*)?$/i;
  return localVerification.test(normalized)
    ? null
    : "허용 목록에 없는 명령은 fail-closed로 차단";
}

export function evaluatePreToolUse(input: HookInput): HookDecision {
  if (input.filePath) {
    const reason = sensitivePathReason(input.filePath);
    if (reason) return { decision: "block", reason };
  }
  if (input.command) {
    const reason = commandPolicyReason(input.command);
    if (reason) return { decision: "block", reason };
  }
  return { decision: "allow", reason: "정책상 허용된 도구 요청" };
}
