import { describe, expect, test } from "vite-plus/test";
import { runBrowserTests } from "./browser-test-runner.ts";

function runWithMatchers(testCode: string, source = "export const noop = () => undefined;\n") {
  return runBrowserTests([
    { path: "src/index.js", content: source },
    { path: "src/index.test.js", content: testCode },
  ]);
}

describe("browser test runner", () => {
  test("runs full test files, including negated identity assertions", () => {
    const source = `const configs = {
  email: { async: true, retries: 3 },
};

export function getNotificationSettings(channel) {
  switch (channel) {
    case 'email':
      return configs.email;
    default:
      return { async: false, retries: 0, disabled: true };
  }
}
`;

    const publicResult = runBrowserTests([
      { path: "src/index.js", content: source },
      {
        path: "src/index.test.js",
        content: `import { describe, expect, it } from 'vitest';
import { getNotificationSettings } from './index.js';

describe('getNotificationSettings', () => {
  it('returns config for known channels', () => {
    expect(getNotificationSettings('email')).toEqual({ async: true, retries: 3 });
  });
});
`,
      },
    ]);

    expect(publicResult.exitCode).toBe(0);

    const fullResult = runBrowserTests([
      { path: "src/index.js", content: source },
      {
        path: "src/index.full.test.js",
        content: `import { describe, expect, it } from 'vitest';
import { getNotificationSettings } from './index.js';

describe('getNotificationSettings', () => {
  it('returns a fresh object on each call', () => {
    const first = getNotificationSettings('email');
    const second = getNotificationSettings('email');

    expect(first).toEqual(second);
    expect(first).not.toBe(second);
  });
});
`,
      },
    ]);

    expect(fullResult.exitCode).toBe(1);
    expect(fullResult.results).toEqual([
      {
        name: "getNotificationSettings > returns a fresh object on each call #1",
        status: "pass",
      },
      {
        name: "getNotificationSettings > returns a fresh object on each call #2",
        status: "fail",
      },
    ]);
  });

  test("supports the full vitest matcher surface used in challenge tests", () => {
    const result = runWithMatchers(`import { describe, expect, it } from 'vitest';
describe('matchers', () => {
  it('toBeUndefined passes for undefined', () => {
    expect(undefined).toBeUndefined();
    expect(0).not.toBeUndefined();
  });

  it('toBeNull / toBeDefined / toBeNaN', () => {
    expect(null).toBeNull();
    expect(0).toBeDefined();
    expect(NaN).toBeNaN();
    expect(1).not.toBeNaN();
  });

  it('truthy / falsy', () => {
    expect(1).toBeTruthy();
    expect(0).toBeFalsy();
    expect('').toBeFalsy();
    expect('a').not.toBeFalsy();
  });

  it('numeric comparisons', () => {
    expect(5).toBeGreaterThan(3);
    expect(5).toBeGreaterThanOrEqual(5);
    expect(2).toBeLessThan(3);
    expect(2).toBeLessThanOrEqual(2);
    expect(0.1 + 0.2).toBeCloseTo(0.3);
  });

  it('toContain on string and array', () => {
    expect('hello world').toContain('world');
    expect([1, 2, 3]).toContain(2);
    expect([1, 2]).not.toContain(99);
  });

  it('toMatch with regex and string', () => {
    expect('hello world').toMatch(/world/);
    expect('hello world').toMatch('hello');
  });

  it('toHaveLength', () => {
    expect([1, 2, 3]).toHaveLength(3);
    expect('abcd').toHaveLength(4);
  });

  it('toBeInstanceOf', () => {
    expect([]).toBeInstanceOf(Array);
    expect(new Map()).toBeInstanceOf(Map);
    expect({}).not.toBeInstanceOf(Array);
  });

  it('toThrow with class and regex', () => {
    expect(() => { throw new TypeError('boom'); }).toThrow(TypeError);
    expect(() => { throw new Error('xyz123'); }).toThrow(/xyz\\d+/);
    expect(() => { throw new Error('boom'); }).toThrow('boom');
  });

  it('deep equality on Set and Map', () => {
    expect(new Set([1, 2, 3])).toEqual(new Set([3, 2, 1]));
    expect(new Map([['a', 1]])).toEqual(new Map([['a', 1]]));
    expect(new Set([1])).not.toEqual(new Set([2]));
  });

  it('deep equality on nested objects with NaN', () => {
    expect({ a: NaN }).toEqual({ a: NaN });
    expect([1, [2, [3]]]).toEqual([1, [2, [3]]]);
  });
});
`);

    expect(result.exitCode).toBe(0);
    expect(result.results.every((r) => r.status === "pass")).toBe(true);
  });
});
