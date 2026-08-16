# 2주차 · Hook·Verifier/Evaluator·Worktree

## 수용 기준

- `W2-AC-01`: 민감 파일과 위험 명령은 PreToolUse 정책에서 이유와 함께 차단됩니다.
- `W2-AC-02`: 일반 source 수정과 로컬 검증 명령은 허용됩니다.
- `W2-AC-03`: Worker 결과는 deterministic Verifier와 independent Evaluator를 모두 통과해야 합니다.
- `W2-AC-04`: 같은 실패 signature가 반복되거나 repair cap에 도달하면 루프가 중단됩니다.
- `W2-AC-05`: 병렬 작업의 owned path가 겹치면 worktree 계획을 만들지 않습니다.
- `W2-AC-06`: task·handoff 문서가 기준 commit, 결과, 미해결 위험을 전달합니다.

Verifier는 “test가 통과했는가, 변경 경로가 허용됐는가”를 코드로 판정합니다. Evaluator는 그 증거를 입력으로 받아 목적 충족과 설명 품질을 독립 평가합니다. 책의 PWE에서 Evaluator가 의미 판정을 맡더라도, 최종 출고에는 모델과 독립적인 Verifier를 별도 유지합니다.

## 실행

```powershell
npm run verify:week2
```

Hook fixture만 실행:

```powershell
npm run hook:allow --workspace=@handbook/week-02-loop-engineering
npm run hook:block --workspace=@handbook/week-02-loop-engineering
```

## 병렬 실습

`src/worktree-plan.ts`는 안전한 plan만 만들고 실제 `git worktree` 명령을 실행하지 않습니다. 학습자는 `fixtures/worktree-ownership.json`의 소유권을 검토한 뒤 별도 임시 저장소에서 명령을 수동 실행합니다. UI와 API가 같은 파일을 소유하도록 바꾸면 계획이 실패해야 합니다.

## 인계 실습

`.agents/tasks/week-02-lab.md`의 완료 조건을 확인하고 `.agents/handoffs/week-02-example.md` 형식으로 결과를 전달합니다. “완료”와 “미검증”을 한 문장에 섞지 않습니다.
