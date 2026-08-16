# 02. 역할과 handoff 계약

## 목표

각 Agent가 node, role, changedFiles, Evidence, handoff를 같은 형식으로 반환하게 합니다.

## 실습

1. `src/contracts.ts`에서 구현 Agent와 Reviewer의 차이를 찾습니다.
2. Evidence의 `criterionIds`가 RequestSpec criterion을 가리키는지 확인합니다.
3. handoff ID가 실제 Evidence ID와 완전히 같아야 하는 이유를 적습니다.

```powershell
npm run test --workspace=@handbook/week-03-multi-agent -- --run tests/verifier.test.ts
```

완료 기준은 누락·추가·중복 ID와 알 수 없는 criterion이 모두 실패하는 것입니다.
