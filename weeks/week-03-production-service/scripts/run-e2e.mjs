import { spawn, spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import process from "node:process";

const require = createRequire(import.meta.url);
const nextCli = require.resolve("next/dist/bin/next");
const port = 3103;
const origin = `http://127.0.0.1:${port}`;
const workspace = new URL("..", import.meta.url);

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function exitCode(child) {
  return new Promise((resolve) =>
    child.once("exit", (code) => resolve(code ?? 1)),
  );
}

async function waitUntilReady(server) {
  const deadline = Date.now() + 120_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null)
      throw new Error(`Next server가 조기 종료됐습니다: ${server.exitCode}`);
    try {
      const response = await fetch(origin, {
        signal: AbortSignal.timeout(1_000),
      });
      if (response.ok) return;
    } catch {
      // 시작 중인 연결 실패는 deadline까지 재시도합니다.
    }
    await delay(250);
  }
  throw new Error("Next server 준비 시간이 120초를 초과했습니다.");
}

async function stopServer(server) {
  if (server.exitCode !== null || !server.pid) return;
  server.kill("SIGTERM");
  await Promise.race([exitCode(server), delay(3_000)]);
  if (server.exitCode !== null) return;

  if (process.platform === "win32") {
    spawnSync("taskkill", ["/PID", String(server.pid), "/T", "/F"], {
      stdio: "ignore",
    });
  } else {
    try {
      process.kill(-server.pid, "SIGKILL");
    } catch {
      server.kill("SIGKILL");
    }
  }
  await Promise.race([exitCode(server), delay(3_000)]);
}

const environment = {
  ...process.env,
  APP_BASE_URL: origin,
  LAB_AUTH_MODE: "demo",
  LAB_DATA_MODE: "memory",
};

const server = spawn(
  process.execPath,
  [
    nextCli,
    "dev",
    "--turbopack",
    "--hostname",
    "127.0.0.1",
    "--port",
    String(port),
  ],
  {
    cwd: workspace,
    env: environment,
    stdio: ["ignore", "pipe", "pipe"],
    detached: process.platform !== "win32",
  },
);
server.stdout.pipe(process.stdout);
server.stderr.pipe(process.stderr);

let result = 1;
try {
  await waitUntilReady(server);
  const { chromium } = await import("playwright");
  const { runWorkRequestScenarios } =
    await import("../e2e/work-request.scenarios.mjs");
  const browser = await chromium.launch({ headless: true });
  try {
    await runWorkRequestScenarios(browser, origin);
    result = 0;
  } finally {
    await browser.close();
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
} finally {
  await stopServer(server);
}

process.exitCode = result;
