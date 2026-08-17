"""Validate model-proposed tool calls before an executor can see them."""

from collections.abc import Callable, Iterable, Mapping
from dataclasses import dataclass
from enum import Enum
from types import MappingProxyType
from typing import TypeAlias

from agent_harness_labs.errors import ContractError

InputValidator: TypeAlias = Callable[[object], bool]


class ToolPermission(str, Enum):
    READ = "read"
    WRITE = "write"
    NETWORK = "network"
    DEPLOY = "deploy"


class SideEffect(str, Enum):
    NONE = "none"
    CONSEQUENTIAL = "consequential"


@dataclass(frozen=True)
class ToolDescriptor:
    name: str
    side_effect: SideEffect
    permissions: tuple[ToolPermission, ...]
    requires_approval: bool
    validate_input: InputValidator
    output_schema: str


@dataclass(frozen=True)
class ToolProposal:
    tool: str
    permissions: tuple[str, ...]
    input: object


@dataclass(frozen=True)
class ValidatedToolCall:
    tool: str
    permissions: tuple[ToolPermission, ...]
    input: object
    side_effect: SideEffect


def object_has_nonempty_string(key: str) -> InputValidator:
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
    registry: dict[str, ToolDescriptor] = {}
    for descriptor in descriptors:
        name = descriptor.name.strip()
        if not name.isidentifier() or not name.isascii() or len(name) < 3:
            raise ContractError("INVALID_TOOL_DESCRIPTOR", "도구 이름이 유효하지 않습니다.")
        if name in registry:
            raise ContractError("DUPLICATE_TOOL", "도구 이름이 중복됩니다.")
        if not descriptor.permissions or len(set(descriptor.permissions)) != len(
            descriptor.permissions
        ):
            raise ContractError("INVALID_PERMISSION_SET", "권한 집합이 비었거나 중복됩니다.")
        if not descriptor.output_schema.strip():
            raise ContractError("INVALID_OUTPUT_SCHEMA", "출력 schema가 필요합니다.")
        if (
            descriptor.side_effect is SideEffect.CONSEQUENTIAL
            and not descriptor.requires_approval
        ):
            raise ContractError("APPROVAL_POLICY_INVALID", "부작용 도구에는 승인이 필요합니다.")
        registry[name] = descriptor
    return MappingProxyType(registry)


def validate_tool_proposal(
    registry: Mapping[str, ToolDescriptor],
    proposal: ToolProposal,
    *,
    approval_granted: bool = False,
) -> ValidatedToolCall:
    descriptor = registry.get(proposal.tool)
    if descriptor is None:
        raise ContractError("UNKNOWN_TOOL", "등록되지 않은 도구입니다.")
    try:
        permissions = tuple(ToolPermission(item) for item in proposal.permissions)
    except ValueError as error:
        raise ContractError("PERMISSION_INVALID", "알 수 없는 권한입니다.") from error
    if not permissions:
        raise ContractError("PERMISSION_INVALID", "권한 요청이 비었습니다.")
    if any(item not in descriptor.permissions for item in permissions):
        raise ContractError("PERMISSION_ESCALATION", "등록 범위를 벗어난 권한입니다.")
    if not descriptor.validate_input(proposal.input):
        raise ContractError("INPUT_SCHEMA_INVALID", "도구 입력 schema 검증에 실패했습니다.")
    if descriptor.requires_approval and not approval_granted:
        raise ContractError("APPROVAL_REQUIRED", "사람 승인이 필요합니다.")
    return ValidatedToolCall(
        tool=descriptor.name,
        permissions=permissions,
        input=proposal.input,
        side_effect=descriptor.side_effect,
    )
