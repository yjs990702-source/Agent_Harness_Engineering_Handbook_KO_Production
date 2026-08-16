# Third-Party Notices 작업 문서

직접·전이 의존성의 이름, 버전, 라이선스, 원문 URL은 `package-lock.json`이 확정된 뒤 자동·수동으로 교차 검토합니다. 현재 파일은 라이선스 확정 전 누락을 방지하기 위한 릴리스 작업 문서이며 최종 고지문이 아닙니다.

검토 대상에는 최소한 Node.js, Next.js, React, TypeScript, Vitest, Playwright, Zod, Supabase client와 각 전이 의존성이 포함됩니다. 배포 전에 다음을 완료합니다.

- lockfile 기준 dependency inventory 생성
- 각 패키지의 배포본 LICENSE 확인
- notice·소스 제공·attribution 의무 확인
- 수정·번들·server/client 배포 형태 기록
- 취약점과 지원 버전 재검토
