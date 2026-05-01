import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const child = spawn("node", ["src/server.mjs"], {
  cwd: path.join(rootDir, "apps", "db"),
  stdio: "inherit",
  env: {
    ...process.env,
    FORCE_COLOR: "1",
    FORUNTENDO_DB_PORT: "41732",
    FORUNTENDO_DB_PATH: "data/e2e.sqlite",
    FORUNTENDO_E2E: "1",
  },
});

child.on("exit", (code) => process.exit(code ?? 0));

let shuttingDown = false;

function shutdown() {
  if (shuttingDown) return;
  shuttingDown = true;

  if (process.platform === "win32" && child.pid) {
    const killer = spawn("taskkill", ["/pid", String(child.pid), "/T", "/F"], {
      stdio: "ignore",
    });
    killer.on("exit", () => process.exit(0));
    setTimeout(() => process.exit(0), 3_000).unref();
    return;
  }

  if (!child.killed) {
    child.kill();
  }
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
