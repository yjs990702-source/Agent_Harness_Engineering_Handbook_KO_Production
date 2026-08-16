# 3주 실습 커리큘럼

## 공통 러닝 케이스

팀원이 합성 업무요청을 등록하고 담당자·상태·기한을 관리하는 작은 서비스를 만듭니다. 기능의 수보다 명세→실패 재현→구현→독립 검증→출고 증거의 연결을 우선합니다.

## 1주차 · 기초 하네스와 TDD

학습 결과:

- root/module AGENTS와 Claude 브리지, path-scoped Rule의 역할을 구분합니다.
- 수동 발동 PR Skill로 부작용을 통제합니다.
- 제목 3자 이상, tenant 격리 수용 기준을 실패 테스트와 구현으로 연결합니다.
- 같은 commit의 focused test와 전체 회귀 결과를 기록합니다.

실행 폴더: `weeks/week-01-foundations`

## 2주차 · 루프 엔지니어링

학습 결과:

- 민감 파일·위험 명령을 PreToolUse Hook으로 차단합니다.
- Planner→Worker→deterministic Verifier→independent Evaluator의 책임을 분리합니다.
- 반복 실패 signature와 repair hard cap으로 무한 루프를 중단합니다.
- worktree 파일 소유권을 검증하고 `.agents` 문서로 인계합니다.

실행 폴더: `weeks/week-02-loop-engineering`

## 3주차 · 서비스와 출고

학습 결과:

- Next.js UI와 Route Handler로 업무요청 생성·목록·상세 흐름을 구현합니다.
- memory adapter로 로컬 실행하고 선택적으로 Supabase/RLS adapter를 연결합니다.
- SQL Injection, tenant 우회, XSS, CSRF 공격 사례를 테스트합니다.
- lint·typecheck·unit·component·E2E·build와 Preview/Production 수동 gate를 구분합니다.

실행 폴더: `weeks/week-03-production-service`

## 프로덕션 확장과 연결

3주 과정 이후 기존 Project Aegis 기준선의 Run state, TaskSpec/Evidence/Verdict, event hash chain, checkpoint/outbox/lease, hash-bound approval, Tool Gateway, sandbox, golden evaluation, release manifest를 순서대로 확장합니다. 교육 앱에 모든 기능을 한꺼번에 넣지 않고 각 실습의 실패 모드와 증거를 먼저 확보합니다.
