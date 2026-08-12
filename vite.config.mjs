import { defineConfig } from "vite-plus";

export default defineConfig({
  fmt: {
    ignorePatterns: [".claude/**", ".lh/**"],
  },
  staged: {
    "*": "vp check --fix",
  },
  test: {
    exclude: ["**/node_modules/**", "**/dist/**", "**/e2e/**"],
  },
  lint: { options: { typeAware: true, typeCheck: true } },
});
