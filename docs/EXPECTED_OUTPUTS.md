# 예상 출력 모음

버전과 실행 시간은 환경에 따라 달라질 수 있습니다. 아래 문자열과 종료 상태를 기준으로 확인하십시오.

## 환경 진단

```text
[PASS] repository root
[PASS] Node.js ...
[PASS] package-lock.json
[PASS] GitHub Actions workflow 0
환경 진단 완료: 기본 실습을 시작할 수 있습니다.
```

Python이 없으면 `[WARN] Python 3.11+`가 표시될 수 있습니다. TypeScript 트랙만 진행할 때는 경고이며, Python 트랙에서는 설치 후 다시 진단해야 합니다.

## 최소 루프

```text
SCENARIO minimal-loop
EVENT 1 tool_validated search_docs
EVENT 1 tool_executed 2개의 합성 문서를 찾았습니다.
EVENT 2 completed 근거 2개를 확인했습니다.
RESULT PASS
```

## 의도된 거부

```text
SCENARIO unknown-tool
BLOCKED UNKNOWN_TOOL 등록되지 않은 도구입니다.
RESULT PASS
```

`RESULT PASS`는 공격이나 잘못된 호출을 **차단하는 데 성공했다**는 뜻입니다.

## Python 검증

마지막 줄은 다음과 같아야 합니다.

```text
Python Companion 검증 통과: Ruff, mypy, pytest, compileall
```

테스트 개수는 교육 자료가 늘어나면 증가할 수 있으므로 특정 숫자를 성공 조건으로 고정하지 않습니다.
