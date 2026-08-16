# Supabase·Vercel 수동 검증

이 문서는 계정·조직 승인·외부 비용이 필요한 단계입니다. 로컬 자동 검증이 대신할 수 없습니다.

## Supabase

1. 운영이 아닌 개발 project와 별도 test user 2명을 준비합니다.
2. migration을 검토·적용하고 두 user의 `app_metadata.tenant_id`를 서로 다르게 설정합니다.
3. user A token으로 생성·목록·상세가 동작하는지 확인합니다.
4. user B token으로 A의 ID를 조회해 일반화된 404인지 확인합니다.
5. `requestId="' OR 1=1 --"`, 잘못된 sort, 51 초과 limit을 보내 DB 전에 400/404인지 확인합니다.
6. Supabase dashboard에서 RLS가 켜졌고 anon grant가 없는지 재확인합니다.

## Vercel Preview

1. 이 저장소 branch를 Vercel project에 연결하고 root directory를 이 주차 폴더로 설정합니다.
2. Preview에 `LAB_DATA_MODE=supabase`, `LAB_AUTH_MODE=supabase`, URL·publishable key를 등록합니다.
3. demo/memory 설정이 Production에서 503으로 fail closed하는지 별도 smoke test합니다.
4. 보호된 Preview에서 정상·validation·권한·CSRF·XSS·mobile keyboard 흐름을 확인합니다.
5. PR에 Preview URL, source commit, migration version, test 결과, rollback 대상을 기록합니다.

## 수동 완료 증거

- Supabase project ref를 노출하지 않은 환경 식별자
- migration SHA-256와 적용 시각
- user A/B 권한 시나리오 결과
- Vercel deployment URL·source commit
- rollback 대상 deployment와 DB 호환성 판정

실제 token·cookie·service key·개인정보는 문서와 화면 캡처에 포함하지 않습니다.
