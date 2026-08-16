import { promises as fs } from "node:fs";
import path from "node:path";

const root = process.cwd();
const requiredLessons = [
  "weeks/week-01-foundations/lessons/01-task-spec.md",
  "weeks/week-01-foundations/lessons/02-input-boundary.md",
  "weeks/week-01-foundations/lessons/03-tenant-isolation.md",
  "weeks/week-01-foundations/lessons/04-request-service.md",
  "weeks/week-01-foundations/lessons/05-evidence-baseline.md",
  "weeks/week-01-foundations/lessons/06-single-worker-harness.md",
  "weeks/week-01-foundations/lessons/07-minimal-offline-loop.md",
  "weeks/week-02-loop-engineering/lessons/01-hook-policy.md",
  "weeks/week-02-loop-engineering/lessons/02-role-contracts.md",
  "weeks/week-02-loop-engineering/lessons/03-owned-path.md",
  "weeks/week-02-loop-engineering/lessons/04-verifier-evaluator.md",
  "weeks/week-02-loop-engineering/lessons/05-handoff.md",
  "weeks/week-02-loop-engineering/lessons/06-read-only-boundary.md",
  "weeks/week-02-loop-engineering/lessons/07-repair-loop.md",
  "weeks/week-02-loop-engineering/lessons/08-approval-resume.md",
  "weeks/week-02-loop-engineering/lessons/09-evaluation-portfolio.md",
  "weeks/week-03-service-deployment/lessons/01-deep-interview-spec.md",
  "weeks/week-03-service-deployment/lessons/02-zero-setting.md",
  "weeks/week-03-service-deployment/lessons/03-tdd-service.md",
  "weeks/week-03-service-deployment/lessons/04-security-gates.md",
  "weeks/week-03-service-deployment/lessons/05-deployment-evidence.md",
  "weeks/week-03-service-deployment/lessons/06-commit-pr-review.md",
  "weeks/week-03-service-deployment/lessons/07-contest-day.md",
  "weeks/week-03-service-deployment/lessons/08-retrospective-transfer.md",
  "weeks/week-03-service-deployment/lessons/09-evidence-driven-delivery.md",
  "weeks/week-03-multi-agent/lessons/01-request-spec.md",
  "weeks/week-03-multi-agent/lessons/02-role-handoff-contracts.md",
  "weeks/week-03-multi-agent/lessons/03-dag-validation.md",
  "weeks/week-03-multi-agent/lessons/04-owned-path.md",
  "weeks/week-03-multi-agent/lessons/05-parallel-waves.md",
  "weeks/week-03-multi-agent/lessons/06-read-only-reviewer.md",
  "weeks/week-03-multi-agent/lessons/07-independent-verifier.md",
  "weeks/week-03-multi-agent/lessons/08-end-to-end-retrospective.md",
  "weeks/week-03-multi-agent/lessons/09-topology-gate.md",
];
const required = [
  ".agents/handoffs/week-03-example.md",
  ".agents/handoffs/week-03-service-example.md",
  ".agents/tasks/week-03-lab.md",
  ".agents/tasks/week-03-service-lab.md",
  ".claude/rules/security.md",
  ".claude/rules/testing.md",
  ".gitattributes",
  ".gitignore",
  "AGENTS.md",
  "CLAUDE.md",
  "CONTRIBUTING.md",
  "LICENSE",
  "LICENSE_SCOPE.md",
  "NOTICE",
  "README.md",
  "THIRD_PARTY_NOTICES.md",
  "docs/CURRICULUM.md",
  "docs/INSTRUCTOR_GUIDE.md",
  "docs/LAB_ACCEPTANCE_CRITERIA.md",
  "docs/RESEARCH_TO_PRACTICE.md",
  "docs/VERIFICATION.md",
  "docs/VERIFICATION_REPORT.md",
  "package-lock.json",
  "package.json",
  "scripts/validate-repository.mjs",
  "weeks/week-01-foundations/README.md",
  "weeks/week-02-loop-engineering/README.md",
  "weeks/week-03-multi-agent/README.md",
  "weeks/week-03-service-deployment/AGENTS.md",
  "weeks/week-03-service-deployment/README.md",
  "weeks/week-03-service-deployment/.env.example",
  "weeks/week-03-service-deployment/deployment-manifest.example.json",
  "weeks/week-03-service-deployment/package.json",
  "weeks/week-03-service-deployment/vercel.json",
  "weeks/week-03-service-deployment/api/health.ts",
  "weeks/week-03-service-deployment/api/requests.ts",
  "weeks/week-03-service-deployment/public/index.html",
  "weeks/week-03-service-deployment/src/deployment.ts",
  "weeks/week-03-service-deployment/src/security.ts",
  "weeks/week-03-service-deployment/tests/security.test.ts",
  ...requiredLessons,
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

const forbiddenPublicationExtension = /\.(?:docx|pdf|hwp|pptx|xlsx|zip|7z)$/i;
const forbiddenPublicationPath =
  /(?:^|\/)(?:manuscript|publication|resume|curriculum-vitae|cover-design|internal-docs?|contracts?|prd)(?:\/|$)/i;
for (const file of repositoryFiles) {
  if (forbiddenPublicationExtension.test(file))
    failures.push(`출판·개인 문서 형식 금지: ${file}`);
  if (forbiddenPublicationPath.test(file))
    failures.push(`공개 실습 범위 밖 경로명: ${file}`);
  if (
    file.startsWith("weeks/") &&
    !/\.(?:ts|md|json|html|example)$/i.test(file)
  )
    failures.push(`주차 폴더에서 허용되지 않은 파일 형식: ${file}`);
}

for (const lesson of requiredLessons) {
  const text = await fs.readFile(path.join(root, lesson), "utf8");
  if (!/npm run/.test(text))
    failures.push(`${lesson}: 실행 가능한 npm 검증 명령 누락`);
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
  (file) => file.startsWith("weeks/") && /\.(?:ts|js|mjs|html)$/i.test(file),
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
    `교육 실습 저장소 검사 통과: 필수 파일 ${required.length}개, 강의 ${requiredLessons.length}개, source ${sourceFiles.length}개, 범위 밖 파일 0개, Actions workflow 0개`,
  );
}
