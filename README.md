# Agent Harness Engineering Handbook KO · 공개 실습

현직자를 위한 3주 하네스 완성 과정의 공개 교육 코드입니다. Rule·Skill 기반 기초 하네스에서 시작해 강제 검증·역할 격리·루프 리팩토링을 거친 뒤, 자신의 명세로 만든 작은 서비스를 로컬에서 검증하고 선택적으로 Preview에 배포합니다.

## 처음 방문했다면

복잡한 폴더부터 읽지 말고 [여기서 시작하세요](START_HERE.md). 아래 세 명령으로 환경, 최소 루프, 오류 코드를 먼저 확인할 수 있습니다.

```powershell
npm ci
npm run doctor
npm run demo:python -- minimal-loop
```

[30분 Quickstart](docs/QUICKSTART_30_MIN.md), [그림 중심 가이드](docs/VISUAL_QUICK_GUIDE.md), [실습 카드](docs/lab-cards/README.md), [명령 치트시트](docs/COMMAND_CHEATSHEET.md)를 원하는 순서로 사용할 수 있습니다.

## 3주 기본 과정

| 주차  | 시간 | 주제                              | 핵심 산출물                                | 검증                   |
| ----- | ---: | --------------------------------- | ------------------------------------------ | ---------------------- |
| 1주차 |   4H | Rule·Skill 기반 기초 하네스       | AGENTS·Rule·PR Skill·TDD Evidence          | `npm run verify:week1` |
| 2주차 |   4H | 루프 엔지니어링과 하네스 리팩토링 | Hook·역할 계약·Evaluator·handoff           | `npm run verify:week2` |
| 3주차 |   5H | 서비스 배포와 Contest Day         | 명세·서비스·보안 Gate·배포 Evidence·점수표 | `npm run verify:week3` |

상세 과정은 [커리큘럼](docs/CURRICULUM.md), 완료 조건은 [실습 수용 기준](docs/LAB_ACCEPTANCE_CRITERIA.md), 강의 운영은 [강사용 가이드](docs/INSTRUCTOR_GUIDE.md)와 [시연 Runbook](docs/INSTRUCTOR_DEMO_RUNBOOK.md)을 따릅니다. 원고 주제와 공개 코드의 대응은 [추적성 매트릭스](docs/BOOK_TO_LAB_TRACEABILITY.md), 제출은 [학습자 Evidence 양식](docs/LEARNER_EVIDENCE_TEMPLATE.md)을 사용합니다.

## 실행

Node.js 20.9 이상과 npm 10 이상이 필요합니다.

```powershell
npm ci
npm run verify
```

외부 모델 API key, DB, 배포 계정 없이 기본 과정이 모두 동작합니다. 결과는 결정적 fixture와 테스트로 판정합니다.

Python 3.11+ 사용자는 약 3시간의 [Python Companion Track](python-labs/README.md)을 선택할 수 있습니다. 언어 선택은 [언어 트랙 가이드](docs/LANGUAGE_TRACK_SELECTION.md), 시간표는 [Python 커리큘럼](docs/PYTHON_TRACK_CURRICULUM.md)을 확인하십시오.

```powershell
py -3.11 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -e ".\python-labs[dev]"
npm run verify:python
npm run verify:all
```

코드를 수정하기 전에 개인 연습지를 만들면 관찰과 Evidence를 한곳에 남길 수 있습니다. `.practice/`는 공개 커밋에서 제외됩니다.

```powershell
npm run lab:new -- approval-reducer
```

## 연구 기반 v11 보강

공개 논문·프로토콜·오픈소스·실무 가이드를 대조해 다음 실습을 추가했습니다. 제3자 원문·도식·코드를 복제하지 않고 교육 목적의 작은 TypeScript 구현으로 새로 작성했습니다.

- 1주차: model–harness–environment 경계, PR Skill, 오프라인 MCP tool contract
- 2주차: replay-safe 승인 상태 머신, Worktree dry-run, 하네스 다이어트, 4축 평가
- 3주차: 열린 질문 기반 명세, SQL 식별자·XSS·CSP 회귀, 교차 검증된 release identity
- 선택 심화: 단일 worker 우선, 2~4개 fan-out, 부분 실패·timeout, Reviewer Evidence fan-in

