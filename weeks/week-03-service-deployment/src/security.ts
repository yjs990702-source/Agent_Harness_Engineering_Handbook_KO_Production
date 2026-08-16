import type { ParameterizedQuery } from "./contracts.js";

export type SortColumn = "created_at" | "title" | "status";
export type SortDirection = "ASC" | "DESC";

function boundedText(value: unknown, field: string, maximum: number): string {
  if (typeof value !== "string")
    throw new TypeError(`${field}는 문자열이어야 합니다.`);
  const normalized = value.trim();
  if (normalized.length < 1 || normalized.length > maximum) {
    throw new RangeError(`${field} 길이가 허용 범위를 벗어났습니다.`);
  }
  return normalized;
}

export function buildTitleLookupQuery(
  tenantId: unknown,
  title: unknown,
): ParameterizedQuery {
  return Object.freeze({
    text: "SELECT id, title, status FROM work_requests WHERE tenant_id = $1 AND title = $2",
    values: Object.freeze([
      boundedText(tenantId, "tenantId", 64),
      boundedText(title, "title", 100),
    ] as const),
  });
}

export function buildSortedTitleLookupQuery(
  tenantId: unknown,
  title: unknown,
  sortColumn: unknown,
  sortDirection: unknown,
): ParameterizedQuery {
  const columns = new Set<SortColumn>(["created_at", "title", "status"]);
  const directions = new Set<SortDirection>(["ASC", "DESC"]);
  if (
    typeof sortColumn !== "string" ||
    !columns.has(sortColumn as SortColumn)
  ) {
    throw new Error("정렬 column이 allowlist에 없습니다.");
  }
  const direction =
    typeof sortDirection === "string" ? sortDirection.toUpperCase() : "";
  if (!directions.has(direction as SortDirection)) {
    throw new Error("정렬 direction이 allowlist에 없습니다.");
  }
  const base = buildTitleLookupQuery(tenantId, title);
  return Object.freeze({
    text: `${base.text} ORDER BY ${sortColumn} ${direction}`,
    values: base.values,
  });
}

export function createSafeTextView(
  value: unknown,
): Readonly<{ textContent: string }> {
  return Object.freeze({ textContent: boundedText(value, "text", 100) });
}

export function validateExternalUrl(value: unknown): string {
  const raw = boundedText(value, "url", 2_048);
  if (raw.startsWith("//"))
    throw new Error("protocol-relative URL은 허용하지 않습니다.");
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    throw new TypeError("URL 형식이 유효하지 않습니다.");
  }
  if (parsed.protocol !== "https:")
    throw new Error("외부 링크는 https:만 허용합니다.");
  if (parsed.username || parsed.password)
    throw new Error("URL 사용자 정보는 허용하지 않습니다.");
  return parsed.toString();
}

export function validateContentSecurityPolicy(
  policy: string,
): readonly string[] {
  const failures: string[] = [];
  const normalized = policy.toLowerCase();
  if (normalized.includes("'unsafe-inline'")) failures.push("UNSAFE_INLINE");
  if (normalized.includes("'unsafe-eval'")) failures.push("UNSAFE_EVAL");
  if (normalized.split(/\s|;/).some((token) => token.includes("*")))
    failures.push("WILDCARD_SOURCE");
  for (const directive of [
    "default-src",
    "script-src",
    "object-src",
    "base-uri",
    "frame-ancestors",
  ]) {
    if (!normalized.includes(`${directive} `))
      failures.push(`MISSING_DIRECTIVE:${directive}`);
  }
  return Object.freeze(failures);
}

export function buildContentSecurityPolicy(nonce: string): string {
  if (!/^[A-Za-z0-9_-]{16,128}$/.test(nonce))
    throw new TypeError("CSP nonce 형식이 유효하지 않습니다.");
  const policy = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}'`,
    "object-src 'none'",
    "base-uri 'none'",
    "frame-ancestors 'none'",
  ].join("; ");
  if (validateContentSecurityPolicy(policy).length > 0)
    throw new Error("안전하지 않은 CSP입니다.");
  return policy;
}

export function toPublicError(
  _error: unknown,
): Readonly<{ code: "REQUEST_FAILED"; message: string }> {
  return Object.freeze({
    code: "REQUEST_FAILED",
    message: "요청을 처리하지 못했습니다. 입력과 권한을 확인해 주세요.",
  });
}
