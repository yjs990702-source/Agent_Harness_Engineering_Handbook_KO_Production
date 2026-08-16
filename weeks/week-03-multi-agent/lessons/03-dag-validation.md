# 03. DAG 사전 검증

## 목표

빈 계획, 중복 node, 중복·누락 dependency, cycle을 실행 전에 차단합니다.

## 실습

1. UI와 Logic이 같은 첫 wave인지 확인합니다.
2. 누락 dependency와 cycle fixture를 실행합니다.
3. node가 0개인 계획이 `planning_failed`인지 확인합니다.

```powershell
npm run test --workspace=@handbook/week-03-multi-agent -- --run tests/dag.test.ts tests/coordinator.test.ts
```

완료 증거는 `[ui, logic] → [tests] → [review]` wave와 구조화된 계획 실패입니다.
