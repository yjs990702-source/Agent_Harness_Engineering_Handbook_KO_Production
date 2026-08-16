# 08 · 승인 가능한 pause/resume 루프

## 목표

위험한 도구 호출을 선택한 순간 실행을 멈추고, run·call·만료 시각에 묶인 승인 token으로 한 번만 재개합니다. 대화 기록이 아니라 append-only event가 실행 상태의 근거입니다.

## 상태 흐름

```text
run_started → tool_proposed → approval_requested
           → approval_granted → tool_executed → run_completed
```

`reduceRun`은 event를 다시 읽어 현재 상태를 재구성합니다. 다른 run의 승인, 만료된 승인, 같은 call ID의 중복 실행은 실패해야 합니다.

## 실습

1. `tests/approval-loop.test.ts`에서 승인 전 실행 횟수가 0인지 확인합니다.
2. 만료된 token fixture를 추가해 실패를 재현합니다.
3. event 목록을 직렬화했다가 다시 읽어도 같은 상태가 나오는지 검사합니다.

```powershell
npm run test --workspace=@handbook/week-02-loop-engineering -- --run tests/approval-loop.test.ts
npm run verify:week2
```
