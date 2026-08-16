# 06. 읽기 전용 Reviewer

## 목표

Reviewer가 파일을 고치지 않고 근거가 있는 review Evidence만 반환하게 합니다.

## 실습

1. Reviewer가 UI·Logic·Test 결과를 모두 받는지 확인합니다.
2. Reviewer 결과에 변경 파일을 추가해 `READ_ONLY_WRITE`를 재현합니다.
3. 구현 수정은 원래 Worker에게 되돌려야 하는 이유를 설명합니다.

```powershell
npm run test --workspace=@handbook/week-03-multi-agent -- --run tests/coordinator.test.ts tests/verifier.test.ts
```

완료 기준은 Reviewer 쓰기 시도가 최종 검증에서 실패하는 것입니다.
