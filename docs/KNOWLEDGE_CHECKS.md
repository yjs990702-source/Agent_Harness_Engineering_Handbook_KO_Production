# 빠른 이해 점검

먼저 답한 뒤 펼쳐 보십시오.

1. 모델이 `deploy` 도구를 출력하면 즉시 실행해도 됩니까?
2. SQL 값 binding만 하면 정렬 열 이름도 안전합니까?
3. Worker가 “완료”라고 응답하면 작업은 완료된 것입니까?
4. 승인 token에 최소한 어떤 identity와 시간 정보가 필요합니까?
5. 멀티에이전트는 언제 단일 worker보다 좋은 선택입니까?

<details>
<summary>정답과 해설</summary>

1. 아닙니다. registry·권한·입력·승인 검증을 먼저 통과해야 합니다.
2. 아닙니다. 식별자는 placeholder 대상이 아니므로 allowlist가 필요합니다.
3. 아닙니다. 테스트·Reviewer·Verifier 같은 독립 Evidence가 필요합니다.
4. run, call, tool, approver, expiry를 묶어야 합니다.
5. 단일 기준선을 결과·과정·안전·비용에서 이기고 작업 소유권을 분리할 수 있을 때입니다.

</details>
