# 학습자 Evidence 제출 양식

아래 양식을 복사해 주차별 실습 기록으로 사용합니다. 모델의 설명 대신 재현 가능한 명령·결과·reference를 기록합니다. 실제 Secret, 고객 데이터, 운영 URL은 적지 않습니다.

## 실행 식별자

- 학습자/팀:
- 주차·실습:
- TaskSpec 또는 spec ID:
- base commit SHA:
- 결과 commit SHA:
- 환경(OS / Node / npm):

## 수용 기준 Evidence

| Criterion ID | 변경 파일 | 검증 명령 | 결과·reference          | 독립 검토자 | 상태        |
| ------------ | --------- | --------- | ----------------------- | ----------- | ----------- |
| AC-          |           |           | test 이름·manifest 경로 |             | PASS / FAIL |

## Red → Green 기록

1. 기대 실패:
2. 실패 명령과 핵심 오류:
3. 최소 변경:
4. focused test 결과:
5. 주차 verify 결과:
6. 전체 회귀 결과:

## 권한·보안·부작용

- 사용한 도구와 최소 권한:
- 금지 경로·데이터:
- 사람 승인이 필요한 행동:
- SQLi/XSS/Secret/URL/CSP 관련 Evidence:
- 실제 외부 쓰기·비용 발생 여부: 없음 / 승인 reference

## 위험과 다음 행동

- 알려진 위험:
- 미검증 항목:
- rollback 조건과 방법:
- 다음 안전 행동:
- 하네스 제거·축소 조건:

## 제출 전 확인

```powershell
npm run verify:repo
npm run verify
```

- [ ] Evidence ID와 criterion ID가 중복되지 않는다.
- [ ] 통과 Evidence에 실제 reference가 있다.
- [ ] 내부 파일·원고·Secret·운영 데이터가 없다.
- [ ] `ready_to_ship`이면 pending이 없고 ship readiness가 PASS다.
- [ ] 실패와 제한을 숨기지 않았다.

## Python Companion 추가 필드

| 필드           | 기록                                               |
| -------------- | -------------------------------------------------- |
| language       | `python`                                           |
| Python version | 3.11 이상 실제 출력                                |
| interpreter    | `.venv/Scripts/python.exe` 또는 `.venv/bin/python` |
| virtualenv     | 새 환경 생성·설치 명령                             |
| fixture ID     | TOOL·APPROVAL·SEC·EVIDENCE ID                      |
| verification   | `npm run verify:python` 또는 `npm run verify:all`  |

Python 제출자는 SQL 공격 값이 query text가 아닌 params에 남은 Evidence와 DOM XSS가 TypeScript 프론트엔드 책임이라는 교차 읽기 결과를 함께 기록합니다.
