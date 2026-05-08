import type { ChallengeFile } from "@foruntendo/challenges";
import type { WebContainer } from "@webcontainer/api";
import { useCallback, useEffect, useRef, useState } from "react";
import type { RunResult } from "../lib/test-runner.ts";
import { runTestsInContainer } from "../lib/test-runner.ts";
import { buildFileTree, getWebContainer } from "../lib/webcontainer.ts";

type Status = "idle" | "booting" | "installing" | "ready" | "error";

export function useWebContainer(
  files: ChallengeFile[],
  dependencies: Record<string, string>,
  enabled: boolean = true,
) {
  const [status, setStatus] = useState<Status>(enabled ? "booting" : "idle");
  const containerRef = useRef<WebContainer | null>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!enabled) {
      setStatus("idle");
      return;
    }

    let cancelled = false;

    async function init() {
      try {
        setStatus("booting");
        const container = await getWebContainer();
        if (cancelled) return;
        containerRef.current = container;

        const tree = buildFileTree(files, dependencies);
        await container.mount(tree);
        if (cancelled) return;

        setStatus("installing");
        const install = await container.spawn("npm", ["install"]);
        const exitCode = await install.exit;
        if (cancelled) return;

        if (exitCode !== 0) {
          setStatus("error");
          return;
        }

        setStatus("ready");
        mountedRef.current = true;
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    void init();
    return () => {
      cancelled = true;
    };
  }, [enabled, files, dependencies]);

  const writeFile = useCallback((path: string, content: string) => {
    void containerRef.current?.fs.writeFile(path, content);
  }, []);

  const writeFiles = useCallback(async (nextFiles: readonly ChallengeFile[]) => {
    const container = containerRef.current;
    if (!container) throw new Error("WebContainer not ready");

    await Promise.all(
      nextFiles.map(async (file) => {
        const dir = file.path.split("/").slice(0, -1).join("/");
        if (dir) {
          await container.fs.mkdir(dir, { recursive: true });
        }
        await container.fs.writeFile(file.path, file.content);
      }),
    );
  }, []);

  const runTests = useCallback(
    async (
      nextFiles?: readonly ChallengeFile[],
      testPaths: readonly string[] = [],
    ): Promise<RunResult> => {
      const container = containerRef.current;
      if (!container) throw new Error("WebContainer not ready");

      if (nextFiles) {
        await writeFiles(nextFiles);
      }

      return runTestsInContainer(container, testPaths);
    },
    [writeFiles],
  );

  return { status, writeFile, runTests };
}
