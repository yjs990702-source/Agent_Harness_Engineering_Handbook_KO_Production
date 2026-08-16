# 하네스 엔지니어링·에이전트 3주 실습

이 과정은 웹 서비스를 만드는 수업이 아닙니다. 에이전트가 무엇을 해야 하는지 제한하고, 결과를 증거로 검증하며, 여러 역할이 충돌하지 않게 협업하는 방법을 순서대로 배웁니다.

## 1주차 · Single Worker Harness

한 Worker가 작은 요청을 처리합니다.

- 요청을 `TaskSpec`으로 표현합니다.
- 허용 경로와 수용 기준을 명시합니다.
- 실패 테스트를 먼저 확인합니다.
- 구현 결과와 Evidence를 분리합니다.
- Worker의 자기 보고가 아니라 테스트로 완료를 판단합니다.

실행 폴더: `weeks/week-01-foundations`

## 2주차 · Planner–Worker–Verifier

계획·구현·판정 역할을 나눕니다.

- Planner가 작은 작업과 기준을 만듭니다.
- Worker는 허용된 범위만 변경합니다.
- Verifier는 테스트·경로·증거를 독립적으로 확인합니다.
- Evaluator는 결과의 설명 품질을 보조 평가합니다.
- 같은 실패가 반복되거나 repair 상한에 도달하면 중단합니다.
- 다음 담당자가 이어갈 수 있도록 `.agents` handoff를 남깁니다.

실행 폴더: `weeks/week-02-loop-engineering`

## 3주차 · Multi-Agent Collaboration

여러 역할을 안전하게 조정합니다.

```text
Request → Planner → UI Worker ┐
                  Logic Worker ┴→ Test Worker → Reviewer → Verifier
```

- 빈 DAG·중복 dependency·누락·cycle을 실행 전에 확인합니다.
- Worker별 owned path를 분리합니다.
- 충돌하지 않는 작업만 같은 wave에서 병렬 실행합니다.
- Test Worker가 구현 결과를 모아 통합 증거를 만듭니다.
- Reviewer는 UI·Logic·Test 전체 결과를 받은 뒤 읽기 전용으로 finding만 반환합니다.
- Verifier가 handoff ID 완전 일치·criterion evidence·안전한 변경 경로를 최종 판정합니다.

실행 폴더: `weeks/week-03-multi-agent`

## 과정 밖의 내용

웹 프레임워크, 실제 데이터베이스, 브라우저 E2E, 외부 모델 호출과 운영 배포는 이 과정에 포함하지 않습니다. 여기서는 하네스와 에이전트 협업 계약만 연습합니다.
