# 1주차 · 기초 하네스와 TDD

## 학습 목표

AGENTS·CLAUDE·path-scoped Rule이 각각 어떤 문제를 다루는지 확인하고, 업무요청 제목 검증과 tenant 격리를 TDD로 구현합니다.

## 수용 기준

- `W1-AC-01`: 제목은 앞뒤 공백 제거 후 3~100자여야 합니다.
- `W1-AC-02`: 유효한 요청은 생성자 tenant/user, 생성 시각, 초기 상태 `open`을 가집니다.
- `W1-AC-03`: 사용자는 자신의 tenant 요청만 목록·상세 조회할 수 있습니다.
- `W1-AC-04`: 다른 tenant의 ID를 알아도 존재 여부를 구분할 수 없습니다.
- `W1-SEC-01`: `<script>` 같은 입력은 실행하지 않고 plain text 데이터로만 보존합니다.

## 실행

저장소 루트에서:

```powershell
npm run verify:week1
```

## 강의 순서

1. [TaskSpec과 수용 기준](lessons/01-task-spec.md)
2. [입력 경계와 안전한 텍스트](lessons/02-input-boundary.md)
3. [tenant 격리 저장소](lessons/03-tenant-isolation.md)
4. [업무요청 서비스](lessons/04-request-service.md)
5. [완료 선언과 Evidence 분리](lessons/05-evidence-baseline.md)
6. [Single Worker Harness](lessons/06-single-worker-harness.md)

## TDD 실습 순서

1. `tests/request.test.ts`의 제목 경계값을 읽습니다.
2. `exercises/01-title-validation.test.ts.example`을 참고해 새 실패 사례를 먼저 추가합니다.
3. `npm run test --workspace=@handbook/week-01-foundations -- --run tests/request.test.ts`로 실패 이유를 확인합니다.
4. `src/request.ts`를 최소 수정해 Green으로 만듭니다.
5. 서비스·tenant 격리 회귀와 주차 전체 verify를 실행합니다.
6. 실행한 Red/Green 명령과 남은 위험을 학습 노트에 기록합니다.

## 역할 지도

| 파일                 | 역할                  | 넣지 않을 내용           |
| -------------------- | --------------------- | ------------------------ |
| root `AGENTS.md`     | 항상 지킬 저장소 정책 | 한 번만 실행할 배포 절차 |
| module `AGENTS.md`   | 이 모듈의 불변식      | root 규칙의 복사본       |
| `.claude/rules/*.md` | 경로별 검증 행동      | 범위 없는 긴 배경 지식   |
| test                 | 실행 가능한 수용 기준 | 구현 세부사항 고정       |
