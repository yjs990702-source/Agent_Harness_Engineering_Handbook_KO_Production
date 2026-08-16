# 3주차 서비스 배포 실습 지침

## 범위

- 기본 경로는 외부 계정 없이 `src`, `api`, `public`, `tests`에서 재현한다.
- Supabase와 Vercel은 학습자 소유 샌드박스의 선택 경로다.
- 실제 Production 배포, 외부 쓰기, 비용 발생 작업은 사람의 명시적 승인 없이 실행하지 않는다.

## 안전 규칙

- 모든 외부 입력은 `unknown`에서 검증한다.
- SQL 문자열 연결을 금지하고 parameter binding 계약만 사용한다.
- 브라우저 출력은 `textContent`를 사용하며 raw HTML API를 사용하지 않는다.
- Secret 값은 코드, manifest, 테스트 fixture, 로그에 넣지 않는다.
- Production manifest에는 승인자와 승인 시각이 없으면 실패한다.

## 완료 기준

1. 명세 ID가 테스트와 Evidence에 연결된다.
2. health, 정상, 오류, 공격 문자열, 배포 manifest 테스트가 통과한다.
3. `npm run verify:week3`와 루트 `npm run verify`가 통과한다.
4. 클라우드 계정이 없으면 로컬 manifest와 테스트 로그를 배포 대체 증거로 남긴다.
