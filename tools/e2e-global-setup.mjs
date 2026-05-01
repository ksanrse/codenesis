import { rm } from "node:fs/promises";
import { resolve } from "node:path";

export default async function globalSetup() {
  await rm(resolve("data/e2e.sqlite"), { force: true });
  await rm(resolve("data/e2e.sqlite-shm"), { force: true });
  await rm(resolve("data/e2e.sqlite-wal"), { force: true });

  try {
    await fetch("http://127.0.0.1:41732/api/test/reset", { method: "POST" });
  } catch {
    // The e2e DB server is usually not running yet. The file cleanup above is the normal path.
  }
}
