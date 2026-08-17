# 언어 트랙 선택 가이드

## 5분 결정

| 질문                                                                     | 예                   | 아니오               |
| ------------------------------------------------------------------------ | -------------------- | -------------------- |
| 브라우저 UI·DOM XSS·HTTP handler·Vercel Preview가 목표인가?              | TypeScript 기본 트랙 | 다음 질문            |
| Python 백엔드 팀이며 event·approval·SQL·Evidence 계약을 먼저 익히려는가? | Python Companion     | TypeScript 기본 트랙 |
| 기본 수료 후 병렬 agent 실패 모드를 검증하려는가?                        | 선택 Multi-Agent     | 여기서 종료          |

## 권장 경로

1. 공식 기본 수료: TypeScript 3주 13시간
2. 언어 비교 또는 Python 조직 온보딩: Python Companion 약 3시간
3. 단일 worker 기준선이 통과한 팀: TypeScript 또는 Python Multi-Agent 선택 심화

Python을 선택해도 `AGENTS.md`, Rule·Skill, Hook·Worktree, Commit→PR→Review 개념은 기본 과정 설명을 함께 읽는다. TypeScript를 선택해도 백엔드 SQL parameter binding과 식별자 allowlist는 언어 중립 수용 기준으로 이해한다.

## 같은 것과 다른 것

- 같다: tool name·schema·permission·approval, event replay, failure code, repair cap, criterion Evidence
- 다르다: TypeScript interface/Vitest/DOM과 Python dataclass/pytest/DB-API
- 섞지 않는다: 한 수업에서 두 언어 전체를 모두 구현하거나, Python 결과를 브라우저 XSS 방어 증거로 대신하지 않는다.

## 수료 구분

- 기본 과정 수료: `npm run verify`
- Python Companion 수료: `npm run verify:python`과 PY-W1~W3 Evidence
- 공개 릴리스 검증: `npm run verify:all`
- Multi-Agent 심화: 단일 worker baseline과 topology·timeout·fan-in 수용 기준 추가
