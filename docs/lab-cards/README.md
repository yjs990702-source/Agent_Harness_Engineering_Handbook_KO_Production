# 실습 카드 모음

각 카드는 10~20분의 작은 성공 단위입니다. 카드별로 **읽기 → 실행 → 관찰 → Evidence** 순서를 지키십시오.

| 번호 | 카드             | 읽을 코드                                                      | 실행 명령                                  | 완료 Evidence             |
| ---: | ---------------- | -------------------------------------------------------------- | ------------------------------------------ | ------------------------- |
|    1 | 최소 루프        | `python-labs/src/agent_harness_labs/week1/minimal_loop.py`     | `npm run demo:python -- minimal-loop`      | 이벤트 순서 3개           |
|    2 | 미등록 도구 차단 | `python-labs/src/agent_harness_labs/week1/tool_contract.py`    | `npm run demo:python -- unknown-tool`      | `UNKNOWN_TOOL`            |
|    3 | 승인 만료        | `python-labs/src/agent_harness_labs/week2/approval_loop.py`    | `npm run demo:python -- approval-expired`  | executor 이전 차단        |
|    4 | 평가·수리 상한   | `python-labs/src/agent_harness_labs/week2/evaluator.py`        | `npm run verify:python`                    | 반복 실패 오류 테스트     |
|    5 | 열린 질문        | `python-labs/src/agent_harness_labs/week3/interview.py`        | `npm run verify:python`                    | 추측 대신 질문 목록       |
|    6 | SQL 공격 회귀    | `python-labs/src/agent_harness_labs/week3/security.py`         | `npm run demo:python -- sql-attack`        | 값·식별자 경계 설명       |
|    7 | 릴리스 Evidence  | `python-labs/src/agent_harness_labs/week3/release_evidence.py` | `npm run demo:python -- release-not-ready` | identity 불일치 차단      |
|    8 | bounded fan-out  | `python-labs/src/agent_harness_labs/extension/multi_agent.py`  | `npm run verify:multi-agent`               | owned path·fan-in 설명    |
|    9 | XSS 방어         | `weeks/week-03-service-deployment/src/security.ts`             | `npm run verify:week3`                     | `textContent` 회귀 테스트 |
|   10 | 최종 회귀        | 저장소 전체                                                    | `npm run verify:all`                       | 전체 로그와 남은 위험     |

## 카드 사용법 예시

```powershell
npm run lab:new -- approval-reducer
```

생성된 개인 연습지에 다음 세 문장을 직접 완성합니다.

1. 모델 또는 사용자가 제안한 것은 `_____`에서 검증되었다.
2. 잘못된 입력은 `_____` 오류 코드로 거부되었다.
3. 완료는 자기 보고가 아니라 `_____`로 확인했다.

새 카드는 [실습 카드 템플릿](../templates/LAB_CARD_TEMPLATE.md)을 복사해 작성할 수 있습니다.
