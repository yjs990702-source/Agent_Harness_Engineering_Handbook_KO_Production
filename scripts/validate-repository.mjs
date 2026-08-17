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
  "weeks/week-01-foundations/lessons/08-rule-skill-mcp-contract.md",
  "weeks/week-02-loop-engineering/lessons/01-hook-policy.md",
  "weeks/week-02-loop-engineering/lessons/02-role-contracts.md",
  "weeks/week-02-loop-engineering/lessons/03-owned-path.md",
  "weeks/week-02-loop-engineering/lessons/04-verifier-evaluator.md",
  "weeks/week-02-loop-engineering/lessons/05-handoff.md",
  "weeks/week-02-loop-engineering/lessons/06-read-only-boundary.md",
  "weeks/week-02-loop-engineering/lessons/07-repair-loop.md",
  "weeks/week-02-loop-engineering/lessons/08-approval-resume.md",
  "weeks/week-02-loop-engineering/lessons/09-evaluation-portfolio.md",
  "weeks/week-02-loop-engineering/lessons/10-worktree-preflight.md",
  "weeks/week-02-loop-engineering/lessons/11-harness-diet.md",
  "weeks/week-03-service-deployment/lessons/01-deep-interview-spec.md",
  "weeks/week-03-service-deployment/lessons/02-zero-setting.md",
  "weeks/week-03-service-deployment/lessons/03-tdd-service.md",
  "weeks/week-03-service-deployment/lessons/04-security-gates.md",
  "weeks/week-03-service-deployment/lessons/05-deployment-evidence.md",
  "weeks/week-03-service-deployment/lessons/06-commit-pr-review.md",
  "weeks/week-03-service-deployment/lessons/07-contest-day.md",
  "weeks/week-03-service-deployment/lessons/08-retrospective-transfer.md",
  "weeks/week-03-service-deployment/lessons/09-evidence-driven-delivery.md",
  "weeks/week-03-service-deployment/lessons/10-deep-interview-to-spec.md",
  "weeks/week-03-service-deployment/lessons/11-security-regression-pack.md",
  "weeks/week-03-multi-agent/lessons/01-request-spec.md",
  "weeks/week-03-multi-agent/lessons/02-role-handoff-contracts.md",
  "weeks/week-03-multi-agent/lessons/03-dag-validation.md",
  "weeks/week-03-multi-agent/lessons/04-owned-path.md",
  "weeks/week-03-multi-agent/lessons/05-parallel-waves.md",
  "weeks/week-03-multi-agent/lessons/06-read-only-reviewer.md",
  "weeks/week-03-multi-agent/lessons/07-independent-verifier.md",
  "weeks/week-03-multi-agent/lessons/08-end-to-end-retrospective.md",
  "weeks/week-03-multi-agent/lessons/09-topology-gate.md",
  "weeks/week-03-multi-agent/lessons/10-failure-modes-and-fan-in.md",
  "python-labs/lessons/01-python-preflight.md",
  "python-labs/lessons/02-minimal-loop-and-tool-contract.md",
  "python-labs/lessons/03-approval-and-evaluator.md",
  "python-labs/lessons/04-interview-security-release.md",
  "python-labs/lessons/05-multi-agent-extension.md",
];
const required = [
  ".agents/handoffs/week-03-example.md",
  ".agents/handoffs/week-03-service-example.md",
  ".agents/tasks/week-03-lab.md",
  ".agents/tasks/week-03-service-lab.md",
  ".claude/rules/security.md",
  ".claude/rules/testing.md",
  ".claude/skills/pr-draft/SKILL.md",
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
  "docs/BOOK_TO_LAB_TRACEABILITY.md",
  "docs/EXPECTED_FAILURES.md",
  "docs/INSTRUCTOR_DEMO_RUNBOOK.md",
  "docs/INSTRUCTOR_GUIDE.md",
  "docs/LAB_ACCEPTANCE_CRITERIA.md",
  "docs/LEARNER_EVIDENCE_TEMPLATE.md",
  "docs/RESEARCH_TO_PRACTICE.md",
  "docs/VERIFICATION.md",
  "docs/VERIFICATION_REPORT.md",
  "docs/LANGUAGE_TRACK_SELECTION.md",
  "docs/PYTHON_TRACK_CURRICULUM.md",
  "package-lock.json",
  "package.json",
  "scripts/validate-repository.mjs",
  "scripts/verify-python.mjs",
  "python-labs/AGENTS.md",
  "python-labs/README.md",
  "python-labs/pyproject.toml",
  "shared/contract-fixtures/tool-proposals.json",
  "shared/contract-fixtures/approval-events.json",
  "shared/contract-fixtures/security-attacks.json",
  "shared/contract-fixtures/release-evidence.json",
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
const allowedPrefixes = ["weeks/", "python-labs/", "shared/contract-fixtures/"];
const ignoredDirectories = new Set([
  ".cache",
  ".git",
  ".mypy_cache",
  ".pytest_cache",
  ".ruff_cache",
  ".tmp",
  ".venv",
  "__pycache__",
  "coverage",
  "dist",
  "node_modules",
]);
const failures = [];

const requiredTraceabilityPaths = [
  ".claude/skills/pr-draft/SKILL.md",
  "weeks/week-01-foundations/src/tool-contract.ts",
  "weeks/week-01-foundations/tests/tool-contract.test.ts",
  "weeks/week-02-loop-engineering/src/approval-loop.ts",
  "weeks/week-02-loop-engineering/tests/approval-loop.test.ts",
  "weeks/week-02-loop-engineering/src/worktree-plan.ts",
  "weeks/week-02-loop-engineering/src/harness-inventory.ts",
  "weeks/week-03-service-deployment/src/interview.ts",
  "weeks/week-03-service-deployment/src/security.ts",
  "weeks/week-03-service-deployment/src/delivery-artifacts.ts",
  "weeks/week-03-multi-agent/src/topology.ts",
  "weeks/week-03-multi-agent/src/coordinator.ts",
  "python-labs/src/agent_harness_labs/week1/tool_contract.py",
  "python-labs/src/agent_harness_labs/week2/approval_loop.py",
  "python-labs/src/agent_harness_labs/week3/security.py",
  "python-labs/src/agent_harness_labs/week3/release_evidence.py",
  "python-labs/src/agent_harness_labs/extension/multi_agent.py",
];

function normalize(file) {
  return file.replaceAll("\\", "/");
}

async function walk(directory) {
  const files = [];
  const entries = await fs.readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    if (
      entry.isDirectory() &&
      (ignoredDirectories.has(entry.name) || entry.name.endsWith(".egg-info"))
    )
      continue;
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
  if (file.startsWith("python-labs/") && !/\.(?:py|md|toml)$/i.test(file))
    failures.push(`Python 실습에서 허용되지 않은 파일 형식: ${file}`);
  if (file.startsWith("shared/contract-fixtures/") && !/\.json$/i.test(file))
    failures.push(`공통 계약 fixture에서 허용되지 않은 파일 형식: ${file}`);
}

for (const lesson of requiredLessons) {
  const text = await fs.readFile(path.join(root, lesson), "utf8");
  if (!/npm run/.test(text))
    failures.push(`${lesson}: 실행 가능한 npm 검증 명령 누락`);
}

const traceabilityText = await fs.readFile(
  path.join(root, "docs/BOOK_TO_LAB_TRACEABILITY.md"),
  "utf8",
);
for (const tracedPath of requiredTraceabilityPaths) {
  if (!traceabilityText.includes(`\`${tracedPath}\``)) {
    failures.push(`추적성 매트릭스 경로 누락: ${tracedPath}`);
  }
}
if (/\.(?:docx|pdf|hwp|pptx|xlsx|zip|7z)\b/i.test(traceabilityText)) {
  failures.push("추적성 매트릭스에 공개 금지 원본 파일 경로가 있습니다.");
}

const skillText = await fs.readFile(
  path.join(root, ".claude/skills/pr-draft/SKILL.md"),
  "utf8",
);
for (const heading of ["## 입력 계약", "## 출력 계약", "## 금지 행동"]) {
  if (!skillText.includes(heading))
    failures.push(`PR Skill 계약 누락: ${heading}`);
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
  (file) =>
    (file.startsWith("weeks/") && /\.(?:ts|js|mjs|html)$/i.test(file)) ||
    (file.startsWith("python-labs/") && /\.py$/i.test(file)),
);
const banned = [
  [
    "HTML sink",
    /dangerouslySetInnerHTML|\.(?:innerHTML|outerHTML)\s*=|\binsertAdjacentHTML\s*\(|\bdocument\.write\s*\(/,
  ],
  ["동적 코드 실행", /\beval\s*\(|\bnew\s+Function\s*\(/],
  ["Python 동적 코드 실행", /\b(?:eval|exec)\s*\(/],
  ["위험한 shell 실행", /\bos\.system\s*\(|\bshell\s*=\s*True\b/],
  ["unsafe 역직렬화", /\bpickle\.loads\s*\(|\byaml\.load\s*\(/],
  ["SQL f-string 실행", /\b(?:execute|executemany)\s*\(\s*f[\"']/],
  ["private key", /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
];

for (const file of sourceFiles) {
  const text = await fs.readFile(path.join(root, file), "utf8");
  for (const [label, pattern] of banned) {
    if (pattern.test(text)) failures.push(`${file}: 금지된 ${label}`);
  }
  if (/\b(?:describe|it|test)\.skip\s*\(/.test(text)) {
    failures.push(`${file}: skip된 테스트 금지`);
  }
  if (
    /\bpytest\.(?:skip|xfail)\s*\(/.test(text) ||
    /xfail\s*\([^)]*strict\s*=\s*False/.test(text)
  ) {
    failures.push(`${file}: Python 검증 우회 금지`);
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
