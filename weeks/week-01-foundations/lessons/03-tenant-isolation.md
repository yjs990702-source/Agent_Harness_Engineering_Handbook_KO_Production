# 03. tenant 격리 저장소

## 목표

객체 ID를 알아도 다른 tenant의 요청을 조회할 수 없게 합니다.

## 실습

1. `src/repository.ts`의 tenant 조건을 읽습니다.
2. A·B tenant 요청을 만든 뒤 A 목록에 B 요청이 없는지 확인합니다.
3. 다른 tenant의 ID와 존재하지 않는 ID가 같은 not-found 경계를 사용하는지 확인합니다.

```powershell
npm run test --workspace=@handbook/week-01-foundations -- --run tests/service.test.ts
```

완료 증거는 교차 tenant 조회가 데이터 존재 여부를 노출하지 않는 테스트 로그입니다.
