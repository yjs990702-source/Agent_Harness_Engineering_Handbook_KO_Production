# 보안 정책

## 지원 범위

`reference-solution` 태그와 최신 주차별 solution 태그를 대상으로 합니다. 교육용 start 태그에는 의도적 결함이 있을 수 있으므로 Production에 배포하지 마십시오.

## 비공개 보고

GitHub 저장소의 Security Advisories 기능을 우선 사용합니다. 기능이 활성화되지 않았다면 저장소 소유자에게 비공개 채널로 재현 조건·영향 범위·영향 tag/commit을 전달하고, 공개 Issue에는 secret·공격 payload·개인정보를 올리지 않습니다.

## 구현 기준

- Backend: schema 검증, parameter binding/query builder, tenant isolation, RLS, 최소 권한, 일반화된 오류 응답
- Frontend: React text escaping, HTML sink 금지, URL allowlist, CSP, HttpOnly cookie 원칙
- API: 인증·권한·Origin·CSRF·content type·body size 검증
- 공급망: lockfile 고정, 직접 의존성 근거 기록, 라이선스·취약점 재검토

실습용 합성 payload는 test 안에서만 사용하며 실제 시스템을 공격하는 데 사용하지 않습니다.
