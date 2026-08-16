# 05. 완료 선언과 Evidence 분리

## 목표

“완료했습니다”라는 설명과 실제 test·diff 증거를 분리합니다.

## 실습

1. 의도적으로 경계값 assertion 하나를 실패시켜 Red 로그를 저장합니다.
2. 최소 구현 후 같은 명령의 Green 로그를 저장합니다.
3. `git diff --check`와 변경 파일 목록을 함께 기록합니다.

```powershell
npm run test --workspace=@handbook/week-01-foundations
npm run verify:week1
```

완료 여부는 설명이 아니라 재실행 가능한 명령과 결과로 판단합니다.
