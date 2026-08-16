# 하네스 중심 3주 학습 경로

## 1주차 · Single Worker Harness

요청을 구조화된 TaskSpec으로 바꾸고, 허용 경로·수용 기준·테스트 증거를 갖춘 한 Worker의 결과를 결정적으로 검증합니다.

핵심 산출물: `AGENTS.md`, TaskSpec, 실패/통과 테스트, Evidence JSON, 읽기 전용 리뷰 메모.

## 2주차 · Planner–Worker–Verifier

Planner의 분해, Worker의 변경, 독립 Verifier의 기계적 판정, 간단한 Evaluator의 의미 판정을 분리합니다. 같은 실패 반복과 repair 상한에서 반드시 중단합니다.

핵심 산출물: 역할 계약, repair trace, verifier verdict, `.agents` handoff.

## 3주차 · Multi-Agent Collaboration

UI Worker와 Logic Worker를 소유 경로가 겹치지 않게 병렬 실행하고, Test Worker·읽기 전용 Reviewer·최종 Verifier로 fan-in합니다.

```text
Request → Planner → UI Worker ─┐
                     Logic Worker ─┼→ Test Worker → Reviewer → Verifier
                                  ┘
```

핵심 산출물: DAG, ownership map, 병렬 wave trace, handoff, evidence manifest, merge/fail verdict.

## 선택 부록

Next.js UI, 데이터베이스, Supabase, 브라우저 보안, 외부 배포는 핵심 과정을 끝낸 뒤 선택합니다. 외부 계정이 없어도 1~3주차 검증은 모두 통과해야 합니다.
