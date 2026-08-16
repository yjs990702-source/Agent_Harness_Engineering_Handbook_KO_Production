# Week 3 Handoff 예시

## 기준

- Base revision: 현재 `main` commit
- Task: `.agents/tasks/week-03-lab.md`

## 역할별 결과

| 역할         | owned path             | 결과              | evidence          |
| ------------ | ---------------------- | ----------------- | ----------------- |
| UI Worker    | `src/ui/**`            | 합성 패널 변경    | focused test·diff |
| Logic Worker | `src/logic/**`         | 합성 정책 변경    | unit test·diff    |
| Test Worker  | `tests/integration/**` | 통합 시나리오     | test result       |
| Reviewer     | 없음                   | 읽기 전용 finding | review record     |

## 최종 검증

- 명령: `npm run verify:week3`
- 상태: 실행 후 실제 결과로 교체
- 미해결 위험: 없음 또는 구체적으로 기록

`완료`와 `미검증`을 같은 의미로 사용하지 않습니다. 실행하지 않은 외부 연동은 선택 부록으로 분리합니다.
