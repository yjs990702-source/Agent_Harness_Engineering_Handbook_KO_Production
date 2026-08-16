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

function normalizePath(value: string): string {
  return value.replaceAll("\\", "/").replace(/^\.\//, "").toLowerCase();
}

function sensitivePathReason(filePath: string): string | null {
  const normalized = normalizePath(filePath);
  // Week 2 start fixture: .env.production 같은 변형을 아직 놓칩니다.
  if (normalized === ".env") return "환경변수 파일 변경 금지";
  if (normalized.startsWith(".git/")) return "Git 내부 데이터 변경 금지";
  if (normalized.startsWith(".github/workflows/"))
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

function dangerousCommandReason(command: string): string | null {
  const normalized = command.trim().toLowerCase();
  const rules: readonly [RegExp, string][] = [
    [/\brm\s+-rf\b/, "재귀 강제 삭제 명령 금지"],
    [/\bgit\s+reset\s+--hard\b/, "파괴적 Git reset 금지"],
    [/\bgit\s+push\b.*(?:--force|-f\b)/, "강제 push 금지"],
    [/\bremove-item\b.*\b-recurse\b/, "재귀 삭제 명령 금지"],
  ];
  return rules.find(([pattern]) => pattern.test(normalized))?.[1] ?? null;
}

export function evaluatePreToolUse(input: HookInput): HookDecision {
  if (input.filePath) {
    const reason = sensitivePathReason(input.filePath);
    if (reason) return { decision: "block", reason };
  }
  if (input.command) {
    const reason = dangerousCommandReason(input.command);
    if (reason) return { decision: "block", reason };
  }
  return { decision: "allow", reason: "정책상 허용된 도구 요청" };
}
