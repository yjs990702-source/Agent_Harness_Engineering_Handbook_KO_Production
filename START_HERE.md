# 여기서 시작하세요

이 저장소는 모델 API 없이도 하네스의 핵심 경계와 검증 루프를 연습할 수 있게 만든 공개 교육 자료입니다. 처음에는 전체 구조를 이해하려 하지 말고 아래 한 줄을 성공시키는 데 집중하십시오.

```powershell
npm ci
npm run doctor
npm run demo:python -- minimal-loop
```

## 10분 첫 성공

1. `npm run doctor`에서 `[FAIL]`이 없는지 확인합니다.
2. `npm run demo:python -- minimal-loop`를 실행합니다.
3. 출력에서 `tool_validated → tool_executed → completed` 순서를 찾습니다.
4. `npm run lab:new -- minimal-loop`로 개인 연습지를 만듭니다.
5. 생성된 `.practice/minimal-loop/README.md`의 질문에 답합니다.

외부 API key, 데이터베이스, 배포 계정은 필요하지 않습니다. `.practice/`는 Git에서 제외되므로 개인 메모를 안전하게 남길 수 있습니다.

## 30분 권장 경로

|    시간 | 할 일                                 | 확인할 결과                           |
| ------: | ------------------------------------- | ------------------------------------- |
|   0~5분 | `npm ci`, `npm run doctor`            | Node·Python·교육 파일 상태            |
|  5~10분 | `npm run demo:python -- minimal-loop` | 제안과 실행 사이의 검증 경계          |
| 10~20분 | `npm run demo:python -- unknown-tool` | 등록되지 않은 도구가 실행 전에 거부됨 |
| 20~25분 | `npm run demo:python -- sql-attack`   | 값 binding과 식별자 allowlist         |
| 25~30분 | `npm run verify:python`               | Ruff·mypy·pytest·compileall 통과      |

자세한 설명은 [30분 Quickstart](docs/QUICKSTART_30_MIN.md), 명령만 다시 볼 때는 [명령 치트시트](docs/COMMAND_CHEATSHEET.md), 그림으로 복습할 때는 [시각 Quick Guide](docs/VISUAL_QUICK_GUIDE.md)를 사용하십시오.

## 막혔을 때

- 명령이 없다고 나오면 저장소 루트에서 실행했는지 확인합니다.
- Python을 찾지 못하면 `python-labs/README.md`의 가상환경 절차를 따릅니다.
- 의도된 실패와 실제 오류는 [예상 실패 안내](docs/EXPECTED_FAILURES.md)로 구분합니다.
- 강의 제출물의 완성 형태는 [샘플 제출물](docs/SAMPLE_SUBMISSION.md)을 참고합니다.

전체 과정은 TypeScript 기본 트랙과 Python 보조 트랙으로 구성됩니다. 처음 하루에는 한 언어만 선택하고, 공통 fixture를 통해 같은 하네스 계약이 양쪽에서 동일하게 동작하는지는 나중에 비교하십시오.
