# 04. owned path 충돌 차단

## 목표

UI, Logic, Test Worker가 서로 다른 안전한 상대 경로만 수정하게 합니다.

## 실습

1. 기본 plan의 owned path를 표로 그립니다.
2. UI 경로를 Logic 하위로 바꿔 충돌을 재현합니다.
3. 절대·drive letter·`..`·빈 segment 경로가 거부되는지 확인합니다.
4. Reviewer의 owned path가 비어 있어야 하는 이유를 설명합니다.

```powershell
npm run test --workspace=@handbook/week-03-multi-agent -- --run tests/dag.test.ts
```

완료 기준은 충돌과 비정상 경로가 Agent 실행 전에 실패하는 것입니다.
