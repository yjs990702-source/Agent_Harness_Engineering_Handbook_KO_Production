# 30분 Quickstart

## 목표

30분 안에 모델 제안이 곧바로 실행되지 않고, 계약 검증·승인·독립 검증을 통과해야 실행되는 이유를 확인합니다. 코드를 많이 작성하는 대신, 결정적인 예제 출력과 테스트를 읽는 데 집중합니다.

## 0~5분: 환경 확인

```powershell
npm ci
npm run doctor
```

`[PASS]`는 진행 가능, `[WARN]`은 선택 기능이 준비되지 않음, `[FAIL]`은 기본 실습을 막는 문제입니다. 진단기는 자격 증명의 값을 읽거나 출력하지 않습니다.

## 5~15분: 가장 작은 하네스 루프

```powershell
npm run demo:python -- minimal-loop
```

출력의 핵심은 다음 세 단계입니다.

1. 모델 역할의 입력은 도구를 **제안**합니다.
2. 하네스는 도구 이름·권한·입력 schema를 **검증**합니다.
3. 검증된 호출만 executor에 전달하고 결과를 **기록**합니다.

이 구조가 없으면 모델 출력과 실제 부작용 사이에 제어 가능한 경계가 없습니다.

## 15~20분: 실패를 학습 자료로 사용하기

```powershell
npm run demo:python -- unknown-tool
npm run demo:python -- approval-expired
```

두 명령은 프로그램 충돌이 아니라 하네스가 의도대로 차단한 결과를 보여 줍니다. 오류 코드 `UNKNOWN_TOOL`, `APPROVAL_EXPIRED`가 설명보다 먼저 나오도록 설계되어 있어 자동화와 사람이 같은 실패를 식별할 수 있습니다.

## 20~25분: 보안 경계 확인

```powershell
npm run demo:python -- sql-attack
```

검색값은 SQL 문장에 연결하지 않고 `params`에 별도로 둡니다. 정렬 열과 방향처럼 placeholder로 바인딩할 수 없는 식별자는 `Enum` allowlist로 제한합니다. 프론트엔드에서는 같은 원리로 모델·사용자 문자열을 HTML로 해석하지 않고 `textContent`로 렌더링합니다.

## 25~30분: 검증과 Evidence

```powershell
npm run verify:python
npm run lab:new -- minimal-loop
```

검증 명령의 성공 로그와 `.practice/minimal-loop/evidence.md`의 관찰 내용을 함께 남깁니다. “제가 완료했습니다”가 아니라 명령, 종료 코드, 핵심 결과, 남은 위험으로 완료를 설명하는 것이 하네스 엔지니어링의 출발점입니다.

## 완료 조건

- `npm run doctor`에 `[FAIL]`이 없다.
- 세 시나리오의 성공·거부 이유를 한 문장씩 설명할 수 있다.
- `npm run verify:python`이 통과한다.
- 생성된 Evidence에 실행 명령과 관찰 결과가 있다.

다음 단계는 [실습 카드](lab-cards/README.md)의 1~4번입니다.
