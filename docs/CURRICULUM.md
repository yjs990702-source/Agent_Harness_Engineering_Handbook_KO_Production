# 현직자를 위한 하네스 완성 3주 과정

기초 하네스 구축 → 루프 엔지니어링·리팩토링 → 서비스 배포와 Contest Day까지 총 13시간 과정입니다. 기능 수보다 요구사항 추적성, 안전 경계, 실패 종료, 독립 검증과 재현 가능한 Evidence를 우선합니다.

## 선수 지식과 준비

- Git branch·commit·diff의 기본 개념
- 터미널에서 Node.js 프로젝트를 실행하고 테스트한 경험
- TypeScript 또는 유사 언어, HTTP·환경변수의 기초
- 회사 데이터·AI 사용 정책과 외부 서비스 권한 확인

외부 계정은 선택입니다. 기본 실습은 합성 데이터와 로컬 fixture만으로 완결됩니다.

## 1 WEEK · Rule·Skill 기반 기초 하네스 구축 (4H)

### 핵심 학습

- Claude Code 핵심 조작과 작업 요청의 7요소
- 하네스 구성요소와 MCP 신뢰 경계
- 하네스가 없는 에이전트의 범위 이탈·누락·증거 부족 비교
- model–harness–environment 경계와 오프라인 최소 도구 루프
- AGENTS.md 중첩 구조와 CLAUDE.md 브리지
- Rule·Skill 분리와 PR 생성 Skill
- 수용 기준→실패 테스트→최소 구현→회귀 검증 TDD
- 기초 하네스와 GitHub 흐름 통합 실습

### 4시간 흐름

| 시간        | 활동                       | 완료 증거             |
| ----------- | -------------------------- | --------------------- |
| 00:00~00:35 | 최소 루프·하네스 전후 비교 | trace·baseline 비교표 |
| 00:35~01:10 | Claude Code·MCP            | 도구·권한 기록        |
| 01:10~02:15 | AGENTS·Rule·Skill          | 지침 파일·PR Skill    |
| 02:15~03:10 | TDD                        | Red→Green 로그        |
| 03:10~03:50 | Commit·PR 초안             | diff·테스트 Evidence  |
| 03:50~04:00 | 회고·과제                  | 확장 계약             |

과제: 프로젝트의 반복 실수 3개를 찾아 AGENTS.md·Rule·Skill의 올바른 위치에 반영합니다.

## 2 WEEK · 루프 엔지니어링과 하네스 리팩토링 (4H)

### 핵심 학습

- Hook을 이용한 강제 검증과 민감 파일 보호
- Sub-agent 역할·도구·컨텍스트 격리
- Worktree와 owned path 기반 병렬 개발
- 결정적 Evaluator와 선택형 Cross-Model Evaluator
- `.agents` task·handoff·Evidence ID
- Supabase MCP 최소 권한 연결과 로컬 대체 fixture
- repair cap·반복 실패 signature·사람 승인 Gate
- event reducer 기반 pause/resume와 중복 부작용 방지
- 단순 기준선 대비 결과·과정·안전·비용 4축 평가
- 강한 모델을 고위험 리뷰에만 쓰는 Advisor Strategy
- 낡은 Rule·중복 설정을 제거하는 하네스 다이어트

### 4시간 흐름

| 시간        | 활동                      | 완료 증거           |
| ----------- | ------------------------- | ------------------- |
| 00:00~00:45 | Hook 실패 fixture         | 허용·차단 로그      |
| 00:45~01:30 | 역할 격리                 | 역할 계약표         |
| 01:30~02:15 | Worktree·owned path       | 소유권·통합 기록    |
| 02:15~03:05 | Evaluator·기준선·4축 평가 | 점수·승격 판정      |
| 03:05~03:35 | 승인 pause/resume·repair  | event·중단 Evidence |
| 03:35~04:00 | handoff·하네스 다이어트   | 인계·전후 지표      |

과제: 하네스 인벤토리를 Keep·Move·Merge·Narrow·Enforce·Delete로 분류하고 중복·낡은 설정을 제거합니다.

## 3 WEEK · 서비스 배포와 Contest Day (5H)

### 핵심 학습

- Deep Interview를 통한 1페이지 요구사항 명세
- Prompt→Context→Harness→Agentic 발전 흐름
- 빈 저장소의 30분 하네스 제로 세팅
- 명세 ID→테스트→코드→Evidence→PR 추적
- Secret·환경변수·parameter binding·XSS 방어
- 로컬 배포 manifest와 선택형 Vercel Preview
- Commit→PR→Review→Verifier 흐름
- 위임·자율권·증거·인계 4종 출고 산출물
- 100점 루브릭과 즉시 중단 Gate가 있는 Contest Day
- 제로 세팅 정리와 30일 도메인 이식 계획

### 5시간 흐름

| 시간        | 활동                   | 완료 증거              |
| ----------- | ---------------------- | ---------------------- |
| 00:00~00:40 | Deep Interview         | SPEC-W3·AC-01~05       |
| 00:40~01:20 | 제로 세팅              | 첫 커밋·verify 기준선  |
| 01:20~02:35 | TDD 서비스 구현        | service·API 테스트     |
| 02:35~03:35 | 보안·배포              | manifest·security test |
| 03:35~04:10 | EvidencePack·PR·Review | 출고 증거·verify 기록  |
| 04:10~04:50 | Contest Day            | 점수·Gate 판정         |
| 04:50~05:00 | 정리·이식              | 30일 계획              |

과제: 최근 반복 실패 한 가지를 자신의 도메인에서 선택하고 제어 위치, 소유자, 효과 지표, 제거 기준을 포함한 운영 PR 계획을 만듭니다.

## 선택 심화 · Multi-Agent DAG

기본 과정 수료 뒤 `weeks/week-03-multi-agent`에서 단일 worker 유지 조건을 먼저 확인한 뒤 DAG, owned path, 2~4개 병렬 wave, 전체 fan-in Reviewer와 독립 Verifier를 학습합니다. 서비스 배포 과정을 대체하지 않습니다.

```powershell
npm run verify:multi-agent
```

## 최종 수료 기준

1. 각 주차 verify와 루트 `npm run verify`가 통과한다.
2. Rule·Skill·Hook·Evaluator가 서로 다른 책임을 가진다.
3. 실패 테스트, diff, review, deployment Evidence가 수용 기준 ID에 연결된다.
4. Secret·고객 데이터·회사 내부 코드가 없다.
5. Preview URL 또는 로컬 대체 manifest와 rollback 조건이 있다.
6. 자신의 도메인에 이식할 것과 제거할 것을 구분한다.
