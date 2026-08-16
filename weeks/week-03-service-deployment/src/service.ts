import { randomUUID } from "node:crypto";

import type { WorkRequest } from "./contracts.js";
import { createSafeTextView } from "./security.js";

export type CreateRequestInput = Readonly<{
  tenantId: unknown;
  title: unknown;
}>;

export function createWorkRequest(
  input: CreateRequestInput,
  createId: () => string = randomUUID,
): WorkRequest {
  if (typeof input.tenantId !== "string" || input.tenantId.trim().length < 2) {
    throw new TypeError("tenantId는 2자 이상의 문자열이어야 합니다.");
  }
  const title = createSafeTextView(input.title).textContent;
  if (title.length < 3) {
    throw new RangeError("title은 3자 이상이어야 합니다.");
  }
  return Object.freeze({
    id: createId(),
    tenantId: input.tenantId.trim(),
    title,
    status: "open",
  });
}
