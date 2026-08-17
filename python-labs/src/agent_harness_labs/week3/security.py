"""DB-API query construction and sanitized public errors."""

from dataclasses import dataclass
from enum import Enum

from agent_harness_labs.errors import ContractError


class SortColumn(str, Enum):
    CREATED_AT = "created_at"
    TITLE = "title"
    STATUS = "status"


class SortDirection(str, Enum):
    ASC = "ASC"
    DESC = "DESC"


@dataclass(frozen=True)
class ParameterizedQuery:
    text: str
    params: tuple[str, str]


@dataclass(frozen=True)
class PublicError:
    code: str = "REQUEST_FAILED"
    message: str = "요청을 처리하지 못했습니다. 입력과 권한을 확인해 주세요."


def _bounded_text(value: object, field: str, maximum: int) -> str:
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
    return PublicError()
