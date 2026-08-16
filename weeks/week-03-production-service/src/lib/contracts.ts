import { z } from "zod";

export const RequestCategorySchema = z.enum([
  "general",
  "security",
  "operations",
]);
export const RequestStatusSchema = z.enum(["open", "in_progress", "done"]);
export const RequestSortSchema = z.enum(["created_desc", "due_asc"]);

const OptionalDueDateSchema = z.preprocess(
  (value) => (value === "" || value === null ? undefined : value),
  z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "기한은 YYYY-MM-DD 형식이어야 합니다.")
    .optional(),
);

export const CreateRequestSchema = z.object({
  // Week 3 start fixture: 첫 서비스 TDD에서 3자 경계로 수정합니다.
  title: z
    .string()
    .trim()
    .min(2, "제목은 2자 이상이어야 합니다.")
    .max(100, "제목은 100자 이하여야 합니다."),
  category: RequestCategorySchema.default("general"),
  dueDate: OptionalDueDateSchema,
});

export const WorkRequestSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().min(1),
  createdBy: z.string().min(1),
  title: z.string().min(3).max(100),
  category: RequestCategorySchema,
  status: RequestStatusSchema,
  dueDate: z.string().nullable(),
  createdAt: z.string().datetime(),
});

export const ListQuerySchema = z.object({
  sort: RequestSortSchema.default("created_desc"),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const RequestIdSchema = z.string().uuid("올바른 요청 ID가 아닙니다.");

export type RequestCategory = z.infer<typeof RequestCategorySchema>;
export type RequestSort = z.infer<typeof RequestSortSchema>;
export type CreateRequestInput = z.infer<typeof CreateRequestSchema>;
export type WorkRequest = z.infer<typeof WorkRequestSchema>;

export type AuthContext = Readonly<{
  tenantId: string;
  userId: string;
  accessToken?: string;
}>;
