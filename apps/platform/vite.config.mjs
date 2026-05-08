import react from "@vitejs/plugin-react";
import { defineConfig } from "vite-plus";

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  optimizeDeps: {
    exclude: ["@foruntendo/challenges"],
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: "react-vendor",
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
            },
            { name: "router", test: /[\\/]node_modules[\\/]@tanstack[\\/]/ },
            { name: "monaco", test: /[\\/]node_modules[\\/](monaco-editor|@monaco-editor)[\\/]/ },
            {
              name: "mosaic",
              test: /[\\/]node_modules[\\/](react-mosaic-component|react-dnd|react-dnd-html5-backend|dnd-core)[\\/]/,
            },
            {
              name: "markdown",
              test: /[\\/]node_modules[\\/](react-markdown|remark-gfm|micromark|mdast-util-.*|unified|hast-util-.*)[\\/]/,
            },
            {
              name: "challenges",
              test: /[\\/](?:node_modules[\\/]@foruntendo[\\/]challenges|packages[\\/]challenges)[\\/]/,
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
      ignored: ["!**/node_modules/@foruntendo/challenges/dist/**"],
    },
  },
  test: {
    exclude: ["**/node_modules/**", "**/dist/**", "**/e2e/**"],
  },
  lint: { options: { typeAware: true, typeCheck: true } },
});
