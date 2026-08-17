import { access } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const candidates = process.env.PYTHON_BIN
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

async function exists(command) {
  if (!path.isAbsolute(command)) return true;
  try {
    await access(command);
    return true;
  } catch {
    return false;
  }
}

function run(command, args, quiet = false) {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd: root,
      shell: false,
      stdio: quiet ? "ignore" : "inherit",
      windowsHide: true,
    });
    child.on("error", () => resolve(false));
    child.on("exit", (code) => resolve(code === 0));
  });
}

let selected;
for (const candidate of candidates) {
  if (!(await exists(candidate.command))) continue;
  if (await run(candidate.command, [...candidate.prefix, "--version"], true)) {
    selected = candidate;
    break;
  }
}

if (!selected) {
  console.error(
    "Python 3.11+ interpreter를 찾지 못했습니다. python-labs/README.md를 확인하세요.",
  );
  process.exit(1);
}

const checks = [
  ["ruff", ["-m", "ruff", "check", "python-labs"]],
  [
    "mypy",
    [
      "-m",
      "mypy",
      "--config-file",
      "python-labs/pyproject.toml",
      "python-labs/src",
      "python-labs/tests",
    ],
  ],
  ["pytest", ["-m", "pytest", "python-labs/tests"]],
  ["compileall", ["-m", "compileall", "-q", "python-labs/src"]],
];

for (const [label, args] of checks) {
  console.log(`\n[python verify] ${label}`);
  const ok = await run(selected.command, [...selected.prefix, ...args]);
  if (!ok) process.exit(1);
}

console.log("\nPython Companion 검증 통과: Ruff, mypy, pytest, compileall");
