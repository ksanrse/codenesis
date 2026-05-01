import { describe, expect, test } from "vite-plus/test";
import {
  getCurrentSourceFiles,
  getSourceFiles,
  normalizeAttemptFiles,
  shouldRecordAttempt,
} from "./challenge-files.ts";

const files = [
  { path: "index.js", content: "export const value = 1;\n" },
  { path: "index.test.js", content: "test('value', () => {});\n" },
  { path: "package.json", content: "{}" },
];

describe("challenge file helpers", () => {
  test("normalizes attempts without counting empty lines or trailing spaces as changes", () => {
    expect(
      normalizeAttemptFiles({
        "index.js": "export const value = 1;  \n\n",
      }),
    ).toBe(
      normalizeAttemptFiles({
        "index.js": "\nexport const value = 1;\n",
      }),
    );
  });

  test("source file helpers ignore tests and package files", () => {
    expect(getSourceFiles(files)).toEqual({
      "index.js": "export const value = 1;\n",
    });
    expect(
      getCurrentSourceFiles(files, {
        "index.js": "export const value = 2;\n",
        "index.test.js": "changed test",
      }),
    ).toEqual({
      "index.js": "export const value = 2;\n",
    });
  });

  test("records a passing result when the same code previously failed", () => {
    const starterFiles = { "index.js": "export function value() {}\n" };
    const submittedFiles = { "index.js": "export function value() {\n  return 1;\n}\n" };

    expect(shouldRecordAttempt(submittedFiles, starterFiles, [], "failed")).toBe(true);
    expect(
      shouldRecordAttempt(
        submittedFiles,
        starterFiles,
        [{ files: submittedFiles, status: "failed", total: 2 }],
        "passed",
        2,
      ),
    ).toBe(true);
    expect(
      shouldRecordAttempt(
        submittedFiles,
        starterFiles,
        [{ files: submittedFiles, status: "passed", total: 2 }],
        "passed",
        2,
      ),
    ).toBe(false);
  });

  test("records a fuller passing submit when an older passed attempt used fewer checks", () => {
    const starterFiles = { "index.js": "export function value() {}\n" };
    const submittedFiles = { "index.js": "export function value() {\n  return 1;\n}\n" };

    expect(
      shouldRecordAttempt(
        submittedFiles,
        starterFiles,
        [{ files: submittedFiles, status: "passed", total: 2 }],
        "passed",
        6,
      ),
    ).toBe(true);
    expect(
      shouldRecordAttempt(
        submittedFiles,
        starterFiles,
        [{ files: submittedFiles, status: "passed", total: 6 }],
        "passed",
        6,
      ),
    ).toBe(false);
  });

  test("does not record unchanged starter code", () => {
    const starterFiles = { "index.js": "export function value() {}\n" };

    expect(shouldRecordAttempt(starterFiles, starterFiles, [], "passed")).toBe(false);
  });
});
