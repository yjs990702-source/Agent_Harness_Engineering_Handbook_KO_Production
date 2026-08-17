# Python Companion Track

하네스의 언어 중립 계약을 Python 3.11+로 재현하는 약 3시간의 선택 실습이다. TypeScript 13시간 기본 과정의 브라우저 UI·Vercel 실습을 대체하지 않는다. 외부 모델·DB·클라우드 계정 없이 표준 라이브러리와 결정적 fixture로 실행한다.

코드 작성 전에 저장소 루트에서 다음 데모를 실행하면 제안→검증→실행→완료 순서를 먼저 볼 수 있다.

```powershell
npm run doctor
npm run demo:python -- minimal-loop
npm run demo:python -- all
```

출력 해설은 `docs/EXPECTED_OUTPUTS.md`, 작은 과제는 `docs/lab-cards/README.md`를 참고한다.

## 빠른 시작

Windows PowerShell:

```powershell
py -3.11 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -e ".\python-labs[dev]"
npm run verify:python
```

macOS/Linux:

```bash
python3 -m venv .venv
./.venv/bin/python -m pip install -e './python-labs[dev]'
npm run verify:python
```

`verify:python`은 Ruff → mypy → pytest → compileall 순으로 실행한다. 전체 TypeScript 회귀까지 확인하려면 `npm run verify:all`을 사용한다.

## 실습 순서

| 시간 | Lesson                                                                     | 핵심 산출물                        |
| ---: | -------------------------------------------------------------------------- | ---------------------------------- |
| 15분 | [01 Preflight](lessons/01-python-preflight.md)                             | interpreter·venv·검증 evidence     |
| 45분 | [02 최소 루프·Tool Contract](lessons/02-minimal-loop-and-tool-contract.md) | bounded loop·승인 전 차단          |
| 60분 | [03 Approval·Evaluator](lessons/03-approval-and-evaluator.md)              | replay-safe reducer·repair cap     |
| 45분 | [04 Interview·Security·Release](lessons/04-interview-security-release.md)  | open question·SQL binding·Evidence |
| 30분 | [05 Multi-Agent 선택 심화](lessons/05-multi-agent-extension.md)            | bounded fan-out·owned path·fan-in  |

공통 공격·계약 입력은 [`../shared/contract-fixtures`](../shared/contract-fixtures)에 있으며 TypeScript와 Python 테스트가 같은 failure code를 확인한다.

## 책임 경계

- Python: 입력·도구·승인·이벤트·SQL·Evidence 경계
- TypeScript: 브라우저 `textContent`, URL·CSP, HTTP UI, Vercel Preview

Python이 JSON을 안전하게 만든다고 DOM XSS가 자동으로 해결되지는 않는다. 브라우저 렌더링은 [`../weeks/week-03-service-deployment/public/index.html`](../weeks/week-03-service-deployment/public/index.html)과 security 테스트를 함께 확인한다.
