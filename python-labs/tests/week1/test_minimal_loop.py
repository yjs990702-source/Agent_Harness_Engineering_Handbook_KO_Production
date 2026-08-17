from collections.abc import Mapping

import pytest

from agent_harness_labs import ContractError
from agent_harness_labs.week1.minimal_loop import run_minimal_loop
from agent_harness_labs.week1.tool_contract import (
    SideEffect,
    ToolDescriptor,
    ToolPermission,
    create_tool_registry,
    object_has_nonempty_string,
)


def test_loop_executes_validated_call_then_completes() -> None:
    registry = create_tool_registry(
        [
            ToolDescriptor(
                "read_note",
                SideEffect.NONE,
                (ToolPermission.READ,),
                False,
                object_has_nonempty_string("note_id"),
                "Note",
            )
        ]
    )
    decisions: list[Mapping[str, object]] = [
        {
            "kind": "tool",
            "tool": "read_note",
            "permissions": ["read"],
            "input": {"note_id": "1"},
        },
        {"kind": "complete", "output": "done"},
    ]
    result = run_minimal_loop(decisions, registry, lambda call: f"read:{call.tool}")
    assert result.output == "done"
    assert [event.type for event in result.events] == [
        "tool_validated",
        "tool_executed",
        "completed",
    ]


def test_unknown_tool_never_reaches_executor() -> None:
    calls = 0

    def executor(_call: object) -> str:
        nonlocal calls
        calls += 1
        return "unexpected"

    with pytest.raises(ContractError, match="UNKNOWN_TOOL"):
        run_minimal_loop(
            [{"kind": "tool", "tool": "missing", "permissions": ["read"], "input": {}}],
            {},
            executor,
        )
    assert calls == 0


def test_step_budget_exhaustion_is_failure() -> None:
    with pytest.raises(ContractError, match="STEP_BUDGET_EXHAUSTED"):
        run_minimal_loop([], {}, lambda _call: "unused", max_steps=1)


@pytest.mark.parametrize("budget", [0, 9])
def test_invalid_step_budget_is_rejected(budget: int) -> None:
    with pytest.raises(ContractError, match="STEP_BUDGET_INVALID"):
        run_minimal_loop([], {}, lambda _call: "unused", max_steps=budget)
