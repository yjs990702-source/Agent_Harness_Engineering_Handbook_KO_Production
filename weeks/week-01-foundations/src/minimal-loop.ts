export type ToolSideEffect = "none" | "consequential";

export type ToolDefinition = Readonly<{
  name: string;
  sideEffect: ToolSideEffect;
  validateInput: (value: unknown) => unknown;
  execute: (input: unknown) => Promise<string>;
}>;

export type ModelDecision =
  | Readonly<{ type: "tool"; name: string; input: unknown }>
  | Readonly<{ type: "final"; answer: string }>;

export interface OfflineModel {
  decide(
    input: Readonly<{
      goal: string;
      observations: readonly string[];
    }>,
  ): Promise<unknown>;
}

export type MinimalLoopEvent =
  | Readonly<{ type: "model_decision"; step: number; decision: ModelDecision }>
  | Readonly<{
      type: "tool_result";
      step: number;
      tool: string;
      observation: string;
    }>
  | Readonly<{
      type: "policy_block";
      step: number;
      tool: string;
      reason: string;
    }>;

export type MinimalLoopOutcome = Readonly<{
  status: "completed" | "policy_blocked" | "max_steps";
  answer: string | null;
  events: readonly MinimalLoopEvent[];
}>;

function parseDecision(value: unknown): ModelDecision {
  if (typeof value !== "object" || value === null) {
    throw new TypeError("모델 결정은 객체여야 합니다.");
  }
  const candidate = value as Record<string, unknown>;
  if (candidate.type === "final" && typeof candidate.answer === "string") {
    return { type: "final", answer: candidate.answer };
  }
  if (
    candidate.type === "tool" &&
    typeof candidate.name === "string" &&
    "input" in candidate
  ) {
    return { type: "tool", name: candidate.name, input: candidate.input };
  }
  throw new TypeError("모델 결정 스키마가 유효하지 않습니다.");
}

function indexTools(
  tools: readonly ToolDefinition[],
): ReadonlyMap<string, ToolDefinition> {
  const registry = new Map<string, ToolDefinition>();
  for (const tool of tools) {
    if (registry.has(tool.name)) {
      throw new Error(`중복 도구 이름: ${tool.name}`);
    }
    registry.set(tool.name, tool);
  }
  return registry;
}

export async function runMinimalLoop(
  input: Readonly<{
    goal: string;
    model: OfflineModel;
    tools: readonly ToolDefinition[];
    maxSteps?: number;
  }>,
): Promise<MinimalLoopOutcome> {
  const maxSteps = input.maxSteps ?? 4;
  if (!Number.isInteger(maxSteps) || maxSteps < 1 || maxSteps > 8) {
    throw new RangeError("maxSteps는 1~8의 정수여야 합니다.");
  }

  const registry = indexTools(input.tools);
  const observations: string[] = [];
  const events: MinimalLoopEvent[] = [];

  for (let step = 1; step <= maxSteps; step += 1) {
    const decision = parseDecision(
      await input.model.decide({
        goal: input.goal,
        observations: Object.freeze([...observations]),
      }),
    );
    events.push({ type: "model_decision", step, decision });

    if (decision.type === "final") {
      return {
        status: "completed",
        answer: decision.answer,
        events: Object.freeze(events),
      };
    }

    const tool = registry.get(decision.name);
    if (!tool) {
      throw new Error(`등록되지 않은 도구: ${decision.name}`);
    }
    if (tool.sideEffect === "consequential") {
      events.push({
        type: "policy_block",
        step,
        tool: tool.name,
        reason: "1주차 최소 루프는 부작용 도구를 실행하지 않습니다.",
      });
      return {
        status: "policy_blocked",
        answer: null,
        events: Object.freeze(events),
      };
    }

    const validatedInput = tool.validateInput(decision.input);
    const observation = await tool.execute(validatedInput);
    observations.push(observation);
    events.push({
      type: "tool_result",
      step,
      tool: tool.name,
      observation,
    });
  }

  return {
    status: "max_steps",
    answer: null,
    events: Object.freeze(events),
  };
}

export class ScriptedModel implements OfflineModel {
  readonly #decisions: readonly unknown[];
  #index = 0;

  constructor(decisions: readonly unknown[]) {
    this.#decisions = decisions;
  }

  async decide(): Promise<unknown> {
    const decision = this.#decisions[this.#index];
    if (decision === undefined) {
      throw new Error("준비된 모델 결정이 없습니다.");
    }
    this.#index += 1;
    return decision;
  }
}
