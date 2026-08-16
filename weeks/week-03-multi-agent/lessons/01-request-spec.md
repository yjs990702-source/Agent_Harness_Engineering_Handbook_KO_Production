# 01. 인터뷰 결과를 RequestSpec으로 압축

## 목표

긴 요청을 goal과 고유 criterion ID가 있는 실행 계약으로 압축합니다.

## 실습

1. `createTeachingPlan`이 만드는 RequestSpec을 읽습니다.
2. criterion을 비우거나 ID를 중복시켜 계획 실패를 확인합니다.
3. criterion 설명을 관찰 가능한 행동 문장으로 고칩니다.

```powershell
npm run test --workspace=@handbook/week-03-multi-agent -- --run tests/planner.test.ts tests/dag.test.ts
```

완료 기준은 goal과 중복 없는 criterion을 가진 RequestSpec입니다.
