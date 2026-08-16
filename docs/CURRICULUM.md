# 3주 실습 커리큘럼

핵심 과정의 상세 흐름은 [하네스 중심 학습 경로](CURRICULUM_HARNESS_FIRST.md)를 기준으로 합니다.

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

## 3주차 · 멀티 에이전트 협업

학습 결과:

- UI Worker와 Logic Worker의 owned path를 분리하고 같은 wave에서 병렬 실행합니다.
- DAG dependency·누락·cycle을 실행 전에 검증합니다.
- Test Worker가 두 구현 결과의 handoff와 evidence를 받아 통합 검증합니다.
- 읽기 전용 Reviewer와 결정적 Verifier가 변경 경로·evidence·handoff를 독립 판정합니다.

실행 폴더: `weeks/week-03-multi-agent`

## 선택형 웹·보안 확장

3주 과정 이후 `optional/web-service-extension`에서 Next.js UI, API, Supabase/RLS 선택 adapter, SQL Injection·XSS·CSRF 방어와 브라우저 E2E를 실습할 수 있습니다. 이 부록은 회사의 실제 개발 구조를 재현하지 않으며 외부 계정 없이도 memory adapter로 실행됩니다.
