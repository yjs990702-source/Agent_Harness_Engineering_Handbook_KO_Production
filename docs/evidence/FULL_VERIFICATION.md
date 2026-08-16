# 전체 로컬 검증 증거

검증일: 2026-08-16 (Asia/Seoul)

## 재현 명령

```powershell
npm ci
npm run verify
npm audit --audit-level=high
```

`npm ci`는 잠금 파일로 462 packages를 설치했고, `npm run verify`와 audit는 종료 코드 0으로 끝났습니다.

## 결과

| Gate                    | 결과                                                                             |
| ----------------------- | -------------------------------------------------------------------------------- |
| 저장소 정책             | 필수 문서 20개, source 61개 검사 통과, GitHub Actions workflow 0개               |
| 출판 경계               | 내부 개발 식별자·개인정보 패턴·private key 0건                                   |
| Format                  | Prettier 전체 통과                                                               |
| Lint/Typecheck          | 네 workspace strict 검사 통과                                                    |
| Unit/Component/Security | 15 files, 69 tests 통과                                                          |
| Build                   | 1·2·3주차 TypeScript, 선택 웹 부록 Next.js production build 통과                 |
| API routes              | 선택 부록 `/api/requests`, `/api/requests/[requestId]`, `/api/session/csrf` 생성 |
| Browser                 | Chromium 2 scenarios 통과, command 종료 코드 0                                   |
| Dependency audit        | 0 vulnerabilities                                                                |

## 디버깅 회귀 증거

두 번째 브라우저 시나리오가 React hydration 전에 기본 HTML form submit을 실행해 XSS payload heading을 찾지 못하는 경쟁 조건을 재현했습니다. E2E가 합성 seed heading을 기다린 뒤 form을 조작하도록 고쳤고, 선택 부록 E2E를 2회 연속 통과시킨 후 전체 `npm run verify`도 다시 통과했습니다.

Windows의 `core.autocrlf` 설정이 새 clone의 파일을 CRLF로 바꿔 Prettier 검사를 실패시키는 문제도 재현했습니다. 루트 `.gitattributes`로 텍스트를 LF로 고정하고 binary 유형을 분리한 뒤, 독립 임시 clone에서 `npm ci`부터 전체 `npm run verify`까지 통과했습니다.

## UI 증거

- desktop PNG SHA-256: `019ED513FE3B2B24440D5E95088A7280D805F866E4525B95CDFBD2CA4684F83C`
- mobile PNG SHA-256: `181100162CCF17B7C1E6A40332F09796E770607C434F1CA70A10CBD04FE6FFC4`

두 화면은 합성 데이터만 사용하며 Korean glyph, desktop 2-column, mobile 1-column, 입력 field, 목록 card, focus/error 영역의 clipping이 없음을 확인했습니다.

## 출판 연계 검증

- 저자: 김재환·윤재성
- 윤재성 표기: 공동저자·실습 코드 공동개발자
- 공개 약력: 기술 역량과 기여 범위만 포함
- 제외: 생년월일·주소·전화번호·개인 이메일·서명 등 이력서 개인정보
- v4 DOCX: 86쪽, 접근성 high/medium/low 0/0/0, 개인정보 메타데이터 scrub 후 전 페이지 렌더 동일

## 완료로 간주하지 않은 외부 항목

- 실제 Supabase migration·RLS·두 사용자 token 검증
- Vercel 보호 Preview와 Production 승격·rollback
- 코드·문서 라이선스 권리자 확정

외부 계정 실습은 선택 부록이며 핵심 하네스·멀티 에이전트 과정의 로컬 Green을 무효화하지 않습니다. 라이선스 결정 전에는 공개 릴리스 완료를 선언하지 않습니다.
