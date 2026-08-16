# 02. Planner·Worker·Verifier·Evaluator 계약

## 목표

계획, 구현, 결정론적 검증, 의미 평가를 서로 다른 책임으로 분리합니다.

## 실습

1. `src/contracts.ts`의 TaskSpec, WorkResult, Verdict를 표로 정리합니다.
2. Worker 결과에 최종 PASS 필드가 없는 이유를 설명합니다.
3. `maxRepairs`를 허용 범위 밖으로 바꿔 계획 단계 실패를 확인합니다.

```powershell
npm run test --workspace=@handbook/week-02-loop-engineering -- --run tests/orchestrator.test.ts
```

완료 기준은 네 역할의 입력·출력·금지 책임이 겹치지 않는 것입니다.
