# 출판 범위

## 중심 주제

이 저장소와 도서는 다음 두 가지를 중심으로 합니다.

1. 에이전트가 안전하고 재현 가능하게 일하도록 만드는 하네스
2. Planner·Worker·Reviewer·Verifier가 책임을 나누는 멀티 에이전트 협업

웹 프레임워크, 데이터베이스, 클라우드 배포는 핵심 개념을 확인하는 선택 부록입니다. 독자는 외부 계정이나 회사 시스템 없이도 핵심 3주 실습을 완료할 수 있어야 합니다.

## 공개 가능한 내용

- 합성 업무요청과 독립적으로 작성한 교육용 코드
- AGENTS·TaskSpec·Evidence·Handoff 같은 일반화된 계약
- 단일 Worker, Planner–Worker–Verifier, 다중 Worker DAG의 최소 예제
- 경로 소유권, 읽기 전용 리뷰, repair 제한, 결정적 검증의 교육용 구현
- SQL parameter binding과 React text escaping의 일반 보안 예제
- 논문·특허·오픈소스의 서지정보와 요약, 라이선스·출처 고지

## 공개하지 않는 내용

- 실제 개발 프로젝트의 저장소 주소, branch, commit SHA, 파일 경로
- 회사 고유 상태 머신·라우팅·평가·승인·복구 알고리즘
- 내부 prompt, hidden/golden 평가셋, 임계값, 공격 fixture
- 고객·tenant schema, 실제 운영 topology, secret·credential
- 사고 기록, 내부 성능 수치, 비공개 제품명·고객명

## 독자 수용 기준

새 clone에서 공개 저장소만 읽은 학습자가 다음을 수행할 수 있어야 합니다.

- 1주차 단일 Worker 하네스를 실행하고 Evidence를 설명한다.
- 2주차 Planner–Worker–Verifier 루프의 실패 종료 조건을 확인한다.
- 3주차 두 Worker의 병렬 실행과 읽기 전용 Reviewer·최종 Verifier를 재현한다.
- 회사 구현을 추정하거나 복원하는 정보 없이 자신의 작은 프로젝트에 패턴을 이식한다.
