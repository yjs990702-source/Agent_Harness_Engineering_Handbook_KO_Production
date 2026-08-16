---
paths:
  - "weeks/**/src/**/*"
  - "weeks/**/app/**/*"
  - "weeks/**/supabase/migrations/*.sql"
---

# 보안 경계 규칙

- SQL은 parameter binding 또는 Supabase query builder만 사용하고 정렬 식별자는 allowlist로 제한합니다.
- tenant scope는 검증된 인증 context에서 주입합니다.
- React 출력은 text로 렌더링하며 HTML sink를 추가하지 않습니다.
- mutation endpoint는 Origin·CSRF·content type·body size·schema를 검사합니다.
- 보안 수정에는 공격 payload regression test를 함께 추가합니다.
