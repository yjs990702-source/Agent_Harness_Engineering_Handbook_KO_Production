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
  tool: string;
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
      executedAt: string;
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

function timestamp(value: string, field: string): number {
  const result = Date.parse(value);
  if (!Number.isFinite(result))
    throw new TypeError(`${field}가 유효하지 않습니다.`);
  return result;
}

function assertActive(status: ReducedRunState["status"]): void {
  if (status === "completed" || status === "failed") {
    throw new Error(`종료 상태 ${status} 뒤에는 이벤트를 추가할 수 없습니다.`);
  }
}

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

  for (const event of events.slice(1)) {
    if (event.runId !== runId) {
      throw new Error("서로 다른 run의 이벤트를 합칠 수 없습니다.");
    }
    assertActive(status);

    if (event.type === "run_started") {
      throw new Error("run_started 이벤트는 한 번만 허용됩니다.");
    }
    if (event.type === "tool_proposed") {
      if (pendingProposal) throw new Error("미처리 도구 제안이 남아 있습니다.");
      if (event.proposal.runId !== runId) {
        throw new Error("도구 제안의 run이 현재 run과 일치하지 않습니다.");
      }
      if (
        !event.proposal.callId.trim() ||
        !event.proposal.tool.trim() ||
        executedCallIds.has(event.proposal.callId)
      ) {
        throw new Error("도구 제안의 call 또는 tool이 유효하지 않습니다.");
      }
      pendingProposal = event.proposal;
    } else if (event.type === "approval_requested") {
      if (
        !pendingProposal ||
        pendingProposal.callId !== event.callId ||
        pendingProposal.sideEffect !== "consequential" ||
        status !== "running"
      ) {
        throw new Error(
          "승인 요청이 현재 부작용 도구 호출과 일치하지 않습니다.",
        );
      }
      status = "waiting_approval";
    } else if (event.type === "approval_granted") {
      const token = event.token;
      if (
        status !== "waiting_approval" ||
        !pendingProposal ||
        token.runId !== runId ||
        token.callId !== pendingProposal.callId ||
        token.tool !== pendingProposal.tool
      ) {
        throw new Error("승인 token이 현재 run·call·tool과 일치하지 않습니다.");
      }
      if (approvals.has(token.callId))
        throw new Error("중복 승인 token입니다.");
      if (token.approvedBy.trim().length < 3) {
        throw new Error("승인자 식별자가 유효하지 않습니다.");
      }
      timestamp(token.expiresAt, "승인 만료 시각");
      approvals.set(token.callId, token);
      status = "running";
    } else if (event.type === "tool_executed") {
      if (executedCallIds.has(event.callId)) {
        throw new Error(`도구 호출 중복 실행: ${event.callId}`);
      }
      if (!pendingProposal || pendingProposal.callId !== event.callId) {
        throw new Error("실행 이벤트가 현재 도구 제안과 일치하지 않습니다.");
      }
      const executedAt = timestamp(event.executedAt, "도구 실행 시각");
      if (pendingProposal.sideEffect === "consequential") {
        const token = approvals.get(event.callId);
        if (
          !token ||
          token.runId !== runId ||
          token.tool !== pendingProposal.tool
        ) {
          throw new Error("승인 없는 부작용 도구 실행 이벤트입니다.");
        }
        if (timestamp(token.expiresAt, "승인 만료 시각") <= executedAt) {
          throw new Error("만료된 승인으로 도구를 실행할 수 없습니다.");
        }
      }
      executedCallIds.add(event.callId);
      pendingProposal = null;
    } else if (event.type === "run_failed") {
      status = "failed";
      pendingProposal = null;
    } else if (event.type === "run_completed") {
      if (pendingProposal)
        throw new Error("미처리 도구 제안이 남아 있어 완료할 수 없습니다.");
      status = "completed";
    }
  }

  return { runId, status, pendingProposal, approvals, executedCallIds };
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
): Promise<readonly [RunEvent, RunEvent]> {
  const state = reduceRun(input.events);
  const proposal = state.pendingProposal;
  if (!proposal) throw new Error("재개할 도구 호출이 없습니다.");
  if (
    state.status !== "waiting_approval" ||
    proposal.sideEffect !== "consequential"
  ) {
    throw new Error("현재 run은 승인 대기 상태가 아닙니다.");
  }
  if (
    input.token.runId !== state.runId ||
    input.token.callId !== proposal.callId ||
    input.token.tool !== proposal.tool
  ) {
    throw new Error("승인 token이 run·call·tool과 일치하지 않습니다.");
  }
  if (
    timestamp(input.token.expiresAt, "승인 만료 시각") <= input.now.getTime()
  ) {
    throw new Error("승인 token이 만료되었습니다.");
  }
  const output = await input.execute(proposal);
  return Object.freeze([
    { type: "approval_granted", runId: state.runId, token: input.token },
    {
      type: "tool_executed",
      runId: state.runId,
      callId: proposal.callId,
      executedAt: input.now.toISOString(),
      output,
    },
  ]);
}
