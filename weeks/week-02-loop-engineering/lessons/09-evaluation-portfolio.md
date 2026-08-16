# 09 · 단순 기준선과 4축 평가

## 목표

복잡한 planner–worker–evaluator가 단순 기준선보다 실제로 나은지 결과·과정·안전·비용으로 비교합니다.

- 결과: 고정 수용 기준 통과율
- 과정: 변경 파일 수와 재시도
- 안전: 정책 위반과 보안 테스트
- 비용: 모델 호출, 지연, 사람 개입

안전 Gate와 필수 수용 기준을 통과하지 못한 후보는 총점이 높아도 승격하지 않습니다. 고정 회귀 과제, 당일 새 과제, 사용자 가치 과제는 서로 다른 세트로 관리합니다.

## 실습

`tests/evaluation-portfolio.test.ts`에서 candidate의 모델 호출 수를 늘리고 승격 판단이 어떻게 바뀌는지 확인합니다. 그다음 안전 위반을 1개 넣어 점수와 Gate가 분리되는지 확인합니다.

```powershell
npm run test --workspace=@handbook/week-02-loop-engineering -- --run tests/evaluation-portfolio.test.ts
npm run verify:week2
```
