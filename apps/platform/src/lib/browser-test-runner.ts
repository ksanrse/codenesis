import type { ChallengeFile } from "@foruntendo/challenges";
import type { RunResult, TestResult } from "./test-runner.ts";

interface BrowserRunResult extends RunResult {
  results: TestResult[];
}

function deepEqual(left: unknown, right: unknown): boolean {
  if (Object.is(left, right)) return true;
  if (typeof left !== typeof right) return false;
  if (left === null || right === null) return false;
  if (typeof left !== "object") return false;

  if (left instanceof Date && right instanceof Date) {
    return left.getTime() === right.getTime();
  }
  if (left instanceof RegExp && right instanceof RegExp) {
    return left.source === right.source && left.flags === right.flags;
  }
  if (left instanceof Set && right instanceof Set) {
    if (left.size !== right.size) return false;
    for (const value of left) if (!right.has(value)) return false;
    return true;
  }
  if (left instanceof Map && right instanceof Map) {
    if (left.size !== right.size) return false;
    for (const [key, value] of left) {
      if (!right.has(key) || !deepEqual(value, right.get(key))) return false;
    }
    return true;
  }
  if (Array.isArray(left)) {
    if (!Array.isArray(right) || left.length !== right.length) return false;
    for (let i = 0; i < left.length; i += 1) {
      if (!deepEqual(left[i], right[i])) return false;
    }
    return true;
  }
  if (Array.isArray(right)) return false;

  const leftKeys = Object.keys(left as Record<string, unknown>);
  const rightKeys = Object.keys(right as Record<string, unknown>);
  if (leftKeys.length !== rightKeys.length) return false;
  for (const key of leftKeys) {
    if (
      !Object.prototype.hasOwnProperty.call(right, key) ||
      !deepEqual(
        (left as Record<string, unknown>)[key],
        (right as Record<string, unknown>)[key],
      )
    )
      return false;
  }
  return true;
}

