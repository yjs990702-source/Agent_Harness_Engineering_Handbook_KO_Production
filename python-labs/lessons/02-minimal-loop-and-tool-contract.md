# 02. 최소 루프와 Tool Contract · 45분

## 목표

모델의 문자열 제안과 실제 함수 호출을 분리하고, 등록 이름·schema·최소 권한·사람 승인을 executor 전에 검증한다.

## Red → Green

```powershell
.\.venv\Scripts\python.exe -m pytest python-labs/tests/week1 -q
npm run verify:python
```

1. `test_unknown_tool_never_reaches_executor`에서 실행 횟수가 0인지 확인한다.
2. `ToolDescriptor`와 `ToolProposal`의 권한 집합을 비교한다.
3. consequential 도구는 `approval_granted=False`에서 멈춘다.
4. 1~8 step budget을 소진하면 `STEP_BUDGET_EXHAUSTED`로 실패한다.

## 수용 기준

- PY-W1-AC-01 미등록 도구가 executor에 도달하지 않는다.
- PY-W1-AC-02 승인 전 consequential 실행은 0회다.
- PY-W1-AC-03 budget 소진을 완료로 위장하지 않는다.
- PY-W1-AC-04 공통 `tool-proposals.json`과 같은 failure code를 낸다.
