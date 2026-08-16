# 기여 가이드

1. Issue 또는 작업 문서에서 주차·수용 기준·소유 파일을 먼저 정합니다.
2. `main`이 아닌 짧은 목적의 branch를 사용합니다.
3. 실패 재현과 focused test를 먼저 남깁니다.
4. 해당 주차 verify와 루트 `npm run verify`를 모두 통과시킵니다.
5. PR 템플릿에 검증 결과, 보안 영향, rollback을 기록합니다.

불필요한 GitHub Actions workflow, 실제 secret·고객 데이터, 라이선스가 불명확한 복사 코드는 받지 않습니다. 보안 취약점은 공개 Issue 대신 [SECURITY.md](SECURITY.md)의 비공개 보고 절차를 따릅니다.
