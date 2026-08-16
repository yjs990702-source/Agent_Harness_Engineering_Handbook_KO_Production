# 3주차 · 서비스 배포와 Contest Day

Deep Interview 결과를 서비스 명세로 바꾸고, 하네스·루프를 이용해 작은 HTTP 서비스를 구현한 뒤 배포 Evidence와 Contest 점수표까지 완성합니다.

## 학습 결과

- 1페이지 명세와 고정 수용 기준 ID를 만든다.
- 외부 입력을 `unknown`에서 검증한다.
- SQL 공격 문자열을 parameter 값으로 격리한다.
- 사용자·모델 출력을 HTML이 아닌 `textContent` 데이터로 렌더링한다.
- Secret 값 없이 로컬·Preview·Production 배포 manifest를 만든다.
- Production에는 사람 승인이 없으면 실패한다.
- 기능 점수와 즉시 중단 Gate를 분리한 Contest 평가를 수행한다.
- 위임·자율권·증거·인계 산출물을 연결하고 criterion별 Evidence가 빠지면 출고를 중단한다.
- `https:` URL과 nonce 기반 CSP를 검증하고 위험한 URL scheme을 거부한다.

## 5시간 진행 순서

| 시간        | 강의·실습                     | 완료 증거                  |
| ----------- | ----------------------------- | -------------------------- |
| 00:00~00:40 | Deep Interview와 1페이지 명세 | `spec.test.ts`             |
| 00:40~01:20 | 빈 저장소 제로 세팅           | AGENTS·verify 기준선       |
| 01:20~02:35 | TDD 기반 서비스 구현          | service·API 테스트         |
| 02:35~03:35 | 보안 Gate와 배포 manifest     | security·deployment 테스트 |
| 03:35~04:10 | Commit→PR→Review              | Evidence가 있는 PR 초안    |
| 04:10~04:50 | Contest Day                   | 100점 점수와 Gate 결과     |
| 04:50~05:00 | 제로 세팅 정리·이식           | 30일 계획                  |

## 실행

저장소 루트에서 실행합니다.

```powershell
npm ci
npm run verify:week3
npm run verify
```

정상 결과는 typecheck, 12개 이상의 테스트, build가 모두 통과하는 것입니다. 외부 API key, DB, 배포 계정은 필요하지 않습니다.

## 로컬 기본 경로

- `src/spec.ts`: Deep Interview 입력을 검증 가능한 명세로 변환
- `src/service.ts`: 최소 업무요청 기능
- `src/security.ts`: parameter binding과 text-only UI 계약
- `api/`: 배포 가능한 health·request HTTP 경계
- `src/deployment.ts`: Secret 값 없는 배포 Evidence
- `src/contest.ts`: 점수와 실격 Gate 분리
- `src/delivery-artifacts.ts`: DelegationBrief·AutonomyPolicy·EvidencePack·ContinuationPack
- `public/index.html`: raw HTML API를 사용하지 않는 최소 화면

`deployment-manifest.example.json`은 실제 배포가 아니라 로컬 대체 증거입니다. commit SHA, 변수 이름, 검증 명령, rollback 조건만 기록하며 Secret 값은 넣지 않습니다.

## 선택형 Supabase·Vercel 경로

학습자 개인 또는 교육용 샌드박스만 사용합니다.

1. `.env.example`의 변수 이름을 플랫폼에 등록합니다. 실제 값은 파일에 적지 않습니다.
2. Supabase MCP는 개발 전용 프로젝트·최소 권한·가능하면 read-only로 연결합니다.
3. `npm run verify:week3`를 통과한 commit에서 Vercel Preview를 만듭니다.
4. `/api/health`와 정상·오류·공격 문자열 시나리오를 확인합니다.
5. Preview URL, commit SHA, 검증 로그, rollback 조건을 PR에 기록합니다.
6. Production 승격은 사람 승인 뒤에만 수행합니다.

계정이나 권한이 없으면 여기서 배포를 시도하지 않습니다. 로컬 manifest와 테스트 로그가 동일한 수료 Evidence입니다.

## 즉시 중단 조건

- Secret이 코드·로그·스크린샷·manifest에 노출됨
- 실제 고객·운영 데이터 사용
- SQL 문자열 연결 또는 raw HTML 렌더링
- 수용 테스트·회귀 검증 실패
- 승인 없는 Production 배포

## 수료 제출물

1. `SPEC-W3`와 AC-01~05
2. 실패→구현→통과 테스트 기록
3. `npm run verify:week3` 결과
4. Preview URL 또는 로컬 deployment manifest
5. PR Review·Verifier 결과
6. Contest 점수표와 Gate 판정
7. 30일 도메인 이식 계획
8. [증거 기반 서비스 출고](lessons/09-evidence-driven-delivery.md)의 4종 산출물
