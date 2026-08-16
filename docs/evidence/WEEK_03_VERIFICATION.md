# 3주차 검증 증거

검증일: 2026-08-16 (Asia/Seoul)

## 환경과 기준

- Windows PowerShell
- Node.js `v24.12.0`, npm `11.6.2`
- Next.js `16.3.1`, React `19.2.8`, Playwright `1.62.1`
- branch `agent/weekly-labs`
- start tag `week3-start`
- npm audit: 0 vulnerabilities

## Red

`week3-start`에서 API·Form이 공유하는 제목 schema를 의도적으로 2자로 두고 focused test를 실행했습니다.

```powershell
npm run test --workspace=@handbook/week-03-production-service -- --run src/lib/contracts.test.ts
```

- 7 tests 중 5개 통과, 2개 실패
- 실패 사례: `"ab"`, `"  ab  "`이 잘못 validation을 통과

## Green

공유 schema를 trim 후 3~100자로 수정했습니다.

```powershell
npm run verify:week3
```

- ESLint: 0 warnings/errors
- strict TypeScript: 통과
- Vitest: 5 files, 18 tests 통과
- Next.js production build: `/`, requests API, detail API, CSRF API와 Proxy 생성 성공
- Chromium scenario 1: 초기 목록→짧은 제목 거부·focus→정상 등록 성공
- Chromium scenario 2: 저장형 XSS payload를 text로 표시, DOM image 0개, script side effect 없음

## SQL Injection·권한 방어 증거

- UUID schema가 `"' OR 1=1 --"`를 repository 호출 전에 거부
- sort는 `created_desc | due_asc` allowlist만 허용
- Supabase adapter는 raw SQL 없이 `.eq("tenant_id", ...)`, `.eq("created_by", ...)`, `.eq("id", ...)` 사용
- tenant와 owner가 모두 다른 상세·목록은 동일하게 비공개 처리
- migration은 RLS에서 `auth.uid()`와 JWT `app_metadata.tenant_id`를 함께 확인

## XSS·CSRF 방어 증거

- 사용자 title은 React child text로만 렌더링
- repository scanner가 HTML sink·`eval` 계열 source를 거부
- nonce CSP, `object-src 'none'`, `base-uri 'none'`, `frame-ancestors 'none'`
- POST는 JSON content type, 16 KiB body, same-origin, Fetch Metadata, double-submit token 검증
- `javascript:`·`data:`·비 TLS 외부 URL 거부 unit test

## 디버깅 기록

Windows에서 test runner가 `npm run dev` 하위 프로세스를 종료하지 못하는 현상을 재현했습니다. 최종 실행기는 Next CLI를 직접 자식 프로세스로 시작하고 Playwright API 시나리오를 실행한 뒤 정확한 child PID만 종료합니다. 최종 명령은 약 13초에 종료 코드 0으로 끝났습니다.

## 외부 미검증

Supabase 실제 개발 project, 두 사용자 token/RLS, Vercel Preview·Production, 조직 Deployment Protection은 계정·승인이 필요한 수동 단계입니다. 절차와 증거 형식은 `weeks/week-03-production-service/docs/MANUAL_DEPLOYMENT.md`에 분리했습니다.
