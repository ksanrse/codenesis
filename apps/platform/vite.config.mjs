import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite-plus";

export default defineConfig({
  plugins: [svelte()],
  optimizeDeps: {
    exclude: ["@codenesis/challenges"],
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: "monaco", test: /[\\/]node_modules[\\/](monaco-editor|@monaco-editor)[\\/]/ },
            {
              name: "challenges",
              test: /[\\/](?:node_modules[\\/]@codenesis[\\/]challenges|packages[\\/]challenges)[\\/]/,
            },
            { name: "fonts", test: /[\\/]node_modules[\\/]@fontsource[\\/]/ },
          ],
        },
      },
    },
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
    watch: {
      ignored: ["!**/node_modules/@codenesis/challenges/dist/**"],
    },
  },
  test: {
    exclude: ["**/node_modules/**", "**/dist/**", "**/e2e/**"],
  },
  lint: { options: { typeAware: true, typeCheck: true } },
});
