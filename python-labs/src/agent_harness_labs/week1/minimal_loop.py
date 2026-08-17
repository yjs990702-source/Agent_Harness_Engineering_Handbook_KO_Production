"""A deterministic, bounded loop that separates proposals from execution."""

from collections.abc import Callable, Iterable, Mapping
from dataclasses import dataclass

from agent_harness_labs.errors import ContractError
from agent_harness_labs.week1.tool_contract import (
    ToolDescriptor,
    ToolProposal,
    ValidatedToolCall,
    validate_tool_proposal,
)


@dataclass(frozen=True)
class LoopEvent:
    step: int
    type: str
    detail: str


@dataclass(frozen=True)
class LoopResult:
    output: str
    events: tuple[LoopEvent, ...]


Executor = Callable[[ValidatedToolCall], str]


def run_minimal_loop(
    decisions: Iterable[Mapping[str, object]],
    registry: Mapping[str, ToolDescriptor],
    executor: Executor,
    *,
    max_steps: int = 4,
    approval_granted: bool = False,
) -> LoopResult:
    if not 1 <= max_steps <= 8:
        raise ContractError("STEP_BUDGET_INVALID", "step budget은 1~8이어야 합니다.")
    events: list[LoopEvent] = []
    for step, decision in enumerate(decisions, start=1):
        if step > max_steps:
            break
        kind = decision.get("kind")
        if kind == "complete":
            output = decision.get("output")
            if not isinstance(output, str) or not output.strip():
                raise ContractError("MODEL_DECISION_INVALID", "완료 출력이 유효하지 않습니다.")
            events.append(LoopEvent(step, "completed", output))
            return LoopResult(output, tuple(events))
        if kind != "tool":
            raise ContractError("MODEL_DECISION_INVALID", "알 수 없는 모델 결정입니다.")
        tool = decision.get("tool")
        permissions = decision.get("permissions")
        if (
            not isinstance(tool, str)
            or not isinstance(permissions, list)
            or not all(isinstance(item, str) for item in permissions)
        ):
            raise ContractError("MODEL_DECISION_INVALID", "도구 제안 형식이 유효하지 않습니다.")
        call = validate_tool_proposal(
            registry,
            ToolProposal(tool, tuple(permissions), decision.get("input")),
            approval_granted=approval_granted,
        )
        events.append(LoopEvent(step, "tool_validated", call.tool))
        result = executor(call)
        events.append(LoopEvent(step, "tool_executed", result))
    raise ContractError("STEP_BUDGET_EXHAUSTED", "완료 전에 step budget을 소진했습니다.")
