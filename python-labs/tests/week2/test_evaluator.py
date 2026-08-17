import pytest

from agent_harness_labs import ContractError
from agent_harness_labs.week2.evaluator import Evaluation, next_repair_attempt


def test_high_scores_pass_without_blocking_findings() -> None:
    assert Evaluation(90, 85, 95, 80).passed


def test_blocking_safety_finding_cannot_be_averaged_away() -> None:
    evaluation = Evaluation(100, 100, 100, 100, ("SQL injection",))
    assert evaluation.average == 100
    assert not evaluation.passed


def test_safety_floor_is_independent() -> None:
    assert not Evaluation(100, 100, 79, 100).passed


def test_repair_increments_once_for_new_signature() -> None:
    assert next_repair_attempt(0, 2, None, "FAIL-A") == 1


@pytest.mark.parametrize(
    ("current", "maximum", "previous", "signature", "code"),
    [(2, 2, None, "A", "REPAIR_CAP_REACHED"), (0, 2, "A", "A", "REPEATED_FAILURE")],
)
def test_repair_stop_conditions(
    current: int, maximum: int, previous: str | None, signature: str, code: str
) -> None:
    with pytest.raises(ContractError) as caught:
        next_repair_attempt(current, maximum, previous, signature)
    assert caught.value.code == code
