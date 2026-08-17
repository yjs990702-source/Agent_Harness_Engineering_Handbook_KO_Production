# 04. Interview·SQL·Release Evidence · 45분

## 목표

요구사항을 추측하지 않고, SQL injection을 parameter binding으로 막고, 같은 release identity의 Evidence만 출고에 사용한다.

## 실행

```powershell
.\.venv\Scripts\python.exe -m pytest python-labs/tests/week3 -q
npm run verify:python
```

## 보안 경계

- 값 공격 문자열은 SQL text가 아니라 DB-API parameter tuple에만 둔다.
- column·direction은 `SortColumn`, `SortDirection` allowlist로 변환한다.
- 내부 query·schema·credential은 `PublicError`에 복사하지 않는다.
- 브라우저 출력은 별도로 `textContent`, URL, CSP 검증을 유지한다.

## 수용 기준

- PY-W3-AC-01 open question이 남으면 명세를 만들지 않는다.
- PY-W3-AC-02 공격 값은 parameter에만 존재한다.
- PY-W3-AC-03 식별자 공격은 query 실행 전에 실패한다.
- PY-W3-AC-04 공개 오류는 민감 정보를 제거한다.
- PY-W3-AC-05 spec·commit·criterion identity와 pending을 교차 검증한다.
