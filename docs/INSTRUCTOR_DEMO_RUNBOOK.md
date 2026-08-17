# 강사용 3주 시연 Runbook

모든 블록은 20분 이내입니다. 강사는 정답을 먼저 보여주지 않고 시작 상태 → 기대 실패 → 관찰 → 최소 수정 → Evidence 순서로 진행합니다. 아래 `npm` 명령은 PowerShell 실행 정책에 따라 `npm.cmd`로 바꿀 수 있습니다.

## 공통 시작 Gate

```powershell
node --version
npm --version
npm ci
npm run verify:repo
```

필수 파일이나 공개 범위 검사에서 실패하면 수업 코드를 진행하지 않습니다. Secret·운영 데이터가 발견되면 즉시 화면 공유와 기록을 중단하고 조직의 폐기·회전 절차를 따릅니다.

## 1주차 · 4시간

| 시간        | 시작 상태·활동            | 실행·관찰                                          | 기대 실패·힌트                         | 완료 Evidence           |
| ----------- | ------------------------- | -------------------------------------------------- | -------------------------------------- | ----------------------- |
| 00:00–00:20 | 새 clone·환경 확인        | `npm run verify:repo`                              | Node 버전·누락 파일부터 확인           | 환경·commit SHA         |
| 00:20–00:40 | 하네스 없는 요청 비교     | 범위·AC·Evidence 없는 요청과 TaskSpec 비교         | “완료” 문장과 실행 증거를 분리         | 전후 누락표             |
| 00:40–01:00 | 최소 루프 trace           | `tests/minimal-loop.test.ts` focused test          | 미등록 도구와 step budget을 찾게 함    | event trace             |
| 01:00–01:20 | Model–Harness–Environment | 모델 제안, validator, registry, executor 경계 표시 | 모델 제안을 권한으로 오해하지 않기     | 경계 그림·설명          |
| 01:20–01:40 | MCP 신뢰 경계             | `tests/tool-contract.test.ts` 실행                 | descriptor 밖 권한 요청을 관찰         | tool contract 실패 code |
| 01:40–02:00 | AGENTS 중첩               | root와 week 지침 비교                              | 같은 규칙 복사 대신 범위별 불변식      | 책임 표                 |
| 02:00–02:20 | Rule·Skill·Hook 구분      | `.claude/rules`와 PR Skill 읽기                    | 상시 제약·호출 절차·강제 차단 분리     | 분류 결과               |
| 02:20–02:40 | PR Skill 입력 계약        | Evidence 하나를 제거한 초안 검토                   | 없는 정보는 추측하지 않고 확인 필요    | PR 초안                 |
| 02:40–03:00 | TDD Red                   | 제목 경계 실패 사례 추가                           | assertion을 바꾸지 않고 실패 이유 기록 | Red 로그                |
| 03:00–03:20 | 최소 Green                | 입력 validator만 최소 변경                         | 테스트 전용 하드코딩 금지              | focused Green 로그      |
| 03:20–03:40 | tenant·XSS 회귀           | `npm run verify:week1`                             | 다른 tenant 존재 노출과 HTML 해석 확인 | 주차 verify             |
| 03:40–04:00 | 회고·과제                 | 반복 실수 3개를 Rule·Skill·test로 분류             | “모두 AGENTS에 넣기”를 피함            | 확장 계획               |

## 2주차 · 4시간

| 시간        | 시작 상태·활동    | 실행·관찰                                                           | 기대 실패·힌트                        | 완료 Evidence               |
| ----------- | ----------------- | ------------------------------------------------------------------- | ------------------------------------- | --------------------------- |
| 00:00–00:20 | Hook 허용 fixture | `npm run hook:allow --workspace=@handbook/week-02-loop-engineering` | 구조화 입력이 allowlist를 통과        | 허용 로그                   |
| 00:20–00:40 | Hook 차단 fixture | `npm run hook:block --workspace=@handbook/week-02-loop-engineering` | 문자열을 실행하지 않고 fail-closed    | 차단 code                   |
| 00:40–01:00 | 민감 경로 변형    | 상위 이동·중첩 `.git` fixture 확인                                  | denylist 단어보다 정규화가 먼저       | 공격 표                     |
| 01:00–01:20 | 역할 계약         | Planner·Worker·Reviewer·Verifier 표 작성                            | Worker 자기 PASS 금지                 | I/O·금지 행동 표            |
| 01:20–01:40 | owned path        | verifier 경로 회귀 실행                                             | 절대·상위·범위 밖 경로 관찰           | 경로 실패 Evidence          |
| 01:40–02:00 | Worktree dry-run  | `tests/worktree-plan.test.ts` 실행                                  | 실제 Git 변경 없이 argv 검토          | base·branch·owned path 계획 |
| 02:00–02:20 | Evaluator 4축     | 단일 기준선과 후보 점수 비교                                        | 안전 Gate 실패는 평균점으로 덮지 않음 | 승격 판정                   |
| 02:20–02:40 | repair loop       | 반복 signature와 cap fixture 실행                                   | prompt 누적 대신 중단 조건 확인       | 종료 Evidence               |
| 02:40–03:00 | 승인 pause        | `approval_requested` 상태까지 replay                                | 함수 호출로 승인 단계를 건너뛰지 않음 | waiting state               |
| 03:00–03:20 | 승인 resume       | 승인 token의 run·call·tool·시간 변경                                | 임의 replay와 만료 실행 실패 확인     | event sequence              |
| 03:20–03:40 | handoff           | base revision·Evidence ID·위험 기록                                 | 결과 ID와 인계 ID 집합 비교           | Continuation note           |
| 03:40–04:00 | 하네스 다이어트   | `tests/harness-inventory.test.ts` 실행                              | 근거 없는 유지·삭제를 거부            | 전후 수·누락률              |

