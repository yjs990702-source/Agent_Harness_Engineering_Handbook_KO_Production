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
    """한 step에서 관찰한 사실입니다.

    이벤트를 불변 객체로 남기면 모델의 최종 답만 보지 않고 검증과 실행 순서를
    테스트할 수 있습니다.
    """

    step: int
    type: str
    detail: str


@dataclass(frozen=True)
class LoopResult:
    """사용자에게 줄 출력과 감사를 위한 이벤트를 함께 반환합니다."""

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
    """미리 준비된 모델 결정을 제한된 횟수만 처리합니다.

    이 교육 예제에서 ``decisions``는 실제 모델 응답을 대신합니다. 중요한 점은 모델
    공급자가 아니라, 그 응답이 registry 검증을 통과해야 executor에 도달한다는 것입니다.
    """

    # 무한 자율 실행을 피하기 위해 구성값 자체에도 작고 명시적인 상한을 둡니다.
    if not 1 <= max_steps <= 8:
        raise ContractError("STEP_BUDGET_INVALID", "step budget은 1~8이어야 합니다.")
    events: list[LoopEvent] = []
    for step, decision in enumerate(decisions, start=1):
        if step > max_steps:
            break
        kind = decision.get("kind")
        if kind == "complete":
            # 완료 선언도 계약의 일부입니다. 빈 답을 성공으로 기록하지 않습니다.
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
        # 이 함수가 핵심 경계입니다. 원본 decision을 executor에 직접 넘기지 않고,
        # 이름·권한·입력을 좁힌 ValidatedToolCall만 전달합니다.
        call = validate_tool_proposal(
            registry,
            ToolProposal(tool, tuple(permissions), decision.get("input")),
            approval_granted=approval_granted,
        )
        events.append(LoopEvent(step, "tool_validated", call.tool))
        # executor는 검증 뒤에만 호출됩니다. 거부 경로에서는 이 줄에 도달하지 않습니다.
        result = executor(call)
        events.append(LoopEvent(step, "tool_executed", result))
    # 반복 횟수 초과는 조용한 부분 성공이 아니라 명시적 실패입니다.
    raise ContractError("STEP_BUDGET_EXHAUSTED", "완료 전에 step budget을 소진했습니다.")
