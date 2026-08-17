# Python Companion 실습 지침

이 폴더는 외부 모델·DB·클라우드 없이 실행되는 Python 3.11+ 교육 실습이다.

## 구현 원칙

- 입력은 `object`에서 시작해 명시적으로 검증한다.
- `eval`, `exec`, `os.system`, `shell=True`, unsafe 역직렬화를 사용하지 않는다.
- SQL 값은 DB-API parameter binding으로 전달하고 column·direction은 `Enum` allowlist로만 고른다.
- event reducer는 입력을 변경하지 않는 순수 함수로 유지한다.
- 승인 token은 run·call·tool·승인자·만료 시각을 모두 검증한 뒤에만 실행한다.
- Worker 결과는 독립 Evidence 검증을 통과해야 최종 PASS가 된다.
- 테스트 skip·느슨한 xfail·예외 삼키기·성공 하드코딩을 금지한다.
- GitHub Actions workflow를 추가하지 않는다. 검증은 `npm run verify:python`으로 실행한다.

## 작업 순서

1. lesson과 수용 기준을 읽는다.
2. 실패 테스트를 먼저 확인한다.
3. 최소 구현으로 focused pytest를 통과시킨다.
4. Ruff, mypy, pytest, compileall을 모두 실행한다.
5. 변경된 계약과 README를 함께 최신화한다.
