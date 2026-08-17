# 샘플 제출물

아래 예시는 정답 복사용이 아니라 Evidence의 구체성 수준을 보여 주는 합성 예시입니다.

## 실습 정보

- 실습: 승인 reducer
- 목표: 만료된 token이 부작용 실행 전에 거부되는지 확인
- 변경 범위: `python-labs/tests/week2/` 아래 학습자 테스트 1개

## 실행 Evidence

```text
명령: npm run demo:python -- approval-expired
종료 코드: 0
핵심 결과: BLOCKED APPROVAL_EXPIRED
해석: 시각 검증이 executor 호출보다 먼저 수행되어 부작용이 발생하지 않았다.
```

## 검증 Evidence

```text
명령: npm run verify:python
결과: Ruff, mypy, pytest, compileall 통과
```

## 안전·한계

- 실제 배포나 외부 쓰기는 수행하지 않았다.
- 예제 token과 시각은 합성 값이다.
- 단일 프로세스 예제이므로 분산 lock과 clock skew는 범위 밖이다.

## 회고

처음에는 승인 여부만 검사했지만, token을 run·call·tool·승인자·만료 시각에 묶어야 재사용과 오용을 막을 수 있다는 점을 확인했다.
