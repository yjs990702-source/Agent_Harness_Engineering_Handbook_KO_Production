"""DB-API query construction and sanitized public errors."""

from dataclasses import dataclass
from enum import Enum

from agent_harness_labs.errors import ContractError


class SortColumn(str, Enum):
    """SQL placeholder로 처리할 수 없는 열 이름의 allowlist입니다."""

    CREATED_AT = "created_at"
    TITLE = "title"
    STATUS = "status"


class SortDirection(str, Enum):
    """정렬 방향을 두 개의 안전한 token으로 제한합니다."""

    ASC = "ASC"
    DESC = "DESC"


@dataclass(frozen=True)
class ParameterizedQuery:
    """SQL 문장과 사용자 값을 분리해 DB-API에 전달할 계약입니다."""

    text: str
    params: tuple[str, str]


@dataclass(frozen=True)
class PublicError:
    """내부 예외·쿼리·경로를 노출하지 않는 고정된 외부 오류입니다."""

    code: str = "REQUEST_FAILED"
    message: str = "요청을 처리하지 못했습니다. 입력과 권한을 확인해 주세요."


def _bounded_text(value: object, field: str, maximum: int) -> str:
    """문자열 타입, 공백, 최대 길이를 DB 경계 전에 검사합니다."""

    if not isinstance(value, str):
        raise ContractError("INPUT_INVALID", f"{field}는 문자열이어야 합니다.")
    normalized = value.strip()
    if not normalized or len(normalized) > maximum:
        raise ContractError("INPUT_INVALID", f"{field} 길이가 유효하지 않습니다.")
    return normalized


def build_sorted_lookup_query(
    tenant_id: object,
    title: object,
    sort_column: object,
    sort_direction: object,
) -> ParameterizedQuery:
    """식별자는 allowlist, 값은 parameter binding으로 분리합니다."""

    # 열 이름은 값 placeholder에 넣을 수 없으므로 Enum 변환으로 닫힌 집합을 강제합니다.
    try:
        column = SortColumn(sort_column)
    except (TypeError, ValueError) as error:
        raise ContractError(
            "SORT_COLUMN_NOT_ALLOWED", "정렬 column이 allowlist에 없습니다."
        ) from error
    try:
        direction = SortDirection(str(sort_direction).upper())
    except ValueError as error:
        raise ContractError(
            "SORT_DIRECTION_NOT_ALLOWED", "정렬 direction이 allowlist에 없습니다."
        ) from error
    # 두 개의 물음표 자리는 DB driver가 params와 결합합니다. 사용자 값을 이 문자열에
    # 직접 넣지 않으므로 따옴표가 포함된 공격 문자열도 SQL 문법이 되지 않습니다.
    text = (
        "SELECT id, title, status FROM work_requests "
        f"WHERE tenant_id = ? AND title = ? ORDER BY {column.value} {direction.value}"
    )
    return ParameterizedQuery(
        text=text,
        params=(
            _bounded_text(tenant_id, "tenant_id", 64),
            _bounded_text(title, "title", 100),
        ),
    )


def to_public_error(_error: object) -> PublicError:
    """내부 오류 종류와 무관하게 최소한의 공개 메시지만 반환합니다."""

    return PublicError()
