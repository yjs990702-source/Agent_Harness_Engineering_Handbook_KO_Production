@AGENTS.md

# Claude Code 전용 브리지

- 작업 시작 시 `/context`에서 root·module 지침과 path-scoped Rule 로드를 확인합니다.
- Tool 실행 전 repository 지침과 Hook 결과를 따릅니다.
- 이 학습 저장소는 별도 개발 branch나 PR 실습 없이 `main`을 기준으로 사용합니다.
- 변경 전후에 해당 주차 verify와 루트 `npm run verify`를 실행합니다.
