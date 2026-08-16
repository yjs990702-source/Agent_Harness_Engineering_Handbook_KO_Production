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
  approvedBy: "reviewer-1",
  expiresAt: "2026-08-18T00:00:00.000Z",
};

function waitingEvents(): readonly RunEvent[] {
  return [
    { type: "run_started", runId: "RUN-001", goal: "Preview 배포" },
    ...eventsForProposal(proposal),
  ];
}

describe("approval event loop", () => {
  it("위험한 도구를 실행 전에 정확한 callId에서 멈춘다", () => {
    const state = reduceRun(waitingEvents());
    expect(state.status).toBe("waiting_approval");
    expect(state.pendingProposal?.callId).toBe("CALL-001");
    expect(state.executedCallIds.size).toBe(0);
  });

  it("올바른 승인 token으로 한 번만 재개한다", async () => {
    const execute = vi.fn(async () => "preview-ready");
    const event = await resumeApprovedTool({
      events: waitingEvents(),
      token,
      now: new Date("2026-08-17T00:00:00.000Z"),
      execute,
    });
    expect(event).toEqual({
      type: "tool_executed",
      runId: "RUN-001",
      callId: "CALL-001",
      output: "preview-ready",
    });
    expect(execute).toHaveBeenCalledOnce();
  });

  it("다른 run의 승인 token을 거부한다", async () => {
    await expect(
      resumeApprovedTool({
        events: waitingEvents(),
        token: { ...token, runId: "RUN-OTHER" },
        now: new Date("2026-08-17T00:00:00.000Z"),
        execute: async () => "should-not-run",
      }),
    ).rejects.toThrow(/일치하지 않습니다/);
  });

  it("event replay에서 같은 callId의 중복 실행을 거부한다", () => {
    const events: RunEvent[] = [
      ...waitingEvents(),
      { type: "approval_granted", runId: "RUN-001", token },
      {
        type: "tool_executed",
        runId: "RUN-001",
        callId: "CALL-001",
        output: "once",
      },
      {
        type: "tool_executed",
        runId: "RUN-001",
        callId: "CALL-001",
        output: "twice",
      },
    ];
    expect(() => reduceRun(events)).toThrow(/중복 실행/);
  });
});
