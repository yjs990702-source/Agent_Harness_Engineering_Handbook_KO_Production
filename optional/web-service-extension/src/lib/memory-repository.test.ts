import { describe, expect, it } from "vitest";
import type { WorkRequest } from "./contracts";
import { MemoryWorkRequestRepository } from "./memory-repository";

const seed: WorkRequest = {
  id: "ab5845a5-6253-4315-9ace-4a924c649365",
  tenantId: "tenant-a",
  createdBy: "user-a",
  title: "비공개 점검 요청",
  category: "security",
  status: "open",
  dueDate: null,
  createdAt: "2026-08-16T00:00:00.000Z",
};

describe("MemoryWorkRequestRepository", () => {
  it("tenant와 owner가 모두 같은 요청만 조회한다", async () => {
    const repository = new MemoryWorkRequestRepository([seed]);
    await expect(
      repository.find({ tenantId: "tenant-b", userId: "user-a" }, seed.id),
    ).resolves.toBeNull();
    await expect(
      repository.find({ tenantId: "tenant-a", userId: "user-b" }, seed.id),
    ).resolves.toBeNull();
    await expect(
      repository.find({ tenantId: "tenant-a", userId: "user-a" }, seed.id),
    ).resolves.toEqual(seed);
  });

  it("목록도 tenant·owner scope와 limit을 적용한다", async () => {
    const repository = new MemoryWorkRequestRepository([seed]);
    await expect(
      repository.list(
        { tenantId: "tenant-a", userId: "user-b" },
        "created_desc",
        20,
      ),
    ).resolves.toEqual([]);
    await expect(
      repository.list(
        { tenantId: "tenant-a", userId: "user-a" },
        "created_desc",
        1,
      ),
    ).resolves.toHaveLength(1);
  });
});
