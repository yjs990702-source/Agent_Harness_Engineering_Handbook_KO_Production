# GitHub 게시 가이드

## 대상

- 저장소: `yjs990702-source/Agent_Harness_Engineering_Handbook_KO_Production`
- 기본 branch: `main`
- 구현 branch: `agent/weekly-labs`

## 2026-08-16 권한 감사

최초 감사에서 `viewerPermission`은 `READ`였으나, 저장소 소유자가 collaborator를 추가한 뒤 `WRITE`로 재확인했습니다. `agent/weekly-labs`와 `baseline-no-harness`, 1·2·3주차 start/solution tag, `reference-solution` push가 성공했습니다. `main` 대상 Draft PR은 [#1](https://github.com/yjs990702-source/Agent_Harness_Engineering_Handbook_KO_Production/pull/1)입니다.

게시 전 다음 명령으로 현재 계정과 권한을 다시 확인합니다.

```powershell
gh auth status -h github.com
gh repo view yjs990702-source/Agent_Harness_Engineering_Handbook_KO_Production --json viewerPermission
git push -u origin agent/weekly-labs
```

## 게시 순서

1. README·STATUS·검증 증거를 코드와 같은 commit에서 갱신합니다.
2. `git diff --check`, secret·workflow 검사, `npm run verify`를 통과합니다.
3. 주차별 commit과 solution tag를 로컬에서 고정합니다.
4. 권한 확인 뒤 `agent/weekly-labs`를 push합니다.
5. `main` 대상으로 draft PR을 만들고 공동저자가 검토합니다.
6. 교육용 기준 tag는 매니페스트의 commit SHA와 함께 고정합니다.
7. 라이선스가 확정되기 전에는 GitHub Release와 패키지 배포를 하지 않습니다.
