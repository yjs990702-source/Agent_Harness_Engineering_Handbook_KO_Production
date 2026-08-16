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
npm run verify:web
npm run verify:publication
```

`verify:publication`은 내부 식별자·개인정보 형태·private key, GitHub Actions workflow, 금지된 XSS sink를 검사하고 모든 핵심·선택 workspace의 format·typecheck·test·build를 실행합니다. `verify:web`은 선택 웹 부록의 Chromium E2E까지 포함합니다.

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
- 외부 서비스 없음: 핵심 1~3주차는 외부 서비스가 필요 없습니다. 선택 웹 부록은 memory/fake adapter를 사용하고 Production 완료로 표시하지 않습니다.
- Playwright browser 없음: 문서화된 설치 명령으로 동일 버전 browser를 설치한 뒤 E2E를 재실행합니다.
- secret 의심: 커밋·push를 중단하고 값을 폐기·회전한 뒤 Git history와 로그를 확인합니다.
