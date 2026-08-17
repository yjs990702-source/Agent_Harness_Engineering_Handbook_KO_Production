# 예상 실패와 진단 지도

실습은 실패를 관찰한 뒤 경계를 보강하는 방식으로 진행합니다. 아래 오류는 우회할 대상이 아니라 어떤 계약이 작동했는지 설명할 Evidence입니다.

| 영역            | 대표 실패                                | 의미                                                  | 먼저 볼 파일                                                 | 복구 후 검증                 |
| --------------- | ---------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------ | ---------------------------- |
| Tool contract   | 등록되지 않은 도구·권한·schema·승인 오류 | 자연어 제안이 실행 계약을 통과하지 못함               | `weeks/week-01-foundations/src/tool-contract.ts`             | `npm run verify:week1`       |
| Hook            | `SENSITIVE_PATH`, `COMMAND_NOT_ALLOWED`  | 민감 경로나 allowlist 밖 명령을 fail-closed로 차단    | `weeks/week-02-loop-engineering/src/hook-policy.ts`          | `npm run verify:week2`       |
| 승인 reducer    | 승인 없는 실행·만료·종료 후 이벤트       | replay가 run·call·tool·시간 상태와 불일치             | `weeks/week-02-loop-engineering/src/approval-loop.ts`        | `npm run verify:week2`       |
| Worktree plan   | base SHA·branch·경로·ownership 오류      | 실행 전 격리 계획이 불완전하거나 충돌                 | `weeks/week-02-loop-engineering/src/worktree-plan.ts`        | `npm run verify:week2`       |
| 하네스 다이어트 | 소유자·근거·제거 조건 누락               | 유지 또는 삭제 결정을 뒷받침할 Evidence 부족          | `weeks/week-02-loop-engineering/src/harness-inventory.ts`    | `npm run verify:week2`       |
| Deep Interview  | `spec: null`, `openQuestions`            | 답변을 추측하지 않고 명세 생성을 중단                 | `weeks/week-03-service-deployment/src/interview.ts`          | `npm run verify:week3`       |
| SQL             | 정렬 allowlist 오류                      | 값 binding으로 해결되지 않는 식별자 공격 차단         | `weeks/week-03-service-deployment/src/security.ts`           | `npm run verify:week3`       |
| XSS·URL·CSP     | 위험 scheme·unsafe·wildcard 오류         | 문자열이 실행 가능한 브라우저 경계로 이동하려 함      | `weeks/week-03-service-deployment/tests/security.test.ts`    | `npm run verify:week3`       |
| 출고 계약       | Evidence 중복·누락·identity 불일치       | 완료 선언과 spec·commit·review·승인·rollback이 분리됨 | `weeks/week-03-service-deployment/src/delivery-artifacts.ts` | `npm run verify:week3`       |
| Multi-Agent     | ownership·timeout·fan-in 오류            | 병렬 후보가 안전하게 합쳐지지 않음                    | `weeks/week-03-multi-agent/src/coordinator.ts`               | `npm run verify:multi-agent` |
| 공개 범위       | 필수 파일 누락·범위 밖 파일·workflow     | 공개 저장소 경계 위반                                 | `scripts/validate-repository.mjs`                            | `npm run verify:repo`        |

## 진단 순서

1. 첫 오류의 criterion ID와 실패 code를 기록합니다.
2. focused test 한 개로 재현합니다.
3. 입력 계약, 상태 전이, 경로 정규화, Evidence reference 순서로 확인합니다.
4. assertion을 약화하거나 test를 skip하지 않고 가장 작은 구현을 수정합니다.
5. focused test → 주차 verify → 루트 verify 순서로 회귀를 확인합니다.

PowerShell은 `npm.cmd`, macOS/Linux는 `npm`을 사용할 수 있습니다. 예를 들어 PowerShell 실행 정책으로 `npm.ps1`이 차단되면 다음과 같이 실행합니다.

```powershell
npm.cmd run verify:week2
npm.cmd run verify
```

외부 서비스 장애는 기본 과정 실패가 아닙니다. Supabase·Vercel·모델 API 대신 합성 fixture, 로컬 manifest, 테스트 로그를 제출합니다.

## Python 진단

| 증상·failure code         | 의미                                     | 먼저 확인할 것                                    |
| ------------------------- | ---------------------------------------- | ------------------------------------------------- |
| `ModuleNotFoundError`     | 다른 interpreter 또는 editable 설치 누락 | `.venv` Python 경로·`pip show agent-harness-labs` |
| `TIMEZONE_REQUIRED`       | naive datetime 사용                      | `datetime.now(UTC)`와 aware expiry                |
| `APPROVAL_MISMATCH`       | run·call·tool identity 불일치            | executor 호출 횟수가 0인지                        |
| `SORT_COLUMN_NOT_ALLOWED` | SQL 식별자 allowlist 밖 입력             | 값을 column으로 연결하지 않았는지                 |
| `RELEASE_NOT_READY`       | pending 또는 Evidence 누락               | spec·commit·criterion 집합                        |
| mypy mutation 오류        | frozen state를 직접 변경                 | reducer가 새 state를 반환하는지                   |

`pytest.skip`, 느슨한 xfail, SQL f-string, 예외 삼키기로 실패를 숨기지 않습니다. focused pytest 뒤 `npm run verify:python`, 공통 계약 변경이면 `npm run verify:all`을 실행합니다.
