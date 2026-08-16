import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import type {
  AuthContext,
  CreateRequestInput,
  RequestSort,
  WorkRequest,
} from "./contracts";
import type { WorkRequestRepository } from "./repository";

const SupabaseRowSchema = z.object({
  id: z.string().uuid(),
  tenant_id: z.string().min(1),
  created_by: z.string().min(1),
  title: z.string().min(3).max(100),
  category: z.enum(["general", "security", "operations"]),
  status: z.enum(["open", "in_progress", "done"]),
  due_date: z.string().nullable(),
  created_at: z.string().datetime(),
});

const selectedColumns =
  "id,tenant_id,created_by,title,category,status,due_date,created_at" as const;
const sortColumns: Readonly<Record<RequestSort, "created_at" | "due_date">> = {
  created_desc: "created_at",
  due_asc: "due_date",
};

function toDomain(value: unknown): WorkRequest {
  const row = SupabaseRowSchema.parse(value);
  return {
    id: row.id,
    tenantId: row.tenant_id,
    createdBy: row.created_by,
    title: row.title,
    category: row.category,
    status: row.status,
    dueDate: row.due_date,
    createdAt: row.created_at,
  };
}

export class RepositoryOperationError extends Error {
  constructor() {
    super("데이터 작업을 완료하지 못했습니다.");
    this.name = "RepositoryOperationError";
  }
}

export class SupabaseWorkRequestRepository implements WorkRequestRepository {
  readonly #client: SupabaseClient;

  constructor(accessToken: string) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !publishableKey || !accessToken) {
      throw new RepositoryOperationError();
    }
    this.#client = createClient(url, publishableKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
    });
  }

  async create(
    context: AuthContext,
    input: CreateRequestInput,
  ): Promise<WorkRequest> {
    const { data, error } = await this.#client
      .from("work_requests")
      .insert({
        tenant_id: context.tenantId,
        created_by: context.userId,
        title: input.title,
        category: input.category,
        due_date: input.dueDate ?? null,
      })
      .select(selectedColumns)
      .single();
    if (error || !data) throw new RepositoryOperationError();
    return toDomain(data);
  }

  async list(
    context: AuthContext,
    sort: RequestSort,
    limit: number,
  ): Promise<readonly WorkRequest[]> {
    const column = sortColumns[sort];
    const { data, error } = await this.#client
      .from("work_requests")
      .select(selectedColumns)
      .eq("tenant_id", context.tenantId)
      .eq("created_by", context.userId)
      .order(column, { ascending: sort === "due_asc", nullsFirst: false })
      .limit(limit);
    if (error || !data) throw new RepositoryOperationError();
    return data.map(toDomain);
  }

  async find(
    context: AuthContext,
    requestId: string,
  ): Promise<WorkRequest | null> {
    const { data, error } = await this.#client
      .from("work_requests")
      .select(selectedColumns)
      .eq("tenant_id", context.tenantId)
      .eq("created_by", context.userId)
      .eq("id", requestId)
      .maybeSingle();
    if (error) throw new RepositoryOperationError();
    return data ? toDomain(data) : null;
  }
}
