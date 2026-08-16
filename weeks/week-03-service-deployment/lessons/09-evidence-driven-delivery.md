# 09 · 증거 기반 서비스 출고

## 목표

명세에서 배포까지 이어지는 위임·자율권·증거·인계 산출물을 완성합니다.

- `DelegationBrief`: 목표, 비목표, owned path, 수용 기준, 반환 계약
- `AutonomyPolicy`: 허용 도구, 금지 경로, 승인 대상, 시간·repair·호출 budget
- `EvidencePack`: commit, 변경 파일, criterion별 증거, 위험, rollback
- `ContinuationPack`: 완료/미완료, 결정, 다음 안전 행동

## 출고 Gate

모든 수용 기준에 통과 증거가 있고, 보안 증거와 변경 파일, rollback이 존재해야 합니다. SQL 공격 문자열은 query text가 아니라 bind value에만 남아야 하며, XSS 문자열은 `textContent` 데이터로 유지합니다. 외부 URL은 `https:` allowlist를 통과하고 CSP는 nonce 기반이어야 합니다.

```powershell
npm run test --workspace=@handbook/week-03-service-deployment -- --run tests/delivery-artifacts.test.ts tests/security.test.ts
npm run verify:week3
```

Production은 이 테스트가 통과해도 자동 실행하지 않습니다. 실제 외부 쓰기와 비용 발생 작업에는 사람 승인이 필요합니다.
