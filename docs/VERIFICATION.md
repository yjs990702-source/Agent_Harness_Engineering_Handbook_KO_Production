# 로컬 검증 가이드

## 전체 검증

```powershell
npm ci
npm run doctor
npm run verify
```

`verify`는 공개 범위, GitHub Actions 부재, format, 모든 workspace의 lint·typecheck·test·build를 순서대로 실행합니다. 외부 모델·DB·배포 계정은 사용하지 않습니다.

## 과정별 검증

```powershell
npm run verify:week1
npm run verify:week2
npm run verify:week3
npm run verify:multi-agent
```

`verify:week1`은 입력·tenant·오프라인 최소 루프와 PR Skill·tool contract의 schema·권한·승인을 검사합니다. `verify:week2`는 Hook·독립 검증·repair, 승인 event replay, Worktree dry-run, 하네스 다이어트와 4축 기준선을 검사합니다. `verify:week3`는 Deep Interview, service·API, SQL parameter binding·식별자 allowlist, text-only UI, URL·CSP·공개 오류, 4종 출고 산출물과 release identity, 배포 manifest, Production 승인, Contest Gate를 검사합니다. `verify:multi-agent`는 기본 과정 뒤의 DAG·토폴로지·부분 실패·fan-in 선택 심화입니다.

## 보강 실습 focused test

```powershell
npm run test --workspace=@handbook/week-01-foundations -- --run tests/minimal-loop.test.ts
npm run test --workspace=@handbook/week-01-foundations -- --run tests/tool-contract.test.ts
npm run test --workspace=@handbook/week-02-loop-engineering -- --run tests/approval-loop.test.ts tests/worktree-plan.test.ts tests/harness-inventory.test.ts
npm run test --workspace=@handbook/week-03-service-deployment -- --run tests/interview.test.ts tests/delivery-artifacts.test.ts tests/security.test.ts
npm run test --workspace=@handbook/extension-multi-agent -- --run tests/topology.test.ts tests/coordinator.test.ts tests/verifier.test.ts
```

## 기대 결과 기록

```text
환경: OS / Node / npm
기준: main commit SHA
명령: npm run verify:weekN
결과: test file 수 / test 수 / build 결과
배포 증거: Preview URL 또는 local deployment manifest
남은 위험: 계정·권한·실제 Production 미검증 항목
```

## 오류 확인 순서

1. `node --version`과 `npm --version`을 확인합니다.
2. `npm ci`로 lockfile과 같은 의존성을 설치합니다.
3. 실패한 과정의 focused test를 실행합니다.
4. 첫 실제 오류를 수정하고 같은 명령을 반복합니다.
5. 해당 과정 verify 뒤 루트 `npm run verify`로 회귀를 확인합니다.

생성된 `dist`만 정리할 수 있으며 저장소 전체나 다른 사용자의 파일을 재귀 삭제하지 않습니다. 테스트 skip, assertion 약화, Secret 추가, 승인 없는 외부 배포로 문제를 우회하지 않습니다.

강의 순서별 시연은 [강사용 Runbook](INSTRUCTOR_DEMO_RUNBOOK.md), 실패 code의 의미는 [예상 실패 지도](EXPECTED_FAILURES.md), 수용 기준 제출은 [학습자 Evidence 양식](LEARNER_EVIDENCE_TEMPLATE.md)을 사용합니다.

## 학습용 시나리오 검증

```powershell
npm run demo:python -- minimal-loop
npm run demo:python -- unknown-tool
npm run demo:python -- approval-expired
npm run demo:python -- sql-attack
npm run demo:python -- release-not-ready
```

각 명령의 `RESULT PASS`는 정상 결과 또는 기대한 안전 거부를 의미합니다. 전체 시나리오는 `npm run demo:python -- all`, 예상 문자열은 [예상 출력](EXPECTED_OUTPUTS.md)에서 확인합니다.

## 클라우드 선택 경로

실제 Preview는 학습자 소유 샌드박스에서 사람이 승인한 경우에만 실행합니다. Codex 또는 자동화가 배포·외부 쓰기·비용 발생을 임의로 수행하지 않습니다. 계정이 없으면 `deployment-manifest.example.json`과 테스트 로그를 사용합니다.

## Python Companion 검증

```powershell
py -3.11 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -e ".\python-labs[dev]"
npm run verify:python
npm run verify:all
```

`verify:python`은 Ruff → mypy strict → pytest → compileall 순서입니다. `verify:all`은 기존 TypeScript 3주 과정과 Python 공통 계약을 함께 회귀 검증합니다. Python이 없는 기본 수강자는 `npm run verify`를 계속 사용할 수 있지만 공개 릴리스 담당자는 `verify:all`을 통과해야 합니다.
