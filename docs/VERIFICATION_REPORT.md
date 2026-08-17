# 공개 교육 실습 저장소 검증 보고서

## 검증 기준

- 검증일: 2026-08-17 (Asia/Seoul)
- 운영체제: Windows
- Node.js: 24.12.0
- npm: 11.6.2
- Python: 3.12.1 (지원 기준 3.11+)
- Python 검증 도구: pytest 8.4.1, Ruff 0.12.10, mypy 1.17.1
- 설치: `package-lock.json` 기준 `npm ci`
- 외부 모델·DB·배포 계정: 기본 검증에는 사용하지 않음
- 검증 범위: 저장소 원본과 `node_modules` 없는 새 복제본

## 결과

| 항목                | 결과 | 증거                                                      |
| ------------------- | ---- | --------------------------------------------------------- |
| 저장소 공개 범위    | PASS | 필수 파일 100개, 강의 45개, source 84개, 범위 밖 파일 0개 |
| GitHub Actions 금지 | PASS | workflow 0개                                              |
| 공개 라이선스       | PASS | 교육 코드·문서 Apache-2.0, 출판 원고·내부 자료 제외       |
| 포맷                | PASS | Prettier 전체 일치                                        |
| lint·타입 검사      | PASS | 4개 workspace 모두 `tsc --noEmit` 통과                    |
| TypeScript 테스트   | PASS | 테스트 파일 24개, 테스트 122개, skip 0개                  |
| Python 검증         | PASS | Ruff·mypy strict·compileall, pytest 41개, skip 0개        |
| 빌드                | PASS | 4개 workspace 모두 통과                                   |
| 의존성 감사         | PASS | `npm audit` 취약점 0건                                    |
| 새 환경 재현        | 예정 | clean clone에서 Node·Python을 새로 설치한 뒤 최종 확인    |

TypeScript 과정별 테스트 수는 1주차 19개, 2주차 36개, 3주차 서비스 배포 31개이며, 선택 심화 멀티 에이전트는 36개다. Python Companion은 Week 1·2·3과 선택 심화를 합쳐 41개다.

## 과정별 완료 증거

- 1주차: Rule·Skill·중첩 `AGENTS.md`·PR 초안 계약·오프라인 MCP tool contract·TDD 기능 구현
- 2주차: Hook·승인 event replay·Worktree dry-run·하네스 다이어트·evaluator·작업 인계
- 3주차: 열린 질문 명세·SQL 식별자 allowlist·XSS/URL/CSP·release identity·배포 manifest
- 선택 심화: 단일 worker 기준선·bounded fan-out·부분 실패/timeout·Reviewer fan-in 검증
- Python Companion: dataclass Tool Contract·pure approval reducer·pytest TDD·DB-API binding·release Evidence·bounded asyncio fan-out
- 공통 계약: tool·approval·security·release JSON fixture를 TypeScript와 Python이 같은 failure code로 판정

## 이번 보강에서 확인한 실패 fixture

- Hook: `git clean`, Unix·PowerShell 삭제, 명령 연결, 강제 push, 중첩 `.git`, `.env*`, workflow, 상위 경로
- DAG: 빈 계획, 중복 node, 중복·누락 dependency, cycle, owned path 충돌
- Reviewer: UI·Logic·Test 전체 fan-in, 변경 파일이 있으면 `READ_ONLY_WRITE`
- Verifier: 비정상 경로, 결과 누락·중복·과잉 및 거짓 결과, 실패 Evidence, criterion 오류·누락, handoff ID 불일치, stale base revision
- 서비스 보안: 매개변수화 SQL 계약, HTML 문자열 결합 금지, 비밀값 누출 방지, 허용된 배포 환경만 수락
- 최소 루프: 알 수 없는 검증기, 실패 검증, 수리 예산 소진, 증거가 없는 완료 선언 차단
- 승인 루프: 승인 없는 부작용 실행, stale 승인 토큰, 승인 대상 불일치, 재개 checkpoint 누락 차단
- Worktree·다이어트: 미확정 base, 절대·상위 경로, 부모–자식 ownership, 근거·제거 조건 누락 차단
- 평가 포트폴리오: 필수 축 누락, blocking finding 우회, 가중치 합계 오류 차단
- 배포 증거: criterion→test→artifact→review→approval→rollback 연결, 위험 URL scheme, 약한 CSP 차단
- 보안 회귀: 동적 SQL 식별자, 저장형·반사형·DOM XSS, credential URL, 민감한 공개 오류 차단
- 토폴로지 선택: 단일 기준선 미달, 부모–자식 경로 충돌, 부분 실패·timeout, fan-in ID 누락 차단
- 자료 경계: DOCX·PDF·HWP·PPTX·XLSX·캡처 출판 파일과 저자·이력·회사 내부 문서 경로를 저장소 검사에서 거부

## 재현 명령

```powershell
npm ci
npm run verify
npm run verify:python
npm run verify:all
npm audit
```

이 결과는 합성 fixture 기반 교육 계약의 재현성을 확인한다. 외부 LLM의 실제 응답 품질, 실제 데이터베이스 권한, Vercel·Supabase 계정 및 네트워크 상태는 배포자의 환경에서 별도로 검증해야 한다.
