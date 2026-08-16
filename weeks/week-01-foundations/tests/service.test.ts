import { describe, expect, it } from "vitest";
import { InMemoryWorkRequestRepository } from "../src/repository.js";
import { RequestNotFoundError, WorkRequestService } from "../src/service.js";

function createService() {
  let sequence = 0;
  return new WorkRequestService(new InMemoryWorkRequestRepository(), {
    createId: () => `request-${++sequence}`,
    now: () => new Date("2026-08-16T00:00:00.000Z"),
  });
}

describe("WorkRequestService", () => {
  it("tenant별 목록을 분리한다", async () => {
    const service = createService();
    await service.create(
      { tenantId: "tenant-a", userId: "user-a" },
      { title: "A 요청" },
    );
    await service.create(
      { tenantId: "tenant-b", userId: "user-b" },
      { title: "B 요청" },
    );

    const requests = await service.list({
      tenantId: "tenant-a",
      userId: "user-a",
    });

    expect(requests).toHaveLength(1);
    expect(requests[0]?.title).toBe("A 요청");
  });

  it("다른 tenant의 상세 ID를 알아도 not-found로 처리한다", async () => {
    const service = createService();
    const request = await service.create(
      { tenantId: "tenant-a", userId: "user-a" },
      { title: "비공개 요청" },
    );

    await expect(
      service.get({ tenantId: "tenant-b", userId: "user-b" }, request.id),
    ).rejects.toBeInstanceOf(RequestNotFoundError);
    await expect(
      service.get({ tenantId: "tenant-b", userId: "user-b" }, "missing"),
    ).rejects.toThrow("업무요청을 찾을 수 없습니다.");
  });
});
