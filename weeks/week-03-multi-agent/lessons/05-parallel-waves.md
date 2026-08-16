# 05. 병렬 wave와 fan-in

## 목표

독립 node만 `Promise.all`로 병렬 실행하고 wave 완료 뒤 dependency 결과를 전달합니다.

## 실습

1. UI·Logic이 wave 1, Test가 wave 2인지 확인합니다.
2. Test Worker가 UI·Logic 두 결과를 받는지 검증합니다.
3. Reviewer가 UI·Logic·Test 세 결과를 모두 받는지 확인합니다.

```powershell
npm run test --workspace=@handbook/week-03-multi-agent -- --run tests/coordinator.test.ts
```

완료 기준은 경쟁 상태 없이 재현되는 wave와 전체 fan-in입니다.
