"""Cross-check release identity and evidence completeness."""

from dataclasses import dataclass

from agent_harness_labs.errors import ContractError


@dataclass(frozen=True)
class CriterionEvidence:
    criterion_id: str
    reference: str
    spec_id: str
    commit_sha: str


@dataclass(frozen=True)
class EvidencePack:
    spec_id: str
    commit_sha: str
    required_criteria: tuple[str, ...]
    evidence: tuple[CriterionEvidence, ...]
    pending: tuple[str, ...] = ()
    reviewer_passed: bool = True
    approval_recorded: bool = True
    rollback_reference: str = "docs/rollback.md"


def validate_release(pack: EvidencePack) -> bool:
    if len(pack.commit_sha) != 40 or any(
        char not in "0123456789abcdef" for char in pack.commit_sha
    ):
        raise ContractError("RELEASE_IDENTITY_INVALID", "commit SHA가 유효하지 않습니다.")
    if pack.pending:
        raise ContractError("RELEASE_NOT_READY", "pending criterion이 남았습니다.")
    if not pack.reviewer_passed or not pack.approval_recorded or not pack.rollback_reference:
        raise ContractError(
            "RELEASE_NOT_READY", "review·approval·rollback evidence가 필요합니다."
        )
    seen: set[str] = set()
    for item in pack.evidence:
        if item.spec_id != pack.spec_id or item.commit_sha != pack.commit_sha:
            raise ContractError("RELEASE_IDENTITY_MISMATCH", "evidence identity가 다릅니다.")
        if item.criterion_id in seen or not item.reference.strip():
            raise ContractError(
                "EVIDENCE_INVALID", "criterion evidence가 중복되거나 비었습니다."
            )
        seen.add(item.criterion_id)
    if seen != set(pack.required_criteria):
        raise ContractError("RELEASE_NOT_READY", "필수 criterion evidence가 완전하지 않습니다.")
    return True
