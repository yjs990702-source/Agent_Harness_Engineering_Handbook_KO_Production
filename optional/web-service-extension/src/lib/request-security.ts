import { timingSafeEqual } from "node:crypto";

export const MAX_REQUEST_BODY_BYTES = 16 * 1024;

export class RequestSecurityError extends Error {
  constructor(
    message: string,
    readonly status: 400 | 403 | 413 | 415,
  ) {
    super(message);
    this.name = "RequestSecurityError";
  }
}

type MutationSecurityInput = Readonly<{
  origin: string | null;
  expectedOrigin: string;
  fetchSite: string | null;
  csrfHeader: string | null;
  csrfCookie: string | null;
  contentType: string | null;
  contentLength: string | null;
}>;

function normalizedOrigin(value: string): string {
  const url = new URL(value);
  return url.origin;
}

export function assertTrustedMutation(input: MutationSecurityInput): void {
  if (!input.contentType?.toLowerCase().startsWith("application/json")) {
    throw new RequestSecurityError("JSON content type이 필요합니다.", 415);
  }

  const declaredLength = input.contentLength
    ? Number.parseInt(input.contentLength, 10)
    : 0;
  if (
    !Number.isFinite(declaredLength) ||
    declaredLength < 0 ||
    declaredLength > MAX_REQUEST_BODY_BYTES
  ) {
    throw new RequestSecurityError(
      "요청 body가 허용 크기를 초과했습니다.",
      413,
    );
  }

  try {
    if (
      !input.origin ||
      normalizedOrigin(input.origin) !== normalizedOrigin(input.expectedOrigin)
    ) {
      throw new RequestSecurityError("신뢰할 수 없는 요청 출처입니다.", 403);
    }
  } catch (error) {
    if (error instanceof RequestSecurityError) throw error;
    throw new RequestSecurityError("신뢰할 수 없는 요청 출처입니다.", 403);
  }

  if (
    input.fetchSite &&
    !["same-origin", "same-site"].includes(input.fetchSite)
  ) {
    throw new RequestSecurityError("cross-site 요청은 허용되지 않습니다.", 403);
  }

  const header = Buffer.from(input.csrfHeader ?? "");
  const cookie = Buffer.from(input.csrfCookie ?? "");
  if (
    header.length < 32 ||
    header.length !== cookie.length ||
    !timingSafeEqual(header, cookie)
  ) {
    throw new RequestSecurityError("CSRF token이 일치하지 않습니다.", 403);
  }
}

export function assertBodySize(body: string): void {
  if (Buffer.byteLength(body, "utf8") > MAX_REQUEST_BODY_BYTES) {
    throw new RequestSecurityError(
      "요청 body가 허용 크기를 초과했습니다.",
      413,
    );
  }
}
