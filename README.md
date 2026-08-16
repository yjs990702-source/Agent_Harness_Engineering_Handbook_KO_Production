# Agent Harness Engineering Handbook KO · 실습 저장소

《Agent Harness Engineering Handbook KO》의 하네스·멀티 에이전트 3주 과정을 직접 실행하기 위한 공개 실습 코드입니다. 예제는 교육을 위해 새로 작성한 합성 코드와 데이터만 사용하며, 실제 회사 코드·고객 데이터·운영 자격 증명을 포함하지 않습니다.

## 저자

- 김재환 — 저자·기획
- 윤재성 — 공동저자·실습 코드 공동개발자

윤재성 공동저자는 Python·PyTorch·FastAPI 기반 AI/ML 시스템, RAG 파이프라인, LLM 평가 데이터, 웹 풀스택·데이터 분석 경험을 바탕으로 주차별 실습 설계, 공개 예제 구현, 실행 검증과 교육 난이도 조정에 참여합니다. 개인정보를 제외한 출판용 약력과 기여 범위는 [저자 소개](docs/AUTHORS.md)에 정리했습니다.

## 현재 상태

| 범위                            | 상태 | 검증 진입점            |
| ------------------------------- | ---- | ---------------------- |
| 공통 저장소 계약                | 완료 | `npm run verify:repo`  |
| 1주차 · 기초 하네스와 TDD       | 완료 | `npm run verify:week1` |
| 2주차 · Hook·Verifier·병렬 작업 | 완료 | `npm run verify:week2` |
| 3주차 · 멀티 에이전트 협업      | 완료 | `npm run verify:week3` |
| 선택 부록 · 웹 서비스·보안      | 완료 | `npm run verify:web`   |
| 전체 재현 검증                  | 완료 | `npm run verify`       |

완료 상태와 실제 실행 증거는 [개발 상태](docs/STATUS.md), [1주차](docs/evidence/WEEK_01_VERIFICATION.md), [2주차](docs/evidence/WEEK_02_VERIFICATION.md), [3주차](docs/evidence/WEEK_03_VERIFICATION.md) 기록에서 확인합니다. 문서의 `완료` 표시는 같은 변경 집합에서 로컬 검증 명령이 통과한 경우에만 사용합니다.

## 빠른 시작

필수 환경은 Node.js 20.9 이상과 npm 10 이상입니다.

```powershell
npm install
npm run verify
```

주차별 시작 위치와 학습 순서는 [커리큘럼](docs/CURRICULUM.md), 명령별 기대 결과와 장애 해결은 [검증 가이드](docs/VERIFICATION.md)를 따릅니다.

## 선택 부록 UI 미리보기

![업무요청 트래커 desktop](optional/web-service-extension/docs/assets/week-03-dashboard-desktop.png)

desktop·mobile 원본과 재현 명령은 [UI 캡처 문서](optional/web-service-extension/docs/assets/README.md)에 있습니다. 이 UI는 핵심 3주 과정이 아니라 SQL Injection·XSS·CSRF 방어를 확인하는 선택 부록입니다.

## 저장소 구조

```text
.
├─ weeks/
│  ├─ week-01-foundations/       # AGENTS·Rule·Skill·TDD·도메인 코어
│  ├─ week-02-loop-engineering/  # Hook·Verifier/Evaluator·worktree·인계
│  └─ week-03-multi-agent/       # 역할 분리·DAG·병렬 실행·인계·독립 검증
├─ optional/
│  └─ web-service-extension/     # 선택형 Next.js UI·API·보안 실습
├─ docs/                         # 수업 운영·검증·추적성·게시 문서
├─ scripts/                      # GitHub Actions가 아닌 로컬 검증
├─ AGENTS.md                     # 저장소 전체 개발·보안 규칙
└─ CLAUDE.md                     # Claude Code 브리지
```

## 보안 기준

- Backend 데이터 접근은 검증된 타입과 parameter binding/클라이언트 필터 API만 사용합니다. 사용자 입력으로 SQL 문자열을 조립하지 않습니다.
- Frontend는 사용자·모델·도구 출력을 React 텍스트로 렌더링합니다. `dangerouslySetInnerHTML`, DOM HTML sink, `javascript:` URL을 허용하지 않습니다.
- 상태 변경 API는 동일 출처와 CSRF token을 검증합니다.
- 운영 secret, `.env*`, 서비스 역할 키는 커밋하지 않습니다.
- 불필요한 GitHub Actions 기반 CI는 만들지 않습니다. 검증은 재현 가능한 로컬 명령으로 제공합니다.

자세한 보고 절차는 [SECURITY.md](SECURITY.md)를 확인하십시오.

## 브랜치·태그 계약

교육용 기준점은 다음 태그와 검증 브랜치로 고정합니다.

- `baseline-no-harness`: 공통 계약만 있는 최초 기준선
- `week1-start`, `week2-start`: 1·2주차 시작점
- `week1-solution`, `week2-solution`: 1·2주차 검증 완성점
- `week3-multi-agent-solution`: 하네스 중심 3주차 멀티 에이전트 완성점
- `reference-harness-first-v4`: 현재 공개 교재와 일치하는 전체 검증 기준점

기존 `week3-start`, `week3-solution`, `reference-solution`은 교육 과정을 하네스 중심으로 재편하기 전 선택형 웹 서비스 실습의 이력 보존 태그입니다. 현재 3주차 시작은 `agent/weekly-labs`의 `weeks/week-03-multi-agent` README와 과제 명세를 사용합니다.

태그와 실제 commit SHA는 게시 시 [릴리스 매니페스트](docs/RELEASE_MANIFEST.md)에 기록합니다.

## GitHub 게시 상태

대상 저장소는 [yjs990702-source/Agent_Harness_Engineering_Handbook_KO_Production](https://github.com/yjs990702-source/Agent_Harness_Engineering_Handbook_KO_Production)입니다. 현재 작업 계정의 권한과 게시 절차는 [GitHub 게시 가이드](docs/GITHUB_PUBLISHING.md)에 기록합니다.

## 라이선스와 공동저자 정보

코드 라이선스는 권리자 합의 전이므로 아직 확정하지 않았습니다. 공개 재사용 조건이 확정되기 전까지 [라이선스 결정 필요 문서](LICENSE_DECISION_REQUIRED.md)를 릴리스 차단 조건으로 취급합니다. 저자 표기와 코드 기여 범위는 [저자 소개](docs/AUTHORS.md), 공개 가능한 내용의 경계는 [출판 범위](docs/PUBLICATION_SCOPE.md)와 [개발·출판 분리 원칙](docs/DEVELOPMENT_PUBLICATION_BOUNDARY.md)을 따릅니다.
