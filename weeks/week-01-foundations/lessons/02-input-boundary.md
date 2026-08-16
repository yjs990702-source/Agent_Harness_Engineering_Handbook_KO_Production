# 02. 입력 경계와 안전한 텍스트

## 목표

외부 입력을 `unknown`에서 검증하고 태그처럼 보이는 문자열도 실행하지 않는 데이터로 다룹니다.

## 실습

1. `normalizeRequestTitle`의 타입·trim·3~100자 검사를 읽습니다.
2. 문자열이 아닌 값과 101자 값을 각각 재현합니다.
3. `<script>` 형태 입력이 평가되지 않고 원문 문자열로 보존되는 테스트를 확인합니다.

```powershell
npm run test --workspace=@handbook/week-01-foundations -- --run tests/request.test.ts
```

웹 UI로 확장할 때도 raw HTML API를 사용하지 않고 프레임워크 기본 escaping을 유지합니다.
