import { randomUUID } from "node:crypto";
import type { AuthContext, CreateRequestInput, WorkRequest } from "./contracts";

type CreationDependencies = Readonly<{
  createId?: () => string;
  now?: () => Date;
}>;

export function createWorkRequest(
  context: AuthContext,
  input: CreateRequestInput,
  dependencies: CreationDependencies = {},
): WorkRequest {
  const createId = dependencies.createId ?? randomUUID;
  const now = dependencies.now ?? (() => new Date());
  return Object.freeze({
    id: createId(),
    tenantId: context.tenantId,
    createdBy: context.userId,
    title: input.title,
    category: input.category,
    status: "open",
    dueDate: input.dueDate ?? null,
    createdAt: now().toISOString(),
  });
}
