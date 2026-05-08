import { spawn } from "node:child_process";

const vp = process.platform === "win32" ? "vp.cmd" : "vp";
const tasks = [
  { args: ["run", "challenges#dev"], name: "challenges" },
  { args: ["run", "db#dev"], name: "db" },
  { args: ["run", "platform#dev"], name: "platform" },
];

const children = tasks.map((task) => {
  const child = spawn(vp, task.args, {
    stdio: "inherit",
    shell: process.platform === "win32",
    env: {
      ...process.env,
      FORCE_COLOR: "1",
    },
  });

  child.on("exit", (code, signal) => {
    if (shuttingDown) return;
    console.log(`[dev] ${task.name} exited with ${signal ?? code} — restart this process manually`);
  });

  return child;
});

let shuttingDown = false;

function shutdown(code = 0) {
  shuttingDown = true;
  for (const child of children) {
    if (!child.killed) {
      child.kill();
    }
  }
  process.exit(code);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
