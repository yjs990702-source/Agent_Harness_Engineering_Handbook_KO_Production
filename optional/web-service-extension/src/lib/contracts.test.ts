import { describe, expect, it } from "vitest";
import {
  CreateRequestSchema,
  ListQuerySchema,
  RequestIdSchema,
} from "./contracts";

describe("CreateRequestSchema", () => {
  it.each(["", " ", "ab", "  ab  "])("3자 미만 제목 %j을 거부한다", (title) => {
    expect(
      CreateRequestSchema.safeParse({ title, category: "general" }).success,
    ).toBe(false);
  });

  it("trim한 제목과 선택 기한을 검증한다", () => {
    expect(
      CreateRequestSchema.parse({
        title: "  권한 검토  ",
        category: "security",
        dueDate: "",
      }),
    ).toEqual({ title: "권한 검토", category: "security", dueDate: undefined });
  });
});

describe("query boundary", () => {
  it("SQLi 형태 ID를 repository 전에 거부한다", () => {
    expect(RequestIdSchema.safeParse("' OR 1=1 --").success).toBe(false);
  });

  it("정렬 column·방향 주입을 allowlist에서 거부한다", () => {
    expect(
      ListQuerySchema.safeParse({
        sort: "created_at desc; drop table work_requests",
      }).success,
    ).toBe(false);
  });
});
