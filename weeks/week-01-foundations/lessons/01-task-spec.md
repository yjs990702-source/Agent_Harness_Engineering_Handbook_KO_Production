# 01. TaskSpec과 수용 기준

## 목표

자연어 요청을 입력 경계, 허용 범위, 관찰 가능한 수용 기준으로 바꿉니다.

## 실습

1. 주차 README의 `W1-AC-*` 기준을 읽습니다.
2. `tests/request.test.ts`에서 기준과 대응하는 테스트를 찾습니다.
3. 3자 미만 제목 사례를 하나 추가해 Red를 확인한 뒤 최소 구현으로 Green을 만듭니다.

```powershell
npm run test --workspace=@handbook/week-01-foundations -- --run tests/request.test.ts
```

완료 증거는 실패 메시지, 통과 로그, 변경한 수용 기준 한 문장입니다.
