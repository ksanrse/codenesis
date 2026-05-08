import { createServer } from "node:http";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import initSqlJs from "sql.js";

const PORT = Number(process.env.FORUNTENDO_DB_PORT ?? 41731);
const HOST = process.env.FORUNTENDO_DB_HOST ?? "127.0.0.1";
const ROOT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const DB_PATH = resolve(
  process.env.FORUNTENDO_DB_PATH ?? resolve(ROOT_DIR, "data/foruntendo.sqlite"),
);

const SQL = await initSqlJs();
const database = await openDatabase();

database.exec(`
  PRAGMA foreign_keys = ON;

  DROP TABLE IF EXISTS challenges;
  DROP TABLE IF EXISTS collections;

  CREATE TABLE IF NOT EXISTS attempts (
    id TEXT PRIMARY KEY,
    challenge_id TEXT NOT NULL,
    challenge_title TEXT NOT NULL,
    language TEXT NOT NULL,
    status TEXT NOT NULL,
    passed INTEGER NOT NULL,
    failed INTEGER NOT NULL,
    total INTEGER NOT NULL,
    files_json TEXT NOT NULL,
    output TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS attempts_challenge_created_idx
    ON attempts (challenge_id, created_at DESC);

  CREATE TABLE IF NOT EXISTS drafts (
    challenge_id TEXT NOT NULL,
    language TEXT NOT NULL,
    files_json TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    PRIMARY KEY (challenge_id, language)
  );

  CREATE TABLE IF NOT EXISTS app_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`);

await persist();

createServer(async (request, response) => {
  try {
    await route(request, response);
  } catch (error) {
    sendJson(response, 500, {
      error: error instanceof Error ? error.message : "Unknown server error",
    });
  }
}).listen(PORT, HOST, () => {
  console.log(`[db] Foruntendo SQLite API is running at http://${HOST}:${PORT}`);
  console.log(`[db] SQLite file: ${DB_PATH}`);
});

async function openDatabase() {
  await mkdir(dirname(DB_PATH), { recursive: true });

  try {
    const file = await readFile(DB_PATH);
    return new SQL.Database(file);
  } catch (error) {
    console.warn("[db] Could not read DB file, starting with empty database:", error?.message ?? error);
    return new SQL.Database();
  }
}

async function persist() {
  await mkdir(dirname(DB_PATH), { recursive: true });
  await writeFile(DB_PATH, Buffer.from(database.export()));
}

async function route(request, response) {
  const url = new URL(request.url ?? "/", `http://${request.headers.host ?? `${HOST}:${PORT}`}`);

  if (request.method === "OPTIONS") {
    sendEmpty(response, 204);
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/health") {
    sendJson(response, 200, { ok: true });
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/state") {
    sendJson(response, 200, readState());
    return;
  }

  if (
    process.env.FORUNTENDO_E2E === "1" &&
    request.method === "POST" &&
    url.pathname === "/api/test/reset"
  ) {
    resetUserState();
    await persist();
    sendJson(response, 200, readState());
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/attempts") {
    const body = await readJson(request);
    const attempt = insertAttempt(body);
    await persist();
    sendJson(response, 201, attempt);
    return;
  }

  const draftMatch = url.pathname.match(/^\/api\/drafts\/([^/]+)\/([^/]+)$/);
  if (draftMatch && request.method === "PUT") {
    const body = await readJson(request);
    const draft = upsertDraft(
      decodeURIComponent(draftMatch[1]),
      decodeURIComponent(draftMatch[2]),
      body,
    );
    await persist();
    sendJson(response, 200, draft);
    return;
  }

  if (draftMatch && request.method === "DELETE") {
    deleteDraft(decodeURIComponent(draftMatch[1]), decodeURIComponent(draftMatch[2]));
    await persist();
    sendEmpty(response, 204);
    return;
  }

  if (request.method === "PUT" && url.pathname === "/api/settings/active-collection") {
    const body = await readJson(request);
    setSetting("activeCollectionId", String(body.collectionId ?? ""));
    await persist();
    sendJson(response, 200, { activeCollectionId: String(body.collectionId ?? "") });
    return;
  }

  sendJson(response, 404, { error: "Not found" });
}

