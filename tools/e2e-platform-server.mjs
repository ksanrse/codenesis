import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const child = spawn("vp dev --host 127.0.0.1 --port 5174", {
  cwd: path.join(rootDir, "apps", "platform"),
  stdio: "inherit",
  shell: true,
  env: {
    ...process.env,
    FORCE_COLOR: "1",
    VITE_FORUNTENDO_API_URL: "http://127.0.0.1:41732/api",
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
