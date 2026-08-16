# Deep Interview에서 실행 가능한 명세로

Deep Interview는 길게 질문하는 행위가 아니라 구현 전에 불확실성을 노출하는 Gate입니다. 역할, 사용 상황, 핵심 문제, 정상 흐름, 실패·복구, 데이터, 권한, 성공 지표, 제외 범위를 각각 확인합니다.

`createInterviewDraft`는 확정된 답변만 보존합니다. 하나라도 빠지면 `ServiceSpec`을 임의로 완성하지 않고 `openQuestions`를 반환합니다. 모든 답변이 확인된 뒤에만 `SPEC-W3`와 고정 수용 기준 ID를 만듭니다.

```powershell
npm run test --workspace=@handbook/week-03-service-deployment -- --run tests/interview.test.ts
npm run verify:week3
```

학습 Evidence에는 최초 열린 질문, 확인한 답변, 최종 spec ID, 각 AC를 검증할 테스트를 기록합니다.
