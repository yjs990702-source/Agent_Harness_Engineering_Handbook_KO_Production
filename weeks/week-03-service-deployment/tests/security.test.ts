import { describe, expect, it } from "vitest";
import {
  buildContentSecurityPolicy,
  buildSortedTitleLookupQuery,
  buildTitleLookupQuery,
  createSafeTextView,
  toPublicError,
  validateContentSecurityPolicy,
  validateExternalUrl,
} from "../src/security.js";

describe("서비스 보안 경계", () => {
  it("SQL 공격 문자열을 query text에 연결하지 않는다", () => {
    const attack = "' OR 1=1 --";
    const query = buildTitleLookupQuery("tenant-a", attack);
    expect(query.text).toBe(
      "SELECT id, title, status FROM work_requests WHERE tenant_id = $1 AND title = $2",
    );
    expect(query.text).not.toContain(attack);
    expect(query.values).toEqual(["tenant-a", attack]);
  });

  it("정렬 식별자는 고정 allowlist로만 SQL text에 넣는다", () => {
    const query = buildSortedTitleLookupQuery(
      "tenant-a",
      "요청",
      "created_at",
      "desc",
    );
    expect(query.text).toMatch(/ORDER BY created_at DESC$/);
    expect(() =>
      buildSortedTitleLookupQuery(
        "tenant-a",
        "요청",
        "created_at; DROP TABLE work_requests",
        "DESC",
      ),
    ).toThrow(/allowlist/);
    expect(() =>
      buildSortedTitleLookupQuery("tenant-a", "요청", "title", "DESC; --"),
    ).toThrow(/allowlist/);
  });

  it.each([
    '<script>alert("reflected")</script>',
    '<img src=x onerror="stored()">',
    '<svg onload="dom()">',
  ])(
    "반사형·저장형·DOM XSS 문자열을 textContent 데이터로 유지한다",
    (attack) => {
      expect(createSafeTextView(attack)).toEqual({ textContent: attack });
    },
  );

  it.each([
    "javascript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "http://example.com",
    "//example.com/path",
    "https://user:password@example.com/path",
  ])("위험한 URL %s을 거부한다", (url) => {
    expect(() => validateExternalUrl(url)).toThrow();
  });

  it("nonce 기반 CSP를 만들고 unsafe·wildcard 정책을 탐지한다", () => {
    const policy = buildContentSecurityPolicy("0123456789abcdef");
    expect(validateContentSecurityPolicy(policy)).toEqual([]);
    expect(
      validateContentSecurityPolicy(
        "default-src *; script-src 'unsafe-inline' 'unsafe-eval'",
      ),
    ).toEqual(
      expect.arrayContaining([
        "UNSAFE_INLINE",
        "UNSAFE_EVAL",
        "WILDCARD_SOURCE",
      ]),
    );
  });

  it("공개 오류 응답에 query·schema·credential·secret을 복사하지 않는다", () => {
    const sensitive = new Error(
      "SELECT * FROM secret_table password=super-secret schema=internal",
    );
    const output = JSON.stringify(toPublicError(sensitive));
    expect(output).toBe(
      '{"code":"REQUEST_FAILED","message":"요청을 처리하지 못했습니다. 입력과 권한을 확인해 주세요."}',
    );
    expect(output).not.toMatch(/SELECT|password|super-secret|internal/i);
  });
});
