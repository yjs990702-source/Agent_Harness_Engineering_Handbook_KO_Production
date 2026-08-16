import { describe, expect, it } from "vitest";

import healthHandler from "../api/health.js";
import requestHandler from "../api/requests.js";

function captureResponse(): {
  calls: Array<{ code: number; body: unknown }>;
  response: { status: (code: number) => { json: (body: unknown) => void } };
} {
  const calls: Array<{ code: number; body: unknown }> = [];
  return {
    calls,
    response: {
      status: (code) => ({ json: (body) => calls.push({ code, body }) }),
    },
  };
}

describe("배포 가능한 HTTP 경계", () => {
  it("health 결과를 반환한다", () => {
    const target = captureResponse();
    healthHandler({}, target.response);
    expect(target.calls).toEqual([
      { code: 200, body: { status: "ok", service: "request-tracker-lab" } },
    ]);
  });

  it("잘못된 body를 400으로 처리한다", () => {
    const target = captureResponse();
    requestHandler({ method: "POST", body: null }, target.response);
    expect(target.calls).toEqual([
      { code: 400, body: { error: "invalid_body" } },
    ]);
  });
});
