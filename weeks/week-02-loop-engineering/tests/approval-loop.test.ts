import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import {
  eventsForProposal,
  reduceRun,
  resumeApprovedTool,
  type ApprovalToken,
  type RunEvent,
  type ToolProposal,
} from "../src/approval-loop.js";

const proposal: ToolProposal = {
  runId: "RUN-001",
  callId: "CALL-001",
  tool: "deploy_preview",
  sideEffect: "consequential",
  input: { commit: "abc1234" },
};

const token: ApprovalToken = {
  runId: "RUN-001",
  callId: "CALL-001",
  tool: "deploy_preview",
  approvedBy: "reviewer-1",
  expiresAt: "2026-08-18T00:00:00.000Z",
};

function waitingEvents(): readonly RunEvent[] {
  return [
    { type: "run_started", runId: "RUN-001", goal: "Preview 배포" },
    ...eventsForProposal(proposal),
  ];
}

type ApprovalFixture = Readonly<{
  events: readonly Record<string, unknown>[];
  expectedCode: string;
}>;

function toRunEvent(event: Record<string, unknown>): RunEvent {
  const runId = String(event.run_id);
  if (event.type === "run_started")
    return { type: "run_started", runId, goal: String(event.goal) };
  if (event.type === "run_completed") return { type: "run_completed", runId };
  if (event.type === "tool_executed")
    return {
      type: "tool_executed",
      runId,
      callId: String(event.call_id),
      executedAt: String(event.executed_at),
      output: "fixture",
    };
  if (event.type === "approval_requested")
    return {
      type: "approval_requested",
      runId,
      callId: String(event.call_id),
    };
  return {
    type: "tool_proposed",
    runId,
    proposal: {
      runId,
      callId: String(event.call_id),
      tool: String(event.tool),
      sideEffect: String(event.side_effect) as "none" | "consequential",
      input: {},
    },
  };
}

function approvalFailureCode(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes("승인 없는")) return "APPROVAL_REQUIRED";
  if (message.includes("종료 상태")) return "TERMINAL_EVENT";
  return "UNMAPPED_FAILURE";
}

describe("approval event loop", () => {
  it("위험한 도구를 실행 전에 정확한 callId에서 멈춘다", () => {
    const state = reduceRun(waitingEvents());
    expect(state.status).toBe("waiting_approval");
    expect(state.pendingProposal?.callId).toBe("CALL-001");
    expect(state.executedCallIds.size).toBe(0);
  });

  it("올바른 승인 token을 이벤트와 함께 한 번만 재개한다", async () => {
    const execute = vi.fn(async () => "preview-ready");
    const resumed = await resumeApprovedTool({
      events: waitingEvents(),
      token,
      now: new Date("2026-08-17T00:00:00.000Z"),
      execute,
    });
    expect(resumed.map((event) => event.type)).toEqual([
      "approval_granted",
      "tool_executed",
    ]);
    expect(reduceRun([...waitingEvents(), ...resumed]).executedCallIds).toEqual(
      new Set(["CALL-001"]),
    );
    expect(execute).toHaveBeenCalledOnce();
  });

  it("다른 run·call·tool의 승인 token과 만료 token을 거부한다", async () => {
    for (const invalid of [
      { ...token, runId: "RUN-OTHER" },
      { ...token, callId: "CALL-OTHER" },
      { ...token, tool: "deploy_production" },
    ]) {
      await expect(
        resumeApprovedTool({
          events: waitingEvents(),
          token: invalid,
          now: new Date("2026-08-17T00:00:00.000Z"),
          execute: async () => "should-not-run",
        }),
      ).rejects.toThrow(/일치하지 않습니다/);
    }
    await expect(
      resumeApprovedTool({
        events: waitingEvents(),
        token,
        now: new Date("2026-08-18T00:00:00.000Z"),
        execute: async () => "should-not-run",
      }),
    ).rejects.toThrow(/만료/);
  });

  it("승인 없는 임의 실행 event replay를 거부한다", () => {
    expect(() =>
      reduceRun([
        ...waitingEvents(),
        {
          type: "tool_executed",
          runId: "RUN-001",
          callId: "CALL-001",
          executedAt: "2026-08-17T00:00:00.000Z",
          output: "forged",
        },
      ]),
    ).toThrow(/승인 없는/);
  });

  it("event replay에서 만료와 같은 callId의 중복 실행을 거부한다", () => {
    const approved: RunEvent[] = [
      ...waitingEvents(),
      { type: "approval_granted", runId: "RUN-001", token },
    ];
    expect(() =>
      reduceRun([
        ...approved,
        {
          type: "tool_executed",
          runId: "RUN-001",
          callId: "CALL-001",
          executedAt: "2026-08-18T00:00:00.000Z",
          output: "late",
        },
      ]),
    ).toThrow(/만료/);

    const executed: RunEvent = {
      type: "tool_executed",
      runId: "RUN-001",
      callId: "CALL-001",
      executedAt: "2026-08-17T00:00:00.000Z",
      output: "once",
    };
    expect(() => reduceRun([...approved, executed, executed])).toThrow(
      /일치하지 않습니다|중복 실행/,
    );
  });

  it("미처리 proposal의 완료와 terminal 상태 뒤 이벤트를 거부한다", () => {
    expect(() =>
      reduceRun([
        ...waitingEvents(),
        { type: "run_completed", runId: "RUN-001" },
      ]),
    ).toThrow(/미처리/);
    expect(() =>
      reduceRun([
        { type: "run_started", runId: "RUN-001", goal: "검증" },
        { type: "run_completed", runId: "RUN-001" },
        { type: "run_completed", runId: "RUN-001" },
      ]),
    ).toThrow(/종료 상태/);
    expect(() =>
      reduceRun([
        { type: "run_started", runId: "RUN-001", goal: "검증" },
        { type: "run_failed", runId: "RUN-001", code: "STOP", summary: "중단" },
        ...eventsForProposal(proposal),
      ]),
    ).toThrow(/종료 상태/);
  });

  it("현재 proposal이 아닌 승인과 중복 승인을 거부한다", () => {
    expect(() =>
      reduceRun([
        ...waitingEvents(),
        {
          type: "approval_granted",
          runId: "RUN-001",
          token: { ...token, callId: "CALL-OTHER" },
        },
      ]),
    ).toThrow(/일치하지 않습니다/);
    expect(() =>
      reduceRun([
        ...waitingEvents(),
        { type: "approval_granted", runId: "RUN-001", token },
        { type: "approval_granted", runId: "RUN-001", token },
      ]),
    ).toThrow();
  });

  it("Python과 같은 approval fixture failure code를 사용한다", () => {
    const cases = JSON.parse(
      readFileSync(
        new URL(
          "../../../shared/contract-fixtures/approval-events.json",
          import.meta.url,
        ),
        "utf8",
      ),
    ) as readonly ApprovalFixture[];
    for (const fixture of cases) {
      try {
        reduceRun(fixture.events.map(toRunEvent));
        expect(fixture.expectedCode).toBe("PASS");
      } catch (error) {
        expect(approvalFailureCode(error)).toBe(fixture.expectedCode);
      }
    }
  });
});
