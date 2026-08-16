@AGENTS.md

# Claude Code 전용 브리지

- 작업 시작 시 `/context`에서 root·module 지침과 path-scoped Rule 로드를 확인합니다.
- Tool 실행 전 repository 지침과 Hook 결과를 따릅니다.
- 공개 기준 저장소는 `main`으로 통합합니다. Commit·PR 실습은 학습자 fork 또는 별도 연습 저장소에서 수행하며 기준 저장소에 불필요한 장기 branch를 만들지 않습니다.
- 변경 전후에 해당 주차 verify와 루트 `npm run verify`를 실행합니다.
