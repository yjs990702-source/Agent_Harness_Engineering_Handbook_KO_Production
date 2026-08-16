# 출판 개정판–공개 실습 추적성

이 표는 출판 개정판의 학습 주제를 독립 작성한 공개 lesson·source·test·실행 명령에 연결합니다. 원고·연구 원본·회사 구현은 저장소에 포함하지 않습니다. 기준선은 2026-08-17의 공개 `main` commit `80a5022`이며, 아래 실습 보강 완료 뒤 검증 보고서의 새 commit으로 갱신합니다.

| 과정  | 개정판 학습 주제               | 공개 lesson                                                               | 실행 계약 source                                                                     | Evidence test                                                       | 검증 명령                    | 범위 |
| ----- | ------------------------------ | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------- | ---------------------------- | ---- |
| 1주차 | TaskSpec·수용 기준             | `weeks/week-01-foundations/lessons/01-task-spec.md`                       | `weeks/week-01-foundations/src/request.ts`                                           | `weeks/week-01-foundations/tests/request.test.ts`                   | `npm run verify:week1`       | 기본 |
| 1주차 | 입력·tenant 경계               | `weeks/week-01-foundations/lessons/03-tenant-isolation.md`                | `weeks/week-01-foundations/src/repository.ts`                                        | `weeks/week-01-foundations/tests/service.test.ts`                   | `npm run verify:week1`       | 기본 |
| 1주차 | Model–Harness–Environment      | `weeks/week-01-foundations/lessons/07-minimal-offline-loop.md`            | `weeks/week-01-foundations/src/minimal-loop.ts`                                      | `weeks/week-01-foundations/tests/minimal-loop.test.ts`              | `npm run verify:week1`       | 기본 |
| 1주차 | Rule·Skill·MCP 신뢰 경계       | `weeks/week-01-foundations/lessons/08-rule-skill-mcp-contract.md`         | `.claude/skills/pr-draft/SKILL.md`, `weeks/week-01-foundations/src/tool-contract.ts` | `weeks/week-01-foundations/tests/tool-contract.test.ts`             | `npm run verify:week1`       | 기본 |
| 2주차 | Hook·민감 파일 보호            | `weeks/week-02-loop-engineering/lessons/01-hook-policy.md`                | `weeks/week-02-loop-engineering/src/hook-policy.ts`                                  | `weeks/week-02-loop-engineering/tests/hook-policy.test.ts`          | `npm run verify:week2`       | 기본 |
| 2주차 | Verifier·Evaluator 분리        | `weeks/week-02-loop-engineering/lessons/04-verifier-evaluator.md`         | `weeks/week-02-loop-engineering/src/verifier.ts`                                     | `weeks/week-02-loop-engineering/tests/verifier.test.ts`             | `npm run verify:week2`       | 기본 |
| 2주차 | repair cap·종료                | `weeks/week-02-loop-engineering/lessons/07-repair-loop.md`                | `weeks/week-02-loop-engineering/src/orchestrator.ts`                                 | `weeks/week-02-loop-engineering/tests/orchestrator.test.ts`         | `npm run verify:week2`       | 기본 |
| 2주차 | 승인 pause/resume·event replay | `weeks/week-02-loop-engineering/lessons/08-approval-resume.md`            | `weeks/week-02-loop-engineering/src/approval-loop.ts`                                | `weeks/week-02-loop-engineering/tests/approval-loop.test.ts`        | `npm run verify:week2`       | 기본 |
| 2주차 | Worktree·owned path            | `weeks/week-02-loop-engineering/lessons/10-worktree-preflight.md`         | `weeks/week-02-loop-engineering/src/worktree-plan.ts`                                | `weeks/week-02-loop-engineering/tests/worktree-plan.test.ts`        | `npm run verify:week2`       | 기본 |
| 2주차 | 하네스 다이어트                | `weeks/week-02-loop-engineering/lessons/11-harness-diet.md`               | `weeks/week-02-loop-engineering/src/harness-inventory.ts`                            | `weeks/week-02-loop-engineering/tests/harness-inventory.test.ts`    | `npm run verify:week2`       | 기본 |
| 3주차 | Deep Interview·열린 질문       | `weeks/week-03-service-deployment/lessons/10-deep-interview-to-spec.md`   | `weeks/week-03-service-deployment/src/interview.ts`                                  | `weeks/week-03-service-deployment/tests/interview.test.ts`          | `npm run verify:week3`       | 기본 |
| 3주차 | 서비스 TDD·API                 | `weeks/week-03-service-deployment/lessons/03-tdd-service.md`              | `weeks/week-03-service-deployment/src/service.ts`                                    | `weeks/week-03-service-deployment/tests/service.test.ts`            | `npm run verify:week3`       | 기본 |
| 3주차 | SQLi·XSS·URL·CSP               | `weeks/week-03-service-deployment/lessons/11-security-regression-pack.md` | `weeks/week-03-service-deployment/src/security.ts`                                   | `weeks/week-03-service-deployment/tests/security.test.ts`           | `npm run verify:week3`       | 기본 |
| 3주차 | 출고 Evidence·rollback         | `weeks/week-03-service-deployment/lessons/09-evidence-driven-delivery.md` | `weeks/week-03-service-deployment/src/delivery-artifacts.ts`                         | `weeks/week-03-service-deployment/tests/delivery-artifacts.test.ts` | `npm run verify:week3`       | 기본 |
| 3주차 | 배포 manifest·사람 승인        | `weeks/week-03-service-deployment/lessons/05-deployment-evidence.md`      | `weeks/week-03-service-deployment/src/deployment.ts`                                 | `weeks/week-03-service-deployment/tests/deployment.test.ts`         | `npm run verify:week3`       | 기본 |
| 심화  | topology·bounded fan-out       | `weeks/week-03-multi-agent/lessons/09-topology-gate.md`                   | `weeks/week-03-multi-agent/src/topology.ts`                                          | `weeks/week-03-multi-agent/tests/topology.test.ts`                  | `npm run verify:multi-agent` | 선택 |
| 심화  | partial failure·fan-in         | `weeks/week-03-multi-agent/lessons/10-failure-modes-and-fan-in.md`        | `weeks/week-03-multi-agent/src/coordinator.ts`                                       | `weeks/week-03-multi-agent/tests/coordinator.test.ts`               | `npm run verify:multi-agent` | 선택 |

## 추적 규칙

1. 수용 기준 이름을 바꾸면 lesson, test, README, 이 표를 같은 변경에서 갱신합니다.
2. 각 기본 주제는 외부 계정 없이 재현 가능한 test 또는 manifest Evidence를 가집니다.
3. 선택 심화는 기본 13시간 과정의 수료 조건을 대체하지 않습니다.
4. 모델 설명, 스크린샷, 성공 주장만으로 행을 완료하지 않습니다.
5. 새 공개 자료가 원고·내부 코드·제3자 원문을 포함하지 않는지 `npm run verify:repo`로 검사합니다.

```powershell
npm run verify:repo
npm run verify
```
