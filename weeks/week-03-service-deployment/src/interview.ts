import type { ServiceSpec } from "./contracts.js";
import { buildServiceSpec } from "./spec.js";

export type DeepInterviewAnswers = Readonly<{
  role?: unknown;
  usageContext?: unknown;
  problem?: unknown;
  coreFlow?: unknown;
  failureRecovery?: unknown;
  dataBoundary?: unknown;
  permissionBoundary?: unknown;
  successMetric?: unknown;
  outOfScope?: unknown;
}>;

export type InterviewServiceSpec = ServiceSpec &
  Readonly<{
    usageContext: string;
    failureRecovery: string;
    dataBoundary: string;
    permissionBoundary: string;
  }>;

export type InterviewDraft = Readonly<{
  spec: InterviewServiceSpec | null;
  confirmedAnswers: Readonly<Record<string, string | readonly string[]>>;
  openQuestions: readonly string[];
}>;

const QUESTIONS = Object.freeze({
  role: "이 서비스를 실제로 사용하는 역할은 누구입니까?",
  usageContext: "어떤 상황과 빈도로 사용합니까?",
  problem: "현재 해결해야 할 핵심 문제는 무엇입니까?",
  coreFlow: "정상 흐름을 순서대로 설명해 주세요.",
  failureRecovery: "실패했을 때 복구·재시도·중단 기준은 무엇입니까?",
  dataBoundary: "사용 가능한 데이터와 금지 데이터는 무엇입니까?",
  permissionBoundary: "허용 권한과 사람 승인이 필요한 행동은 무엇입니까?",
  successMetric: "성공을 판정할 측정 가능한 지표는 무엇입니까?",
  outOfScope: "이번 실습에서 명시적으로 제외할 범위는 무엇입니까?",
});

function text(value: unknown): string | null {
  return typeof value === "string" && value.trim().length >= 3
    ? value.trim()
    : null;
}

function textList(value: unknown): readonly string[] | null {
  if (!Array.isArray(value) || value.length === 0) return null;
  const result = value.map(text);
  return result.some((item) => item === null)
    ? null
    : Object.freeze(result as string[]);
}

export function createInterviewDraft(
  input: DeepInterviewAnswers,
): InterviewDraft {
  const values = {
    role: text(input.role),
    usageContext: text(input.usageContext),
    problem: text(input.problem),
    coreFlow: textList(input.coreFlow),
    failureRecovery: text(input.failureRecovery),
    dataBoundary: text(input.dataBoundary),
    permissionBoundary: text(input.permissionBoundary),
    successMetric: text(input.successMetric),
    outOfScope: textList(input.outOfScope),
  };
  const confirmedAnswers: Record<string, string | readonly string[]> = {};
  const openQuestions: string[] = [];
  for (const key of Object.keys(QUESTIONS) as (keyof typeof QUESTIONS)[]) {
    const value = values[key];
    if (value === null) openQuestions.push(QUESTIONS[key]);
    else confirmedAnswers[key] = value;
  }
  if (
    !values.role ||
    !values.usageContext ||
    !values.problem ||
    !values.coreFlow ||
    !values.failureRecovery ||
    !values.dataBoundary ||
    !values.permissionBoundary ||
    !values.successMetric ||
    !values.outOfScope
  ) {
    return Object.freeze({
      spec: null,
      confirmedAnswers: Object.freeze(confirmedAnswers),
      openQuestions: Object.freeze(openQuestions),
    });
  }
  const baseSpec = buildServiceSpec({
    problem: values.problem,
    targetUser: `${values.role} — ${values.usageContext}`,
    successMetric: values.successMetric,
    coreFlow: [...values.coreFlow, `실패·복구: ${values.failureRecovery}`],
    outOfScope: values.outOfScope,
  });
  const spec = Object.freeze({
    ...baseSpec,
    usageContext: values.usageContext,
    failureRecovery: values.failureRecovery,
    dataBoundary: values.dataBoundary,
    permissionBoundary: values.permissionBoundary,
  });
  return Object.freeze({
    spec,
    confirmedAnswers: Object.freeze(confirmedAnswers),
    openQuestions: Object.freeze([]),
  });
}
