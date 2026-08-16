"use client";

import { useEffect, useState } from "react";
import { WorkRequestSchema, type WorkRequest } from "@/lib/contracts";
import { RequestCard } from "./request-card";
import { RequestForm } from "./request-form";

export function RequestDashboard() {
  const [requests, setRequests] = useState<readonly WorkRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    let active = true;
    void fetch("/api/requests?sort=created_desc&limit=20", {
      cache: "no-store",
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("목록을 불러오지 못했습니다.");
        const body = (await response.json()) as { requests?: unknown };
        return WorkRequestSchema.array().parse(body.requests);
      })
      .then((items) => {
        if (active) setRequests(items);
      })
      .catch(() => {
        if (active) setError("업무요청 목록을 불러오지 못했습니다.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  function addCreated(request: WorkRequest) {
    setRequests((current) => [request, ...current]);
    setAnnouncement(`“${request.title}” 요청을 등록했습니다.`);
  }

  return (
    <div className="dashboard-grid">
      <RequestForm onCreated={addCreated} />
      <section className="request-list" aria-labelledby="request-list-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">검증 가능한 결과</p>
            <h2 id="request-list-title">업무요청 목록</h2>
          </div>
          <span className="count" aria-label={`요청 ${requests.length}건`}>
            {requests.length}
          </span>
        </div>
        <p className="sr-only" aria-live="polite">
          {announcement}
        </p>
        {loading ? (
          <p className="state-message">목록을 불러오는 중입니다.</p>
        ) : null}
        {error ? (
          <p className="state-message error" role="alert">
            {error}
          </p>
        ) : null}
        {!loading && !error && requests.length === 0 ? (
          <p className="state-message">등록된 합성 업무요청이 없습니다.</p>
        ) : null}
        <div className="cards">
          {requests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      </section>
    </div>
  );
}
