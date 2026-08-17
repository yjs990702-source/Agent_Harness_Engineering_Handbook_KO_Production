import asyncio

import pytest

from agent_harness_labs import ContractError
from agent_harness_labs.extension.multi_agent import (
    WorkerEvidence,
    WorkerTask,
    run_bounded_fanout,
    validate_topology,
)

TASKS = (WorkerTask("ui", ("public/",)), WorkerTask("logic", ("src/",)))


def test_single_worker_baseline_is_required() -> None:
    with pytest.raises(ContractError, match="BASELINE_REQUIRED"):
        validate_topology(TASKS, single_worker_passed=False)


def test_fanout_is_limited_to_two_to_four() -> None:
    with pytest.raises(ContractError, match="FANOUT_LIMIT"):
        validate_topology(TASKS[:1], single_worker_passed=True)


def test_owned_path_conflict_is_rejected() -> None:
    tasks = (WorkerTask("one", ("src/",)), WorkerTask("two", ("src/",)))
    with pytest.raises(ContractError, match="OWNED_PATH_CONFLICT"):
        validate_topology(tasks, single_worker_passed=True)


def test_successful_fanout_preserves_evidence_identity() -> None:
    async def worker(task: WorkerTask) -> WorkerEvidence:
        await asyncio.sleep(0)
        return WorkerEvidence(task.task_id, f"ev-{task.task_id}", True)

    result = asyncio.run(run_bounded_fanout(TASKS, worker, timeout_seconds=1))
    assert {item.evidence_id for item in result} == {"ev-ui", "ev-logic"}


def test_partial_failure_stops_fan_in() -> None:
    async def worker(task: WorkerTask) -> WorkerEvidence:
        return WorkerEvidence(task.task_id, f"ev-{task.task_id}", task.task_id != "logic")

    with pytest.raises(ContractError, match="PARTIAL_FAILURE"):
        asyncio.run(run_bounded_fanout(TASKS, worker, timeout_seconds=1))


def test_timeout_is_structured_failure() -> None:
    async def worker(task: WorkerTask) -> WorkerEvidence:
        await asyncio.sleep(0.05)
        return WorkerEvidence(task.task_id, f"ev-{task.task_id}", True)

    with pytest.raises(ContractError, match="WORKER_TIMEOUT"):
        asyncio.run(run_bounded_fanout(TASKS, worker, timeout_seconds=0.001))
