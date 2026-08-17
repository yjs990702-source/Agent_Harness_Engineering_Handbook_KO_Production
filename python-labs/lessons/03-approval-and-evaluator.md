# 03. Approval Reducer와 Evaluator · 60분

## 목표

immutable event를 순수 reducer로 replay하고 run·call·tool·승인자·만료를 묶은 token만 재개한다. 안전 finding은 평균 점수로 덮지 않는다.

## 실행

```powershell
.\.venv\Scripts\python.exe -m pytest python-labs/tests/week2 -q
npm run verify:python
```

## 핵심 관찰

- `datetime`은 timezone-aware 값만 받는다.
- token mismatch·expiry는 `execute` 호출 전에 실패한다.
- reducer는 입력 event를 변경하지 않고 새 frozen state를 반환한다.
- blocking safety finding이 있으면 평균 100점이어도 FAIL이다.
- 같은 실패 signature 또는 repair cap에서 종료한다.

## 수용 기준

- PY-W2-AC-01 replay와 재개가 같은 상태 규칙을 사용한다.
- PY-W2-AC-02 forged·expired token의 실행 횟수는 0이다.
- PY-W2-AC-03 safety gate는 평균과 독립적이다.
- PY-W2-AC-04 repair loop는 상한에서 멈춘다.
