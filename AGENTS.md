# 실습 저장소 개발 지침

## 1. 목표와 적용 범위

이 저장소는 도서의 주차별 실습을 새 clone에서 재현할 수 있게 만드는 교육용 코드입니다. 모든 하위 모듈은 이 지침을 따르며, 더 구체적인 모듈 `AGENTS.md`가 있으면 해당 범위에서 추가 적용합니다.

## 2. 기본 작업 순서

1. 해당 주차 README의 수용 기준과 실패 사례를 읽습니다.
2. 실패 테스트 또는 재현 fixture를 먼저 확인합니다.
3. 가장 작은 구현으로 focused test를 통과시킵니다.
4. 해당 주차 `npm run verify`를 실행합니다.
5. 루트 `npm run verify`로 회귀를 확인합니다.
6. README·상태·검증 증거를 코드와 같은 commit에서 갱신합니다.

테스트 assertion을 약화하거나 skip·과도한 mock으로 실제 경로를 우회해 Green을 만들지 않습니다.

## 3. GitHub Actions 금지와 로컬 검증

- 불필요한 GitHub Actions 기반 CI를 만들지 않습니다.
- `.github/workflows/*.yml` 또는 `.github/workflows/*.yaml`을 생성·수정하지 않습니다.
- Marketplace Action을 추가하지 않습니다.
- 기본 검증 진입점은 루트 `npm run verify`입니다.
- 자동화가 필요하면 먼저 재현 가능한 로컬 스크립트와 증거 형식을 만듭니다.
- GitHub Actions 도입은 권리자·운영 책임자의 명시적 요청과 별도 설계 결정 없이는 허용하지 않습니다.

## 4. Backend SQL Injection 방어

- 사용자 입력을 SQL 문자열에 연결·보간하지 않습니다.
- template literal, 문자열 덧셈, `format`으로 동적 SQL을 만들지 않습니다.
- Supabase query builder, ORM 또는 database driver의 parameter binding을 사용합니다.
- 정렬 column·방향처럼 bind할 수 없는 식별자는 고정 allowlist enum으로 변환합니다.
- tenant 조건은 요청 body가 아니라 검증된 인증 context에서 가져옵니다.
- raw SQL은 정적 migration과 승인된 named parameter query로만 제한합니다.
- 입력 길이·형식·페이지 크기를 schema에서 제한하고, DB 계정은 최소 권한과 RLS를 사용합니다.
- SQLi payload, tenant 우회, 오류 정보 노출을 regression test로 보호합니다.

금지 예:

```ts
const query = `select * from work_requests where id = '${requestId}'`;
```

허용 예:

```ts
await supabase.from("work_requests").select("id,title").eq("id", requestId);
```

## 5. Frontend XSS 방어

- 사용자·모델·도구·artifact 출력은 불신 데이터로 취급합니다.
- React의 기본 escaping을 유지하고 문자열을 JSX text로 렌더링합니다.
- `dangerouslySetInnerHTML`, `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`를 사용하지 않습니다.
- Markdown raw HTML은 비활성화합니다. HTML 미리보기가 필수라면 검증된 sanitizer와 엄격한 allowlist, 별도 보안 검토가 필요합니다.
- 링크는 `https:`와 명시적으로 허용한 내부 상대 경로만 허용하며 `javascript:`·`data:`를 차단합니다.
- `eval`, `new Function`, 문자열 기반 timer를 사용하지 않습니다.
- CSP를 유지하고 인증 token을 browser localStorage에 저장하지 않습니다.
- 저장형·반사형·DOM 기반 XSS payload를 component/E2E test로 보호합니다.

## 6. API·Secret·데이터 경계

- 상태 변경 API는 인증·권한·Origin·CSRF·content type·body size·schema를 검증합니다.
- 다른 tenant의 객체와 존재하지 않는 객체는 동일한 not-found 응답으로 처리합니다.
- 실제 고객·운영·개인정보를 fixture에 넣지 않습니다.
- `.env*`, token, private key, service role key를 커밋·로그·화면 캡처하지 않습니다.
- 외부 서비스가 없어도 memory/fake adapter로 핵심 실습과 검증이 동작해야 합니다.
- Production에서 demo identity 또는 memory adapter가 활성화되면 fail closed 합니다.

## 7. Git·문서·완료 기준

- 구현은 `agent/weekly-labs` 누적 브랜치에서 주차별로 커밋합니다.
- `main` 직접 변경이나 강제 push를 하지 않습니다.
- 주차별 solution 태그는 검증 결과와 같은 commit을 가리켜야 합니다.
- 실제 코드 라이선스가 확정되기 전에는 `LICENSE_DECISION_REQUIRED.md`를 제거하지 않습니다.
- 공동저자 약력은 승인된 원문 없이 추정해 작성하지 않습니다.
- 완료 선언에는 실행 명령, 결과 수, 환경, commit SHA, 남은 외부 검증이 포함돼야 합니다.
