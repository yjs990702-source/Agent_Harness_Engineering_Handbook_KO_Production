# 06. 읽기 전용 데이터 경계

## 목표

외부 DB 계정 없이 tenant 범위와 최소 권한 데이터 접근을 연습합니다.

## 실습

1. 1주차 repository가 tenant 조건 없는 조회를 노출하지 않는지 확인합니다.
2. 읽기 전용 검토 역할에는 insert·update 권한을 주지 않는 설계를 작성합니다.
3. 실제 DB로 확장할 때 문자열 SQL 대신 parameter binding을 사용해야 하는 이유를 기록합니다.

```powershell
npm run test --workspace=@handbook/week-01-foundations -- --run tests/service.test.ts
npm run verify:week2
```

완료 기준은 읽기 기능, tenant scope, 쓰기 승인 경계가 분리된 것입니다.
