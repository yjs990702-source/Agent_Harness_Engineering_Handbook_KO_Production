import type { ParameterizedQuery } from "./contracts.js";

function boundedText(value: unknown, field: string, maximum: number): string {
  if (typeof value !== "string") {
    throw new TypeError(`${field}는 문자열이어야 합니다.`);
  }
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

export function createSafeTextView(value: unknown): Readonly<{
  textContent: string;
}> {
  return Object.freeze({ textContent: boundedText(value, "text", 100) });
}

export function validateExternalUrl(value: unknown): string {
  const raw = boundedText(value, "url", 2_048);
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    throw new TypeError("URL 형식이 유효하지 않습니다.");
  }
  if (parsed.protocol !== "https:") {
    throw new Error("외부 링크는 https:만 허용합니다.");
  }
  if (parsed.username || parsed.password) {
    throw new Error("URL 사용자 정보는 허용하지 않습니다.");
  }
  return parsed.toString();
}

export function buildContentSecurityPolicy(nonce: string): string {
  if (!/^[A-Za-z0-9_-]{16,128}$/.test(nonce)) {
    throw new TypeError("CSP nonce 형식이 유효하지 않습니다.");
  }
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}'`,
    "object-src 'none'",
    "base-uri 'none'",
    "frame-ancestors 'none'",
  ].join("; ");
}
