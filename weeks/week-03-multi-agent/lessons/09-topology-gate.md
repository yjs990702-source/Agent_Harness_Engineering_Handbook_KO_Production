# 09 · 멀티에이전트 토폴로지 Gate

## 목표

에이전트 수를 늘리기 전에 단일 worker 기준선으로 충분한지 판단하고, 필요한 경우에만 컨텍스트와 조정 방식을 선택합니다.

| 컨텍스트 | 중앙 조정                    | 동료 조정                                |
| -------- | ---------------------------- | ---------------------------------------- |
| 공유     | 짧은 협업                    | 원격 peer가 공유 문맥을 안전하게 쓸 때만 |
| 격리     | 독립 구현·독립 평가의 기본값 | 실제 원격 조직 경계의 고급 선택지        |

첫 fan-out은 독립 작업 2~4개로 제한합니다. 같은 파일 경로를 두 worker가 소유하면 실행 전에 중단하고, 통합은 결정론적 테스트와 Evidence fan-in 뒤에 수행합니다.

```powershell
npm run test --workspace=@handbook/extension-multi-agent -- --run tests/topology.test.ts
npm run verify:multi-agent
```
