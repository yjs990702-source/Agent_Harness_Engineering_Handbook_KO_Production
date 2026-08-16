# 3주차 · 멀티 에이전트 협업 하네스

## 목표

두 구현 Worker를 안전하게 병렬 실행하고, Test Worker·읽기 전용 Reviewer·독립 Verifier로 결과를 합칩니다. 모델 SDK나 외부 계정 없이 역할·의존성·증거 계약을 먼저 이해하는 실습입니다.

```text
Request → Planner → UI Worker ───┐
                     Logic Worker ─┼→ Test Worker → Reviewer → Verifier
                                  ┘
```

## 수용 기준

- `W3-AC-01`: Planner는 UI·Logic·Test·Reviewer 노드와 의존성을 가진 DAG를 반환합니다.
- `W3-AC-02`: UI·Logic Worker는 첫 wave에서 병렬 실행됩니다.
- `W3-AC-03`: owned path가 같거나 상하위로 겹치면 실행 전에 실패합니다.
- `W3-AC-04`: 빈 DAG·dependency 누락·중복 dependency·중복 ID·cycle을 실행 전에 실패시킵니다.
- `W3-AC-05`: Test Worker는 두 구현 Worker 결과를 받은 뒤 실행됩니다.
- `W3-AC-06`: Reviewer는 UI·Logic·Test 전체 결과를 받은 읽기 전용 역할이며 파일을 변경하면 최종 검증에 실패합니다.
- `W3-AC-07`: 모든 Agent는 base revision·실제 결과와 완전히 같은 evidence ID 집합·다음 수신자를 handoff에 기록합니다.
- `W3-AC-08`: Verifier는 안전한 상대 경로, RequestSpec criterion evidence, handoff, review 결과를 독립 판정합니다.

## 실행

저장소 루트에서:

```powershell
npm run verify:week3
```

## 강의 순서

1. [RequestSpec](lessons/01-request-spec.md)
2. [역할과 handoff 계약](lessons/02-role-handoff-contracts.md)
3. [DAG 사전 검증](lessons/03-dag-validation.md)
4. [owned path 충돌 차단](lessons/04-owned-path.md)
5. [병렬 wave와 fan-in](lessons/05-parallel-waves.md)
6. [읽기 전용 Reviewer](lessons/06-read-only-reviewer.md)
7. [독립 Verifier](lessons/07-independent-verifier.md)
8. [전체 협업 시나리오와 회고](lessons/08-end-to-end-retrospective.md)

## 코드 읽기 순서

1. `src/contracts.ts`에서 역할과 산출물 계약을 읽습니다.
2. `src/planner.ts`에서 최소 교육용 DAG를 확인합니다.
3. `src/dag.ts`와 `src/ownership.ts`에서 실행 전 차단 조건을 확인합니다.
4. `src/coordinator.ts`에서 wave 단위 병렬 실행과 fan-in을 추적합니다.
5. `src/verifier.ts`가 Agent의 설명을 믿지 않고 무엇을 다시 검사하는지 확인합니다.
6. `tests`의 실패 사례를 하나 바꾸고 Red→Green을 재현합니다.

## 실습 과제

- `ui-worker`가 `src/logic/**`도 소유하도록 바꾸고 ownership 실패를 확인합니다.
- Reviewer fixture에 변경 파일을 추가해 `READ_ONLY_WRITE`를 확인합니다.
- Logic Worker의 evidence를 실패로 바꿔 최종 verdict가 `failed`인지 확인합니다.
- handoff의 evidence ID 하나를 삭제하고 `INVALID_HANDOFF`를 확인합니다.
- Evidence의 criterion ID를 알 수 없는 값으로 바꾸고 criterion 누락 실패를 확인합니다.
- 새로운 `docs-worker`를 추가하기 전에 dependency와 owned path를 표로 설계합니다.

인계 양식은 루트 `.agents/tasks/week-03-lab.md`와 `.agents/handoffs/week-03-example.md`를 사용합니다.
