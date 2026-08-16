# 부분 실패·Timeout·Fan-in 완전성

병렬화는 성공 경로보다 실패 경로에서 더 많은 계약이 필요합니다. 한 Worker가 실패하거나 제한 시간을 넘기면 그 결과에 의존하는 Test Worker와 Reviewer를 실행하지 않습니다. 이미 시작한 같은 wave의 작업은 외부 부작용을 갖지 않아야 하며, 재시도는 새 run과 명시적 budget에서 수행합니다.

Reviewer는 UI·Logic·Test의 Evidence ID 전체를 `inputEvidenceIds`로 인계합니다. 최종 Verifier는 실제 dependency 결과의 집합과 완전히 같은지 다시 검사합니다.

```powershell
npm run test --workspace=@handbook/extension-multi-agent -- --run tests/coordinator.test.ts tests/verifier.test.ts tests/topology.test.ts
npm run verify:multi-agent
```

첫 fan-out은 2~4개로 제한하고, 후보가 같은 과제와 자원 조건의 단일 Worker 기준선을 넘지 못하면 멀티 에이전트로 승격하지 않습니다.
