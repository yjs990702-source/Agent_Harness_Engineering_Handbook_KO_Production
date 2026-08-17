import { access } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const scenario = process.argv[2] ?? "all";
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
    // 명령과 인자를 배열로 분리하고 shell을 끄면 시나리오 이름이 별도 명령으로
    // 해석되지 않습니다. 학습 도구도 운영 코드와 같은 실행 경계를 지킵니다.
    const child = spawn(command, args, {
      cwd: root,
      // Windows pipe에서도 한국어가 시스템 code page로 깨지지 않게 Python UTF-8 모드를 켭니다.
      env: { ...process.env, PYTHONUTF8: "1" },
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
    "Python 3.11+ interpreter를 찾지 못했습니다. START_HERE.md를 확인하세요.",
  );
  process.exit(1);
}

const ok = await run(selected.command, [
  ...selected.prefix,
  "-m",
  "agent_harness_labs.demo",
  scenario,
]);
if (!ok) process.exit(1);
