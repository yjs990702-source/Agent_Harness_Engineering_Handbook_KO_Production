# 명령 치트시트

모든 명령은 저장소 루트에서 실행합니다.

| 목적                   | 명령                                  |
| ---------------------- | ------------------------------------- |
| 최초 설치              | `npm ci`                              |
| 환경 진단              | `npm run doctor`                      |
| 가장 작은 Python 데모  | `npm run demo:python -- minimal-loop` |
| 모든 Python 데모       | `npm run demo:python -- all`          |
| 개인 연습지 생성       | `npm run lab:new -- approval-reducer` |
| 1주차 검증             | `npm run verify:week1`                |
| 2주차 검증             | `npm run verify:week2`                |
| 3주차 검증             | `npm run verify:week3`                |
| 멀티에이전트 선택 실습 | `npm run verify:multi-agent`          |
| Python 전체 검증       | `npm run verify:python`               |
| 모든 언어·범위 검증    | `npm run verify:all`                  |

## Python 설치가 아직 안 된 경우

```powershell
py -3.11 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -e ".\python-labs[dev]"
npm run verify:python
```

macOS·Linux에서는 두 번째 줄의 interpreter를 `.venv/bin/python`으로 바꿉니다.

## 결과 읽는 순서

1. 첫 번째 `[FAIL]` 또는 오류 코드를 찾습니다.
2. 그 줄 위의 실행 단계 이름을 확인합니다.
3. [예상 출력](EXPECTED_OUTPUTS.md)과 비교합니다.
4. 수정 후 가장 작은 검증부터 다시 실행합니다.
5. 마지막에 `npm run verify:all`로 회귀를 확인합니다.
