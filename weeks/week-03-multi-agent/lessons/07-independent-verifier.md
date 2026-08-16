# 07. 독립 Verifier

## 목표

Agent 설명이 아니라 결과, path, Evidence, handoff, review를 다시 계산해 판정합니다.

## 실습

1. base revision을 바꿔 handoff 실패를 재현합니다.
2. handoff에서 Evidence ID 하나를 삭제합니다.
3. 상위 경로가 예외가 아니라 `PATH_OUT_OF_SCOPE`인지 확인합니다.
4. 알 수 없는 criterion과 criterion Evidence 누락을 재현합니다.

```powershell
npm run test --workspace=@handbook/week-03-multi-agent -- --run tests/verifier.test.ts
```

완료 기준은 실패 원인이 구조화된 코드로 구분되고 Verifier가 예외로 중단되지 않는 것입니다.
