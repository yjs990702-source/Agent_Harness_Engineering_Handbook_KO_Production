import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { RequestIdSchema } from "@/lib/contracts";
import { apiError, handleApiError } from "@/lib/server/api";
import { requireAuth } from "@/lib/server/auth";
import { getRepository } from "@/lib/server/repository-factory";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ requestId: string }> },
) {
  try {
    const auth = await requireAuth(request);
    const requestId = RequestIdSchema.safeParse(
      (await context.params).requestId,
    );
    if (!requestId.success)
      return apiError(404, "NOT_FOUND", "업무요청을 찾을 수 없습니다.");
    const item = await getRepository(auth).find(auth, requestId.data);
    if (!item)
      return apiError(404, "NOT_FOUND", "업무요청을 찾을 수 없습니다.");
    return NextResponse.json(
      { request: item },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
