# Week 3 Task · 멀티 에이전트 fan-in

## 기준

- Base revision: `week3-start`
- 범위: `weeks/week-03-multi-agent/**`
- 금지: `optional/**`, 실제 회사 코드·이름·URL·credential

## 목표

UI Worker와 Logic Worker를 병렬 실행하고 Test Worker, 읽기 전용 Reviewer, Verifier가 순서대로 결과를 합치게 합니다.

## 완료 조건

- ownership conflict와 DAG cycle fixture가 실패한다.
- 정상 계획의 wave가 `[ui, logic] → [tests] → [review]`이다.
- Reviewer가 변경 파일을 반환하면 실패한다.
- 모든 Agent handoff가 같은 base revision과 evidence ID를 기록한다.
- `npm run verify:week3`이 통과한다.

## 결과 기록

완료한 항목, 실행 명령, test 수, 변경 파일, 미해결 위험을 `.agents/handoffs/week-03-example.md` 형식으로 남깁니다.
