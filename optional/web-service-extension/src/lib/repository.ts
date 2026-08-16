import type {
  AuthContext,
  CreateRequestInput,
  RequestSort,
  WorkRequest,
} from "./contracts";

export interface WorkRequestRepository {
  create(context: AuthContext, input: CreateRequestInput): Promise<WorkRequest>;
  list(
    context: AuthContext,
    sort: RequestSort,
    limit: number,
  ): Promise<readonly WorkRequest[]>;
  find(context: AuthContext, requestId: string): Promise<WorkRequest | null>;
}
