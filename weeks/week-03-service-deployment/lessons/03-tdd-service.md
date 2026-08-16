# 03 · TDD로 서비스 기능 구현

AC-02 정상 생성과 AC-03 오류 응답을 실패 테스트로 먼저 재현합니다. assertion을 약화하거나 실제 경계를 mock으로 없애지 않습니다.

```powershell
npm run test --workspace=@handbook/week-03-service-deployment -- service.test.ts api.test.ts
```

완료 증거는 정상·짧은 제목·잘못된 body·health 시나리오입니다.
