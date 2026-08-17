"""Pure replay reducer and guarded approval resume boundary."""

from collections.abc import Callable, Mapping, Sequence
from dataclasses import dataclass, replace
from datetime import datetime

from agent_harness_labs.errors import ContractError


@dataclass(frozen=True)
class ApprovalToken:
    """한 번의 run·call·tool과 만료 시각에 묶인 사람 승인입니다."""

    run_id: str
    call_id: str
    tool: str
    approved_by: str
    expires_at: datetime


@dataclass(frozen=True)
class RunState:
    """event replay로 언제든 다시 계산할 수 있는 실행 상태입니다."""

    run_id: str
    status: str = "running"
    pending_call_id: str | None = None
    pending_tool: str | None = None
    pending_side_effect: str | None = None
    approval: ApprovalToken | None = None
    executed_call_ids: tuple[str, ...] = ()


def _text(event: Mapping[str, object], field: str) -> str:
    """event 경계에서 필수 문자열을 한 방식으로 정규화합니다."""

    value = event.get(field)
    if not isinstance(value, str) or not value.strip():
        raise ContractError("EVENT_INVALID", f"{field}가 유효하지 않습니다.")
    return value


def _time(value: str) -> datetime:
    """비교 가능한 timezone-aware 시각만 허용합니다."""

    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError as error:
        raise ContractError("TIMESTAMP_INVALID", "시각 형식이 유효하지 않습니다.") from error
    if parsed.tzinfo is None:
        raise ContractError("TIMEZONE_REQUIRED", "timezone-aware datetime이 필요합니다.")
    return parsed


def reduce_run(events: Sequence[Mapping[str, object]]) -> RunState:
    """부작용 없이 event 목록을 상태로 접는 순수 reducer입니다.

    재시작 시 같은 event를 replay해도 같은 상태가 나오므로, 프로세스 메모리를 승인
    기록의 원천으로 사용하지 않아도 됩니다.
    """

    if not events or events[0].get("type") != "run_started":
        raise ContractError("RUN_START_REQUIRED", "첫 이벤트는 run_started여야 합니다.")
    state = RunState(run_id=_text(events[0], "run_id"))
    for event in events[1:]:
        # 종료 상태 뒤의 event를 허용하면 완료 기록을 사후에 바꿀 수 있습니다.
        if state.status in {"completed", "failed"}:
            raise ContractError("TERMINAL_EVENT", "종료 후 이벤트는 허용하지 않습니다.")
        if _text(event, "run_id") != state.run_id:
            raise ContractError("RUN_MISMATCH", "다른 run의 이벤트입니다.")
        kind = event.get("type")
        if kind == "tool_proposed":
            # 동시에 두 호출을 pending으로 두지 않는 단순한 단일 호출 모델입니다.
            if state.pending_call_id is not None:
                raise ContractError("PENDING_CALL_EXISTS", "미처리 호출이 남았습니다.")
            state = replace(
                state,
                pending_call_id=_text(event, "call_id"),
                pending_tool=_text(event, "tool"),
                pending_side_effect=_text(event, "side_effect"),
            )
        elif kind == "approval_requested":
            if (
                state.pending_call_id != _text(event, "call_id")
                or state.pending_side_effect != "consequential"
            ):
                raise ContractError("APPROVAL_MISMATCH", "현재 호출과 승인 요청이 다릅니다.")
            state = replace(state, status="waiting_approval")
        elif kind == "approval_granted":
            # token은 현재 pending 호출의 identity와 일치할 때만 상태에 들어갑니다.
            token = ApprovalToken(
                run_id=state.run_id,
                call_id=_text(event, "call_id"),
                tool=_text(event, "tool"),
                approved_by=_text(event, "approved_by"),
                expires_at=_time(_text(event, "expires_at")),
            )
            if (
                state.status != "waiting_approval"
                or token.call_id != state.pending_call_id
                or token.tool != state.pending_tool
            ):
                raise ContractError("APPROVAL_MISMATCH", "현재 호출과 승인 token이 다릅니다.")
            if state.approval is not None:
                raise ContractError("DUPLICATE_APPROVAL", "중복 승인입니다.")
            state = replace(state, status="running", approval=token)
        elif kind == "tool_executed":
            # call_id 기록은 replay나 재시도로 같은 부작용을 두 번 실행하는 것을 막습니다.
            call_id = _text(event, "call_id")
            if call_id in state.executed_call_ids:
                raise ContractError("DUPLICATE_EXECUTION", "중복 실행입니다.")
            if call_id != state.pending_call_id:
                raise ContractError("CALL_MISMATCH", "현재 호출과 실행 이벤트가 다릅니다.")
            if state.pending_side_effect == "consequential" and state.approval is None:
                raise ContractError("APPROVAL_REQUIRED", "승인 없는 부작용 실행입니다.")
            # 승인 시각이 아니라 실제 실행 시각을 기준으로 만료를 판정합니다.
            if state.approval is not None and state.approval.expires_at <= _time(
                _text(event, "executed_at")
            ):
                raise ContractError("APPROVAL_EXPIRED", "만료된 승인입니다.")
            state = replace(
                state,
                pending_call_id=None,
                pending_tool=None,
                pending_side_effect=None,
                approval=None,
                executed_call_ids=(*state.executed_call_ids, call_id),
            )
        elif kind == "run_completed":
            if state.pending_call_id is not None:
                raise ContractError("PENDING_CALL_EXISTS", "미처리 호출이 남았습니다.")
            state = replace(state, status="completed")
        elif kind == "run_failed":
            state = replace(state, status="failed", pending_call_id=None, pending_tool=None)
        else:
            raise ContractError("EVENT_INVALID", "알 수 없는 이벤트입니다.")
    return state


def resume_approved_tool(
    events: Sequence[Mapping[str, object]],
    token: ApprovalToken,
    now: datetime,
    execute: Callable[[str], str],
) -> tuple[Mapping[str, object], Mapping[str, object]]:
    """현재 상태와 token을 다시 검증한 뒤에만 executor를 호출합니다."""

    state = reduce_run(events)
    if state.status != "waiting_approval" or state.pending_call_id is None:
        raise ContractError("NOT_WAITING_APPROVAL", "승인 대기 상태가 아닙니다.")
    if (token.run_id, token.call_id, token.tool) != (
        state.run_id,
        state.pending_call_id,
        state.pending_tool,
    ):
        raise ContractError("APPROVAL_MISMATCH", "token identity가 현재 호출과 다릅니다.")
    if not token.approved_by.strip():
        raise ContractError("APPROVER_INVALID", "승인자 식별자가 필요합니다.")
    if token.expires_at.tzinfo is None or now.tzinfo is None:
        raise ContractError("TIMEZONE_REQUIRED", "timezone-aware datetime이 필요합니다.")
    if token.expires_at <= now:
        raise ContractError("APPROVAL_EXPIRED", "승인이 만료되었습니다.")
    # 모든 identity·승인자·시간 검사가 끝난 뒤에만 실제 부작용 경계에 도달합니다.
    output = execute(token.tool)
    granted: Mapping[str, object] = {
        "type": "approval_granted",
        "run_id": token.run_id,
        "call_id": token.call_id,
        "tool": token.tool,
        "approved_by": token.approved_by,
        "expires_at": token.expires_at.isoformat(),
    }
    executed: Mapping[str, object] = {
        "type": "tool_executed",
        "run_id": token.run_id,
        "call_id": token.call_id,
        "executed_at": now.isoformat(),
        "output": output,
    }
    return granted, executed
