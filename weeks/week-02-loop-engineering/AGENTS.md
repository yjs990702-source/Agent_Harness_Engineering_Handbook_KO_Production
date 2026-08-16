# 2주차 모듈 지침

- Hook은 명확한 위험만 fail-closed로 차단하고 일반 읽기·검증은 허용합니다.
- Hook 입력은 `unknown`에서 구조를 검증하며 shell 문자열을 실행하지 않습니다.
- Worker는 자기 결과의 최종 PASS를 결정하지 않습니다.
- Verifier는 test·path·evidence 같은 결정론적 사실, Evaluator는 독립 품질 판정을 담당합니다.
- 같은 실패 signature가 반복되거나 repair cap에 도달하면 중단합니다.
- worktree 계획은 작업별 파일 소유권 중첩을 거부하며 명령을 자동 실행하지 않습니다.
- `.agents` 인계는 완료 증거와 미해결 위험을 분리합니다.
