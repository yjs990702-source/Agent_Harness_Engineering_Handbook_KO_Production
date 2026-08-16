import { describe, expect, it } from "vitest";
import {
  MAX_REQUEST_BODY_BYTES,
  RequestSecurityError,
  assertBodySize,
  assertTrustedMutation,
} from "./request-security";
import { mutationHeaders, safeExternalUrl } from "./security";

const token = "a".repeat(64);

function validInput() {
  return {
    origin: "http://localhost:3000",
    expectedOrigin: "http://localhost:3000",
    fetchSite: "same-origin",
    csrfHeader: token,
    csrfCookie: token,
    contentType: "application/json; charset=utf-8",
    contentLength: "120",
  };
}

describe("mutation security", () => {
  it("동일 출처와 일치하는 CSRF token을 허용한다", () => {
    expect(() => assertTrustedMutation(validInput())).not.toThrow();
  });

  it("cross-site·token 불일치·잘못된 content type을 거부한다", () => {
    expect(() =>
      assertTrustedMutation({
        ...validInput(),
        origin: "https://evil.example",
      }),
    ).toThrow(RequestSecurityError);
    expect(() =>
      assertTrustedMutation({ ...validInput(), csrfHeader: "b".repeat(64) }),
    ).toThrow(/CSRF/);
    expect(() =>
      assertTrustedMutation({ ...validInput(), contentType: "text/plain" }),
    ).toThrow(/JSON/);
  });

  it("실제 UTF-8 body byte 크기를 제한한다", () => {
    expect(() => assertBodySize("가".repeat(MAX_REQUEST_BODY_BYTES))).toThrow(
      /크기/,
    );
  });
});

describe("browser output helpers", () => {
  it.each([
    "javascript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "http://example.com",
  ])("위험 URL %s을 거부한다", (url) =>
    expect(safeExternalUrl(url, ["example.com"])).toBeNull(),
  );

  it("mutation header에 검증된 token만 넣는다", () => {
    expect(mutationHeaders(token)["X-CSRF-Token"]).toBe(token);
    expect(() => mutationHeaders("short")).toThrow(/CSRF/);
  });
});
