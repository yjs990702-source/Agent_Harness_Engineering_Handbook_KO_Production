# Task · 3주차 서비스 배포 실습

## 목표

`SPEC-W3`의 AC-01~05를 로컬에서 재현하고 위임·자율권·배포 Evidence·인계와 Contest 판정을 남긴다.

## 범위

- 변경 가능: `weeks/week-03-service-deployment/**`
- 금지: 실제 Secret, 고객 데이터, 운영 URL, 승인 없는 Production 배포

## Evidence

- `npm run verify:week3`
- `deployment-manifest.example.json`
- security·API·Contest 테스트
- DelegationBrief·AutonomyPolicy·EvidencePack·ContinuationPack

## 중단 조건

- Secret 또는 내부 정보 노출
- SQL 문자열 연결·raw HTML API
- 같은 실패의 반복 또는 요구사항 불명확
- criterion 통과 증거 또는 rollback 누락
