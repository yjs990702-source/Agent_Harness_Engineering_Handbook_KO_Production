---
paths:
  - "weeks/**/src/**/*"
  - "weeks/**/tests/**/*"
---

# 보안 경계 규칙

- 데이터 저장 예제를 추가한다면 SQL은 parameter binding이나 안전한 query builder만 사용하고 정렬 식별자는 allowlist로 제한합니다.
- tenant scope는 검증된 인증 context에서 주입합니다.
- UI 예제를 추가한다면 사용자·모델 출력은 text로 렌더링하며 raw HTML sink를 추가하지 않습니다.
- HTTP 변경 예제를 추가한다면 Origin·CSRF·content type·body size·schema를 검사합니다.
- 보안 수정에는 공격 payload regression test를 함께 추가합니다.
