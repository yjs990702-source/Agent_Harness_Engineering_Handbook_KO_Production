import {
  createWorkRequest,
  type CreateRequestInput,
  type WorkRequest,
} from "./request.js";
import type { WorkRequestRepository } from "./repository.js";

export type AuthContext = Readonly<{
  tenantId: string;
  userId: string;
}>;

export class RequestNotFoundError extends Error {
  constructor() {
    super("업무요청을 찾을 수 없습니다.");
    this.name = "RequestNotFoundError";
  }
}

type ServiceDependencies = Readonly<{
  createId?: () => string;
  now?: () => Date;
}>;

export class WorkRequestService {
  constructor(
    private readonly repository: WorkRequestRepository,
    private readonly dependencies: ServiceDependencies = {},
  ) {}

  async create(
    context: AuthContext,
    input: CreateRequestInput,
  ): Promise<WorkRequest> {
    const request = createWorkRequest(context, input, this.dependencies);
    await this.repository.insert(request);
    return request;
  }

  async list(context: AuthContext): Promise<readonly WorkRequest[]> {
    return this.repository.listForTenant(context.tenantId);
  }

  async get(context: AuthContext, requestId: string): Promise<WorkRequest> {
    const request = await this.repository.findForTenant(
      context.tenantId,
      requestId,
    );
    if (!request) throw new RequestNotFoundError();
    return request;
  }
}
