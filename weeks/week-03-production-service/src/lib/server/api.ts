import "server-only";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { AuthenticationError } from "./auth";
import {
  MAX_REQUEST_BODY_BYTES,
  RequestSecurityError,
  assertBodySize,
  assertTrustedMutation,
} from "../request-security";
import { RepositoryOperationError } from "../supabase-repository";

export function apiError(
  status: number,
  code: string,
  message: string,
  fields?: Readonly<Record<string, readonly string[]>>,
) {
  return NextResponse.json(
    { error: { code, message, ...(fields ? { fields } : {}) } },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

export function handleApiError(error: unknown) {
  if (error instanceof AuthenticationError) {
    return apiError(
      error.status,
      error.status === 401 ? "UNAUTHORIZED" : "AUTH_NOT_CONFIGURED",
      error.message,
    );
  }
  if (error instanceof RequestSecurityError) {
    return apiError(error.status, "REQUEST_REJECTED", error.message);
  }
  if (error instanceof RepositoryOperationError) {
    return apiError(
      503,
      "DATA_UNAVAILABLE",
      "데이터 작업을 완료하지 못했습니다.",
    );
  }
  return apiError(500, "INTERNAL_ERROR", "요청을 처리하지 못했습니다.");
}

function expectedOrigin(request: NextRequest): string {
  return process.env.APP_BASE_URL ?? request.nextUrl.origin;
}

export async function readMutationJson(request: NextRequest): Promise<unknown> {
  assertTrustedMutation({
    origin: request.headers.get("origin"),
    expectedOrigin: expectedOrigin(request),
    fetchSite: request.headers.get("sec-fetch-site"),
    csrfHeader: request.headers.get("x-csrf-token"),
    csrfCookie: request.cookies.get("handbook_csrf")?.value ?? null,
    contentType: request.headers.get("content-type"),
    contentLength: request.headers.get("content-length"),
  });
  const body = await request.text();
  assertBodySize(body);
  try {
    return JSON.parse(body) as unknown;
  } catch {
    throw new RequestSecurityError("올바른 JSON body가 아닙니다.", 400);
  }
}

export const apiBodyLimit = MAX_REQUEST_BODY_BYTES;
