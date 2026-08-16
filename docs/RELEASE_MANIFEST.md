# 릴리스 매니페스트

기준일: 2026-08-16 (Asia/Seoul)

아래 값은 교육용 기준점을 재현하기 위한 고정 식별자입니다. GitHub Release 또는 상용 배포 완료를 뜻하지 않습니다.

| 항목                         | 값                                                                                                |
| ---------------------------- | ------------------------------------------------------------------------------------------------- |
| source branch                | `agent/weekly-labs`                                                                               |
| 검증 source commit           | `23795aad6d5bd8ca4366202b8410f85f0213c3b0`                                                        |
| `baseline-no-harness`        | `ba5bee0939b379f1beb52c36647d1a61b3eb2c8b`                                                        |
| `week1-start`                | `a5117978cbee6165d921ccd007b2a96f5f2e50b7`                                                        |
| `week1-solution`             | `bd5518ff30ffa5aeb16ab700f4bedcc873a2b0a3`                                                        |
| `week2-start`                | `5dc38c63589778c5d1c7152a6c55c2a6b8a5ef75`                                                        |
| `week2-solution`             | `5bada603e29555c325f7a933603688722c4d780c`                                                        |
| `week3-multi-agent-solution` | `0de28f4d928ea101d7f95798fb90f1118f911c54`                                                        |
| `reference-harness-first-v4` | `0de28f4d928ea101d7f95798fb90f1118f911c54`                                                        |
| `reference-harness-first`    | `23795aad6d5bd8ca4366202b8410f85f0213c3b0`                                                        |
| legacy `week3-start`         | `0c62df29062d23d19c2003c15a7fc98d8fa7577f`                                                        |
| legacy `week3-solution`      | `1c34bb15dac14e5186302c9045cbd46f58f01274`                                                        |
| `package-lock.json` SHA-256  | `4351521319A8E4DFDEF7B5604FE84382A79812CA908A11AFBFA2CF830D678109`                                |
| 전체 verify 결과             | 15 files·69 tests, 4 builds, Chromium 2 scenarios, exit code 0                                    |
| npm audit                    | 0 vulnerabilities                                                                                 |
| 출판 DOCX SHA-256            | `CD7ADEF4E0C9AC834F54CC50B05870ADCFC22A89312CB06A2AE0318AD0811765`                                |
| Draft PR                     | [#1](https://github.com/yjs990702-source/Agent_Harness_Engineering_Handbook_KO_Production/pull/1) |
| Supabase·Vercel 통합         | 선택 부록·외부 검증 필요                                                                          |
| 코드/문서 라이선스           | 권리자 결정 필요                                                                                  |

## 재현

```powershell
git clone https://github.com/yjs990702-source/Agent_Harness_Engineering_Handbook_KO_Production.git
cd Agent_Harness_Engineering_Handbook_KO_Production
git checkout reference-harness-first
npm ci
npm run verify
```

기존 `week3-start`, `week3-solution`, `reference-solution`은 하네스 중심 재편 전 웹 서비스 실습의 이력 보존 tag입니다. `reference-harness-first-v4`는 최초 v4 기준 기록이고, 현재 핵심 과정의 새 clone 재현에는 `reference-harness-first`를 사용합니다. 라이선스 결정과 선택 외부 통합 증거가 없으므로 공개 패키지 배포 또는 Production 완료 상태로 선언하지 않습니다.
