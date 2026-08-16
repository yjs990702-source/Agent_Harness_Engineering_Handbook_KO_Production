# 04. Verifier와 Evaluator

## 목표

테스트·경로·Evidence 판정과 설명 품질 평가를 분리합니다.

## 실습

1. 좋은 summary에 실패 Evidence를 붙여도 통과하지 않는지 확인합니다.
2. Verifier 실패를 Evaluator가 덮어쓸 수 없는 실행 순서를 읽습니다.
3. 평가 이유가 test·diff로 재검증 가능한지 검토합니다.

```powershell
npm run test --workspace=@handbook/week-02-loop-engineering -- --run tests/verifier.test.ts tests/orchestrator.test.ts
```

완료 기준은 deterministic verdict와 advisory 평가가 따로 기록되는 것입니다.
