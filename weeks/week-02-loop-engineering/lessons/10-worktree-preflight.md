# Worktree 병렬 개발 사전 점검

병렬 개발의 핵심은 Worktree 명령 자체가 아니라 기준 revision, branch, 대상 경로, owned path를 실행 전에 고정하는 것입니다. 이 실습은 실제 Git 상태를 바꾸지 않고 검토 가능한 `program + argv` 계획만 만듭니다.

```powershell
npm run test --workspace=@handbook/week-02-loop-engineering -- --run tests/worktree-plan.test.ts
npm run verify:week2
```

절대 경로, 상위 이동, 중복 branch·대상 경로, 부모–자식 owned path 충돌, 확인하지 않은 base SHA는 모두 계획 단계에서 실패합니다. 학습자가 계획과 `git status`를 확인한 뒤 실제 실행 여부를 승인해야 합니다.
