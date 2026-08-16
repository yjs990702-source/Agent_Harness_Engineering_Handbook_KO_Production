# 3주차 검증 증거

검증일: 2026-08-16 (Asia/Seoul)

## 환경과 기준

- Windows PowerShell
- Node.js `v24.12.0`, npm `11.6.2`
- branch `agent/weekly-labs`
- source tag `week3-multi-agent-solution`
- 외부 모델·클라우드 계정·운영 데이터 사용 없음

## 학습 목표

3주차는 웹 서비스 구현이 아니라 하네스 중심 멀티 에이전트 협업을 검증합니다.

```text
Request → Planner → UI Worker ┐
                  Logic Worker ┴→ Test Worker → read-only Reviewer → Verifier
```

- Planner: 역할·dependency·owned path가 있는 결정적 DAG 생성
- UI/Logic Worker: 충돌하지 않는 범위에서 같은 wave로 병렬 실행
- Test Worker: 두 구현 결과가 준비된 뒤 통합 증거 생성
- Reviewer: 읽기 전용 finding만 반환
- Verifier: 코드·테스트·정책 증거를 독립 규칙으로 최종 판정

## 실행 결과

```powershell
npm run verify:week3
```

- strict TypeScript lint/typecheck: 통과
- Vitest: 4 files, 22 tests 통과
- TypeScript build: 통과
- 종료 코드: 0

## 핵심 계약 증거

- 중복 node ID, 없는 dependency, cycle이 있는 DAG는 실행 전 거부됩니다.
- `src/ui`와 `src/logic`은 같은 wave에서 실행할 수 있지만 상하위 경로 충돌은 거부됩니다.
- Test Worker는 UI·Logic 결과를 모두 요구하며, Reviewer는 파일 변경을 반환할 수 없습니다.
- handoff는 base revision, 변경 경로, evidence ID, 결정, 미해결 위험을 보존합니다.
- Verifier는 node 결과·owned path·Reviewer 읽기 전용·handoff·review evidence를 모두 확인한 뒤에만 `passed=true`를 반환합니다.
- 합성 fixture와 결정적 로컬 규칙만 사용하므로 모델 provider나 secret 없이 재현됩니다.

## 선택 웹 부록과의 경계

기존 Next.js·Supabase·Vercel 실습은 `optional/web-service-extension`으로 이동했습니다. SQL Injection·XSS·CSRF·브라우저 회귀 검증은 유지하지만 3주차 핵심 점수와 외부 계정 없는 재현을 막지 않습니다. 과거 `week3-start`, `week3-solution`, `reference-solution` tag는 이 선택 부록의 이력 보존 기준점입니다.
