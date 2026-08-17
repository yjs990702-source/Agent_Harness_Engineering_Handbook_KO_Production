"""Bounded fan-out exercise focused on ownership and partial failure."""

import asyncio
from collections.abc import Awaitable, Callable, Sequence
from dataclasses import dataclass

from agent_harness_labs.errors import ContractError


@dataclass(frozen=True)
class WorkerTask:
    task_id: str
    owned_paths: tuple[str, ...]


@dataclass(frozen=True)
class WorkerEvidence:
    task_id: str
    evidence_id: str
    passed: bool


Worker = Callable[[WorkerTask], Awaitable[WorkerEvidence]]


def validate_topology(tasks: Sequence[WorkerTask], *, single_worker_passed: bool) -> None:
    if not single_worker_passed:
        raise ContractError("BASELINE_REQUIRED", "단일 worker 기준선이 먼저 통과해야 합니다.")
    if not 2 <= len(tasks) <= 4:
        raise ContractError("FANOUT_LIMIT", "worker는 2~4개여야 합니다.")
    owners: dict[str, str] = {}
    for task in tasks:
        if not task.owned_paths:
            raise ContractError("OWNED_PATH_REQUIRED", "각 worker에 owned path가 필요합니다.")
        for item in task.owned_paths:
            if item in owners:
                raise ContractError("OWNED_PATH_CONFLICT", "worker owned path가 충돌합니다.")
            owners[item] = task.task_id


async def run_bounded_fanout(
    tasks: Sequence[WorkerTask],
    worker: Worker,
    *,
    timeout_seconds: float,
    single_worker_passed: bool = True,
) -> tuple[WorkerEvidence, ...]:
    validate_topology(tasks, single_worker_passed=single_worker_passed)
    try:
        results = await asyncio.wait_for(
            asyncio.gather(*(worker(task) for task in tasks)),
            timeout=timeout_seconds,
        )
    except TimeoutError as error:
        raise ContractError("WORKER_TIMEOUT", "worker fan-out이 timeout되었습니다.") from error
    if any(not item.passed for item in results):
        raise ContractError("PARTIAL_FAILURE", "하나 이상의 worker가 실패했습니다.")
    expected = {task.task_id for task in tasks}
    actual = {item.task_id for item in results}
    if actual != expected or len({item.evidence_id for item in results}) != len(results):
        raise ContractError("FANIN_EVIDENCE_MISMATCH", "fan-in evidence 집합이 다릅니다.")
    return tuple(results)
