import json
from datetime import UTC, datetime, timedelta
from pathlib import Path
from typing import Any

import pytest

from agent_harness_labs import ContractError
from agent_harness_labs.week2.approval_loop import (
    ApprovalToken,
    reduce_run,
    resume_approved_tool,
)


def waiting_events() -> list[dict[str, object]]:
    return [
        {"type": "run_started", "run_id": "run-1", "goal": "publish"},
        {
            "type": "tool_proposed",
            "run_id": "run-1",
            "call_id": "call-1",
            "tool": "publish_note",
            "side_effect": "consequential",
        },
        {"type": "approval_requested", "run_id": "run-1", "call_id": "call-1"},
    ]


def test_common_approval_fixture_codes() -> None:
    fixture_path = Path(__file__).parents[3] / "shared/contract-fixtures/approval-events.json"
    cases: list[dict[str, Any]] = json.loads(fixture_path.read_text(encoding="utf-8"))
    for case in cases:
        if case["expectedCode"] == "PASS":
            assert reduce_run(case["events"]).status == "waiting_approval"
        else:
            with pytest.raises(ContractError) as caught:
                reduce_run(case["events"])
            assert caught.value.code == case["expectedCode"]


def test_mismatched_token_fails_before_executor() -> None:
    calls = 0

    def execute(_tool: str) -> str:
        nonlocal calls
        calls += 1
        return "ok"

    token = ApprovalToken(
        "other", "call-1", "publish_note", "reviewer", datetime.now(UTC) + timedelta(minutes=5)
    )
    with pytest.raises(ContractError, match="APPROVAL_MISMATCH"):
        resume_approved_tool(waiting_events(), token, datetime.now(UTC), execute)
    assert calls == 0


def test_expired_token_fails_before_executor() -> None:
    now = datetime.now(UTC)
    token = ApprovalToken("run-1", "call-1", "publish_note", "reviewer", now)
    with pytest.raises(ContractError, match="APPROVAL_EXPIRED"):
        resume_approved_tool(waiting_events(), token, now, lambda _tool: "unexpected")


def test_naive_datetime_is_rejected() -> None:
    token = ApprovalToken("run-1", "call-1", "publish_note", "reviewer", datetime(2030, 1, 1))
    with pytest.raises(ContractError, match="TIMEZONE_REQUIRED"):
        resume_approved_tool(
            waiting_events(), token, datetime(2029, 1, 1), lambda _tool: "unexpected"
        )


def test_valid_resume_returns_evidence_events() -> None:
    now = datetime.now(UTC)
    token = ApprovalToken(
        "run-1", "call-1", "publish_note", "reviewer", now + timedelta(minutes=1)
    )
    granted, executed = resume_approved_tool(
        waiting_events(), token, now, lambda tool: f"ok:{tool}"
    )
    assert granted["approved_by"] == "reviewer"
    assert executed["output"] == "ok:publish_note"
    replayed = reduce_run([*waiting_events(), granted, executed])
    assert replayed.executed_call_ids == ("call-1",)


def test_replay_rejects_expired_granted_event() -> None:
    events: list[dict[str, object]] = [
        *waiting_events(),
        {
            "type": "approval_granted",
            "run_id": "run-1",
            "call_id": "call-1",
            "tool": "publish_note",
            "approved_by": "reviewer",
            "expires_at": "2030-01-01T00:00:00+00:00",
        },
        {
            "type": "tool_executed",
            "run_id": "run-1",
            "call_id": "call-1",
            "executed_at": "2030-01-01T00:00:00+00:00",
        },
    ]
    with pytest.raises(ContractError, match="APPROVAL_EXPIRED"):
        reduce_run(events)