function formatValue(value: unknown): string {
  if (typeof value === "string") return `"${value}"`;
  if (typeof value === "function") return `[Function ${value.name || "anonymous"}]`;
  if (typeof value === "undefined") return "undefined";
  if (typeof value === "bigint") return `${value}n`;
  if (value instanceof Set) return `Set(${value.size})`;
  if (value instanceof Map) return `Map(${value.size})`;
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function isObjectLike(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function hasLength(value: unknown): value is { length: number } {
  return (
    (typeof value === "string" || typeof value === "function" || isObjectLike(value)) &&
    "length" in (value as Record<string, unknown>) &&
    typeof (value as { length: unknown }).length === "number"
  );
}

function toErrorClass(value: unknown): typeof Error | null {
  if (typeof value === "function" && value.prototype instanceof Error) return value as typeof Error;
  if (value === Error) return Error;
  return null;
}

function createExpect(
  actual: unknown,
  recordAssertion: (status: TestResult["status"], error?: string) => void,
) {
  const pass = () => recordAssertion("pass");
  const fail = (message: string) => {
    recordAssertion("fail", message);
    throw new Error(message);
  };

  const assert = (condition: boolean, message: string) => {
    if (!condition) fail(message);
    else pass();
  };

  const matchers = {
    toBe(expected: unknown) {
      assert(
        Object.is(actual, expected),
        `Expected ${formatValue(actual)} to be ${formatValue(expected)}`,
      );
    },
    toEqual(expected: unknown) {
      assert(
        deepEqual(actual, expected),
        `Expected ${formatValue(actual)} to equal ${formatValue(expected)}`,
      );
    },
    toStrictEqual(expected: unknown) {
      assert(
        deepEqual(actual, expected),
        `Expected ${formatValue(actual)} to strictly equal ${formatValue(expected)}`,
      );
    },
    toBeUndefined() {
      assert(actual === undefined, `Expected ${formatValue(actual)} to be undefined`);
    },
    toBeDefined() {
      assert(actual !== undefined, `Expected value to be defined`);
    },
    toBeNull() {
      assert(actual === null, `Expected ${formatValue(actual)} to be null`);
    },
    toBeNaN() {
      assert(
        typeof actual === "number" && Number.isNaN(actual),
        `Expected ${formatValue(actual)} to be NaN`,
      );
    },
    toBeTruthy() {
      assert(Boolean(actual), `Expected ${formatValue(actual)} to be truthy`);
    },
    toBeFalsy() {
      assert(!actual, `Expected ${formatValue(actual)} to be falsy`);
    },
    toBeGreaterThan(expected: number) {
      assert(
        typeof actual === "number" && actual > expected,
        `Expected ${formatValue(actual)} to be greater than ${expected}`,
      );
    },
    toBeGreaterThanOrEqual(expected: number) {
      assert(
        typeof actual === "number" && actual >= expected,
        `Expected ${formatValue(actual)} to be >= ${expected}`,
      );
    },
    toBeLessThan(expected: number) {
      assert(
        typeof actual === "number" && actual < expected,
        `Expected ${formatValue(actual)} to be less than ${expected}`,
      );
    },
    toBeLessThanOrEqual(expected: number) {
      assert(
        typeof actual === "number" && actual <= expected,
        `Expected ${formatValue(actual)} to be <= ${expected}`,
      );
    },
    toBeCloseTo(expected: number, precision = 2) {
      const diff = Math.abs((actual as number) - expected);
      assert(
        diff < Math.pow(10, -precision) / 2,
        `Expected ${formatValue(actual)} to be close to ${expected}`,
      );
    },
    toContain(expected: unknown) {
      let ok = false;
      if (typeof actual === "string" && typeof expected === "string") ok = actual.includes(expected);
      else if (Array.isArray(actual)) ok = actual.includes(expected);
      else if (actual instanceof Set) ok = actual.has(expected);
      assert(ok, `Expected ${formatValue(actual)} to contain ${formatValue(expected)}`);
    },
    toMatch(expected: RegExp | string) {
      const str = String(actual);
      const ok =
        expected instanceof RegExp ? expected.test(str) : str.includes(expected as string);
      assert(ok, `Expected ${formatValue(actual)} to match ${String(expected)}`);
    },
    toHaveLength(expected: number) {
      assert(
        hasLength(actual) && actual.length === expected,
        `Expected length ${expected}, got ${hasLength(actual) ? actual.length : "n/a"}`,
      );
    },
    toBeInstanceOf(expected: unknown) {
      const Ctor = expected as new (...args: unknown[]) => unknown;
      assert(
        actual instanceof Ctor,
        `Expected ${formatValue(actual)} to be instance of ${Ctor?.name ?? String(expected)}`,
      );
    },
    toThrow(expectedMessage?: string | RegExp) {
      if (typeof actual !== "function") {
        fail("Expected value to be a function");
      }

      const callback = actual as () => unknown;
      try {
        callback();
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (expectedMessage instanceof RegExp) {
          if (!expectedMessage.test(message)) {
            fail(`Expected error "${message}" to match ${expectedMessage}`);
          }
        } else if (typeof expectedMessage === "string") {
          if (!message.includes(expectedMessage)) {
            fail(`Expected error "${message}" to include "${expectedMessage}"`);
          }
        } else if (expectedMessage !== undefined) {
          const ErrorClass = toErrorClass(expectedMessage);
          if (ErrorClass && !(error instanceof ErrorClass)) {
            fail(`Expected error to be instance of ${ErrorClass.name}`);
          }
        }
        pass();
        return;
      }

      fail("Expected function to throw");
    },
  };

  const negate = (condition: boolean, message: string) => assert(!condition, message);

  return {
    ...matchers,
    not: {
      toBe(expected: unknown) {
        negate(
          Object.is(actual, expected),
          `Expected ${formatValue(actual)} not to be ${formatValue(expected)}`,
        );
      },
      toEqual(expected: unknown) {
        negate(
          deepEqual(actual, expected),
          `Expected ${formatValue(actual)} not to equal ${formatValue(expected)}`,
        );
      },
      toStrictEqual(expected: unknown) {
        negate(
          deepEqual(actual, expected),
          `Expected ${formatValue(actual)} not to strictly equal ${formatValue(expected)}`,
        );
      },
      toBeUndefined() {
        negate(actual === undefined, `Expected value not to be undefined`);
      },
      toBeDefined() {
        negate(actual !== undefined, `Expected value not to be defined`);
      },
      toBeNull() {
        negate(actual === null, `Expected value not to be null`);
      },
      toBeNaN() {
        negate(
          typeof actual === "number" && Number.isNaN(actual),
          `Expected value not to be NaN`,
        );
      },
      toBeTruthy() {
        negate(Boolean(actual), `Expected ${formatValue(actual)} not to be truthy`);
      },
      toBeFalsy() {
        negate(!actual, `Expected ${formatValue(actual)} not to be falsy`);
      },
      toContain(expected: unknown) {
        let ok = false;
        if (typeof actual === "string" && typeof expected === "string") ok = actual.includes(expected);
        else if (Array.isArray(actual)) ok = actual.includes(expected);
        else if (actual instanceof Set) ok = actual.has(expected);
        negate(ok, `Expected ${formatValue(actual)} not to contain ${formatValue(expected)}`);
      },
      toMatch(expected: RegExp | string) {
        const str = String(actual);
        const ok =
          expected instanceof RegExp ? expected.test(str) : str.includes(expected as string);
        negate(ok, `Expected ${formatValue(actual)} not to match ${String(expected)}`);
      },
      toHaveLength(expected: number) {
        negate(
          hasLength(actual) && actual.length === expected,
          `Expected length not to be ${expected}`,
        );
      },
      toBeInstanceOf(expected: unknown) {
        const Ctor = expected as new (...args: unknown[]) => unknown;
        negate(
          actual instanceof Ctor,
          `Expected ${formatValue(actual)} not to be instance of ${Ctor?.name ?? String(expected)}`,
        );
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

  const recordAssertion = (status: TestResult["status"], error?: string) => {
    currentCaseAssertion += 1;
    const result: TestResult = {
      name: `${currentCaseName} #${currentCaseAssertion}`,
      status,
    };
    if (error !== undefined) result.error = error;
    results.push(result);
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
        results.push({ name: fullName, status: "fail", error: message });
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
