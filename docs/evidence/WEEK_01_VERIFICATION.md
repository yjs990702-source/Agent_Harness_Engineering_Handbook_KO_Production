# 1주차 검증 증거

검증일: 2026-08-16 (Asia/Seoul)

## 환경

- Windows PowerShell
- Node.js `v24.12.0`
- npm `11.6.2`
- branch `agent/weekly-labs`
- start tag `week1-start`

## Red

`week1-start`에서 제목 최소 길이 결함을 유지한 채 다음 focused test를 실행했습니다.

```powershell
npm run test --workspace=@handbook/week-01-foundations -- --run tests/request.test.ts
```

예상대로 `"ab"`, `"  ab  "` 두 사례가 “함수가 오류를 던지지 않았다”는 이유로 실패했습니다. 테스트 삭제·skip·assertion 약화 없이 production 경계를 수정했습니다.

## Green

```powershell
npm run verify:week1
```

- TypeScript strict typecheck: 통과
- Vitest: 2 files, 10 tests 통과
- build 계약(`tsc --noEmit`): 통과

루트 정책·format·회귀 검증은 solution commit 직전에 `npm run verify`로 다시 실행합니다.

## 보호한 실패 모드

- trim 후 3자 미만·100자 초과 제목
- 다른 tenant의 목록·상세 데이터 노출
- 존재 여부를 구분하는 다른 오류 응답
- HTML처럼 보이는 입력을 코드로 실행하는 처리

## 외부 미검증

1주차는 외부 서비스가 없는 순수 TypeScript domain 실습이므로 Supabase·Vercel 검증 대상이 아닙니다.
