import json
from pathlib import Path
from typing import Any

import pytest

from agent_harness_labs import ContractError
from agent_harness_labs.week3.release_evidence import (
    CriterionEvidence,
    EvidencePack,
    validate_release,
)

SHA = "0123456789abcdef0123456789abcdef01234567"


def pack(*, pending: tuple[str, ...] = (), sha: str = SHA) -> EvidencePack:
    return EvidencePack(
        spec_id="spec-1",
        commit_sha=sha,
        required_criteria=("AC-01", "AC-02"),
        evidence=(
            CriterionEvidence("AC-01", "pytest:test_a", "spec-1", SHA),
            CriterionEvidence("AC-02", "pytest:test_b", "spec-1", SHA),
        ),
        pending=pending,
    )


def test_complete_evidence_is_release_ready() -> None:
    assert validate_release(pack())


def test_pending_criterion_blocks_release() -> None:
    with pytest.raises(ContractError, match="RELEASE_NOT_READY"):
        validate_release(pack(pending=("AC-02",)))


def test_identity_mismatch_blocks_release() -> None:
    with pytest.raises(ContractError, match="RELEASE_IDENTITY_MISMATCH"):
        validate_release(pack(sha="f" * 40))


def test_common_release_fixture_codes() -> None:
    fixture_path = Path(__file__).parents[3] / "shared/contract-fixtures/release-evidence.json"
    cases: list[dict[str, Any]] = json.loads(fixture_path.read_text(encoding="utf-8"))
    for case in cases:
        evidence = tuple(
            CriterionEvidence(item, f"pytest:{item}", case["specId"], case["commitSha"])
            for item in case["evidenceCriteria"]
        )
        candidate = EvidencePack(
            case["specId"],
            case["commitSha"],
            tuple(case["requiredCriteria"]),
            evidence,
            tuple(case["pending"]),
        )
        if case["expectedCode"] == "PASS":
            assert validate_release(candidate)
        else:
            with pytest.raises(ContractError) as caught:
                validate_release(candidate)
            assert caught.value.code == case["expectedCode"]


def test_review_approval_and_rollback_are_required() -> None:
    candidate = EvidencePack("spec-1", SHA, (), (), reviewer_passed=False)
    with pytest.raises(ContractError, match="RELEASE_NOT_READY"):
        validate_release(candidate)
