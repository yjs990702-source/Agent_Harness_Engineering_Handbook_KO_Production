# Rule·Skill·Hook과 MCP Tool Contract

Rule은 작업 내내 적용할 제약, Skill은 특정 요청에서 호출하는 절차, Hook은 위험 행동을 실행 직전에 강제로 차단하는 장치입니다. 자연어 설명만으로 권한을 부여하지 않고 도구 이름·입력 validator·권한·부작용·출력 schema를 구조화된 계약으로 고정합니다.

## 실습

1. `.claude/skills/pr-draft/SKILL.md`의 입력·출력·금지 행동을 확인합니다.
2. `src/tool-contract.ts`의 읽기 도구와 부작용 도구 경계를 읽습니다.
3. 승인 없이 `deploy_preview`를 제안한 테스트가 실패하는 이유를 설명합니다.
4. 실제 MCP 서버 대신 합성 descriptor로 schema와 최소 권한을 검증합니다.

```powershell
npm run test --workspace=@handbook/week-01-foundations -- --run tests/tool-contract.test.ts
npm run verify:week1
```

검증 통과는 외부 도구가 안전하다는 보장이 아니라, 하네스가 선언한 계약을 일관되게 적용했다는 Evidence입니다. 실제 연결에서는 서버 신뢰도, 사용자 승인, 데이터 분류, 로그 보존 정책을 별도로 확인해야 합니다.
