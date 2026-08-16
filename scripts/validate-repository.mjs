import { promises as fs } from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  ".agents/handoffs/week-03-example.md",
  ".agents/tasks/week-03-lab.md",
  ".claude/rules/security.md",
  ".claude/rules/testing.md",
  ".gitattributes",
  ".gitignore",
  "AGENTS.md",
  "CLAUDE.md",
  "LICENSE_DECISION_REQUIRED.md",
  "README.md",
  "THIRD_PARTY_NOTICES.md",
  "docs/CURRICULUM.md",
  "docs/INSTRUCTOR_GUIDE.md",
  "docs/LAB_ACCEPTANCE_CRITERIA.md",
  "docs/VERIFICATION.md",
  "docs/VERIFICATION_REPORT.md",
  "package-lock.json",
  "package.json",
  "scripts/validate-repository.mjs",
  "weeks/week-01-foundations/README.md",
  "weeks/week-02-loop-engineering/README.md",
  "weeks/week-03-multi-agent/README.md",
];

const allowedFiles = new Set(required);
const allowedPrefixes = ["weeks/"];
const ignoredDirectories = new Set([
  ".cache",
  ".git",
  ".tmp",
  "coverage",
  "dist",
  "node_modules",
]);
const failures = [];

function normalize(file) {
  return file.replaceAll("\\", "/");
}

async function walk(directory) {
  const files = [];
  const entries = await fs.readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(fullPath)));
    else files.push(fullPath);
  }
  return files;
}

const repositoryFiles = (await walk(root)).map((file) =>
  normalize(path.relative(root, file)),
);

for (const file of required) {
  if (!repositoryFiles.includes(file)) failures.push(`필수 파일 누락: ${file}`);
}

for (const file of repositoryFiles) {
  const allowed =
    allowedFiles.has(file) ||
    allowedPrefixes.some((prefix) => file.startsWith(prefix));
  if (!allowed) failures.push(`교육 실습 범위 밖 파일: ${file}`);
}

const workflowDirectory = path.join(root, ".github", "workflows");
try {
  const entries = await fs.readdir(workflowDirectory);
  if (entries.some((name) => /\.ya?ml$/i.test(name))) {
    failures.push("금지된 GitHub Actions workflow가 존재합니다.");
  }
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

const sourceFiles = repositoryFiles.filter(
  (file) => file.startsWith("weeks/") && /\.(?:ts|js|mjs)$/i.test(file),
);
const banned = [
  [
    "HTML sink",
    /dangerouslySetInnerHTML|\.(?:innerHTML|outerHTML)\s*=|\binsertAdjacentHTML\s*\(|\bdocument\.write\s*\(/,
  ],
  ["동적 코드 실행", /\beval\s*\(|\bnew\s+Function\s*\(/],
  ["private key", /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
];

for (const file of sourceFiles) {
  const text = await fs.readFile(path.join(root, file), "utf8");
  for (const [label, pattern] of banned) {
    if (pattern.test(text)) failures.push(`${file}: 금지된 ${label}`);
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    `교육 실습 저장소 검사 통과: 필수 파일 ${required.length}개, source ${sourceFiles.length}개, 범위 밖 파일 0개, Actions workflow 0개`,
  );
}
