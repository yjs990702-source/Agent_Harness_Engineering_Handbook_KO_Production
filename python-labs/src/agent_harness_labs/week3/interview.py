"""Deep Interview draft that refuses to guess missing requirements."""

from dataclasses import dataclass

from agent_harness_labs.errors import ContractError


@dataclass(frozen=True)
class InterviewDraft:
    service_name: str | None
    primary_user: str | None
    success_measure: str | None
    open_questions: tuple[str, ...]


@dataclass(frozen=True)
class ServiceSpec:
    service_name: str
    primary_user: str
    success_measure: str


def draft_interview(answers: dict[str, object]) -> InterviewDraft:
    questions: list[str] = []

    def answer(field: str, question: str) -> str | None:
        value = answers.get(field)
        if not isinstance(value, str) or not value.strip():
            questions.append(question)
            return None
        return value.strip()

    return InterviewDraft(
        service_name=answer("service_name", "서비스 이름은 무엇입니까?"),
        primary_user=answer("primary_user", "주 사용자는 누구입니까?"),
        success_measure=answer("success_measure", "성공 측정 기준은 무엇입니까?"),
        open_questions=tuple(questions),
    )


def finalize_spec(draft: InterviewDraft) -> ServiceSpec:
    if draft.open_questions:
        raise ContractError("OPEN_QUESTIONS", "미응답 질문이 남아 있습니다.")
    if (
        draft.service_name is None
        or draft.primary_user is None
        or draft.success_measure is None
    ):
        raise ContractError("SPEC_INCOMPLETE", "명세 필드가 완전하지 않습니다.")
    return ServiceSpec(draft.service_name, draft.primary_user, draft.success_measure)
