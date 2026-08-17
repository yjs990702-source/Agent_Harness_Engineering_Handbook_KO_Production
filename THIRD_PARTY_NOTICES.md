# Third-party notices

이 저장소의 직접 개발 의존성은 TypeScript 학습 코드의 검사와 테스트에만 사용됩니다.

| 패키지      | 고정 버전 | 용도                     | 라이선스   |
| ----------- | --------- | ------------------------ | ---------- |
| TypeScript  | 5.9.3     | strict typecheck와 build | Apache-2.0 |
| Vitest      | 4.1.10    | unit test                | MIT        |
| Prettier    | 3.7.4     | format 검사              | MIT        |
| tsx         | 4.21.0    | TypeScript fixture 실행  | MIT        |
| @types/node | 24.10.4   | Node.js type 정의        | MIT        |
| pytest      | 8.4.1     | Python unit test         | MIT        |
| Ruff        | 0.12.10   | Python lint·format       | MIT        |
| mypy        | 1.17.1    | Python strict typecheck  | MIT        |

Node 의존성의 정확한 버전은 `package-lock.json`, Python 직접 개발 의존성은 `python-labs/pyproject.toml`을 기준으로 합니다. 의존성은 각 패키지의 라이선스를 따르며 이 저장소의 Apache-2.0으로 재허가되지 않습니다. 릴리스 시 직접·전이 의존성의 고지 의무를 다시 확인합니다.

## 연구·읽기 자료

`docs/RESEARCH_TO_PRACTICE.md`의 논문·공개 프로젝트·서적은 설계 근거와 추가 읽기 링크입니다. 해당 원본·도식·소스 코드는 이 저장소 배포물에 포함되지 않으며, 각 권리자의 라이선스와 저작권을 따릅니다. 이 저장소의 구현과 문서는 원리를 교육할 목적으로 독립 작성했습니다.

## Diagram Design 참고

`docs/visual-guide`의 독립 작성 SVG는 명확한 윤곽선, 제한된 색상, 라벨 우선, 정적 기본값이라는 시각 원칙을 설계할 때 [cathrynlavery/diagram-design](https://github.com/cathrynlavery/diagram-design)을 참고했습니다. 원 프로젝트의 코드·아이콘·예제 이미지를 복제하지 않았습니다.

Diagram Design은 MIT License이며 Copyright (c) 2025 Cathryn Lavery입니다. 원 프로젝트의 라이선스와 저작권은 해당 권리자에게 있습니다.
