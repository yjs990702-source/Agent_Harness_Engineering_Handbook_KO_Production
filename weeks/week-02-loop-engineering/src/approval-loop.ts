export type ToolProposal = Readonly<{
  runId: string;
  callId: string;
  tool: string;
  sideEffect: "none" | "consequential";
  input: unknown;
}>;

export type ApprovalToken = Readonly<{
  runId: string;
  callId: string;
  approvedBy: string;
  expiresAt: string;
}>;

export type RunEvent =
  | Readonly<{ type: "run_started"; runId: string; goal: string }>
  | Readonly<{ type: "tool_proposed"; runId: string; proposal: ToolProposal }>
  | Readonly<{ type: "approval_requested"; runId: string; callId: string }>
  | Readonly<{
      type: "approval_granted";
      runId: string;
      token: ApprovalToken;
    }>
  | Readonly<{
      type: "tool_executed";
      runId: string;
      callId: string;
      output: string;
    }>
  | Readonly<{
      type: "run_failed";
      runId: string;
      code: string;
      summary: string;
    }>
  | Readonly<{ type: "run_completed"; runId: string }>;

export type ReducedRunState = Readonly<{
  runId: string;
  status: "running" | "waiting_approval" | "completed" | "failed";
  pendingProposal: ToolProposal | null;
  approvals: ReadonlyMap<string, ApprovalToken>;
  executedCallIds: ReadonlySet<string>;
}>;

export function reduceRun(events: readonly RunEvent[]): ReducedRunState {
  const first = events[0];
  if (!first || first.type !== "run_started") {
    throw new Error("첫 이벤트는 run_started여야 합니다.");
  }
  const runId = first.runId;
  let status: ReducedRunState["status"] = "running";
  let pendingProposal: ToolProposal | null = null;
  const approvals = new Map<string, ApprovalToken>();
  const executedCallIds = new Set<string>();

  for (const event of events) {
    if (event.runId !== runId) {
      throw new Error("서로 다른 run의 이벤트를 합칠 수 없습니다.");
    }
    if (event.type === "tool_proposed") {
      pendingProposal = event.proposal;
    } else if (event.type === "approval_requested") {
      if (pendingProposal?.callId !== event.callId) {
        throw new Error("승인 요청이 현재 도구 호출과 일치하지 않습니다.");
      }
      status = "waiting_approval";
    } else if (event.type === "approval_granted") {
      approvals.set(event.token.callId, event.token);
      status = "running";
    } else if (event.type === "tool_executed") {
      if (executedCallIds.has(event.callId)) {
        throw new Error(`도구 호출 중복 실행: ${event.callId}`);
      }
      executedCallIds.add(event.callId);
      if (pendingProposal?.callId === event.callId) pendingProposal = null;
    } else if (event.type === "run_failed") {
      status = "failed";
    } else if (event.type === "run_completed") {
      status = "completed";
    }
  }

  return {
    runId,
    status,
    pendingProposal,
    approvals,
    executedCallIds,
  };
}

export function eventsForProposal(proposal: ToolProposal): readonly RunEvent[] {
  const events: RunEvent[] = [
    { type: "tool_proposed", runId: proposal.runId, proposal },
  ];
  if (proposal.sideEffect === "consequential") {
    events.push({
      type: "approval_requested",
      runId: proposal.runId,
      callId: proposal.callId,
    });
  }
  return Object.freeze(events);
}

export async function resumeApprovedTool(
  input: Readonly<{
    events: readonly RunEvent[];
    token: ApprovalToken;
    now: Date;
    execute: (proposal: ToolProposal) => Promise<string>;
  }>,
): Promise<RunEvent> {
  const state = reduceRun(input.events);
  const proposal = state.pendingProposal;
  if (!proposal) throw new Error("재개할 도구 호출이 없습니다.");
  if (
    input.token.runId !== state.runId ||
    input.token.callId !== proposal.callId
  ) {
    throw new Error("승인 token이 run 또는 tool call과 일치하지 않습니다.");
  }
  if (Date.parse(input.token.expiresAt) <= input.now.getTime()) {
    throw new Error("승인 token이 만료되었습니다.");
  }
  if (state.executedCallIds.has(proposal.callId)) {
    throw new Error("이미 실행한 도구 호출입니다.");
  }

  const output = await input.execute(proposal);
  return {
    type: "tool_executed",
    runId: state.runId,
    callId: proposal.callId,
    output,
  };
}