설계 근거와 권리별 읽기 원칙은 [연구에서 실습으로](docs/RESEARCH_TO_PRACTICE.md)를 참고하십시오.

## 로컬 기본 경로와 선택 경로

- 기본 경로: 합성 데이터, 로컬 TypeScript, HTTP handler, 배포 manifest로 완결합니다.
- 선택 경로: 학습자 개인 또는 교육용 Supabase·Vercel 샌드박스에 연결합니다.
- 대체 증거: 계정이 없으면 Preview URL 대신 로컬 manifest, 테스트 로그, rollback 조건을 제출합니다.
- 승인 Gate: 실제 Production 배포, 외부 쓰기, 비용 발생 작업은 사람의 명시적 승인 없이 수행하지 않습니다.

## 폴더 구조

```text
.
├─ weeks/
│  ├─ week-01-foundations/          # Rule·Skill·AGENTS·TDD
│  ├─ week-02-loop-engineering/     # Hook·role·worktree·evaluator·handoff
│  ├─ week-03-service-deployment/   # spec·service·security·deploy·contest
│  └─ week-03-multi-agent/          # 선택 심화: DAG·owned path·fan-in
├─ python-labs/                      # 선택: Python 계약·pytest·DB-API
├─ shared/contract-fixtures/         # TypeScript·Python 공통 공격 입력
├─ START_HERE.md                     # 초심자 단일 진입점
├─ .agents/                         # task·handoff 교육 예시
├─ .claude/rules/                   # 경로별 안전·테스트 규칙
├─ .claude/skills/pr-draft/         # 외부 쓰기 없는 PR 본문 초안 절차
├─ docs/                            # 과정·실습 카드·그림·운영·검증
└─ scripts/                         # 진단·데모·연습지·공개 범위 검사
```

기존 Multi-Agent 코드는 삭제하지 않고 [선택 심화](weeks/week-03-multi-agent/README.md)로 분리했습니다. 기본 13시간 과정과 혼동하지 않으며 다음 명령으로 따로 검증합니다.

```powershell
npm run verify:multi-agent
```

## 안전 원칙

- 불필요한 GitHub Actions workflow를 만들지 않습니다.
- 실제 개인정보, 자격 증명, 회사 코드, 운영 URL과 설정을 넣지 않습니다.
- SQL 문자열 연결을 금지하고 parameter binding을 사용합니다.
- 사용자·모델 출력은 `textContent`로 렌더링하고 raw HTML API를 사용하지 않습니다.
- 테스트를 skip하거나 assertion을 약화해 Green을 만들지 않습니다.
- Worker의 자기 보고가 아니라 독립 테스트·Reviewer·Verifier Evidence로 완료를 판단합니다.
- 위험한 도구 선택과 실제 부작용 실행 사이에서 멈추며, 승인 token은 run·call·만료 시각에 묶습니다.
- 복잡한 멀티에이전트가 단순 기준선을 결과·과정·안전·비용에서 이길 때만 승격합니다.

## 저장소 운영

공개 기준 자료는 `main`에 통합합니다. Commit→PR→Review 실습은 학습자 fork 또는 별도 연습 저장소에서 수행하며 기준 저장소에 장기 교육 branch를 만들지 않습니다. 변경 전 [기여 가이드](CONTRIBUTING.md)를 읽고 TypeScript 변경은 `npm run verify`, Python 또는 공통 계약 변경은 `npm run verify:all`을 통과시키십시오.

## 저자와 자료 범위

- 김재환 — 저자·기획
- 윤재성 — 공동저자·실습 코드 공동개발

이 저장소에는 공개 교육 코드와 교육 문서만 포함합니다. 도서 원고·편집 파일·표지·이력서·계약 자료와 회사 내부 개발 문서는 포함하지 않습니다.

교육 코드와 교육 문서는 [Apache License 2.0](LICENSE)을 따릅니다. 출판 저작물은 공동저자가 별도로 관리하며 이 라이선스 대상이 아닙니다. 자세한 경계는 [LICENSE_SCOPE.md](LICENSE_SCOPE.md), 제3자 고지는 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)를 확인하십시오.
