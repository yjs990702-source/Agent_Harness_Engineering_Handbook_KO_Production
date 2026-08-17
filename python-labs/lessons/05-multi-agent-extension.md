# 05. Multi-Agent Failure Lab · 선택 30분

## 목표

멀티 에이전트를 성능 과시가 아니라 topology·owned path·timeout·부분 실패·fan-in Evidence 문제로 다룬다.

## 실행

```powershell
.\.venv\Scripts\python.exe -m pytest python-labs/tests/extension -q
npm run verify:python
```

## 제약

- 단일 worker 기준선 통과 후에만 선택한다.
- worker는 2~4개로 제한한다.
- parent/child를 포함한 owned path 중복을 금지한다.
- timeout·부분 실패는 구조화된 실패로 종료한다.
- Reviewer가 받은 task·Evidence ID 집합과 Verifier의 fan-in 집합이 같아야 한다.

실제 모델 SDK, 원격 A2A 서버, 비용 발생 호출은 이 실습 범위가 아니다.
