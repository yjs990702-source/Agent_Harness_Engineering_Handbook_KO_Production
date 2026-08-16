# 서비스 보안 회귀 팩

SQL 값은 parameter binding으로 분리하고, column·direction 같은 식별자는 고정 allowlist에서만 선택합니다. 사용자·모델·저장소에서 온 문자열은 출처와 관계없이 `textContent` 데이터로 다루며 raw HTML sink에 전달하지 않습니다.

회귀 팩은 다음을 포함합니다.

- SQL 값 공격과 동적 정렬 식별자 공격
- 반사형·저장형·DOM 기반 XSS 문자열
- `javascript:`, `data:`, `http:`, protocol-relative, credential 포함 URL
- CSP의 `unsafe-inline`, `unsafe-eval`, wildcard source
- query·schema·credential·secret을 숨기는 공개 오류 응답

```powershell
npm run test --workspace=@handbook/week-03-service-deployment -- --run tests/security.test.ts
npm run verify:week3
```

프론트엔드 프레임워크를 추가해도 기본 escaping을 해제하지 않습니다. 꼭 필요한 HTML은 신뢰 가능한 고정 template과 별도의 sanitizer·보안 검토를 거쳐야 하며 이 기초 실습 범위에서는 사용하지 않습니다.
