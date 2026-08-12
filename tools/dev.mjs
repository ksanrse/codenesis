import { spawn } from "node:child_process";
import { resolve } from "node:path";

const vp = process.platform === "win32" ? "vp.cmd" : "vp";
const developerCode = process.env.CODENESIS_DEV_AUTH_CODE ?? "codenesis-dev-local";
const tasks = [
  { args: ["run", "challenges#dev"], name: "challenges" },
  {
    args: ["run", "db#dev"],
    name: "db",
    env: {
      CODENESIS_DEV: "1",
      CODENESIS_DEV_AUTH_CODE: developerCode,
      CODENESIS_DB_PATH: resolve("data/development.sqlite"),
      CODENESIS_WEBAUTHN_ORIGIN: "http://localhost:5173",
      CODENESIS_WEBAUTHN_RP_ID: "localhost",
    },
  },
  { args: ["run", "platform#dev"], name: "platform" },
];

const children = tasks.map((task) => {
  const child = spawn(vp, task.args, {
    stdio: "inherit",
    shell: process.platform === "win32",
    env: {
      ...process.env,
      ...task.env,
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

console.log(`[dev] Developer login code: ${developerCode}`);
console.log("[dev] Development progress is isolated in data/development.sqlite");

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