function readState() {
  const attempts = selectAll(`
    SELECT id, challenge_id, challenge_title, language, status, passed, failed, total,
           files_json, output, created_at
    FROM attempts
    ORDER BY created_at DESC
  `).map((row) => ({
    id: row.id,
    challengeId: row.challenge_id,
    challengeTitle: row.challenge_title,
    language: row.language,
    status: row.status,
    passed: row.passed,
    failed: row.failed,
    total: row.total,
    files: JSON.parse(row.files_json),
    output: row.output,
    createdAt: row.created_at,
  }));

  const drafts = {};
  for (const row of selectAll(
    "SELECT challenge_id, language, files_json, updated_at FROM drafts",
  )) {
    drafts[`${row.challenge_id}:${row.language}`] = {
      challengeId: row.challenge_id,
      language: row.language,
      files: JSON.parse(row.files_json),
      updatedAt: row.updated_at,
    };
  }

  return {
    version: 1,
    attempts,
    drafts,
    activeCollectionId: getSetting("activeCollectionId"),
  };
}

function resetUserState() {
  database.exec(`
    DELETE FROM attempts;
    DELETE FROM drafts;
    DELETE FROM app_settings;
  `);
}

function insertAttempt(body) {
  const now = new Date().toISOString();
  const attempt = {
    id: body.id ?? crypto.randomUUID(),
    challengeId: body.challengeId,
    challengeTitle: body.challengeTitle,
    language: body.language,
    status: body.status,
    passed: Number(body.passed ?? 0),
    failed: Number(body.failed ?? 0),
    total: Number(body.total ?? 0),
    files: body.files ?? {},
    output: body.output ?? "",
    createdAt: body.createdAt ?? now,
  };

  database
    .prepare(`
      INSERT INTO attempts (
        id, challenge_id, challenge_title, language, status, passed, failed, total,
        files_json, output, created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .run([
      attempt.id,
      attempt.challengeId,
      attempt.challengeTitle,
      attempt.language,
      attempt.status,
      attempt.passed,
      attempt.failed,
      attempt.total,
      JSON.stringify(attempt.files),
      attempt.output,
      attempt.createdAt,
    ]);

  return attempt;
}

function upsertDraft(challengeId, language, body) {
  const draft = {
    challengeId,
    language,
    files: body.files ?? {},
    updatedAt: body.updatedAt ?? new Date().toISOString(),
  };

  database
    .prepare(`
      INSERT INTO drafts (challenge_id, language, files_json, updated_at)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(challenge_id, language) DO UPDATE SET
        files_json = excluded.files_json,
        updated_at = excluded.updated_at
    `)
    .run([draft.challengeId, draft.language, JSON.stringify(draft.files), draft.updatedAt]);

  return draft;
}

function deleteDraft(challengeId, language) {
  database
    .prepare("DELETE FROM drafts WHERE challenge_id = ? AND language = ?")
    .run([challengeId, language]);
}

function setSetting(key, value) {
  database
    .prepare(`
      INSERT INTO app_settings (key, value, updated_at)
      VALUES (?, ?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
    `)
    .run([key, value, new Date().toISOString()]);
}

function getSetting(key) {
  const rows = selectAll("SELECT value FROM app_settings WHERE key = ?", [key]);
  return rows[0]?.value;
}

function selectAll(sql, params = []) {
  const statement = database.prepare(sql);
  statement.bind(params);
  const rows = [];

  while (statement.step()) {
    rows.push(statement.getAsObject());
  }

  statement.free();
  return rows;
}

async function readJson(request) {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(chunk);
  }

  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function sendJson(response, statusCode, value) {
  const body = JSON.stringify(value);
  response.writeHead(statusCode, {
    ...corsHeaders(),
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
  });
  response.end(body);
}

function sendEmpty(response, statusCode) {
  response.writeHead(statusCode, corsHeaders());
  response.end();
}

function corsHeaders() {
  const allowed = process.env.FORUNTENDO_ALLOWED_ORIGINS ?? "http://localhost:5173";
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}
