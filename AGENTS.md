# 학습 저장소 개발 지침

## 목적

이 저장소는 도서 독자가 하네스 엔지니어링과 에이전트 협업을 외부 계정 없이 재현하는 교육용 코드입니다. `weeks/week-01-foundations`, `week-02-loop-engineering`, `week-03-multi-agent`만 실행 코드 범위로 둡니다.

## 작업 순서

1. 해당 주차 README와 실패 테스트를 읽습니다.
2. 한 번에 하나의 수용 기준만 변경합니다.
3. 가장 작은 구현으로 focused test를 통과시킵니다.
4. 해당 주차 verify를 실행합니다.
5. 루트 `npm run verify`로 전체 회귀를 확인합니다.
6. 코드와 관련 README를 함께 최신화합니다.

테스트를 skip하거나 assertion을 약화해 Green을 만들지 않습니다.

## 저장소 운영

- 학습 코드는 `main` 한 브랜치에 통합합니다.
- push 전 `npm run verify`를 통과시킵니다.
- 불필요한 GitHub Actions workflow를 만들지 않습니다.
- `.github/workflows/*.yml`과 Marketplace Action을 추가하지 않습니다.
- 외부 모델·DB·배포 환경 없이 모든 실습이 동작해야 합니다.
- 실제 개인정보·자격 증명·비공개 코드·운영 설정을 넣지 않습니다.

## 안전한 코드 원칙

- 사용자·모델·도구 출력은 문자열 데이터로 취급하고 HTML·shell 명령으로 실행하지 않습니다.
- 실습을 웹·DB 예제로 확장할 경우 SQL 문자열 조립 대신 parameter binding을 사용하고, Frontend는 기본 text escaping을 유지합니다.
- 파일 소유 경로와 허용 범위를 먼저 검증합니다.
- Worker가 자기 결과를 최종 PASS로 판정하지 않습니다.
- Reviewer는 읽기 전용이며 Verifier가 테스트·경로·evidence를 독립 확인합니다.
- 반복 실패와 repair 상한에서 반드시 중단합니다.

## 완료 기준

- 관련 테스트와 전체 verify가 통과합니다.
- 변경 경로와 evidence가 수용 기준에 대응합니다.
- README의 명령이 새 clone에서 그대로 실행됩니다.
- 생성 파일·불필요한 고난도 예제·외부 서비스 설정이 남지 않습니다.
- 라이선스가 확정되기 전에는 `LICENSE_DECISION_REQUIRED.md`를 제거하지 않습니다.
