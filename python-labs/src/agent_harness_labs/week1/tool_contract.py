"""Validate model-proposed tool calls before an executor can see them."""

from collections.abc import Callable, Iterable, Mapping
from dataclasses import dataclass
from enum import Enum
from types import MappingProxyType
from typing import TypeAlias

from agent_harness_labs.errors import ContractError

InputValidator: TypeAlias = Callable[[object], bool]


class ToolPermission(str, Enum):
    """도구가 요청할 수 있는 권한의 닫힌 집합입니다."""

    READ = "read"
    WRITE = "write"
    NETWORK = "network"
    DEPLOY = "deploy"


class SideEffect(str, Enum):
    """사람 승인 없이 실행해도 되는지를 판단하는 최소 분류입니다."""

    NONE = "none"
    CONSEQUENTIAL = "consequential"


@dataclass(frozen=True)
class ToolDescriptor:
    """개발자가 미리 등록하는 신뢰된 도구 계약입니다."""

    name: str
    side_effect: SideEffect
    permissions: tuple[ToolPermission, ...]
    requires_approval: bool
    validate_input: InputValidator
    output_schema: str


@dataclass(frozen=True)
class ToolProposal:
    """모델이 제안한 아직 신뢰할 수 없는 호출입니다."""

    tool: str
    permissions: tuple[str, ...]
    input: object


@dataclass(frozen=True)
class ValidatedToolCall:
    """모든 정적 검사를 통과해 executor에 전달할 수 있는 호출입니다."""

    tool: str
    permissions: tuple[ToolPermission, ...]
    input: object
    side_effect: SideEffect


def object_has_nonempty_string(key: str) -> InputValidator:
    """실습에서 재사용할 수 있는 가장 작은 입력 schema 검사기를 만듭니다."""

    def validate(value: object) -> bool:
        return (
            isinstance(value, Mapping)
            and isinstance(value.get(key), str)
            and bool(str(value[key]).strip())
        )

    return validate


def create_tool_registry(
    descriptors: Iterable[ToolDescriptor],
) -> Mapping[str, ToolDescriptor]:
    """descriptor를 검증하고 실행 중 수정할 수 없는 registry로 고정합니다."""

    registry: dict[str, ToolDescriptor] = {}
    for descriptor in descriptors:
        name = descriptor.name.strip()
        if not name.isidentifier() or not name.isascii() or len(name) < 3:
            raise ContractError("INVALID_TOOL_DESCRIPTOR", "도구 이름이 유효하지 않습니다.")
        # 같은 이름의 구현이 두 개면 어떤 도구가 실행되는지 모호해집니다.
        if name in registry:
            raise ContractError("DUPLICATE_TOOL", "도구 이름이 중복됩니다.")
        if not descriptor.permissions or len(set(descriptor.permissions)) != len(
            descriptor.permissions
        ):
            raise ContractError("INVALID_PERMISSION_SET", "권한 집합이 비었거나 중복됩니다.")
        if not descriptor.output_schema.strip():
            raise ContractError("INVALID_OUTPUT_SCHEMA", "출력 schema가 필요합니다.")
        # 부작용 분류와 승인 정책이 모순되는 설정은 시작할 때 실패시킵니다.
        if (
            descriptor.side_effect is SideEffect.CONSEQUENTIAL
            and not descriptor.requires_approval
        ):
            raise ContractError("APPROVAL_POLICY_INVALID", "부작용 도구에는 승인이 필요합니다.")
        registry[name] = descriptor
    # 모델 처리 중 registry가 바뀌면 같은 입력의 결과가 달라질 수 있으므로 불변 view를 줍니다.
    return MappingProxyType(registry)


def validate_tool_proposal(
    registry: Mapping[str, ToolDescriptor],
    proposal: ToolProposal,
    *,
    approval_granted: bool = False,
) -> ValidatedToolCall:
    """신뢰하지 않는 제안을 최소 권한의 검증된 호출로 변환합니다."""

    # allowlist의 첫 단계입니다. 등록되지 않은 문자열은 구현 탐색 없이 바로 거부합니다.
    descriptor = registry.get(proposal.tool)
    if descriptor is None:
        raise ContractError("UNKNOWN_TOOL", "등록되지 않은 도구입니다.")
    try:
        permissions = tuple(ToolPermission(item) for item in proposal.permissions)
    except ValueError as error:
        raise ContractError("PERMISSION_INVALID", "알 수 없는 권한입니다.") from error
    if not permissions:
        raise ContractError("PERMISSION_INVALID", "권한 요청이 비었습니다.")
    # 모델이 요청한 권한은 descriptor가 허용한 집합의 부분집합이어야 합니다.
    if any(item not in descriptor.permissions for item in permissions):
        raise ContractError("PERMISSION_ESCALATION", "등록 범위를 벗어난 권한입니다.")
    if not descriptor.validate_input(proposal.input):
        raise ContractError("INPUT_SCHEMA_INVALID", "도구 입력 schema 검증에 실패했습니다.")
    # schema 통과가 승인 대체 수단이 되지 않도록 별도의 Gate로 검사합니다.
    if descriptor.requires_approval and not approval_granted:
        raise ContractError("APPROVAL_REQUIRED", "사람 승인이 필요합니다.")
    return ValidatedToolCall(
        tool=descriptor.name,
        permissions=permissions,
        input=proposal.input,
        side_effect=descriptor.side_effect,
    )
