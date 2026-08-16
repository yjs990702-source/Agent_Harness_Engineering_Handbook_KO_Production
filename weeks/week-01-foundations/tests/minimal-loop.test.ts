import { describe, expect, it, vi } from "vitest";
import {
  ScriptedModel,
  runMinimalLoop,
  type ToolDefinition,
} from "../src/minimal-loop.js";

const lookup: ToolDefinition = {
  name: "lookup_request",
  sideEffect: "none",
  validateInput(value) {
    if (typeof value !== "string") throw new TypeError("문자열 ID 필요");
    return value;
  },
  async execute(input) {
    return `found:${String(input)}`;
  },
};

describe("runMinimalLoop", () => {
  it("도구 관찰을 다음 결정에 전달하고 완료한다", async () => {
    const outcome = await runMinimalLoop({
      goal: "요청 상태 확인",
      model: new ScriptedModel([
        { type: "tool", name: "lookup_request", input: "REQ-001" },
        { type: "final", answer: "요청을 찾았습니다." },
      ]),
      tools: [lookup],
    });

    expect(outcome.status).toBe("completed");
    expect(outcome.answer).toBe("요청을 찾았습니다.");
    expect(outcome.events.map((event) => event.type)).toEqual([
      "model_decision",
      "tool_result",
      "model_decision",
    ]);
  });

  it("모델의 잘못된 도구 호출 스키마를 실행 전에 거부한다", async () => {
    await expect(
      runMinimalLoop({
        goal: "잘못된 호출",
        model: new ScriptedModel([{ type: "tool", name: 7 }]),
        tools: [lookup],
      }),
    ).rejects.toThrow(/스키마/);
  });

  it("승인 경계가 없는 최소 루프에서 부작용 도구를 차단한다", async () => {
    const execute = vi.fn(async () => "deleted");
    const outcome = await runMinimalLoop({
      goal: "요청 삭제",
      model: new ScriptedModel([
        { type: "tool", name: "delete_request", input: "REQ-001" },
      ]),
      tools: [
        {
          name: "delete_request",
          sideEffect: "consequential",
          validateInput: (value) => value,
          execute,
        },
      ],
    });

    expect(outcome.status).toBe("policy_blocked");
    expect(execute).not.toHaveBeenCalled();
  });

  it("무한 반복 대신 maxSteps에서 중단한다", async () => {
    const outcome = await runMinimalLoop({
      goal: "반복 제한",
      model: new ScriptedModel([
        { type: "tool", name: "lookup_request", input: "A" },
        { type: "tool", name: "lookup_request", input: "B" },
      ]),
      tools: [lookup],
      maxSteps: 2,
    });

    expect(outcome.status).toBe("max_steps");
    expect(outcome.events).toHaveLength(4);
  });
});
