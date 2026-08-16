# 08. 전체 협업 시나리오와 회고

## 목표

RequestSpec부터 최종 verdict까지 재현하고 자신의 도메인으로 이식할 경계를 찾습니다.

## 실습

1. 정상 Coordinator 시나리오를 실행합니다.
2. Logic Evidence를 실패로 바꿔 최종 상태 변화를 관찰합니다.
3. 유지할 계약과 교체할 합성 fixture를 구분합니다.
4. wave, Evidence ID, verdict, 남은 위험을 회고에 기록합니다.

```powershell
npm run test --workspace=@handbook/week-03-multi-agent
npm run verify:week3
npm run verify
```

완료 기준은 외부 모델 없이도 같은 실패와 성공을 재현할 수 있는 것입니다.
