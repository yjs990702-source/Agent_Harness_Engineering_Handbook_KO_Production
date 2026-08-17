# Python Companion Track · 3시간

## 대상과 범위

Python 3.11 이상을 사용하는 현직 개발자가 외부 모델 SDK 없이 하네스의 실행 계약을 직접 테스트한다. 13시간 TypeScript 기본 과정의 선택 보강이며 UI·Vercel 배포는 기존 3주차 자료를 사용한다.

## 시간표

| 구간          | 시간 | 학습 활동                          | 완료 Evidence                 |
| ------------- | ---: | ---------------------------------- | ----------------------------- |
| Preflight     | 15분 | venv·고정 의존성·interpreter 확인  | version·경로·검증 로그        |
| Week 1 Bridge | 45분 | 최소 루프·ToolDescriptor·pytest    | executor 전 차단·budget 실패  |
| Week 2 Bridge | 60분 | approval reducer·Evaluator·repair  | replay·expiry·blocking safety |
| Week 3 Bridge | 45분 | Interview·DB-API·release evidence  | open question·SQL·identity    |
| 선택 심화     | 30분 | bounded fan-out·owned path·timeout | fan-in Evidence 집합          |

## 강의 운영

강사는 13시간을 늘리지 않을 때 같은 개념 블록만 Python으로 교체한다. 1주차 AGENTS·Rule·Skill, 2주차 Hook·Worktree, 3주차 DOM XSS·Vercel 설명은 TypeScript 자료를 유지한다. 코드 실습은 `python-labs/lessons` 순서로 진행하며 공통 JSON fixture를 양쪽 테스트에서 실행한다.

## 필수 수용 기준

- Week 1: unknown tool·권한 확대·schema 오류·승인 누락이 executor 전에 실패하고 step budget 소진을 완료로 위장하지 않는다.
- Week 2: run·call·tool·만료가 다른 token은 실행 0회이며 blocking safety finding과 repair cap이 독립 Gate다.
- Week 3: 열린 질문은 명세를 막고 SQL 값은 parameter에만 있으며 식별자 공격과 민감 오류·release identity mismatch가 차단된다.
- 선택 심화: worker 2~4개, owned path 무충돌, timeout·partial failure 종료, fan-in Evidence ID 완전 일치.

## 제출

`docs/LEARNER_EVIDENCE_TEMPLATE.md`에 language=`python`, Python version, interpreter/venv, fixture ID, criterion, test reference, 결과와 남은 risk를 기록한다. 스크린샷만 제출하지 않고 재실행 가능한 명령을 포함한다.
