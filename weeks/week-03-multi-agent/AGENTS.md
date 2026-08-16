# 3주차 멀티 에이전트 모듈 지침

- 역할 계약, DAG, ownership, handoff, verifier를 한 파일에 합치지 않습니다.
- UI Worker와 Logic Worker의 owned path는 겹치지 않아야 합니다.
- Test Worker는 두 구현 Worker가 끝난 뒤에만 실행합니다.
- Reviewer는 UI·Logic·Test 전체 결과가 준비된 뒤에만 실행합니다.
- Reviewer는 읽기 전용이며 `changedFiles`를 반환하면 실패합니다.
- 빈 DAG와 중복 dependency를 실행 전에 거부합니다.
- Agent의 자기 보고만으로 통과시키지 않고 결정적 Verifier가 안전한 상대 경로, RequestSpec criterion evidence, handoff evidence ID 완전 일치를 확인합니다.
- 같은 역할 이름을 비공개 시스템의 모듈·prompt·라우팅 정보와 연결하지 않습니다.
- fixture는 합성 식별자와 합성 경로만 사용합니다.
- 변경 후 `npm run verify:multi-agent`와 루트 `npm run verify`를 실행합니다.
- 불필요한 GitHub Actions workflow를 만들지 않습니다.
