import { WebContainer, type FileSystemTree } from "@webcontainer/api";
import type { ChallengeFile } from "@foruntendo/challenges";

let instance: WebContainer | null = null;
let bootPromise: Promise<WebContainer> | null = null;

export async function getWebContainer(): Promise<WebContainer> {
  if (instance) return instance;
  if (bootPromise) return bootPromise;

  bootPromise = WebContainer.boot().then(
    (container) => {
      instance = container;
      return container;
    },
    (err) => {
      bootPromise = null;
      throw err;
    },
  );
  return bootPromise;
}

function setNestedFile(tree: FileSystemTree, path: string, content: string) {
  const parts = path.split("/");
  let current = tree;

  for (let i = 0; i < parts.length - 1; i++) {
    const dir = parts[i]!;
    if (!current[dir]) {
      current[dir] = { directory: {} };
    }
    const entry = current[dir];
    if (entry && "directory" in entry) {
      current = entry.directory;
    }
  }

  const fileName = parts[parts.length - 1]!;
  current[fileName] = {
    file: { contents: content },
  };
}

export function buildFileTree(
  files: ChallengeFile[],
  dependencies: Record<string, string>,
): FileSystemTree {
  const tree: FileSystemTree = {};

  for (const file of files) {
    setNestedFile(tree, file.path, file.content);
  }

  const pkg = {
    name: "challenge",
    type: "module",
    private: true,
    dependencies,
    devDependencies: {
      vitest: "latest",
    },
    scripts: {
      test: "vitest run --reporter=verbose",
    },
  };

  tree["package.json"] = {
    file: { contents: JSON.stringify(pkg, null, 2) },
  };

  tree[".npmrc"] = {
    file: {
      contents: "include=optional\naudit=false\nfund=false\n",
    },
  };

  // Add a vitest config for jsdom
  tree["vitest.config.js"] = {
    file: {
      contents: `import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    environment: 'jsdom',
  },
});
`,
    },
  };

  return tree;
}
