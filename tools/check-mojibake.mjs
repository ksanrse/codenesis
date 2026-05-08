import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const MAX_SNIPPET_LENGTH = 140;

const SKIP_DIRECTORIES = new Set([
  ".claude",
  ".git",
  ".vite",
  "coverage",
  "dist",
  "node_modules",
  "target",
]);

const TEXT_EXTENSIONS = new Set([
  ".cjs",
  ".css",
  ".html",
  ".js",
  ".json",
  ".jsx",
  ".md",
  ".mjs",
  ".mts",
  ".ts",
  ".tsx",
  ".txt",
  ".yaml",
  ".yml",
]);

const MOJIBAKE_PATTERN =
  /\uFFFD|Р[°±Ііґµ¶·ё№є»јЅѕїЂЃ‚ѓ„…†‡€‰Љ‹ЊЌЋЏђѓљњќўџЎҐЄЇЃ]|С[ЂЃ‚ѓ„…†‡€‰Љ‹ЊЌЋЏ‘’“”•–—™љњќўџ]|Ð[А-џ]?|Ñ[А-џ]?|â(?:€|€™|€œ|€ќ|€¦|„|–|—)|в(?:Ђ|„|–|”|™|њ)|т(?:Ю|К)/u;

function isTextFile(path) {
  const lowerPath = path.toLowerCase();
  if (lowerPath.endsWith("package-lock.json") || lowerPath.endsWith("pnpm-lock.yaml")) {
    return false;
  }

  const extension = lowerPath.match(/\.[^.]+$/)?.[0];
  return extension ? TEXT_EXTENSIONS.has(extension) : false;
}

async function* walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRECTORIES.has(entry.name)) {
        yield* walk(join(directory, entry.name));
      }
      continue;
    }

    if (entry.isFile()) {
      const path = join(directory, entry.name);
      if (isTextFile(path)) {
        yield path;
      }
    }
  }
}

function getColumn(line, matchIndex) {
  return line.slice(0, matchIndex).length + 1;
}

function formatSnippet(line, matchIndex) {
  const start = Math.max(0, matchIndex - 48);
  const end = Math.min(line.length, matchIndex + MAX_SNIPPET_LENGTH);
  const prefix = start > 0 ? "..." : "";
  const suffix = end < line.length ? "..." : "";
  return `${prefix}${line.slice(start, end).trim()}${suffix}`;
}

const findings = [];

for await (const file of walk(ROOT)) {
  const relativePath = relative(ROOT, file).replaceAll("\\", "/");
  if (relativePath === "tools/check-mojibake.mjs") continue;

  const fileStat = await stat(file);
  if (fileStat.size > 1_000_000) continue;

  const text = await readFile(file, "utf8");
  const lines = text.split(/\r?\n/);

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex];
    const match = MOJIBAKE_PATTERN.exec(line);
    if (!match) continue;

    findings.push({
      column: getColumn(line, match.index),
      file: relativePath,
      line: lineIndex + 1,
      snippet: formatSnippet(line, match.index),
    });
  }
}

if (findings.length > 0) {
  console.error(`Mojibake check failed: ${findings.length} suspicious line(s).`);
  for (const finding of findings.slice(0, 50)) {
    console.error(`${finding.file}:${finding.line}:${finding.column}  ${finding.snippet}`);
  }
  if (findings.length > 50) {
    console.error(`...and ${findings.length - 50} more.`);
  }
  process.exitCode = 1;
} else {
  console.log("Mojibake check passed.");
}
