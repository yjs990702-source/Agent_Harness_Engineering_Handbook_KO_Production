import { describe, expect, it } from "vitest";
import {
  createToolRegistry,
  validateToolProposal,
  type ToolDescriptor,
} from "../src/tool-contract.js";

const readFile: ToolDescriptor = {
  name: "read_file",
  sideEffect: "none",
  permissions: ["read"],
  requiresApproval: false,
  validateInput: (input) =>
    typeof input === "object" && input !== null && "path" in input,
  outputSchema: "{ content: string }",
};

const deployPreview: ToolDescriptor = {
  name: "deploy_preview",
  sideEffect: "consequential",
  permissions: ["deploy", "network"],
  requiresApproval: true,
  validateInput: (input) =>
    typeof input === "object" && input !== null && "commitSha" in input,
  outputSchema: "{ previewId: string }",
};

describe("오프라인 MCP tool contract", () => {
  it("등록된 읽기 도구의 구조화된 제안만 허용한다", () => {
    const registry = createToolRegistry([readFile]);
    expect(
      validateToolProposal(registry, {
        tool: "read_file",
        permissions: ["read"],
        input: { path: "docs/CURRICULUM.md" },
      }),
    ).toMatchObject({ tool: "read_file", sideEffect: "none" });
  });

  it("중복 이름, 알 수 없는 권한, 출력 schema 누락을 거부한다", () => {
    expect(() => createToolRegistry([readFile, readFile])).toThrow(/중복/);
    expect(() =>
      createToolRegistry([
        {
          ...readFile,
          name: "bad_permission",
          permissions: ["root" as "read"],
        },
      ]),
    ).toThrow(/권한/);
    expect(() =>
      createToolRegistry([
        { ...readFile, name: "no_schema", outputSchema: "" },
      ]),
    ).toThrow(/schema/);
  });

  it("descriptor보다 큰 권한과 유효하지 않은 입력을 거부한다", () => {
    const registry = createToolRegistry([readFile]);
    expect(() =>
      validateToolProposal(registry, {
        tool: "read_file",
        permissions: ["read", "write"],
        input: { path: "README.md" },
      }),
    ).toThrow(/범위/);
    expect(() =>
      validateToolProposal(registry, {
        tool: "read_file",
        permissions: ["read"],
        input: "README.md",
      }),
    ).toThrow(/schema/);
  });

  it("부작용 도구는 명시적 승인 전에는 검증을 통과하지 않는다", () => {
    const registry = createToolRegistry([deployPreview]);
    const proposal = {
      tool: "deploy_preview",
      permissions: ["deploy"] as const,
      input: { commitSha: "0123456" },
    };
    expect(() => validateToolProposal(registry, proposal)).toThrow(/승인/);
    expect(validateToolProposal(registry, proposal, true)).toMatchObject({
      tool: "deploy_preview",
      sideEffect: "consequential",
    });
  });
});
