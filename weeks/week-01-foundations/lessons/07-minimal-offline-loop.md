# 07 · 오프라인 최소 에이전트 루프

## 목표

모델, 하네스, 환경의 경계를 코드에서 확인합니다. `ScriptedModel`은 행동을 제안하고, 하네스는 스키마·도구 registry·step budget·부작용 정책을 검사하며, 도구는 환경 관찰을 반환합니다.

```text
goal → model decision → schema/policy → tool → observation → model decision
```

## 코드 읽기

1. `src/minimal-loop.ts`의 `ModelDecision`을 읽습니다.
2. 모델 출력이 `unknown`에서 구조 검증되는 위치를 찾습니다.
3. `consequential` 도구가 `execute` 호출 전에 차단되는지 확인합니다.
4. `maxSteps`가 무한 반복을 끝내는지 확인합니다.

## 실습

`tests/minimal-loop.test.ts`에 등록되지 않은 도구와 잘못된 입력을 하나씩 추가합니다. 모델의 자연어 설명이 아니라 event trace와 도구 호출 횟수로 결과를 판정하십시오.

```powershell
npm run test --workspace=@handbook/week-01-foundations -- --run tests/minimal-loop.test.ts
npm run verify:week1
```

실제 모델 SDK 연결은 선택 사항입니다. 기본 실습은 API key 없이 동일 결과를 재현해야 합니다.
