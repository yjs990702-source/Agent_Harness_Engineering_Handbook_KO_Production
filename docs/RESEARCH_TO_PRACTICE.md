# 연구에서 공개 실습으로

기준일: 2026-08-17

이 문서는 공개 연구와 공식 프로젝트에서 확인한 원리를 이 저장소의 교육 실습에 어떻게 독립적으로 재구성했는지 설명합니다. 제3자의 PDF, 원문, 그림, 표, 템플릿, 코드를 이 저장소에 포함하지 않습니다.

## 핵심 설계 결론

1. 모델·하네스·환경의 경계를 먼저 보이고 최소 루프에서 출발합니다.
2. 복잡한 에이전트 전에 검색→수정→검증 같은 단순 기준선을 측정합니다.
3. 도구 호출은 구조화된 제안이며 실제 부작용은 결정론적 정책·승인 뒤에 수행합니다.
4. 대화 컨텍스트와 실행 상태를 분리하고 event·checkpoint·인계 파일로 재개합니다.
5. 역할 수보다 TaskSpec·Evidence·handoff 같은 산출물 계약을 우선합니다.
6. 평가는 결과·과정·안전·비용과 반복 신뢰성을 함께 봅니다.
7. 멀티에이전트는 독립 작업·권한 차이·컨텍스트 격리·독립 평가가 필요할 때만 사용합니다.

## 논문에서 실습으로

| 연구 흐름                                                                                         | 이 저장소의 적용                                            |
| ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| [ReAct](https://arxiv.org/abs/2210.03629), [Toolformer](https://arxiv.org/abs/2302.04761)         | `minimal-loop.ts`의 decision→tool→observation과 schema 검증 |
| [Reflexion](https://arxiv.org/abs/2303.11366)                                                     | repair feedback과 반복 실패 signature·상한                  |
| [MetaGPT](https://arxiv.org/abs/2308.00352), [ChatDev](https://arxiv.org/abs/2307.07924)          | 역할 수가 아니라 구조화된 산출물·DAG를 비교하는 선택 심화   |
| [SWE-agent](https://arxiv.org/abs/2405.15793)                                                     | 모델에 노출하는 도구·관찰 인터페이스를 작게 유지            |
| [Agentless](https://arxiv.org/abs/2407.01489)                                                     | 멀티에이전트 전에 단순 기준선과 비교                        |
| [SWE-bench](https://arxiv.org/abs/2310.06770), [SWE-bench Live](https://arxiv.org/abs/2505.23419) | 고정 회귀 과제와 최신 과제를 분리하는 평가 원칙             |
| [SWE-Lancer](https://arxiv.org/abs/2502.12115)                                                    | 사용자 가치와 사람 검토를 Contest 평가에서 분리             |
| [SWE-Gym](https://arxiv.org/abs/2412.21139)                                                       | 결과뿐 아니라 실행 궤적과 verifier 실패를 Evidence로 기록   |
| [AutoFlow](https://arxiv.org/abs/2407.12821), [AFlow](https://arxiv.org/abs/2410.10762)           | workflow 자동 변경은 운영 중이 아니라 오프라인 평가 뒤 승격 |

OSWorld, OpenHands, 최신 하네스·MAS 경험 보고는 GUI 환경, 샌드박스, 관측성의 중요성을 보여 주지만 13시간 기본 실습 범위를 벗어나므로 선택 읽기로 둡니다.

## 오픈소스에서 확인할 구현 선택지

- [LangGraph](https://github.com/langchain-ai/langgraph): durable state graph, checkpoint, human-in-the-loop의 공급자 중립 참고체
- [OpenAI Agents SDK](https://github.com/openai/openai-agents-python): tools, guardrails, handoffs/agents-as-tools, tracing, sandbox를 단순하게 구성하는 선택지
- [PydanticAI](https://github.com/pydantic/pydantic-ai): typed tool contract, eval, OpenTelemetry 참고체
- [OpenHands](https://github.com/OpenHands/OpenHands), [SWE-agent](https://github.com/SWE-agent/SWE-agent): 코딩 실행 환경과 agent-computer interface 참고체
- [Microsoft Agent Framework](https://github.com/microsoft/agent-framework): Python/.NET, graph, checkpoint, HITL, MCP/A2A 선택지
- [MCP Servers](https://github.com/modelcontextprotocol/servers): 교육용 참조 구현이며 서버별 라이선스·위협 모델을 별도 확인
- [A2A](https://github.com/a2aproject/A2A): 실제 원격·조직 경계가 있을 때만 도입

AutoGen은 역사적 학습 자료로만 다루고 현재 유지보수·후속 프로젝트 상태를 공식 README에서 다시 확인합니다. GitHub stars는 채택률·품질·보안 지표로 사용하지 않습니다.

## 공개 책·가이드와 권리

- [Harness Engineering Guide](https://github.com/nexu-io/harness-engineering-guide): MIT. 최소 루프·컨텍스트·오류 복구·장기 실행의 읽기 자료.
- [12 Factor Agents](https://github.com/humanlayer/12-factor-agents): 본문 CC BY-SA 4.0, 코드 Apache-2.0. control flow·context·reducer state의 읽기 자료.
- [AI Agents in Depth](https://github.com/bojieli/ai-agent-book): 저장소 Apache-2.0. model–harness–environment·평가·멀티에이전트 분류의 읽기 자료.
- [Agentic SDLC Handbook](https://github.com/danielmeppiel/agentic-sdlc-handbook): 본문 CC BY-NC-ND 4.0. 상업 출판물에 문장·그림·편집 구조를 개작하지 않습니다.
- [Harness Engineering: The Complete Guide](https://github.com/alchaincyf/harness-engineering-orange-book): 표준 오픈 라이선스를 확인할 수 없어 개념 인용만 합니다.
- [Agentic Software Engineering](https://agenticse-book.github.io/pdf/AgenticSE_Book.pdf): All Rights Reserved. 서지 인용과 독립적인 원리 설명에만 사용합니다.

이 저장소의 `DelegationBrief`, `AutonomyPolicy`, `EvidencePack`, `ContinuationPack`은 기존 TaskSpec·테스트 계약을 바탕으로 새로 작성한 교육용 구조입니다. 제3자 서적의 고유 템플릿과 도식은 복제하지 않았습니다.

## 시점·법률 Gate

- 모델명·가격·SDK API·저장소 유지보수 상태는 출판·강의 직전에 공식 문서로 다시 확인합니다.
- 공개 PDF는 자동으로 재배포 가능한 자료가 아닙니다. 원본은 이 저장소에 넣지 않습니다.
- 특허 문헌은 회피 설계와 전문 검토의 출발점일 뿐 비침해 판단이 아닙니다.
- 교육 코드를 회사 시스템에 적용할 때는 데이터·보안·라이선스·특허 검토를 새로 수행합니다.

## 재현

```powershell
npm ci
npm run verify
```

기본 검증은 외부 모델·DB·클라우드 계정을 사용하지 않습니다. 실제 모델 연결 결과는 별도의 골든 과제와 비용·지연·보안 Gate로 검증해야 합니다.
