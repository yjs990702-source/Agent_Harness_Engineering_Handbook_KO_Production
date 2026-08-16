import { createWorkRequest } from "../src/service.js";

type RequestLike = Readonly<{ method?: string; body?: unknown }>;
type ResponseWriter = { json: (body: unknown) => void };
type ResponseLike = Readonly<{
  status: (code: number) => ResponseWriter;
}>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export default function requestHandler(
  request: RequestLike,
  response: ResponseLike,
): void {
  if (request.method !== "POST") {
    response.status(405).json({ error: "method_not_allowed" });
    return;
  }
  if (!isRecord(request.body)) {
    response.status(400).json({ error: "invalid_body" });
    return;
  }
  try {
    const created = createWorkRequest({
      tenantId: request.body.tenantId,
      title: request.body.title,
    });
    response.status(201).json(created);
  } catch (error) {
    response.status(400).json({
      error: "invalid_request",
      message: error instanceof Error ? error.message : "unknown error",
    });
  }
}
