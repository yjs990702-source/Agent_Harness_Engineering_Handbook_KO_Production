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

  it.each([".env", ".env.production", "config/.env.local"])(
    "민감 파일 %s을 차단한다",
    (file) => {
      expect(decision(file)).toMatchObject({ decision: "block" });
    },
  );

  it("GitHub Actions workflow 생성을 차단한다", () => {
    expect(decision(".github/workflows/ci.yml").reason).toMatch(/workflow/);
  });

  it.each([
    "rm -rf ./build",
    "git reset --hard HEAD~1",
    "git push origin main --force",
  ])("위험 명령 %s을 차단한다", (command) => {
    const result = evaluatePreToolUse(
      parseHookInput({ tool_name: "Bash", tool_input: { command } }),
    );
    expect(result.decision).toBe("block");
  });

  it("잘못된 Hook 입력은 허용으로 우회하지 않는다", () => {
    expect(() => parseHookInput({ tool_input: {} })).toThrow(/tool_name/);
  });
});
