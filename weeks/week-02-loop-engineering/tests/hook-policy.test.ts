import { describe, expect, it } from "vitest";
import { evaluatePreToolUse, parseHookInput } from "../src/hook-policy.js";

function decision(filePath: string) {
  return evaluatePreToolUse(
    parseHookInput({ tool_name: "Write", tool_input: { file_path: filePath } }),
  );
}

describe("PreToolUse hook policy", () => {
  it("일반 source 수정을 허용한다", () => {
    expect(
      decision("weeks/week-02-loop-engineering/src/example.ts").decision,
    ).toBe("allow");
  });

  it.each([
    {
      label: "환경 파일",
      values: [".env", ".env.production", "config/.env.local"],
    },
    {
      label: "Git 내부 파일",
      values: [".git/config", "nested/.git/config", "../.git/config"],
    },
    {
      label: "workflow",
      values: [".github/workflows/ci.yml", "nested/.github/workflows/ci.yml"],
    },
  ])("민감 경로 그룹 $label을 차단한다", ({ values }) => {
    for (const file of values) {
      expect(decision(file)).toMatchObject({ decision: "block" });
    }
  });

  it.each([
    { label: "Git·Unix", values: ["git clean -fdx", "rm -rf ./build"] },
    {
      label: "PowerShell",
      values: ["Remove-Item ./build -Recurse", "git reset --hard HEAD~1"],
    },
    {
      label: "연결·강제 push",
      values: ["npm run verify && rm -rf .", "git push origin main --force"],
    },
  ])("위험 명령 그룹 $label을 차단한다", ({ values }) => {
    for (const command of values) {
      const result = evaluatePreToolUse(
        parseHookInput({ tool_name: "Bash", tool_input: { command } }),
      );
      expect(result.decision).toBe("block");
    }
  });

  it("필요한 로컬 검증 명령은 허용한다", () => {
    const result = evaluatePreToolUse(
      parseHookInput({
        tool_name: "Bash",
        tool_input: { command: "npm run verify:week2" },
      }),
    );
    expect(result.decision).toBe("allow");
  });

  it("잘못된 Hook 입력은 허용으로 우회하지 않는다", () => {
    expect(() => parseHookInput({ tool_input: {} })).toThrow(/tool_name/);
  });
});
