import type {
  AuthContext,
  CreateRequestInput,
  RequestSort,
  WorkRequest,
} from "./contracts";
import { createWorkRequest } from "./domain";
import type { WorkRequestRepository } from "./repository";

function copy(request: WorkRequest): WorkRequest {
  return Object.freeze({ ...request });
}

export class MemoryWorkRequestRepository implements WorkRequestRepository {
  readonly #requests = new Map<string, WorkRequest>();

  constructor(seed: readonly WorkRequest[] = []) {
    for (const request of seed) this.#requests.set(request.id, copy(request));
  }

  async create(
    context: AuthContext,
    input: CreateRequestInput,
  ): Promise<WorkRequest> {
    const request = createWorkRequest(context, input);
    this.#requests.set(request.id, copy(request));
    return copy(request);
  }

  async list(
    context: AuthContext,
    sort: RequestSort,
    limit: number,
  ): Promise<readonly WorkRequest[]> {
    const requests = [...this.#requests.values()].filter(
      (request) =>
        request.tenantId === context.tenantId &&
        request.createdBy === context.userId,
    );
    requests.sort((left, right) => {
      if (sort === "due_asc") {
        return (left.dueDate ?? "9999-12-31").localeCompare(
          right.dueDate ?? "9999-12-31",
        );
      }
      return right.createdAt.localeCompare(left.createdAt);
    });
    return requests.slice(0, limit).map(copy);
  }

  async find(
    context: AuthContext,
    requestId: string,
  ): Promise<WorkRequest | null> {
    const request = this.#requests.get(requestId);
    return request?.tenantId === context.tenantId &&
      request.createdBy === context.userId
      ? copy(request)
      : null;
  }
}

const syntheticSeed: readonly WorkRequest[] = [
  {
    id: "7db95cff-a60f-46f4-a57e-bc70ce8b781a",
    tenantId: "tenant-demo",
    createdBy: "user-demo",
    title: "분기 접근 권한 점검",
    category: "security",
    status: "open",
    dueDate: "2026-09-01",
    createdAt: "2026-08-16T00:00:00.000Z",
  },
  {
    id: "02f5ee6b-74a1-4de6-bd78-b3bb73d022e5",
    tenantId: "tenant-demo",
    createdBy: "user-demo",
    title: "장비 정기 점검 일정 확인",
    category: "operations",
    status: "in_progress",
    dueDate: "2026-08-28",
    createdAt: "2026-08-15T00:00:00.000Z",
  },
];

const globalRepository = globalThis as typeof globalThis & {
  handbookMemoryRepository?: MemoryWorkRequestRepository;
};

export function getMemoryRepository(): MemoryWorkRequestRepository {
  globalRepository.handbookMemoryRepository ??= new MemoryWorkRequestRepository(
    syntheticSeed,
  );
  return globalRepository.handbookMemoryRepository;
}
