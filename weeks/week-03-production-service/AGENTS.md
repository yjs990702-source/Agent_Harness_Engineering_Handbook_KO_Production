# 3주차 서비스 모듈 지침

- Route Handler는 public HTTP endpoint로 보고 인증·tenant 권한·Origin·CSRF·content type·body size·schema를 검증합니다.
- `LAB_AUTH_MODE=demo`와 memory adapter는 development/test에서만 허용하고 Production에서는 fail closed 합니다.
- Supabase 모드는 사용자 Bearer token과 RLS를 사용하며 service-role credential을 사용하지 않습니다.
- query builder의 `.eq()`와 고정 sort allowlist만 사용합니다. 사용자 문자열로 SQL·column·direction을 조립하지 않습니다.
- 다른 tenant 요청과 없는 요청은 같은 404로 처리합니다.
- 사용자 title·category·오류 값은 React text로만 렌더링합니다. HTML sink를 추가하지 않습니다.
- CSP·CSRF·secure cookie·URL protocol 방어를 약화하지 않습니다.
- 변경 후 unit/component/security test, Chromium E2E, production build를 실행합니다.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
