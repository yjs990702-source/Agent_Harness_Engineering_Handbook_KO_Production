# Third-Party Notices 작업 문서

기준: 2026-08-16 `package-lock.json`과 설치된 npm 배포본의 `package.json` metadata. 이 표는 직접 의존성 inventory이며 최종 법적 고지문을 대신하지 않습니다.

| 패키지                       | 고정 버전 | 표시 라이선스 | 용도                         |
| ---------------------------- | --------: | ------------- | ---------------------------- |
| Next.js / eslint-config-next |    16.3.1 | MIT           | 3주차 Web·lint               |
| React / React DOM            |    19.2.8 | MIT           | UI rendering                 |
| Supabase JavaScript          |   2.112.3 | MIT           | 선택 DB/Auth adapter         |
| Zod                          |     4.4.3 | MIT           | API·UI schema                |
| Playwright                   |    1.62.1 | Apache-2.0    | Chromium E2E·UI capture      |
| Vitest                       |    4.1.10 | MIT           | unit/component/security test |
| Testing Library React        |    16.3.2 | MIT           | component test               |
| Testing Library jest-dom     |     6.9.1 | MIT           | DOM assertions               |
| TypeScript                   |     5.9.3 | Apache-2.0    | typecheck/build              |
| ESLint                       |    9.39.1 | MIT           | Week 3 lint                  |
| jsdom                        |    27.0.1 | MIT           | component test DOM           |
| Prettier                     |     3.7.4 | MIT           | format gate                  |
| tsx                          |    4.21.0 | MIT           | Week 2 Hook fixture runner   |

`@types/node`, `@types/react`, `@types/react-dom`과 lockfile의 전이 의존성도 배포 전에 별도 inventory와 LICENSE 원문을 확인해야 합니다. 현재 `esbuild`는 알려진 low 이슈를 피하기 위해 `0.28.1`로 override했고 `npm audit` 결과는 0건입니다.

최종 공개 릴리스 전에 다음을 완료합니다.

- lockfile 전체 dependency·license inventory와 LICENSE 원문 보존
- notice·소스 제공·attribution·수정 표시 의무 확인
- server/client/browser bundle별 실제 배포 포함 여부 기록
- 이미지·문서·코드 예제의 저작권·출처·수정 여부 확인
- 공동 권리자의 코드·문서 라이선스 결정

라이선스·특허 해석은 권리자와 필요 시 법률 전문가가 검토합니다.
