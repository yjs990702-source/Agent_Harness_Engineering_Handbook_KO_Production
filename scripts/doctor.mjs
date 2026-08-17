import { access, readdir } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";

const root = process.cwd();
let hardFailures = 0;

function report(level, subject, detail) {
  console.log(`[${level}] ${subject}: ${detail}`);
  if (level === "FAIL") hardFailures += 1;
}

async function exists(relativePath) {
  try {
    await access(path.join(root, relativePath));
    return true;
  } catch {
    return false;
  }
}

// 숫자 세 개만 비교하면 prerelease 문구나 배포판 이름에 영향받지 않습니다.
function versionAtLeast(actual, minimum) {
  const current = actual.replace(/^v/, "").split(".").map(Number);
  const required = minimum.split(".").map(Number);
  return required.every(
    (value, index) =>
      (current[index] ?? 0) >= value ||
      current.slice(0, index).some((item, prior) => item > required[prior]),
  );
}

// Python 실행 파일 선택 규칙은 verify-python과 같은 순서를 사용합니다.
// shell을 거치지 않으므로 경로와 인자가 명령 문자열로 다시 해석되지 않습니다.
const pythonCandidates = process.env.PYTHON_BIN
  ? [{ command: process.env.PYTHON_BIN, prefix: [] }]
  : [
      {
        command: path.join(root, ".venv", "Scripts", "python.exe"),
        prefix: [],
      },
      { command: path.join(root, ".venv", "bin", "python"), prefix: [] },
      { command: "python", prefix: [] },
      { command: "python3", prefix: [] },
      { command: "py", prefix: ["-3.11"] },
    ];

console.log("Agent Harness 교육 환경 진단\n");
report(
  (await exists("package.json")) ? "PASS" : "FAIL",
  "repository root",
  root,
);
report(
  versionAtLeast(process.version, "20.9.0") ? "PASS" : "FAIL",
  "Node.js",
  `${process.version} (필요: 20.9.0+)`,
);
report(
  (await exists("package-lock.json")) ? "PASS" : "FAIL",
  "package-lock.json",
  "재현 가능한 npm 설치 기준",
);
report(
  (await exists("node_modules")) ? "PASS" : "WARN",
  "node_modules",
  (await exists("node_modules")) ? "설치됨" : "npm ci를 실행하세요",
);
report(
  (await exists("shared/contract-fixtures/tool-proposals.json"))
    ? "PASS"
    : "FAIL",
  "공통 fixture",
  "TypeScript·Python 계약 입력",
);

let pythonFound = false;
for (const candidate of pythonCandidates) {
  const result = spawnSync(
    candidate.command,
    [...candidate.prefix, "--version"],
    {
      cwd: root,
      encoding: "utf8",
      shell: false,
      windowsHide: true,
    },
  );
  if (result.status === 0) {
    const output = `${result.stdout}${result.stderr}`.trim();
    const match = output.match(/Python\s+(\d+)\.(\d+)/);
    const supported =
      match &&
      (Number(match[1]) > 3 ||
        (Number(match[1]) === 3 && Number(match[2]) >= 11));
    report(supported ? "PASS" : "WARN", "Python 3.11+", output);
    pythonFound = true;
    break;
  }
}
if (!pythonFound)
  report("WARN", "Python 3.11+", "Python 트랙을 사용할 때 설치하세요");

try {
  const workflows = await readdir(path.join(root, ".github", "workflows"));
  const count = workflows.filter((name) => /\.ya?ml$/i.test(name)).length;
  report(
    count === 0 ? "PASS" : "FAIL",
    "GitHub Actions workflow",
    `${count}개`,
  );
} catch (error) {
  if (error.code === "ENOENT") report("PASS", "GitHub Actions workflow", "0개");
  else throw error;
}

console.log();
if (hardFailures > 0) {
  console.error(
    `환경 진단 실패: 기본 문제 ${hardFailures}개를 먼저 해결하세요.`,
  );
  process.exitCode = 1;
} else {
  console.log("환경 진단 완료: 기본 실습을 시작할 수 있습니다.");
}
