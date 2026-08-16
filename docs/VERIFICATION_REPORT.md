# 공개 실습 저장소 검증 보고서

## 검증 기준

- 검증일: 2026-08-17 (Asia/Seoul)
- 운영체제: Windows
- Node.js: 24.12.0
- npm: 11.6.2
- 설치: `package-lock.json` 기준 `npm ci`
- 외부 모델·DB·배포 계정: 사용하지 않음

## 결과

| 항목           | 결과 | 증거                                                                |
| -------------- | ---- | ------------------------------------------------------------------- |
| 저장소 범위    | PASS | 필수 파일 22개, TypeScript/JavaScript source 28개, 범위 밖 파일 0개 |
| GitHub Actions | PASS | workflow 0개                                                        |
| 포맷           | PASS | Prettier 전체 일치                                                  |
| lint·타입      | PASS | 3개 workspace 모두 `tsc --noEmit` 통과                              |
| 테스트         | PASS | 테스트 파일 9개, 테스트 56개, skip 0개                              |
| 빌드           | PASS | 3개 workspace 모두 통과                                             |
| 의존성 감사    | PASS | 취약점 0건                                                          |

주차별 테스트 수는 1주차 10개, 2주차 16개, 3주차 30개다.

## 이번 보강에서 확인한 실패 fixture

- Hook: `git clean`, Unix·PowerShell 재귀 삭제, 명령 연결, 강제 push, 중첩 `.git`, `.env*`, workflow, 상위 경로
- DAG: 빈 계획, 중복 node, 중복·누락 dependency, cycle, owned path 충돌
- Reviewer: UI·Logic·Test 전체 fan-in, 변경 파일이 있으면 `READ_ONLY_WRITE`
- Verifier: 비정상 경로, 결과 누락·중복·계획 밖 결과, 실패 Evidence, criterion 오류·누락, handoff ID 불일치, stale base revision

## 재현 명령

```powershell
npm ci
npm run verify
npm audit
```

이 결과는 합성 fixture 기반 교육 계약의 재현성을 뜻한다. 외부 LLM 품질, 실제 데이터베이스와 배포 환경은 검증 범위가 아니다.
