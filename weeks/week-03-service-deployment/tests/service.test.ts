import { describe, expect, it } from "vitest";

import { createWorkRequest } from "../src/service.js";

describe("업무요청 서비스", () => {
  it("정상 요청을 tenant 경계와 함께 생성한다", () => {
    expect(
      createWorkRequest(
        { tenantId: "tenant-a", title: "세금계산서 확인" },
        () => "request-1",
      ),
    ).toEqual({
      id: "request-1",
      tenantId: "tenant-a",
      title: "세금계산서 확인",
      status: "open",
    });
  });

  it("짧은 제목을 거부한다", () => {
    expect(() =>
      createWorkRequest({ tenantId: "tenant-a", title: "x" }),
    ).toThrow(/3자/);
  });
});
