# 실습 수용 기준

## 공통

- 새 clone과 문서화된 Node/npm 버전에서 설치·검증이 재현된다.
- 실제 개인정보·자격 증명·비공개 코드 없이 실행된다.
- 변경 가능 경로와 금지 경로가 TaskSpec에 명시된다.
- 성공 선언에는 테스트·diff·review 중 필요한 Evidence가 포함된다.
- GitHub Actions 없이 로컬 단일 진입점으로 검증된다.

## 1주차

- 입력 경계와 tenant 격리 테스트가 먼저 실패하고 구현 후 통과한다.
- Worker 결과가 허용 경로 밖을 변경하면 실패한다.

## 2주차

- Planner·Worker·Verifier·Evaluator 책임이 코드 계약에서 구분된다.
- Hook은 로컬 검증 명령만 allowlist로 허용하고 위험·연결 명령과 비정상·민감 경로를 fail-closed로 거부한다.
- 동일 실패 signature 또는 repair 상한에서 루프가 끝난다.
- owned path 충돌을 실행 전에 거부한다.

## 3주차

- UI·Logic Worker가 같은 wave에서 병렬 실행될 수 있다.
- 빈 DAG, 중복 dependency, dependency 누락과 cycle을 검증한다.
- Test Worker는 두 구현 Worker의 handoff 이후에만 실행된다.
- Reviewer는 UI·Logic·Test 전체 결과를 받은 뒤 실행되며 변경 파일을 만들 수 없다.
- Verifier는 안전한 ownership·criterion evidence·handoff ID 완전 일치·review를 모두 통과해야 `passed`를 반환한다.

## 안전 확장 규칙

- 데이터 저장 예제를 추가하면 사용자 입력을 SQL 문자열에 연결하지 않고 parameter binding을 사용한다.
- UI 예제를 추가하면 사용자·모델 출력을 raw HTML로 렌더링하지 않는다.
- 네트워크 예제를 추가하면 인증 경계와 입력 schema를 회귀 테스트한다.
