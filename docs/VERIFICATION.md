# 로컬 검증 가이드

## 전체 검증

```powershell
npm install
npm run verify
```

`verify`는 저장소 정책 검사, format, 각 workspace lint/typecheck/test/build를 순서대로 실행합니다. GitHub Actions는 사용하지 않습니다.

## 주차별 focused 검증

```powershell
npm run verify:week1
npm run verify:week2
npm run verify:week3
```

아직 구현되지 않은 주차 명령은 workspace가 추가될 때까지 실패할 수 있으며, [상태 문서](STATUS.md)의 완료 항목만 기준으로 사용합니다.

## 기대 결과 기록 형식

```text
환경: OS / Node / npm
기준: branch / commit SHA
명령: npm run verify:weekN
결과: 통과한 test file 수 / test 수 / build 결과
외부 미검증: Supabase, Vercel, 실제 브라우저 등
```

## 장애 해결

- 의존성 불일치: `node --version`, `npm --version`, lockfile 변경 여부를 먼저 확인합니다.
- stale build: 해당 workspace의 `.next` 또는 `dist`만 지운 뒤 다시 실행합니다. 저장소 전체를 재귀 삭제하지 않습니다.
- 외부 서비스 없음: memory/fake adapter를 사용합니다. Production 완료로 표시하지 않습니다.
- Playwright browser 없음: 문서화된 설치 명령으로 동일 버전 browser를 설치한 뒤 E2E를 재실행합니다.
- secret 의심: 커밋·push를 중단하고 값을 폐기·회전한 뒤 Git history와 로그를 확인합니다.
