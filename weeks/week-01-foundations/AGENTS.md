# 1주차 모듈 지침

- 핵심 수용 기준은 제목 trim 후 3~100자와 tenant 격리입니다.
- domain 함수는 UI·database·agent framework에 의존하지 않습니다.
- 시간과 ID 생성은 테스트에서 주입할 수 있어야 합니다.
- 다른 tenant 객체와 없는 객체는 같은 `RequestNotFoundError`로 처리합니다.
- 사용자 입력은 HTML로 해석하지 않고 원문 문자열로 보존합니다. 렌더링 계층이 text escaping을 담당합니다.
- 변경 후 `npm run verify --workspace=@handbook/week-01-foundations`와 루트 `npm run verify`를 실행합니다.
