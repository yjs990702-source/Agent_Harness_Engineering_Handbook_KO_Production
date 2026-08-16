"use client";

import { useRef, useState, type FormEvent } from "react";
import {
  CreateRequestSchema,
  WorkRequestSchema,
  type RequestCategory,
  type WorkRequest,
} from "@/lib/contracts";
import { mutationHeaders } from "@/lib/security";

type ApiErrorBody = {
  error?: { message?: string; fields?: Record<string, string[] | undefined> };
};

async function csrfToken(): Promise<string> {
  const response = await fetch("/api/session/csrf", { cache: "no-store" });
  if (!response.ok) throw new Error("보안 token을 발급하지 못했습니다.");
  const body = (await response.json()) as { token?: unknown };
  if (typeof body.token !== "string")
    throw new Error("보안 token 응답이 올바르지 않습니다.");
  return body.token;
}

export function RequestForm({
  onCreated,
}: {
  onCreated: (request: WorkRequest) => void;
}) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<RequestCategory>("general");
  const [dueDate, setDueDate] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldError(null);
    setFormError(null);
    const parsed = CreateRequestSchema.safeParse({ title, category, dueDate });
    if (!parsed.success) {
      setFieldError(
        parsed.error.flatten().fieldErrors.title?.[0] ??
          "입력값을 확인하십시오.",
      );
      titleRef.current?.focus();
      return;
    }

    setPending(true);
    try {
      const token = await csrfToken();
      const response = await fetch("/api/requests", {
        method: "POST",
        credentials: "same-origin",
        headers: mutationHeaders(token),
        body: JSON.stringify(parsed.data),
      });
      const body = (await response.json()) as {
        request?: unknown;
      } & ApiErrorBody;
      if (!response.ok) {
        const titleError = body.error?.fields?.title?.[0];
        if (titleError) {
          setFieldError(titleError);
          titleRef.current?.focus();
        } else {
          setFormError(
            body.error?.message ?? "업무요청을 등록하지 못했습니다.",
          );
        }
        return;
      }
      const created = WorkRequestSchema.parse(body.request);
      onCreated(created);
      setTitle("");
      setDueDate("");
    } catch {
      setFormError("네트워크 또는 응답 검증 오류로 등록하지 못했습니다.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="request-form" onSubmit={submit} noValidate>
      <div className="section-heading">
        <div>
          <p className="eyebrow">핵심 사용자 흐름</p>
          <h2>새 업무요청</h2>
        </div>
        <span className="local-badge">합성 데이터</span>
      </div>

      <label htmlFor="request-title">제목</label>
      <input
        ref={titleRef}
        id="request-title"
        name="title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        aria-invalid={Boolean(fieldError)}
        aria-describedby={fieldError ? "title-error" : "title-help"}
        maxLength={100}
        autoComplete="off"
      />
      {fieldError ? (
        <p id="title-error" className="field-error" role="alert">
          {fieldError}
        </p>
      ) : (
        <p id="title-help" className="field-help">
          공백 제외 3~100자로 작성합니다.
        </p>
      )}

      <div className="field-grid">
        <div>
          <label htmlFor="request-category">분류</label>
          <select
            id="request-category"
            value={category}
            onChange={(event) =>
              setCategory(event.target.value as RequestCategory)
            }
          >
            <option value="general">일반</option>
            <option value="security">보안</option>
            <option value="operations">운영</option>
          </select>
        </div>
        <div>
          <label htmlFor="request-due-date">기한</label>
          <input
            id="request-due-date"
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
          />
        </div>
      </div>

      {formError ? (
        <p className="form-error" role="alert">
          {formError}
        </p>
      ) : null}
      <button type="submit" disabled={pending}>
        {pending ? "등록 중…" : "요청 등록"}
      </button>
    </form>
  );
}
