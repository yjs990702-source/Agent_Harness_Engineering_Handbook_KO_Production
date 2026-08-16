# 하네스 다이어트

오래된 규칙을 무조건 삭제하지 않습니다. 각 Rule·Skill·Hook·Evaluator에 소유자, 최근 사용일, 예방한 실패, 적용 범위, 근거, 제거 조건을 붙이고 `Keep | Move | Merge | Narrow | Enforce | Delete`로 판정합니다.

```powershell
npm run test --workspace=@handbook/week-02-loop-engineering -- --run tests/harness-inventory.test.ts
npm run verify:week2
```

완료 Evidence는 삭제한 줄 수가 아니라 전후 항목 수와 검증 누락률입니다. 근거가 없으면 유지하지 않고, 중요한 자연어 규칙이 결정적으로 검사 가능하면 Hook이나 테스트로 옮깁니다.
