import { describe, expect, it } from "vitest";

import {
  buildContentSecurityPolicy,
  buildTitleLookupQuery,
  createSafeTextView,
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

  it("XSS 문자열을 실행 지시가 아닌 textContent 데이터로 유지한다", () => {
    const attack = '<img src=x onerror="alert(1)">';
    expect(createSafeTextView(attack)).toEqual({ textContent: attack });
  });

  it.each([
    "javascript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "http://example.com",
  ])("위험하거나 암호화되지 않은 URL %s을 거부한다", (url) => {
    expect(() => validateExternalUrl(url)).toThrow();
  });

  it("nonce 기반 CSP를 만들고 unsafe-inline과 unsafe-eval을 허용하지 않는다", () => {
    const policy = buildContentSecurityPolicy("0123456789abcdef");
    expect(policy).toContain("script-src 'self' 'nonce-0123456789abcdef'");
    expect(policy).not.toContain("unsafe-inline");
    expect(policy).not.toContain("unsafe-eval");
  });
});
