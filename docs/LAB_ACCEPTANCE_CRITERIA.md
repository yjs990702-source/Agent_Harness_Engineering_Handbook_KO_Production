# 실습 수용 기준

## 공통

- 새 clone과 문서화된 Node/npm 버전에서 설치·검증이 재현된다.
- 실제 회사 코드·고객 데이터·secret 없이 실행된다.
- 변경 가능 경로와 금지 경로가 TaskSpec에 명시된다.
- 성공 선언에는 테스트·diff·review 중 필요한 Evidence가 포함된다.
- GitHub Actions 없이 로컬 단일 진입점으로 검증된다.

## 1주차

- 입력 경계와 tenant 격리 테스트가 먼저 실패하고 구현 후 통과한다.
- Worker 결과가 허용 경로 밖을 변경하면 실패한다.

## 2주차

- Planner·Worker·Verifier·Evaluator 책임이 코드 계약에서 구분된다.
- 동일 실패 signature 또는 repair 상한에서 루프가 끝난다.
- owned path 충돌을 실행 전에 거부한다.

## 3주차

- UI·Logic Worker가 같은 wave에서 병렬 실행될 수 있다.
- dependency와 cycle을 검증한다.
- Test Worker는 두 구현 Worker의 handoff 이후에만 실행된다.
- Reviewer는 변경 파일을 만들 수 없다.
- Verifier는 ownership·evidence·review를 모두 통과해야 `passed`를 반환한다.

## 선택 웹 부록

- Backend가 사용자 입력으로 SQL 문자열을 조립하지 않는다.
- Frontend가 사용자·모델 출력을 raw HTML로 렌더링하지 않는다.
- CSRF·tenant 격리·일반화된 오류가 테스트된다.
