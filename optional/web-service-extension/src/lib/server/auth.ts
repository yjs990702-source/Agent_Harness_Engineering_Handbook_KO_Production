import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";
import type { AuthContext } from "../contracts";

export class AuthenticationError extends Error {
  constructor(readonly status: 401 | 503) {
    super(
      status === 401
        ? "인증이 필요합니다."
        : "인증 구성이 완료되지 않았습니다.",
    );
    this.name = "AuthenticationError";
  }
}

function bearerToken(request: NextRequest): string | null {
  const authorization = request.headers.get("authorization");
  const match = authorization?.match(/^Bearer\s+([^\s]+)$/i);
  return match?.[1] ?? null;
}

export async function requireAuth(request: NextRequest): Promise<AuthContext> {
  const mode = process.env.LAB_AUTH_MODE ?? "demo";
  if (mode === "demo") {
    if (process.env.NODE_ENV === "production")
      throw new AuthenticationError(503);
    return { tenantId: "tenant-demo", userId: "user-demo" };
  }
  if (mode !== "supabase") throw new AuthenticationError(503);

  const token = bearerToken(request);
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!token || !url || !publishableKey)
    throw new AuthenticationError(token ? 503 : 401);

  const client = createClient(url, publishableKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await client.auth.getUser(token);
  const tenantId = data.user?.app_metadata.tenant_id;
  if (error || !data.user || typeof tenantId !== "string" || !tenantId) {
    throw new AuthenticationError(401);
  }
  return { tenantId, userId: data.user.id, accessToken: token };
}
