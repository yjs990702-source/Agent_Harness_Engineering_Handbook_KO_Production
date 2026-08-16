import { promises as fs } from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "README.md",
  "AGENTS.md",
  "CLAUDE.md",
  "SECURITY.md",
  "LICENSE_DECISION_REQUIRED.md",
  "docs/CURRICULUM.md",
  "docs/CURRICULUM_HARNESS_FIRST.md",
  "docs/AUTHORS.md",
  "docs/PUBLICATION_SCOPE.md",
  "docs/DEVELOPMENT_PUBLICATION_BOUNDARY.md",
  "docs/DISCLOSURE_POLICY.md",
  "docs/CONTENT_CLASSIFICATION.md",
  "docs/REDACTION_REGISTER.md",
  "docs/CODE_PROVENANCE.md",
  "docs/LAB_ACCEPTANCE_CRITERIA.md",
  "docs/PUBLICATION_REVIEW_CHECKLIST.md",
  "docs/INSTRUCTOR_GUIDE.md",
  "docs/STATUS.md",
  "docs/VERIFICATION.md",
];

const failures = [];

for (const file of required) {
  try {
    await fs.access(path.join(root, file));
  } catch {
    failures.push(`필수 파일 누락: ${file}`);
  }
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

async function walk(directory) {
  const files = [];
  let entries = [];
  try {
    entries = await fs.readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") return files;
    throw error;
  }
  for (const entry of entries) {
    if (["node_modules", ".next", "coverage", "dist"].includes(entry.name))
      continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(fullPath)));
    else files.push(fullPath);
  }
  return files;
}

const sourceFiles = (
  await Promise.all(
    ["weeks", "optional"].map((directory) => walk(path.join(root, directory))),
  )
)
  .flat()
  .filter((file) => /\.(?:ts|tsx|js|mjs)$/i.test(file));
const bannedSinks = [
  ["dangerouslySetInnerHTML", /dangerouslySetInnerHTML/],
  ["DOM innerHTML sink", /\.(?:innerHTML|outerHTML)\s*=/],
  ["insertAdjacentHTML", /insertAdjacentHTML\s*\(/],
  ["document.write", /document\.write\s*\(/],
  ["eval", /\beval\s*\(/],
  ["new Function", /\bnew\s+Function\s*\(/],
];

for (const file of sourceFiles) {
  const relative = path.relative(root, file).replaceAll("\\", "/");
  const text = await fs.readFile(file, "utf8");
  for (const [label, pattern] of bannedSinks) {
    if (pattern.test(text)) failures.push(`${relative}: 금지된 ${label}`);
  }
}

const envExample = await fs.readFile(path.join(root, ".env.example"), "utf8");
for (const line of envExample.split(/\r?\n/)) {
  if (
    /^(?:NEXT_PUBLIC_SUPABASE_URL|NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY|SUPABASE_SERVICE_ROLE_KEY)=.+/.test(
      line,
    )
  ) {
    failures.push(
      ".env.example에 실제 값처럼 보이는 Supabase 설정이 있습니다.",
    );
  }
}

if (failures.length > 0) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    `저장소 정책 검사 통과: 필수 문서 ${required.length}개, source ${sourceFiles.length}개`,
  );
}
