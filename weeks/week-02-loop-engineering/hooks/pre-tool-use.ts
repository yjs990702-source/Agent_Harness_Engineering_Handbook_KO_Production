import { readFile } from "node:fs/promises";
import { evaluatePreToolUse, parseHookInput } from "../src/hook-policy.js";

async function readInput(): Promise<string> {
  const fixturePath = process.argv[2];
  if (fixturePath)
    return readFile(new URL(`../${fixturePath}`, import.meta.url), "utf8");
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString("utf8");
}

try {
  const input = parseHookInput(JSON.parse(await readInput()));
  const decision = evaluatePreToolUse(input);
  process.stdout.write(`${JSON.stringify(decision)}\n`);
  const expected = process.argv[3];
  if (expected && decision.decision !== expected) process.exitCode = 1;
  else if (!expected && decision.decision === "block") process.exitCode = 2;
} catch (error) {
  process.stdout.write(
    `${JSON.stringify({ decision: "block", reason: error instanceof Error ? error.message : "invalid input" })}\n`,
  );
  process.exitCode = 2;
}