## 3주차 · 5시간

| 시간        | 시작 상태·활동       | 실행·관찰                             | 기대 실패·힌트                          | 완료 Evidence     |
| ----------- | -------------------- | ------------------------------------- | --------------------------------------- | ----------------- |
| 00:00–00:20 | 문제 인터뷰          | 역할·사용 상황·문제 질문              | 기능 목록부터 만들지 않음               | 확인 답변         |
| 00:20–00:40 | 실패·데이터·권한     | 빈 답변으로 interview test 실행       | `spec: null`과 열린 질문이 정상         | openQuestions     |
| 00:40–01:00 | 1페이지 명세         | 확정 답변으로 `SPEC-W3` 생성          | AC ID 변경 금지                         | spec·AC 표        |
| 01:00–01:20 | 제로 세팅            | root·module 지침, package script 점검 | 외부 계정을 필수로 만들지 않음          | 로컬 기준선       |
| 01:20–01:40 | service Red          | 정상·오류 요청 test 실행              | HTTP보다 도메인 validator 먼저          | Red 로그          |
| 01:40–02:00 | service Green        | 최소 service 구현 확인                | tenant와 입력 경계 유지                 | focused Green     |
| 02:00–02:20 | API 경계             | health·request handler test           | unknown 입력과 공개 오류 분리           | API Evidence      |
| 02:20–02:40 | SQL 값 binding       | SQL 공격 문자열 fixture               | 공격 문자열은 values에만 존재           | query snapshot    |
| 02:40–03:00 | SQL 식별자 allowlist | 악성 column·direction 실행            | 식별자는 parameter가 아닌 enum mapping  | 거부 Evidence     |
| 03:00–03:20 | XSS·URL              | 저장형·반사형·DOM payload 실행        | textContent와 위험 scheme 확인          | security test     |
| 03:20–03:40 | CSP·공개 오류        | unsafe·wildcard·민감 오류 fixture     | 보안 header와 오류 메시지를 별도 검증   | CSP·오류 Evidence |
| 03:40–04:00 | 배포 manifest        | local/preview manifest 생성           | Secret 값 대신 변수 이름만 기록         | manifest          |
| 04:00–04:20 | 출고 4종 산출물      | Evidence 중복·누락·pending 상태 실행  | 완료 선언보다 교차 불변식 우선          | release identity  |
| 04:20–04:40 | PR·Contest           | 루브릭과 즉시 중단 Gate 적용          | Gate를 점수 합계로 상쇄하지 않음        | review·점수표     |
| 04:40–05:00 | 전체 verify·이식     | `npm run verify` 후 30일 계획         | 실제 Preview 실패 시 로컬 대체 Evidence | 최종 제출물       |

## 선택 심화 · 80분

| 시간        | 활동                             | 실행·관찰                   | 완료 Evidence         |
| ----------- | -------------------------------- | --------------------------- | --------------------- |
| 00:00–00:20 | 단일 Worker 기준선·토폴로지 Gate | `tests/topology.test.ts`    | 승격/유지 이유        |
| 00:20–00:40 | 2–4 fan-out·owned path           | 부모–자식 충돌 fixture      | 충돌 code             |
| 00:40–01:00 | 부분 실패·timeout                | `tests/coordinator.test.ts` | dependent 미실행      |
| 01:00–01:20 | Reviewer fan-in·Verifier         | `tests/verifier.test.ts`    | Evidence ID 완전 일치 |

## 외부 서비스 대체 경로

- 모델 API 불가: 결정적 fake decision과 합성 fixture를 사용합니다.
- Supabase 불가: parameterized query object와 tenant 테스트를 사용합니다.
- Vercel 불가: `deployment-manifest.example.json`, API test, rollback 조건을 제출합니다.
- GitHub PR 불가: PR Skill 출력 계약에 맞춘 로컬 Markdown 초안을 제출합니다.

## 종료 확인

```powershell
npm run verify:week1
npm run verify:week2
npm run verify:week3
npm run verify:multi-agent
npm run verify
```

강사는 [학습자 Evidence 양식](LEARNER_EVIDENCE_TEMPLATE.md)에서 commit, 명령, 결과, 위험, 다음 안전 행동을 확인하고 [예상 실패 지도](EXPECTED_FAILURES.md)로 재현 여부를 판정합니다.

## Python Companion · 선택 3시간

```powershell
py -3.11 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -e ".\python-labs[dev]"
.\.venv\Scripts\python.exe -m pytest python-labs/tests/week1 -q
.\.venv\Scripts\python.exe -m pytest python-labs/tests/week2 -q
.\.venv\Scripts\python.exe -m pytest python-labs/tests/week3 -q
npm run verify:python
npm run verify:all
```

15분 Preflight 뒤 45분 Week 1, 60분 Week 2, 45분 Week 3을 진행합니다. 남은 15분은 공통 fixture와 TypeScript 결과 비교에 사용합니다. 선택 Multi-Agent 30분은 단일 worker 기준선 통과자만 진행합니다.
