"""Cross-check release identity and evidence completeness."""

from dataclasses import dataclass

from agent_harness_labs.errors import ContractError


@dataclass(frozen=True)
class CriterionEvidence:
    """한 수용 기준을 한 spec·commit에 연결하는 증거 포인터입니다."""

    criterion_id: str
    reference: str
    spec_id: str
    commit_sha: str


@dataclass(frozen=True)
class EvidencePack:
    """릴리스 후보 판정을 위해 필요한 identity와 Evidence의 묶음입니다."""

    spec_id: str
    commit_sha: str
    required_criteria: tuple[str, ...]
    evidence: tuple[CriterionEvidence, ...]
    pending: tuple[str, ...] = ()
    reviewer_passed: bool = True
    approval_recorded: bool = True
    rollback_reference: str = "docs/rollback.md"


def validate_release(pack: EvidencePack) -> bool:
    """완전성뿐 아니라 모든 Evidence의 release identity를 교차 검증합니다."""

    # 축약 SHA는 사람에게 편하지만 다른 commit과 혼동될 수 있어 40자리만 받습니다.
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
        # 이전 실행이나 다른 명세의 성공 로그를 현재 릴리스에 재사용하지 못하게 합니다.
        if item.spec_id != pack.spec_id or item.commit_sha != pack.commit_sha:
            raise ContractError("RELEASE_IDENTITY_MISMATCH", "evidence identity가 다릅니다.")
        if item.criterion_id in seen or not item.reference.strip():
            raise ContractError(
                "EVIDENCE_INVALID", "criterion evidence가 중복되거나 비었습니다."
            )
        seen.add(item.criterion_id)
    # 누락뿐 아니라 예상하지 않은 criterion이 섞인 경우도 동일하게 거부합니다.
    if seen != set(pack.required_criteria):
        raise ContractError("RELEASE_NOT_READY", "필수 criterion evidence가 완전하지 않습니다.")
    return True
