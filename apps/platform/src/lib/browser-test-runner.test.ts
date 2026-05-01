import { describe, expect, test } from "vite-plus/test";
import { runBrowserTests } from "./browser-test-runner.ts";

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
});
