import { readFileSync } from "node:fs";
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

type FixtureCase = Readonly<{
  proposal: Readonly<{
    tool: string;
    permissions: readonly string[];
    input: unknown;
  }>;
  approvalGranted: boolean;
  expectedCode: string;
}>;

function fixtureFailureCode(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes("등록되지 않은")) return "UNKNOWN_TOOL";
  if (message.includes("범위를 벗어난")) return "PERMISSION_ESCALATION";
  if (message.includes("schema")) return "INPUT_SCHEMA_INVALID";
  if (message.includes("승인")) return "APPROVAL_REQUIRED";
  return "UNMAPPED_FAILURE";
}

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

  it("Python과 같은 공통 tool fixture failure code를 사용한다", () => {
    const cases = JSON.parse(
      readFileSync(
        new URL(
          "../../../shared/contract-fixtures/tool-proposals.json",
          import.meta.url,
        ),
        "utf8",
      ),
    ) as readonly FixtureCase[];
    const registry = createToolRegistry([
      {
        ...readFile,
        name: "read_note",
        validateInput: (input) =>
          typeof input === "object" && input !== null && "note_id" in input,
      },
      {
        ...deployPreview,
        name: "publish_note",
        permissions: ["deploy"],
        validateInput: (input) =>
          typeof input === "object" && input !== null && "note_id" in input,
      },
    ]);
    for (const fixture of cases) {
      try {
        validateToolProposal(
          registry,
          fixture.proposal,
          fixture.approvalGranted,
        );
        expect(fixture.expectedCode).toBe("PASS");
      } catch (error) {
        expect(fixtureFailureCode(error)).toBe(fixture.expectedCode);
      }
    }
  });
});
