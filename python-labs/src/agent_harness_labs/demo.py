"""결정적인 하네스 동작을 명령 한 줄로 관찰하는 학습용 시나리오.

실제 모델·DB·배포 서비스를 호출하지 않고 기존 핵심 모듈을 조합합니다. 따라서 출력은
반복 실행해도 같으며, 학습자는 인프라 설정 대신 경계와 오류 코드에 집중할 수 있습니다.
"""

from collections.abc import Callable, Mapping, Sequence
from datetime import UTC, datetime, timedelta

from agent_harness_labs.errors import ContractError
from agent_harness_labs.week1.minimal_loop import run_minimal_loop
from agent_harness_labs.week1.tool_contract import (
    SideEffect,
    ToolDescriptor,
    ToolPermission,
    ToolProposal,
    create_tool_registry,
    object_has_nonempty_string,
    validate_tool_proposal,
)
from agent_harness_labs.week2.approval_loop import ApprovalToken, resume_approved_tool
from agent_harness_labs.week3.release_evidence import EvidencePack, validate_release
from agent_harness_labs.week3.security import build_sorted_lookup_query

Scenario = Callable[[], tuple[str, ...]]


def _registry() -> Mapping[str, ToolDescriptor]:
    """정상 루프와 공격 예제가 공유하는 최소 read-only registry를 만듭니다."""
    return create_tool_registry(
        [
            ToolDescriptor(
                name="search_docs",
                side_effect=SideEffect.NONE,
                permissions=(ToolPermission.READ,),
                requires_approval=False,
                validate_input=object_has_nonempty_string("query"),
                output_schema="{count: integer}",
            )
        ]
    )


def _blocked(error: ContractError) -> str:
    """오류 코드는 한 번만 표시하고 사람이 읽을 설명을 뒤에 둡니다."""
    prefix = f"[{error.code}] "
    detail = str(error)
    if detail.startswith(prefix):
        detail = detail[len(prefix) :]
    return f"BLOCKED {error.code} {detail}"


def _minimal_loop() -> tuple[str, ...]:
    registry = _registry()
    decisions: list[Mapping[str, object]] = [
        {
            "kind": "tool",
            "tool": "search_docs",
            "permissions": ["read"],
            "input": {"query": "harness"},
        },
        {"kind": "complete", "output": "근거 2개를 확인했습니다."},
    ]
    result = run_minimal_loop(
        decisions,
        registry,
        lambda _call: "2개의 합성 문서를 찾았습니다.",
    )
    events = tuple(f"EVENT {item.step} {item.type} {item.detail}" for item in result.events)
    return ("SCENARIO minimal-loop", *events, "RESULT PASS")


def _unknown_tool() -> tuple[str, ...]:
    try:
        validate_tool_proposal(
            _registry(),
            ToolProposal("delete_all", ("write",), {}),
        )
    except ContractError as error:
        return ("SCENARIO unknown-tool", _blocked(error), "RESULT PASS")
    raise AssertionError("미등록 도구가 거부되지 않았습니다.")


def _approval_expired() -> tuple[str, ...]:
    now = datetime(2026, 8, 17, 9, 0, tzinfo=UTC)
    events = [
        {"type": "run_started", "run_id": "run-demo"},
        {
            "type": "tool_proposed",
            "run_id": "run-demo",
            "call_id": "call-1",
            "tool": "publish",
            "side_effect": "consequential",
        },
        {"type": "approval_requested", "run_id": "run-demo", "call_id": "call-1"},
    ]
    token = ApprovalToken(
        "run-demo",
        "call-1",
        "publish",
        "reviewer-1",
        now - timedelta(minutes=1),
    )
    try:
        # 이 callback은 호출되면 안 됩니다. 만료 검사가 executor보다 앞에 있는지를 확인합니다.
        resume_approved_tool(events, token, now, lambda _tool: "unexpected")
    except ContractError as error:
        return ("SCENARIO approval-expired", _blocked(error), "RESULT PASS")
    raise AssertionError("만료된 승인이 거부되지 않았습니다.")


def _sql_attack() -> tuple[str, ...]:
    payload = "report' OR '1'='1"
    query = build_sorted_lookup_query("tenant-demo", payload, "created_at", "desc")
    return (
        "SCENARIO sql-attack",
        f"QUERY {query.text}",
        f"PARAMS {query.params!r}",
        f"PAYLOAD_IN_SQL {'YES' if payload in query.text else 'NO'}",
        "RESULT PASS",
    )


def _release_not_ready() -> tuple[str, ...]:
    pack = EvidencePack(
        spec_id="spec-demo",
        commit_sha="a" * 40,
        required_criteria=("AC-1",),
        evidence=(),
        pending=("AC-1",),
    )
    try:
        validate_release(pack)
    except ContractError as error:
        return ("SCENARIO release-not-ready", _blocked(error), "RESULT PASS")
    raise AssertionError("불완전한 릴리스가 거부되지 않았습니다.")


SCENARIOS: dict[str, Scenario] = {
    "minimal-loop": _minimal_loop,
    "unknown-tool": _unknown_tool,
    "approval-expired": _approval_expired,
    "sql-attack": _sql_attack,
    "release-not-ready": _release_not_ready,
}


def render_scenario(name: str) -> str:
    """CLI와 테스트가 함께 쓰는 순수 렌더링 함수입니다."""
    try:
        scenario = SCENARIOS[name]
    except KeyError as error:
        choices = ", ".join((*SCENARIOS, "all"))
        raise ContractError("SCENARIO_UNKNOWN", f"시나리오를 선택하세요: {choices}") from error
    return "\n".join(scenario())


def main(argv: Sequence[str] | None = None) -> int:
    """하나 또는 모든 시나리오를 실행하고 사람이 읽을 수 있는 결과를 출력합니다."""
    import sys

    arguments = tuple(sys.argv[1:] if argv is None else argv)
    selected = arguments[0] if arguments else "all"
    try:
        names = tuple(SCENARIOS) if selected == "all" else (selected,)
        print("\n\n".join(render_scenario(name) for name in names))
    except ContractError as error:
        print(f"ERROR {error.code} {error}", file=sys.stderr)
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
