# 05. `.agents` handoff

## 목표

대화 기록 대신 기준 revision, 변경 파일, Evidence, 결정, 위험, 다음 행동을 전달합니다.

## 실습

1. `.agents/handoffs/week-02-example.md`를 읽습니다.
2. 실행한 test와 diff를 Evidence에 기록합니다.
3. 미해결 위험과 다음 행동을 별도 항목으로 작성합니다.

```powershell
npm run verify:week2
git diff --check
```

완료 증거는 새 세션에서 그대로 재현할 수 있는 handoff 문서입니다.
