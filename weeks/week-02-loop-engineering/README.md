# 2주차 · Planner–Worker–Verifier

## 수용 기준

- `W2-AC-01`: 민감 파일과 위험 명령은 간단한 Hook 정책에서 이유와 함께 차단됩니다.
- `W2-AC-02`: 일반 source 수정과 로컬 검증 명령은 허용됩니다.
- `W2-AC-03`: Worker 결과는 deterministic Verifier와 independent Evaluator를 모두 통과해야 합니다.
- `W2-AC-04`: 같은 실패 signature가 반복되거나 repair cap에 도달하면 루프가 중단됩니다.
- `W2-AC-05`: task·handoff 문서가 기준 revision, 결과, 미해결 위험을 전달합니다.

Verifier는 테스트·변경 경로·Evidence를 코드로 판정합니다. Evaluator는 그 증거를 읽고 목적 충족과 설명 품질을 보조 평가합니다. Worker의 자기 보고만으로 PASS하지 않습니다.

## 실행

```powershell
npm run verify:week2
```

Hook fixture만 확인하려면 다음을 실행합니다.

```powershell
npm run hook:allow --workspace=@handbook/week-02-loop-engineering
npm run hook:block --workspace=@handbook/week-02-loop-engineering
```

## 인계 실습

`.agents/tasks/week-02-lab.md`의 완료 조건을 확인하고 `.agents/handoffs/week-02-example.md` 형식으로 결과를 전달합니다. 완료 증거와 미해결 위험을 분리해 기록합니다.
