# GitHub 게시 가이드

## 대상

- 저장소: `yjs990702-source/Agent_Harness_Engineering_Handbook_KO_Production`
- 기본 branch: `main`
- 구현 branch: `agent/weekly-labs`

## 2026-08-16 권한 감사

GitHub CLI의 `viewerPermission` 결과는 `READ`입니다. `contact536` 계정은 clone과 조회는 가능하지만 branch push·PR용 branch 게시 권한이 없습니다.

저장소 소유자는 GitHub의 repository Settings → Collaborators에서 `contact536`를 최소 Write 권한으로 추가해야 합니다. 권한 변경 후 다음으로 재확인합니다.

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
6. 라이선스가 확정되기 전에는 공개 릴리스 tag와 패키지 배포를 하지 않습니다.
