import react from "@vitejs/plugin-react";
import { defineConfig } from "vite-plus";

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  server: {
    headers: {
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Opener-Policy": "same-origin",
    },
    proxy: {
      "/api": {
        target: "http://127.0.0.1:41731",
        changeOrigin: true,
      },
    },
  },
  test: {
    exclude: ["**/node_modules/**", "**/dist/**", "**/e2e/**"],
  },
  lint: { options: { typeAware: true, typeCheck: true } },
});
