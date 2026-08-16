# 03. TaskSpec의 owned path

## 목표

Worker가 TaskSpec의 허용 경로 밖을 수정하지 못하게 합니다.

## 실습

1. 정상 변경 파일이 `allowedPaths` 아래인지 확인합니다.
2. `.env.production`과 허용 범위 밖 파일을 넣어 실패 코드를 비교합니다.
3. 경로를 넓히기 전에 소유자와 충돌 위험을 기록합니다.

```powershell
npm run test --workspace=@handbook/week-02-loop-engineering -- --run tests/verifier.test.ts
```

완료 증거는 `SENSITIVE_PATH`와 `PATH_OUT_OF_SCOPE`가 구분된 verdict입니다.
