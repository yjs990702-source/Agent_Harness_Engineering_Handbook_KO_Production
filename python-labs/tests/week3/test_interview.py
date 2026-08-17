import pytest

from agent_harness_labs import ContractError
from agent_harness_labs.week3.interview import draft_interview, finalize_spec


def test_missing_answers_are_open_questions() -> None:
    draft = draft_interview({"service_name": "Harness Lab"})
    assert len(draft.open_questions) == 2
    assert draft.primary_user is None


def test_open_questions_prevent_spec_guessing() -> None:
    with pytest.raises(ContractError, match="OPEN_QUESTIONS"):
        finalize_spec(draft_interview({"service_name": "Harness Lab"}))


def test_complete_answers_create_frozen_spec() -> None:
    spec = finalize_spec(
        draft_interview(
            {
                "service_name": "Harness Lab",
                "primary_user": "AI engineer",
                "success_measure": "all acceptance tests pass",
            }
        )
    )
    assert spec.primary_user == "AI engineer"
    with pytest.raises(AttributeError):
        spec.primary_user = "other"  # type: ignore[misc]
