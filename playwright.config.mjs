import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "apps/platform/e2e",
  outputDir: "test-results/e2e",
  fullyParallel: false,
  reporter: [["list"]],
  timeout: 60_000,
  use: {
    baseURL: "http://127.0.0.1:5174",
    trace: "on-first-retry",
    ...devices["Desktop Chrome"],
  },
  globalSetup: "./tools/e2e-global-setup.mjs",
  webServer: [
    {
      command: "node tools/e2e-db-server.mjs",
      url: "http://127.0.0.1:41732/api/health",
      reuseExistingServer: false,
      timeout: 60_000,
    },
    {
      command: "node tools/e2e-platform-server.mjs",
      url: "http://127.0.0.1:5174",
      reuseExistingServer: false,
      timeout: 60_000,
    },
  ],
});
