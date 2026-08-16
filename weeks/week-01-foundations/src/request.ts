import { randomUUID } from "node:crypto";

export const REQUEST_STATUSES = ["open", "in_progress", "done"] as const;
export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export type WorkRequest = Readonly<{
  id: string;
  tenantId: string;
  createdBy: string;
  title: string;
  status: RequestStatus;
  createdAt: string;
}>;

export type CreateRequestInput = Readonly<{ title: unknown }>;

export class RequestValidationError extends Error {
  readonly field: "title";

  constructor(message: string) {
    super(message);
    this.name = "RequestValidationError";
    this.field = "title";
  }
}

export function normalizeRequestTitle(value: unknown): string {
  if (typeof value !== "string") {
    throw new RequestValidationError("제목은 문자열이어야 합니다.");
  }

  const title = value.trim();
  if (title.length < 3) {
    throw new RequestValidationError(
      "제목은 공백을 제외하고 3자 이상이어야 합니다.",
    );
  }
  if (title.length > 100) {
    throw new RequestValidationError("제목은 100자를 초과할 수 없습니다.");
  }
  return title;
}

type CreationContext = Readonly<{
  tenantId: string;
  userId: string;
}>;

type CreationDependencies = Readonly<{
  createId?: () => string;
  now?: () => Date;
}>;

export function createWorkRequest(
  context: CreationContext,
  input: CreateRequestInput,
  dependencies: CreationDependencies = {},
): WorkRequest {
  const createId = dependencies.createId ?? randomUUID;
  const now = dependencies.now ?? (() => new Date());
  return Object.freeze({
    id: createId(),
    tenantId: context.tenantId,
    createdBy: context.userId,
    title: normalizeRequestTitle(input.title),
    status: "open",
    createdAt: now().toISOString(),
  });
}
