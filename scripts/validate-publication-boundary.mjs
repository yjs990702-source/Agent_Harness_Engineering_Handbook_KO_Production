import { promises as fs } from "node:fs";
import path from "node:path";

const root = process.cwd();
const self = path.resolve(
  import.meta.dirname,
  "validate-publication-boundary.mjs",
);
const ignoredDirectories = new Set([
  ".git",
  ".next",
  "coverage",
  "dist",
  "node_modules",
  "playwright-report",
  "test-results",
]);
const textExtensions = new Set([
  ".css",
  ".example",
  ".html",
  ".js",
  ".json",
  ".md",
  ".mjs",
  ".sql",
  ".ts",
  ".tsx",
  ".txt",
  ".yaml",
  ".yml",
]);

// This file is intentionally excluded from scanning because it owns the denylist.
const forbidden = [
  "xaikorea/Agent_Harness_Engineering",
  "Project Aegis",
  "packages/model_adapters/src/aegis_models",
  "packages/persistence/src/aegis_persistence",
  "05975b302c2fc31c4ab68f50bb577c45ed2d70e0",
];
const piiPatterns = [
  ["대한민국 휴대전화", /\b01[016789]-?\d{3,4}-?\d{4}\b/g],
  ["주민등록번호 형태", /\b\d{6}-[1-4]\d{6}\b/g],
  ["private key", /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g],
];

async function walk(directory) {
  const files = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(fullPath)));
    else if (textExtensions.has(path.extname(entry.name).toLowerCase()))
      files.push(fullPath);
  }
  return files;
}

const failures = [];
for (const file of await walk(root)) {
  if (path.resolve(file) === self) continue;
  const relative = path.relative(root, file).replaceAll("\\", "/");
  const text = await fs.readFile(file, "utf8");
  for (const identifier of forbidden) {
    if (text.toLowerCase().includes(identifier.toLowerCase()))
      failures.push(`${relative}: 공개 금지 식별자`);
  }
  for (const [label, pattern] of piiPatterns) {
    pattern.lastIndex = 0;
    if (pattern.test(text)) failures.push(`${relative}: ${label} 형태`);
  }
}

if (failures.length > 0) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log("출판 경계 검사 통과: 내부 식별자·PII·private key 0건");
}
