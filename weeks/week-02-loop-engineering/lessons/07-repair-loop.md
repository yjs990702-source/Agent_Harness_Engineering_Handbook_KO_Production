# 07. repair cap 실행 루프

## 목표

실패 Evidence를 다음 시도의 입력으로 되돌리되 무한 반복을 막습니다.

## 실습

1. 첫 실패 후 두 번째 시도가 통과하는 fixture를 실행합니다.
2. 같은 실패 signature가 반복되면 repair cap 전에 중단되는지 확인합니다.
3. 비정상 `maxRepairs`를 넣어 계획 오류를 재현합니다.

```powershell
npm run test --workspace=@handbook/week-02-loop-engineering -- --run tests/orchestrator.test.ts
npm run verify:week2
```

완료 증거는 `passed`, `repeated_failure`, 잘못된 repair 예산의 구분입니다.
