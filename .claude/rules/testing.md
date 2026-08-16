---
paths:
  - "weeks/**/src/**/*.ts"
  - "weeks/**/src/**/*.tsx"
  - "weeks/**/tests/**/*.ts"
  - "weeks/**/tests/**/*.tsx"
---

# 테스트 변경 규칙

- 수용 기준 하나당 focused test를 먼저 작성합니다.
- 실패 이유를 확인한 뒤 최소 구현을 추가합니다.
- assertion 약화, test 삭제·skip, 실제 경로의 mock 우회로 Green을 만들지 않습니다.
- focused test 후 해당 주차 verify와 루트 verify를 실행합니다.
