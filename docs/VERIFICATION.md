# 로컬 검증 가이드

## 전체 검증

```powershell
npm ci
npm run verify
```

`verify`는 저장소 구조, format, 각 주차 lint·typecheck·test·build를 순서대로 실행합니다. GitHub Actions와 외부 서비스는 사용하지 않습니다.

## 주차별 검증

```powershell
npm run verify:week1
npm run verify:week2
npm run verify:week3
```

## 기대 결과 기록

```text
환경: OS / Node / npm
기준: main commit SHA
명령: npm run verify:weekN
결과: test file 수 / test 수 / build 결과
```

## 오류 확인 순서

1. `node --version`과 `npm --version`을 확인합니다.
2. `npm ci`로 `package-lock.json`과 같은 의존성을 설치합니다.
3. 실패한 주차의 `npm run verify:weekN`을 먼저 실행합니다.
4. 첫 번째 실제 오류를 수정한 뒤 같은 명령을 다시 실행합니다.
5. 마지막에 루트 `npm run verify`로 전체 회귀를 확인합니다.

`dist`처럼 생성된 폴더만 정리할 수 있으며, 저장소 전체나 다른 사용자의 파일을 재귀 삭제하지 않습니다. 테스트를 skip하거나 assertion을 약화해 통과시키지 않습니다.
