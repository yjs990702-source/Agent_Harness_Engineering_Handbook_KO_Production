# 04 · SQL Injection·XSS 방어 Gate

SQL은 고정 query text와 별도 values를 사용합니다. UI는 신뢰하지 않는 문자열을 `textContent`에 넣고 raw HTML API를 사용하지 않습니다.

```powershell
npm run test --workspace=@handbook/week-03-service-deployment -- security.test.ts
```

공격 문자열이 query text에 들어가거나 HTML sink가 발견되면 출고를 중단합니다.
