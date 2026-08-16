---
name: create-pr
description: 검증된 로컬 변경의 diff, 테스트, 위험, 롤백을 확인한 뒤 사람이 승인하면 PR 준비 정보를 만든다.
disable-model-invocation: true
---

# PR 생성 Skill

1. 현재 branch가 `main`이 아닌지 확인합니다.
2. `git status --short`, `git diff --check`, `git diff --stat`, staged diff를 확인합니다.
3. `.env*`, credential, private key, `.github/workflows`가 변경에 포함되지 않았는지 확인합니다.
4. 변경한 주차의 focused test와 루트 `npm run verify`를 실행합니다.
5. `.github/pull_request_template.md` 형식으로 문제·범위·수용 기준·검증·보안·롤백·남은 위험을 작성합니다.
6. 실제 commit, push, PR 생성은 저장소 쓰기 권한과 사람의 명시적 승인을 확인한 뒤에만 수행합니다.

검증 실패, secret 의심, main 직접 작업, 라이선스 미확정 코드의 외부 복사 발견 시 중단하고 원인을 보고합니다.
