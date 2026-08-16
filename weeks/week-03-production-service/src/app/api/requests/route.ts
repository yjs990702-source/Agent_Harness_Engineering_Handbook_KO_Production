import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { CreateRequestSchema, ListQuerySchema } from "@/lib/contracts";
import { apiError, handleApiError, readMutationJson } from "@/lib/server/api";
import { requireAuth } from "@/lib/server/auth";
import { getRepository } from "@/lib/server/repository-factory";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const context = await requireAuth(request);
    const query = ListQuerySchema.safeParse({
      sort: request.nextUrl.searchParams.get("sort") ?? undefined,
      limit: request.nextUrl.searchParams.get("limit") ?? undefined,
    });
    if (!query.success)
      return apiError(400, "INVALID_QUERY", "목록 조건이 올바르지 않습니다.");
    const requests = await getRepository(context).list(
      context,
      query.data.sort,
      query.data.limit,
    );
    return NextResponse.json(
      { requests },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const context = await requireAuth(request);
    const parsed = CreateRequestSchema.safeParse(
      await readMutationJson(request),
    );
    if (!parsed.success) {
      return apiError(
        400,
        "VALIDATION_ERROR",
        "입력값을 확인하십시오.",
        parsed.error.flatten().fieldErrors,
      );
    }
    const created = await getRepository(context).create(context, parsed.data);
    return NextResponse.json({ request: created }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
