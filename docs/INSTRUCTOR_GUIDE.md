# 강사용 운영 가이드

## 진행 원칙

정답 코드를 먼저 보여주지 않습니다. 실패를 재현하고 학습자가 필요한 경계와 Evidence를 말하게 한 뒤 최소 구현으로 이동합니다. 모델의 설명은 증거로 채점하지 않습니다.

## 개강 전 확인

1. 새 clone에서 `npm ci`와 `npm run verify`를 실행합니다.
2. 조직 AI·코드 반출·외부 MCP·로그 보존 정책을 확인합니다.
3. Supabase·Vercel은 선택임을 알리고 로컬 대체 Evidence를 준비합니다.
4. 실제 고객 데이터·Secret·운영 DB·승인 없는 Production 배포를 금지합니다.
5. 기준 저장소는 `main`, PR 실습은 학습자 fork 또는 별도 연습 저장소로 분리합니다.
6. [시연 Runbook](INSTRUCTOR_DEMO_RUNBOOK.md)의 시작 Gate와 [예상 실패 지도](EXPECTED_FAILURES.md)를 준비합니다.

## 권장 시간

| 주차  | 개념·시범 |  실습 | 검증·회고 | 합계 |
| ----- | --------: | ----: | --------: | ---: |
| 1주차 |      70분 | 130분 |      40분 |   4H |
| 2주차 |      80분 | 125분 |      35분 |   4H |
| 3주차 |      85분 | 165분 |      50분 |   5H |

## 1주차 개입 지점

- Rule과 Skill이 중복되면 항상 로드되는 사실·제약과 호출형 절차로 다시 분류합니다.
- 학습자가 모델의 완료 보고를 믿으면 실패 테스트·diff·새 세션 재현을 요구합니다.
- TDD에서 assertion을 약화하면 원래 수용 기준 ID로 돌아갑니다.
- 최소 루프에서 모델의 tool call 제안과 실제 `execute`를 분리해 설명합니다. 1주차에는 부작용 도구를 실행하지 않습니다.
- PR Skill은 초안만 만들며 게시·push 같은 외부 쓰기를 수행하지 않습니다. MCP는 합성 descriptor로 먼저 권한과 schema를 검증합니다.

## 2주차 개입 지점

- Hook denylist가 충분하다고 하면 위험 명령 변형과 비정상 경로 fixture를 실행합니다.
- 역할이 겹치면 구현보다 입력·출력·금지 행동 표를 먼저 고칩니다.
- Worktree 충돌이 발생하면 owned path와 dependency를 다시 설계합니다.
- 같은 실패가 반복되면 prompt를 늘리지 않고 repair cap과 TaskSpec을 확인합니다.
- Cross-Model Evaluator는 선택이며 결정적 테스트를 대체하지 않는다고 설명합니다.
- 승인 실습은 `approval_requested`에서 프로세스를 끊고 event를 다시 읽어 재개하게 합니다. 단순 함수 호출로 승인 단계를 건너뛰지 않습니다.
- Worktree 실습은 실제 명령을 실행하지 않는 dry-run으로 base·branch·경로·ownership을 먼저 검토합니다.
- 하네스 다이어트는 줄 수가 아니라 항목 수와 검증 누락률의 전후 Evidence로 판정합니다.
- 복잡한 후보가 단순 기준선보다 나은지 4축 점수와 안전 Gate를 함께 비교합니다.

## 3주차 개입 지점

- 요구사항이 모호하면 기능 구현을 멈추고 Deep Interview의 열린 질문으로 돌립니다.
- SQL 공격 문자열이 query text에 보이면 parameter binding 테스트부터 고칩니다.
- UI가 문자열을 HTML로 해석하면 textContent 경계로 되돌립니다.
- Secret·운영 데이터·실제 고객 정보가 보이면 즉시 중단하고 폐기·회전 절차를 따릅니다.
- 클라우드 권한이 없으면 배포를 강요하지 않고 로컬 manifest와 테스트 로그로 채점합니다.
- Contest는 기능 수가 아니라 명세 추적성, 안전, 복구, Evidence를 우선합니다.
- EvidencePack에 criterion별 통과 증거가 하나라도 빠지면 Preview 출고를 중단합니다.
- `javascript:`·`data:` URL과 nonce 없는 script 정책을 XSS 회귀 사례로 사용합니다.
- SQL 정렬 column·direction 공격, 저장형·반사형·DOM XSS, credential 포함 URL, wildcard CSP를 함께 실행합니다.
- `ready_to_ship`에 pending이 남거나 release commit identity가 다르면 출고를 중단합니다.

## Contest Day

| 영역               | 배점 |
| ------------------ | ---: |
| 문제·요구사항 명세 |   15 |
| 하네스 설계        |   20 |
| 루프·Evaluator     |   20 |
| 기능 완성도        |   20 |
| 배포·보안·운영     |   15 |
| PR·문서·데모       |   10 |

Secret 노출, 실제 운영 데이터 사용, 파괴적 변경, 승인 없는 Production 배포, 검증 우회는 점수와 무관한 즉시 중단 Gate입니다. 동률이면 더 적은 권한, 더 작은 하네스, 더 명확한 rollback을 우선합니다.

## 수업 종료

학습자는 자신의 도메인에 이식할 반복 실패 하나, 소유자, 30일 일정, 효과 지표, 제거 기준을 제출합니다. 교육 코드를 회사 저장소로 그대로 복사하지 않고 제어 원리와 수용 기준을 다시 설계하게 합니다.

선택 멀티에이전트에서 역할 수를 늘리는 것을 성과로 채점하지 않습니다. 단일 worker 유지 근거, 독립 작업 수, 컨텍스트 격리 필요성, owned path, fan-in 비용을 먼저 제출하게 합니다.

학습자 제출은 [Evidence 양식](LEARNER_EVIDENCE_TEMPLATE.md)으로 통일하며, 실제 실행하지 않은 명령과 통과한 명령을 구분해 기록하게 합니다.

## Python Companion 운영

- 13시간을 늘리지 않으면 최소 루프, approval·Evaluator, Interview·SQL 블록만 Python으로 교체합니다.
- AGENTS·Rule·Skill, Hook·Worktree, DOM XSS·Vercel 설명은 기존 TypeScript 자료를 유지합니다.
- 수업 전 Python 3.11+, 격리 venv, `python-labs[dev]` 설치와 `npm run verify:python`을 확인합니다.
- `ModuleNotFoundError`가 나면 패키지를 다시 설치하기 전에 현재 interpreter 경로와 venv 활성 여부를 먼저 비교합니다.
- Python 결과를 브라우저 XSS 방어 Evidence로 인정하지 않습니다. `textContent`, URL, CSP 테스트를 별도로 확인합니다.
- 수료 Evidence에 language, Python version, interpreter, fixture ID를 추가합니다.
