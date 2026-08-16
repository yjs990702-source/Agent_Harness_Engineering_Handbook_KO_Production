# 06 · Commit → PR → Review

명세 ID, 변경 파일, 테스트 결과, 배포 Evidence, rollback, 남은 위험을 PR 본문에 연결합니다. Reviewer는 finding만 남기고 Verifier가 실제 head에서 검증합니다.

```powershell
npm run verify:week3
git status --short
git diff --check
```

불필요한 GitHub Actions workflow는 만들지 않으며 로컬 verify 결과를 첨부합니다.
