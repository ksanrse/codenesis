import type { WebContainer } from "@webcontainer/api";

export interface TestResult {
  name: string;
  status: "pass" | "fail";
  error?: string;
}

export interface RunResult {
  raw: string;
  exitCode: number;
  skipped?: boolean;
}

async function collectProcessOutput(
  process: Awaited<ReturnType<WebContainer["spawn"]>>,
): Promise<RunResult> {
  let raw = "";
  const reader = process.output.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    raw += value;
  }

  const exitCode = await process.exit;
  return { raw, exitCode };
}

export async function runTestsInContainer(
  container: WebContainer,
  testPaths: readonly string[] = [],
): Promise<RunResult> {
  const process = await container.spawn("./node_modules/.bin/vitest", [
    "run",
    "--reporter=verbose",
    ...testPaths,
  ]);
  return collectProcessOutput(process);
}

// eslint-disable-next-line no-control-regex
const ANSI_RE = /\x1b\[[0-9;]*m/g;

export function parseTestResults(raw: string): TestResult[] {
  const clean = raw.replace(ANSI_RE, "");
  const lines = clean.split("\n");
  const results: TestResult[] = [];

  for (const line of lines) {
    const passMatch = line.match(/^\s*[✓✔]\s+(.+?)(?:\s+\d+ms)?$/);
    if (passMatch) {
      results.push({ name: passMatch[1]!, status: "pass" });
      continue;
    }

    const failMatch = line.match(/^\s*[×✕✘]\s+(.+?)(?:\s+\d+ms)?$/);
    if (failMatch) {
      results.push({ name: failMatch[1]!, status: "fail" });
    }
  }

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i]!;
    if (!/^[\w$]/.test(line)) continue;
    const name = line.trim();
    const detail: string[] = [];
    let j = i + 1;
    while (j < lines.length && (lines[j]!.startsWith("  ") || lines[j]!.startsWith("\t"))) {
      detail.push(lines[j]!.replace(/^\s+/, ""));
      j += 1;
    }
    if (detail.length === 0) continue;
    const target = results.find((r) => r.status === "fail" && r.name === name && !r.error);
    if (target) target.error = detail.join("\n");
  }

  return results;
}
