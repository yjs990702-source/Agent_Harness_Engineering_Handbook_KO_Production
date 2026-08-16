# 01. Hook 입력과 강제 차단

## 목표

지침으로만 남던 금지 조건을 실행 전 allow/block 판정으로 바꿉니다.

## 실습

1. 잘못된 JSON, 상위·절대·민감 경로 fixture를 구분합니다.
2. 로컬 포맷·타입·테스트·빌드·verify 명령만 허용되는지 확인합니다.
3. `git clean`, PowerShell 재귀 삭제, 명령 연결, 강제 push를 재현합니다.
4. Hook이 명령 문자열을 직접 실행하지 않는지 확인합니다.

```powershell
npm run test --workspace=@handbook/week-02-loop-engineering -- --run tests/hook-policy.test.ts
```

완료 증거는 허용 명령과 차단 명령·경로의 판정 이유입니다.
