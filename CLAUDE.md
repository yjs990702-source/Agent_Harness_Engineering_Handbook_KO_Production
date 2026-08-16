@AGENTS.md

# Claude Code 전용 브리지

- 작업 시작 시 `/context`에서 root·module 지침과 path-scoped Rule 로드를 확인합니다.
- Tool 실행 전 repository 지침과 Hook 결과를 따릅니다.
- PR 생성은 `.claude/skills/create-pr/SKILL.md`를 사용하되, 실제 push·PR 부작용은 사람이 승인한 경우에만 수행합니다.
