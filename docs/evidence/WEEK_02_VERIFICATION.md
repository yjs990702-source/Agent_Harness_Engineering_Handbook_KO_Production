# 2주차 검증 증거

검증일: 2026-08-16 (Asia/Seoul)

## 환경과 기준

- Windows PowerShell
- Node.js `v24.12.0`, npm `11.6.2`
- branch `agent/weekly-labs`
- start tag `week2-start`
- dependency audit: 0 vulnerabilities after `esbuild 0.28.1` override

## Red

`week2-start`의 Hook은 정확한 `.env`만 차단하고 변형 이름을 놓치도록 구성했습니다.

```powershell
npm run test --workspace=@handbook/week-02-loop-engineering
```

- 4 test files 중 3개 통과, 1개 실패
- 19 tests 중 17개 통과, 2개 실패
- 실패 사례: `.env.production`, `config/.env.local`이 잘못 `allow`됨

## Green

환경 파일 basename을 경로 어느 위치에서든 `.env` 또는 `.env.*` 패턴으로 인식하도록 수정했습니다.

```powershell
npm run verify:week2
```

- strict TypeScript: 통과
- Vitest: 4 files, 19 tests 통과
- library build: 통과
- Hook allow fixture: `allow`
- Hook secret fixture: `block` / `환경변수 파일 변경 금지`

## 검증한 루프 경계

- 소유권 밖·민감 경로·누락/실패 evidence의 deterministic 거부
- Evaluator가 Verifier 실패를 PASS로 덮어쓰지 못함
- 첫 실패 feedback을 다음 repair에 전달
- 동일 failure signature 2회 반복 시 조기 중단
- `maxRepairs` 0~2 제한
- 부모/자식 owned path 충돌과 shell metacharacter 거부

## 외부 미검증

실제 Claude Code 등 제품별 Hook 설정 연결과 실제 worktree 생성·fan-in은 제품 버전·임시 Git 저장소가 필요한 수동 실습으로 남깁니다. 이 항목은 로컬 정책 코드 완료와 구분합니다.
