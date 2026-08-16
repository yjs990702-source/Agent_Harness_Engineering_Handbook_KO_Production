import { describe, expect, it } from "vitest";
import {
  RequestValidationError,
  createWorkRequest,
  normalizeRequestTitle,
} from "../src/request.js";

describe("normalizeRequestTitle", () => {
  it.each(["", " ", "ab", "  ab  "])("3자 미만 제목 %j을 거부한다", (title) => {
    expect(() => normalizeRequestTitle(title)).toThrow(RequestValidationError);
  });

  it("앞뒤 공백을 제거하고 3자 제목을 허용한다", () => {
    expect(normalizeRequestTitle("  요청A  ")).toBe("요청A");
  });

  it("100자를 초과하는 제목을 거부한다", () => {
    expect(() => normalizeRequestTitle("가".repeat(101))).toThrow(/100자/);
  });

  it("HTML처럼 보이는 입력을 실행하지 않고 문자열로 보존한다", () => {
    const payload = "<script>alert('xss')</script>";
    expect(normalizeRequestTitle(payload)).toBe(payload);
  });
});

describe("createWorkRequest", () => {
  it("검증된 제목과 추적 가능한 생성 정보를 만든다", () => {
    const request = createWorkRequest(
      { tenantId: "tenant-a", userId: "user-a" },
      { title: "  장비 점검  " },
      {
        createId: () => "request-001",
        now: () => new Date("2026-08-16T00:00:00.000Z"),
      },
    );

    expect(request).toEqual({
      id: "request-001",
      tenantId: "tenant-a",
      createdBy: "user-a",
      title: "장비 점검",
      status: "open",
      createdAt: "2026-08-16T00:00:00.000Z",
    });
    expect(Object.isFrozen(request)).toBe(true);
  });
});
