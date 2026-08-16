# 06. Single Worker Harness

## 목표

한 Worker가 작은 요청을 처리하더라도 입력·범위·테스트·완료 증거를 하네스로 고정합니다.

## 실습

1. README → 실패 테스트 → 최소 구현 → 전체 회귀 순서를 따릅니다.
2. 관련 없는 파일을 변경하지 않았는지 확인합니다.
3. 결과 요약에 실행 명령, 통과 수, 남은 위험을 기록합니다.

```powershell
npm run verify:week1
npm run verify
```

완료 기준은 새 clone에서 같은 명령으로 동일 결과를 얻는 것입니다.
