import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const requested = process.argv[2];
const cards = {
  "minimal-loop": {
    source: "python-labs/src/agent_harness_labs/week1/minimal_loop.py",
    command: "npm run demo:python -- minimal-loop",
    question: "제안과 실행 사이에서 어떤 검증이 수행되었는가?",
  },
  "approval-reducer": {
    source: "python-labs/src/agent_harness_labs/week2/approval_loop.py",
    command: "npm run demo:python -- approval-expired",
    question: "token의 어느 identity 또는 시간 조건이 실행을 막았는가?",
  },
  "sql-boundary": {
    source: "python-labs/src/agent_harness_labs/week3/security.py",
    command: "npm run demo:python -- sql-attack",
    question: "값 binding과 식별자 allowlist는 각각 무엇을 보호하는가?",
  },
  "release-evidence": {
    source: "python-labs/src/agent_harness_labs/week3/release_evidence.py",
    command: "npm run demo:python -- release-not-ready",
    question: "서로 다른 commit을 가리키는 Evidence를 왜 합칠 수 없는가?",
  },
  "mini-project": {
    source: "docs/MINI_PROJECT.md",
    command: "npm run verify:all",
    question: "결과·과정·안전·비용의 합격 기준을 어떻게 증명했는가?",
  },
};

if (!requested || !Object.hasOwn(cards, requested)) {
  console.error(`사용법: npm run lab:new -- <${Object.keys(cards).join("|")}>`);
  process.exit(1);
}

const card = cards[requested];
const target = path.join(root, ".practice", requested);
try {
  // recursive는 부모 폴더만 만들며, 기존 카드 폴더가 있으면 다시 쓰지 않습니다.
  // 학습자의 메모를 자동화가 덮어쓰지 않는 것이 이 도구의 안전 경계입니다.
  await mkdir(target, { recursive: false });
} catch (error) {
  if (error.code === "ENOENT") {
    await mkdir(path.join(root, ".practice"), { recursive: true });
    await mkdir(target, { recursive: false });
  } else if (error.code === "EEXIST") {
    console.error(`이미 존재합니다: .practice/${requested}`);
    process.exit(1);
  } else throw error;
}

const readme = `# 개인 실습: ${requested}\n\n## 먼저 읽기\n\n- \`${card.source}\`\n\n## 실행\n\n\`\`\`powershell\n${card.command}\n\`\`\`\n\n## 관찰 질문\n\n${card.question}\n\n## 내 답\n\n- \n`;
const evidence = `# Evidence\n\n- 실행 명령: \n- 종료 코드: \n- 핵심 결과 또는 오류 코드: \n- 부작용이 차단된 위치: \n- 남은 위험: \n`;
await writeFile(path.join(target, "README.md"), readme, {
  encoding: "utf8",
  flag: "wx",
});
await writeFile(path.join(target, "evidence.md"), evidence, {
  encoding: "utf8",
  flag: "wx",
});
console.log(`개인 실습지를 만들었습니다: .practice/${requested}`);
