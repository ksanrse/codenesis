import type { ChallengeDefinition, Language } from "@foruntendo/challenges";

type ChallengeFiles = ChallengeDefinition["starterFiles"][Language];

interface AttemptSignatureRecord {
  files: Record<string, string>;
  status: "passed" | "failed";
  total?: number;
}

function isEditableSourceFile(path: string): boolean {
  return !path.includes(".test.") && path !== "package.json";
}

export function normalizeAttemptFiles(files: Record<string, string>): string {
  return JSON.stringify(
    Object.entries(files)
      .sort(([leftPath], [rightPath]) => leftPath.localeCompare(rightPath))
      .map(([path, content]) => [
        path,
        content
          .split(/\r?\n/)
          .map((line) => line.trimEnd())
          .filter((line) => line.trim() !== "")
          .join("\n")
          .trim(),
      ]),
  );
}

export function getSourceFiles(files: ChallengeFiles): Record<string, string> {
  return Object.fromEntries(
    files
      .filter((file) => isEditableSourceFile(file.path))
      .map((file) => [file.path, file.content]),
  );
}

export function getCurrentSourceFiles(
  files: ChallengeFiles,
  changes: Record<string, string>,
): Record<string, string> {
  return Object.fromEntries(
    files
      .filter((file) => isEditableSourceFile(file.path))
      .map((file) => [file.path, changes[file.path] ?? file.content]),
  );
}

export function shouldRecordAttempt(
  submittedFiles: Record<string, string>,
  starterFiles: Record<string, string>,
  previousAttempts: readonly AttemptSignatureRecord[],
  nextStatus: "passed" | "failed",
  nextTotal = 0,
): boolean {
  const submittedSignature = normalizeAttemptFiles(submittedFiles);
  if (submittedSignature === normalizeAttemptFiles(starterFiles)) return false;

  const matchingAttempts = previousAttempts.filter(
    (attempt) => normalizeAttemptFiles(attempt.files) === submittedSignature,
  );

  if (matchingAttempts.length === 0) return true;
  if (nextStatus !== "passed") return false;

  return !matchingAttempts.some(
    (attempt) => attempt.status === "passed" && (attempt.total ?? 0) >= nextTotal,
  );
}
