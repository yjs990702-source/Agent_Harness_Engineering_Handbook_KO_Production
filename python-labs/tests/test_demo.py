from agent_harness_labs.demo import main, render_scenario


def test_minimal_loop_shows_ordered_events() -> None:
    output = render_scenario("minimal-loop")
    assert (
        output.index("tool_validated")
        < output.index("tool_executed")
        < output.index("completed")
    )
    assert output.endswith("RESULT PASS")


def test_unknown_tool_is_reported_as_expected_block() -> None:
    assert "BLOCKED UNKNOWN_TOOL" in render_scenario("unknown-tool")


def test_sql_payload_stays_outside_query_text() -> None:
    output = render_scenario("sql-attack")
    assert "PAYLOAD_IN_SQL NO" in output
    assert "OR '1'='1" in output  # 공격값은 params를 설명하는 출력에만 남습니다.


def test_release_pending_is_not_ready() -> None:
    assert "BLOCKED RELEASE_NOT_READY" in render_scenario("release-not-ready")


def test_unknown_scenario_returns_usage_error(capsys: object) -> None:
    assert main(["missing"]) == 2
