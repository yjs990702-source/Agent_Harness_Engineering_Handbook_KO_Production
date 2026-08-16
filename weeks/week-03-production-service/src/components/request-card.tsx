import type { WorkRequest } from "@/lib/contracts";

const categoryLabels: Readonly<Record<WorkRequest["category"], string>> = {
  general: "일반",
  security: "보안",
  operations: "운영",
};

const statusLabels: Readonly<Record<WorkRequest["status"], string>> = {
  open: "접수",
  in_progress: "진행 중",
  done: "완료",
};

export function RequestCard({ request }: { request: WorkRequest }) {
  return (
    <article className="request-card" data-status={request.status}>
      <div className="card-heading">
        <span className="category">{categoryLabels[request.category]}</span>
        <span className="status">{statusLabels[request.status]}</span>
      </div>
      <h3>{request.title}</h3>
      <dl>
        <div>
          <dt>기한</dt>
          <dd>{request.dueDate ?? "미정"}</dd>
        </div>
        <div>
          <dt>등록</dt>
          <dd>
            <time dateTime={request.createdAt}>
              {new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium" }).format(
                new Date(request.createdAt),
              )}
            </time>
          </dd>
        </div>
      </dl>
    </article>
  );
}
