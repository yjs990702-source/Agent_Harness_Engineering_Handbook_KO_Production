# 실습 수용 기준

## 공통

- 새 clone과 문서화된 Node/npm 버전에서 설치·검증이 재현된다.
- 실제 개인정보·자격 증명·회사 코드·운영 설정 없이 실행된다.
- 변경 가능 경로와 금지 경로가 TaskSpec에 명시된다.
- 모델 답변이 아닌 테스트·diff·review·manifest가 Evidence다.
- GitHub Actions 없이 로컬 `npm run verify`가 공식 검증 진입점이다.

## 1주차

- AGENTS.md·CLAUDE.md·Rule·Skill의 책임이 구분된다.
- 입력 경계와 tenant 격리 테스트가 먼저 실패하고 구현 뒤 통과한다.
- Worker가 허용 경로 밖을 변경하면 실패한다.
- PR 초안에 변경 이유, 범위, 테스트, 위험이 있다.
- 최소 루프는 모델 결정을 `unknown`에서 검증하고 등록되지 않은·부작용 도구를 실행하지 않는다.
- 최대 step과 event trace로 종료·실행 근거를 남긴다.

## 2주차

- Hook이 위험 명령과 민감 경로를 fail-closed로 거부한다.
- Planner·Worker·Reviewer·Verifier·Evaluator 책임이 계약에서 구분된다.
- owned path 충돌을 실행 전에 거부한다.
- Reviewer는 읽기 전용이고 Verifier가 독립 판정한다.
- 동일 실패 signature 또는 repair 상한에서 루프가 끝난다.
- `.agents` handoff가 base revision, Evidence ID, 남은 위험, 다음 명령을 포함한다.
- 위험 도구는 run·call·만료 시각에 묶인 승인 전에는 실행되지 않고 event replay에서도 중복 실행되지 않는다.
- 후보 하네스는 단순 기준선과 같은 과제·자원 조건에서 결과·과정·안전·비용으로 비교된다.

## 3주차

- `SPEC-W3`와 AC-01~05가 테스트·코드·배포 Evidence에 연결된다.
- health, 정상 생성, 오류 입력, 공격 문자열 경계가 테스트된다.
- SQL 공격 문자열은 parameter values에만 존재하고 query text에 연결되지 않는다.
- 사용자·모델 출력은 `textContent` 데이터로 유지되며 raw HTML sink가 없다.
- deployment manifest에는 Secret 값이 없고 변수 이름·commit SHA·rollback 조건이 있다.
- Production manifest는 사람 승인 없이는 생성되지 않는다.
- Contest 점수와 Secret 노출·운영 데이터 사용 같은 즉시 중단 Gate가 분리된다.
- 외부 계정이 없으면 로컬 manifest와 테스트 로그로 같은 수료 기준을 증명한다.
- DelegationBrief·AutonomyPolicy·EvidencePack·ContinuationPack이 명세·권한·증거·인계를 연결한다.
- 외부 URL은 `https:`만 허용하며 nonce 기반 CSP에 `unsafe-inline`과 `unsafe-eval`이 없다.

## 선택 심화

- 빈 DAG, 중복·누락 dependency와 cycle을 거부한다.
- 충돌하지 않는 owned path만 같은 wave에서 실행한다.
- Reviewer는 전체 fan-in 뒤 읽기 전용으로 실행된다.
- Verifier는 criterion Evidence와 handoff ID 완전 일치를 확인한다.
- 멀티에이전트 도입 전에 단일 worker 기준선을 확인하고 첫 fan-out은 2~4개로 제한한다.
- shared/isolated context와 central/peer 조정 선택 근거를 기록한다.

## 공개 범위

- 공개 저장소에는 교육 코드·테스트·합성 fixture·강의 문서만 둔다.
- DOCX·PDF·이력서·계약·내부 개발 문서와 실제 secret을 넣지 않는다.
- 불필요한 GitHub Actions workflow와 Marketplace Action을 추가하지 않는다.
