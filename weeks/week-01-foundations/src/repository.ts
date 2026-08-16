import type { WorkRequest } from "./request.js";

export interface WorkRequestRepository {
  insert(request: WorkRequest): Promise<void>;
  listForTenant(tenantId: string): Promise<readonly WorkRequest[]>;
  findForTenant(
    tenantId: string,
    requestId: string,
  ): Promise<WorkRequest | null>;
}

function copyRequest(request: WorkRequest): WorkRequest {
  return Object.freeze({ ...request });
}

export class InMemoryWorkRequestRepository implements WorkRequestRepository {
  readonly #requests = new Map<string, WorkRequest>();

  async insert(request: WorkRequest): Promise<void> {
    this.#requests.set(request.id, copyRequest(request));
  }

  async listForTenant(tenantId: string): Promise<readonly WorkRequest[]> {
    return [...this.#requests.values()]
      .filter((request) => request.tenantId === tenantId)
      .sort((left, right) => left.createdAt.localeCompare(right.createdAt))
      .map(copyRequest);
  }

  async findForTenant(
    tenantId: string,
    requestId: string,
  ): Promise<WorkRequest | null> {
    const request = this.#requests.get(requestId);
    return request?.tenantId === tenantId ? copyRequest(request) : null;
  }
}
