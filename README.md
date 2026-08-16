# Agent Harness Engineering Handbook KO · 실습 자료

《Agent Harness Engineering Handbook KO》의 하네스 엔지니어링과 멀티 에이전트 협업을 직접 실행하는 3주 학습 저장소입니다. 모든 예제는 외부 서비스 없이 합성 데이터와 순수 TypeScript로 동작합니다.

## 3주 학습 과정

| 주차  | 주제                      | 배우는 핵심                                | 검증 명령              |
| ----- | ------------------------- | ------------------------------------------ | ---------------------- |
| 1주차 | Single Worker Harness     | TaskSpec·수용 기준·Evidence·테스트         | `npm run verify:week1` |
| 2주차 | Planner–Worker–Verifier   | 역할 분리·repair 상한·독립 판정·인계       | `npm run verify:week2` |
| 3주차 | Multi-Agent Collaboration | DAG·owned path·병렬 wave·Reviewer·Verifier | `npm run verify:week3` |

과정 설명은 [커리큘럼](docs/CURRICULUM.md), 실습 완료 조건은 [수용 기준](docs/LAB_ACCEPTANCE_CRITERIA.md), 실행 오류 해결은 [검증 가이드](docs/VERIFICATION.md)를 따릅니다. 수업을 운영한다면 [강사용 가이드](docs/INSTRUCTOR_GUIDE.md)를 함께 사용하십시오.

## 실행

필수 환경은 Node.js 20.9 이상과 npm 10 이상입니다.

```powershell
npm ci
npm run verify
```

외부 모델 API key와 클라우드 계정은 필요하지 않습니다. 예제 결과는 결정적 fixture와 규칙으로 검증합니다.

## 폴더 구조

```text
.
├─ weeks/
│  ├─ week-01-foundations/       # 한 Worker의 명세·실행·증거
│  ├─ week-02-loop-engineering/  # Planner–Worker–Verifier 루프
│  └─ week-03-multi-agent/       # 역할·DAG·소유권·인계·독립 검증
├─ .agents/                      # Task·handoff 학습 예시
├─ .claude/rules/                # 경로별 안전·테스트 규칙 예시
├─ docs/                         # 커리큘럼·수용 기준·수업·검증 가이드
├─ scripts/                      # 교육 자료 범위와 안전 규칙 검사
└─ AGENTS.md                     # 실습 공통 개발 규칙
```

## 학습 원칙

- 불필요한 GitHub Actions workflow를 만들지 않습니다.
- 실제 개인정보, 자격 증명, 비공개 코드와 운영 설정을 넣지 않습니다.
- 테스트를 삭제·skip하거나 assertion을 약화해 통과시키지 않습니다.
- 사용자·모델 출력을 HTML이나 명령으로 실행하지 않습니다.

## 저자

- 김재환 — 저자·기획
- 윤재성 — 공동저자·실습 코드 공동개발

상세 이력과 출판 계약 자료는 이 교육용 저장소에 포함하지 않습니다.

## 자료 범위와 라이선스

이 저장소에는 도서의 하네스·멀티 에이전트 실습에 필요한 자료만 포함합니다. 제품 코드, 운영 구성, 원고, 기획·개발 문서, 이력서 원본은 저장하지 않습니다. 코드·문서 라이선스는 권리자 합의 전이므로 [라이선스 결정 필요 문서](LICENSE_DECISION_REQUIRED.md)를 확인하십시오.
