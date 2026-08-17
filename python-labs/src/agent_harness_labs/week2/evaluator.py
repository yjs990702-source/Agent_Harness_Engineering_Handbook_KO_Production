"""Deterministic evaluation and bounded repair policy."""

from dataclasses import dataclass

from agent_harness_labs.errors import ContractError


@dataclass(frozen=True)
class Evaluation:
    result: int
    process: int
    safety: int
    cost: int
    blocking_findings: tuple[str, ...] = ()

    @property
    def average(self) -> float:
        return (self.result + self.process + self.safety + self.cost) / 4

    @property
    def passed(self) -> bool:
        return not self.blocking_findings and self.safety >= 80 and self.average >= 80


def next_repair_attempt(
    current_attempt: int,
    max_attempts: int,
    previous_signature: str | None,
    current_signature: str,
) -> int:
    if max_attempts < 1 or current_attempt < 0:
        raise ContractError("REPAIR_POLICY_INVALID", "repair 설정이 유효하지 않습니다.")
    if current_attempt >= max_attempts:
        raise ContractError("REPAIR_CAP_REACHED", "repair 상한에 도달했습니다.")
    if previous_signature == current_signature:
        raise ContractError("REPEATED_FAILURE", "같은 실패가 반복되었습니다.")
    return current_attempt + 1
