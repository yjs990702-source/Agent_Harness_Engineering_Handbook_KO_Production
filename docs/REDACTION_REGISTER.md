# 공개 전 제거·일반화 레지스터

| 대상                              | 조치                                | 검증                         |
| --------------------------------- | ----------------------------------- | ---------------------------- |
| 회사 개발 저장소 URL·branch·SHA   | 전부 제거                           | `npm run verify:publication` |
| 내부 프로젝트 고유명·모듈 경로    | 일반 용어로 교체                    | 금지 식별자 scan             |
| 내부 상태·queue·승인·평가 구현    | 도서에서 제거, 최소 패턴으로 재작성 | 원고·코드 교차 검토          |
| 실제 prompt·hidden test·threshold | 전부 제외                           | 문서·fixture 수동 검수       |
| 고객·tenant·운영 데이터           | 합성 데이터로 교체                  | fixture scan                 |
| 공동저자 이력서 개인정보          | 약력에서 제외                       | `docs/AUTHORS.md` 검수       |
| GitHub Actions workflow           | 생성하지 않음                       | repository policy scan       |

이 레지스터는 삭제 사실을 증명하는 공개용 목록이며, 제거한 민감 원문이나 식별자를 다시 기록하지 않습니다.
