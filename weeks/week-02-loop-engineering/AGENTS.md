# 2주차 모듈 지침

- 명령 Hook은 로컬 포맷·타입·테스트·빌드·verify 명령만 allowlist로 허용하고 나머지는 fail-closed로 차단합니다.
- Hook 입력은 `unknown`에서 구조를 검증하며 shell 문자열을 실행하지 않습니다.
- 절대·drive letter·상위 이동·중첩 `.git`·`.env*` 경로를 정규화 단계에서 거부합니다.
- Worker는 자기 결과의 최종 PASS를 결정하지 않습니다.
- Verifier는 test·path·evidence 같은 결정론적 사실, Evaluator는 독립 품질 판정을 담당합니다.
- 같은 실패 signature가 반복되거나 repair cap에 도달하면 중단합니다.
- `.agents` 인계는 완료 증거와 미해결 위험을 분리합니다.
