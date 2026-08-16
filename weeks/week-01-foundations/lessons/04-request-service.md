# 04. 업무요청 서비스

## 목표

입력 검증, 생성 메타데이터, 저장소 경계를 조합하고 시간과 ID를 재현 가능하게 만듭니다.

## 실습

1. `createId`와 `now` 의존성을 주입하는 이유를 설명합니다.
2. 생성 결과의 tenant, user, status, time을 검증합니다.
3. service가 저장소의 tenant-safe 메서드만 호출하는지 확인합니다.

```powershell
npm run test --workspace=@handbook/week-01-foundations -- --run tests/request.test.ts tests/service.test.ts
```

완료 기준은 같은 fixture에서 같은 생성 결과가 재현되는 것입니다.
