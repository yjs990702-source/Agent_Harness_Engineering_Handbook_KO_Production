# 01. Python Preflight · 15분

## 목표

Python 3.11 이상, 격리된 가상환경, 고정 개발 의존성, 공식 검증 진입점을 확인한다.

## 실행

Windows는 저장소 루트에서 다음을 실행한다.

```powershell
py -3.11 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -e ".\python-labs[dev]"
npm run verify:python
```

macOS/Linux는 `python3 -m venv .venv`, `./.venv/bin/python`을 사용한다.

## 실패를 읽는 법

- `ModuleNotFoundError`: 설치한 interpreter와 실행 interpreter가 다르다.
- `No module named ruff`: 가상환경에 `python-labs[dev]`가 설치되지 않았다.
- Python version 오류: 3.11 이상 interpreter로 가상환경을 다시 만든다.

## Evidence

Python version, 실행한 interpreter 경로, `npm run verify:python` 결과를 기록한다. 전역 Python에 패키지를 설치한 결과는 제출 evidence로 사용하지 않는다.
