import type { ChallengeFile } from "@foruntendo/challenges";
import type { RunResult, TestResult } from "./test-runner.ts";

interface BrowserRunResult extends RunResult {
  results: TestResult[];
}

function deepEqual(left: unknown, right: unknown): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

function formatValue(value: unknown): string {
  if (typeof value === "string") return `"${value}"`;
  return JSON.stringify(value);
}

function createExpect(actual: unknown, recordAssertion: (status: TestResult["status"]) => void) {
  const pass = () => recordAssertion("pass");
  const fail = (message: string) => {
    recordAssertion("fail");
    throw new Error(message);
  };

  const matchers = {
    toBe(expected: unknown) {
      if (!Object.is(actual, expected)) {
        fail(`Expected ${formatValue(actual)} to be ${formatValue(expected)}`);
      }
      pass();
    },
    toEqual(expected: unknown) {
      if (!deepEqual(actual, expected)) {
        fail(`Expected ${formatValue(actual)} to equal ${formatValue(expected)}`);
      }
      pass();
    },
    toThrow(expectedMessage?: string) {
      if (typeof actual !== "function") {
        fail("Expected value to be a function");
      }

      const callback = actual as () => unknown;
      try {
        callback();
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (expectedMessage && !message.includes(expectedMessage)) {
          fail(`Expected error "${message}" to include "${expectedMessage}"`);
        }
        pass();
        return;
      }

      fail("Expected function to throw");
    },
  };

  return {
    ...matchers,
    not: {
      toBe(expected: unknown) {
        if (Object.is(actual, expected)) {
          fail(`Expected ${formatValue(actual)} not to be ${formatValue(expected)}`);
        }
        pass();
      },
      toEqual(expected: unknown) {
        if (deepEqual(actual, expected)) {
          fail(`Expected ${formatValue(actual)} not to equal ${formatValue(expected)}`);
        }
        pass();
      },
    },
  };
}

function getExportNames(source: string): string[] {
  return Array.from(
    source.matchAll(/export\s+(?:function|const|let|var|class)\s+([A-Za-z_$][\w$]*)/g),
    (match) => match[1]!,
  );
}

function buildSolutionModule(source: string): Record<string, unknown> {
  const exportNames = getExportNames(source);
  const executable = source
    .replace(/export\s+default\s+/g, "const __default__ = ")
    .replace(/export\s+(function|const|let|var|class)\s+/g, "$1 ");

  const returnedNames = exportNames.map((name) => `${JSON.stringify(name)}: ${name}`).join(",");
  // eslint-disable-next-line typescript-eslint/no-implied-eval
  return new Function(`${executable}\nreturn {${returnedNames}};`)() as Record<string, unknown>;
}

function buildTestCode(source: string): string {
  return source
    .replace(/import\s+\{[^}]*\}\s+from\s+['"]vitest['"];\s*/g, "")
    .replace(/import\s+\{[^}]*\}\s+from\s+['"]\.\/index\.js['"];\s*/g, "");
}

export function canRunInBrowser(files: ChallengeFile[]): boolean {
  return (
    files.some((file) => file.path === "src/index.js") &&
    files.some((file) => file.path.endsWith(".test.js"))
  );
}

export function runBrowserTests(files: ChallengeFile[]): BrowserRunResult {
  const source = files.find((file) => file.path === "src/index.js")?.content;
  const testFiles = files.filter((file) => file.path.endsWith(".test.js"));

  if (!source || testFiles.length === 0) {
    throw new Error(
      "Browser runner supports JavaScript challenges with src/index.js and .test.js files.",
    );
  }

  const moduleExports = buildSolutionModule(source);
  const results: TestResult[] = [];
  const errors: string[] = [];
  const scope: string[] = [];
  let currentCaseName = "";
  let currentCaseAssertion = 0;

  const recordAssertion = (status: TestResult["status"]) => {
    currentCaseAssertion += 1;
    results.push({
      name: `${currentCaseName} #${currentCaseAssertion}`,
      status,
    });
  };

  const describe = (name: string, callback: () => void) => {
    scope.push(name);
    try {
      callback();
    } finally {
      scope.pop();
    }
  };

  const runCase = (name: string, callback: () => void) => {
    const fullName = [...scope, name].join(" > ");
    const resultCountBeforeCase = results.length;
    const previousCaseName = currentCaseName;
    const previousCaseAssertion = currentCaseAssertion;
    currentCaseName = fullName;
    currentCaseAssertion = 0;

    try {
      callback();
      if (results.length === resultCountBeforeCase) {
        results.push({ name: fullName, status: "pass" });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (results.length === resultCountBeforeCase) {
        results.push({ name: fullName, status: "fail" });
      }
      errors.push(`${fullName}\n  ${message}`);
    } finally {
      currentCaseName = previousCaseName;
      currentCaseAssertion = previousCaseAssertion;
    }
  };

  for (const testFile of testFiles) {
    const testCode = buildTestCode(testFile.content);
    // eslint-disable-next-line typescript-eslint/no-implied-eval
    new Function("describe", "expect", "it", "test", ...Object.keys(moduleExports), testCode)(
      describe,
      (actual: unknown) => createExpect(actual, recordAssertion),
      runCase,
      runCase,
      ...Object.values(moduleExports),
    );
  }

  const raw = [
    ...results.map((result) => `${result.status === "pass" ? "✓" : "✗"} ${result.name}`),
    errors.length > 0 ? `\n${errors.join("\n\n")}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    exitCode: results.every((result) => result.status === "pass") ? 0 : 1,
    raw,
    results,
  };
}
