import json
from collections.abc import Mapping
from pathlib import Path
from typing import Any

import pytest

from agent_harness_labs import ContractError
from agent_harness_labs.week1.tool_contract import (
    SideEffect,
    ToolDescriptor,
    ToolPermission,
    ToolProposal,
    create_tool_registry,
    object_has_nonempty_string,
    validate_tool_proposal,
)


def registry() -> Mapping[str, ToolDescriptor]:
    return create_tool_registry(
        [
            ToolDescriptor(
                "read_note",
                SideEffect.NONE,
                (ToolPermission.READ,),
                False,
                object_has_nonempty_string("note_id"),
                "Note",
            ),
            ToolDescriptor(
                "publish_note",
                SideEffect.CONSEQUENTIAL,
                (ToolPermission.DEPLOY,),
                True,
                object_has_nonempty_string("note_id"),
                "Receipt",
            ),
        ]
    )


def test_common_tool_fixture_codes() -> None:
    fixture_path = Path(__file__).parents[3] / "shared/contract-fixtures/tool-proposals.json"
    cases: list[dict[str, Any]] = json.loads(fixture_path.read_text(encoding="utf-8"))
    tool_registry = registry()
    for case in cases:
        raw = case["proposal"]
        proposal = ToolProposal(raw["tool"], tuple(raw["permissions"]), raw["input"])
        if case["expectedCode"] == "PASS":
            assert validate_tool_proposal(tool_registry, proposal).tool == "read_note"
        else:
            with pytest.raises(ContractError) as caught:
                validate_tool_proposal(
                    tool_registry,
                    proposal,
                    approval_granted=bool(case["approvalGranted"]),
                )
            assert caught.value.code == case["expectedCode"]


def test_consequential_descriptor_requires_approval_policy() -> None:
    with pytest.raises(ContractError, match="APPROVAL_POLICY_INVALID"):
        create_tool_registry(
            [
                ToolDescriptor(
                    "bad_tool",
                    SideEffect.CONSEQUENTIAL,
                    (ToolPermission.WRITE,),
                    False,
                    lambda value: True,
                    "Receipt",
                )
            ]
        )


def test_registry_rejects_duplicate_name() -> None:
    descriptor = ToolDescriptor(
        "read_note",
        SideEffect.NONE,
        (ToolPermission.READ,),
        False,
        object_has_nonempty_string("note_id"),
        "Note",
    )
    with pytest.raises(ContractError, match="DUPLICATE_TOOL"):
        create_tool_registry([descriptor, descriptor])


def test_registry_is_read_only() -> None:
    tool_registry = registry()
    with pytest.raises(TypeError):
        tool_registry["other"] = tool_registry["read_note"]  # type: ignore[index]
