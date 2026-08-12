import { spawn } from "node:child_process";
import { resolve } from "node:path";

const vp = process.platform === "win32" ? "vp.cmd" : "vp";
const developerCode = process.env.CODENESIS_DEV_AUTH_CODE ?? "codenesis-dev-local";
const remoteApi =
  process.env.CODENESIS_REMOTE_API_URL ?? "https://codenesis-api.159-195-17-180.nip.io/api";
const useLocalDb = process.env.CODENESIS_LOCAL_DB === "1";
const tasks = [
  { args: ["run", "challenges#dev"], name: "challenges" },
  ...(useLocalDb
    ? [
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
      ]
    : []),
  { args: ["run", "platform#dev"], name: "platform", env: { VITE_CODENESIS_API_URL: remoteApi } },
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

if (useLocalDb) console.log(`[dev] Developer login code: ${developerCode}`);
console.log(`[dev] API: ${useLocalDb ? "local data/development.sqlite" : remoteApi}`);
console.log(`[dev] To use an isolated local database: CODENESIS_LOCAL_DB=1 pnpm dev`);

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
