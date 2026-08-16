import "server-only";

import type { AuthContext } from "../contracts";
import { getMemoryRepository } from "../memory-repository";
import type { WorkRequestRepository } from "../repository";
import { SupabaseWorkRequestRepository } from "../supabase-repository";

export function getRepository(context: AuthContext): WorkRequestRepository {
  const mode = process.env.LAB_DATA_MODE ?? "memory";
  if (mode === "memory") {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "Production에서는 memory repository를 사용할 수 없습니다.",
      );
    }
    return getMemoryRepository();
  }
  if (mode === "supabase" && context.accessToken) {
    return new SupabaseWorkRequestRepository(context.accessToken);
  }
  throw new Error("데이터 저장소 구성이 완료되지 않았습니다.");
}
