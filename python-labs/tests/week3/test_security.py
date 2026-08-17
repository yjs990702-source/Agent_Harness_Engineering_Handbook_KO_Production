import json
from pathlib import Path
from typing import Any

import pytest

from agent_harness_labs import ContractError
from agent_harness_labs.week3.security import build_sorted_lookup_query, to_public_error


def test_attack_value_stays_only_in_parameter_tuple() -> None:
    attack = "x' OR 1=1 --"
    query = build_sorted_lookup_query("tenant-1", attack, "title", "DESC")
    assert attack not in query.text
    assert query.params == ("tenant-1", attack)
    assert query.text.count("?") == 2


def test_common_security_fixture_codes() -> None:
    fixture_path = Path(__file__).parents[3] / "shared/contract-fixtures/security-attacks.json"
    cases: list[dict[str, Any]] = json.loads(fixture_path.read_text(encoding="utf-8"))
    for case in cases:
        kind = case["kind"]
        column = case["value"] if kind == "sort_column" else "title"
        direction = case["value"] if kind == "sort_direction" else "ASC"
        title = case["value"] if kind == "value" else "safe"
        if case["expectedCode"] == "PASS":
            assert (
                build_sorted_lookup_query("tenant-1", title, column, direction).params[1]
                == title
            )
        else:
            with pytest.raises(ContractError) as caught:
                build_sorted_lookup_query("tenant-1", title, column, direction)
            assert caught.value.code == case["expectedCode"]


def test_public_error_never_copies_sensitive_details() -> None:
    public = to_public_error(RuntimeError("SELECT secret FROM users password=abc"))
    serialized = f"{public.code} {public.message}".lower()
    for secret in ("select", "password", "abc", "users"):
        assert secret not in serialized


@pytest.mark.parametrize("value", ["", None, 3])
def test_invalid_value_boundary_is_rejected(value: object) -> None:
    with pytest.raises(ContractError, match="INPUT_INVALID"):
        build_sorted_lookup_query(value, "title", "title", "ASC")
