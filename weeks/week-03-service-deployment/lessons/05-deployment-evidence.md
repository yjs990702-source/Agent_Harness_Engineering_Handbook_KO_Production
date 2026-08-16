# 05 · 로컬·Preview 배포 Evidence

외부 계정이 없으면 deployment manifest와 테스트 로그를 수료 증거로 사용합니다. 실제 Preview를 만들 때에도 Secret 값이 아니라 변수 이름만 기록합니다.

```powershell
npm run test --workspace=@handbook/week-03-service-deployment -- deployment.test.ts
```

Production manifest는 승인자와 승인 시각이 없으면 실패해야 합니다.
