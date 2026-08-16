# 릴리스 매니페스트

기준일: 2026-08-16 (Asia/Seoul)

아래 값은 교육용 기준점을 재현하기 위한 고정 식별자입니다. GitHub Release 또는 패키지 배포 완료를 뜻하지 않습니다.

| 항목                        | 값                                                                                                |
| --------------------------- | ------------------------------------------------------------------------------------------------- |
| source branch               | `agent/weekly-labs`                                                                               |
| 검증 source commit          | `1c34bb15dac14e5186302c9045cbd46f58f01274`                                                        |
| `baseline-no-harness`       | `ba5bee0939b379f1beb52c36647d1a61b3eb2c8b`                                                        |
| `week1-start`               | `a5117978cbee6165d921ccd007b2a96f5f2e50b7`                                                        |
| `week1-solution`            | `bd5518ff30ffa5aeb16ab700f4bedcc873a2b0a3`                                                        |
| `week2-start`               | `5dc38c63589778c5d1c7152a6c55c2a6b8a5ef75`                                                        |
| `week2-solution`            | `5bada603e29555c325f7a933603688722c4d780c`                                                        |
| `week3-start`               | `0c62df29062d23d19c2003c15a7fc98d8fa7577f`                                                        |
| `week3-solution`            | `1c34bb15dac14e5186302c9045cbd46f58f01274`                                                        |
| `reference-solution`        | `1c34bb15dac14e5186302c9045cbd46f58f01274`                                                        |
| `package-lock.json` SHA-256 | `B6BB7FD49270A9A2A76AB891E422D878E901A84CC06C55ED2AA2BF96D0154E98`                                |
| 전체 verify 결과            | 11 files·47 tests, 3 builds, Chromium 2 scenarios, exit code 0                                    |
| npm audit                   | 0 vulnerabilities                                                                                 |
| Draft PR                    | [#1](https://github.com/yjs990702-source/Agent_Harness_Engineering_Handbook_KO_Production/pull/1) |
| Supabase 통합 결과          | 외부 검증 필요                                                                                    |
| Vercel Preview 결과         | 외부 검증 필요                                                                                    |
| 코드/문서 라이선스          | 권리자 결정 필요                                                                                  |

## 재현

```powershell
git clone https://github.com/yjs990702-source/Agent_Harness_Engineering_Handbook_KO_Production.git
cd Agent_Harness_Engineering_Handbook_KO_Production
git checkout reference-solution
npm install
npm run verify
```

정확한 잠금 파일 설치가 필요한 배포 검증에서는 `npm install` 대신 `npm ci`를 사용합니다. 라이선스 결정, 실제 Supabase RLS 검증, Vercel 승격 증거가 없으므로 Production 또는 공개 배포 완료 상태로 선언하지 않습니다.
