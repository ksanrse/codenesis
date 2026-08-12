import { createServer } from "node:http";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";
import initSqlJs from "sql.js";

const PORT = Number(process.env.CODENESIS_DB_PORT ?? 41731);
const HOST = process.env.CODENESIS_DB_HOST ?? "127.0.0.1";
const ROOT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const DB_PATH = resolve(
  process.env.CODENESIS_DB_PATH ?? resolve(ROOT_DIR, "data/codenesis.sqlite"),
);
const PRIMARY_USER_ID = "codenesis-local-user";
const DEVELOPER_USER_ID = "codenesis-developer";
const DEV_MODE = process.env.CODENESIS_DEV === "1";
const DEV_AUTH_CODE = process.env.CODENESIS_DEV_AUTH_CODE ?? "";

const SQL = await initSqlJs();
const database = await openDatabase();

database.exec(`
  PRAGMA foreign_keys = ON;

  DROP TABLE IF EXISTS challenges;
  DROP TABLE IF EXISTS collections;

  CREATE TABLE IF NOT EXISTS attempts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL DEFAULT 'codenesis-local-user',
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
    user_id TEXT NOT NULL DEFAULT 'codenesis-local-user',
    challenge_id TEXT NOT NULL,
    language TEXT NOT NULL,
    files_json TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    PRIMARY KEY (user_id, challenge_id, language)
  );

  CREATE TABLE IF NOT EXISTS auth_credentials (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    user_id TEXT NOT NULL,
    credential_id TEXT NOT NULL UNIQUE,
    public_key TEXT NOT NULL,
    counter INTEGER NOT NULL DEFAULT 0,
    recovery_hash TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS auth_sessions (
    token_hash TEXT PRIMARY KEY,
    user_id TEXT NOT NULL DEFAULT 'codenesis-local-user',
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS dev_skill_progress (
    user_id TEXT NOT NULL,
    skill_id TEXT NOT NULL,
    progress INTEGER NOT NULL,
    PRIMARY KEY (user_id, skill_id)
  );
`);

migrateUserScopedState();

// Replace the pre-WebAuthn prototype schema without affecting user progress.
const authColumns = selectAll("PRAGMA table_info(auth_credentials)").map((row) => row.name);
if (!authColumns.includes("credential_id")) {
  database.exec(
    "DROP TABLE IF EXISTS auth_credentials; CREATE TABLE auth_credentials (id INTEGER PRIMARY KEY CHECK (id = 1), user_id TEXT NOT NULL, credential_id TEXT NOT NULL UNIQUE, public_key TEXT NOT NULL, counter INTEGER NOT NULL DEFAULT 0, recovery_hash TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);",
  );
}
database.exec(
  "CREATE TABLE IF NOT EXISTS auth_challenges (id INTEGER PRIMARY KEY CHECK (id = 1), challenge TEXT NOT NULL, kind TEXT NOT NULL, expires_at INTEGER NOT NULL);",
);

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
  console.log(`[db] Codenesis SQLite API is running at http://${HOST}:${PORT}`);
  console.log(`[db] SQLite file: ${DB_PATH}`);
});

async function openDatabase() {
  await mkdir(dirname(DB_PATH), { recursive: true });

  try {
    const file = await readFile(DB_PATH);
    return new SQL.Database(file);
  } catch (error) {
    console.warn(
      "[db] Could not read DB file, starting with empty database:",
      error?.message ?? error,
    );
    return new SQL.Database();
  }
}

async function persist() {
  await mkdir(dirname(DB_PATH), { recursive: true });
  await writeFile(DB_PATH, Buffer.from(database.export()));
}

function migrateUserScopedState() {
  const attemptColumns = selectAll("PRAGMA table_info(attempts)").map((row) => row.name);
  if (!attemptColumns.includes("user_id")) {
    database.exec(
      "ALTER TABLE attempts ADD COLUMN user_id TEXT NOT NULL DEFAULT 'codenesis-local-user';",
    );
  }
  database.exec(`
    DROP INDEX IF EXISTS attempts_challenge_created_idx;
    CREATE INDEX IF NOT EXISTS attempts_user_challenge_created_idx
      ON attempts (user_id, challenge_id, created_at DESC);
  `);

  const draftColumns = selectAll("PRAGMA table_info(drafts)").map((row) => row.name);
  if (!draftColumns.includes("user_id")) {
    database.exec(`
      CREATE TABLE drafts_scoped (
        user_id TEXT NOT NULL,
        challenge_id TEXT NOT NULL,
        language TEXT NOT NULL,
        files_json TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        PRIMARY KEY (user_id, challenge_id, language)
      );
      INSERT INTO drafts_scoped (user_id, challenge_id, language, files_json, updated_at)
        SELECT '${PRIMARY_USER_ID}', challenge_id, language, files_json, updated_at FROM drafts;
      DROP TABLE drafts;
      ALTER TABLE drafts_scoped RENAME TO drafts;
    `);
  }

  const sessionColumns = selectAll("PRAGMA table_info(auth_sessions)").map((row) => row.name);
  if (!sessionColumns.includes("user_id")) {
    database.exec(
      "ALTER TABLE auth_sessions ADD COLUMN user_id TEXT NOT NULL DEFAULT 'codenesis-local-user';",
    );
  }
}

async function route(request, response) {
  const url = new URL(request.url ?? "/", `http://${request.headers.host ?? `${HOST}:${PORT}`}`);

  if (request.method === "OPTIONS") {
    sendEmpty(response, 204);
    return;
  }

  if (["POST", "PUT", "DELETE", "PATCH"].includes(request.method) && !isAllowedOrigin(request)) {
    sendJson(response, 403, { error: "Origin is not allowed" });
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/health") {
    sendJson(response, 200, {
      ok: true,
      ...(process.env.CODENESIS_E2E === "1" ? { dbPath: DB_PATH } : {}),
    });
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/auth/session") {
    const userId = authenticatedUserId(request);
    sendJson(response, 200, {
      authenticated: Boolean(userId),
      ...(userId ? { user: publicUser(userId) } : {}),
    });
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/dev/login") {
    if (!DEV_MODE || !DEV_AUTH_CODE) {
      sendJson(response, 404, { error: "Not found" });
      return;
    }
    const { code } = await readJson(request);
    if (!constantTimeEqual(String(code ?? ""), DEV_AUTH_CODE)) {
      sendJson(response, 401, { error: "Неверный developer-код" });
      return;
    }
    sendSessionCookie(response, DEVELOPER_USER_ID);
    await persist();
    sendJson(response, 200, { ok: true, user: publicUser(DEVELOPER_USER_ID) });
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/auth/logout") {
    clearSession(request, response);
    await persist();
    sendJson(response, 200, { ok: true });
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/state") {
    const userId = requireAuthenticated(request, response);
    if (!userId) return;
    sendJson(response, 200, readState(userId));
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/dev/progress") {
    const userId = requireDeveloper(request, response);
    if (!userId) return;
    sendJson(response, 200, readDeveloperProgress(userId));
    return;
  }

  if (request.method === "PUT" && url.pathname === "/api/dev/progress") {
    const userId = requireDeveloper(request, response);
    if (!userId) return;
    const body = await readJson(request);
    const challenges = Array.isArray(body.challenges) ? body.challenges : [];
    if (challenges.length > 1_000) {
      sendJson(response, 400, { error: "Too many challenges" });
      return;
    }
    database.prepare("DELETE FROM attempts WHERE user_id = ?").run([userId]);
    for (const challenge of challenges) {
      if (!challenge?.solved) continue;
      insertAttempt(
        {
          challengeId: String(challenge.id ?? ""),
          challengeTitle: String(challenge.title ?? challenge.id ?? "Задача"),
          language: String(challenge.language ?? "javascript"),
          status: "passed",
          passed: 1,
          failed: 0,
          total: 1,
          files: {},
          output: "Developer progress override",
        },
        userId,
      );
    }
    const skillProgress = body.skillProgress ?? {};
    database.prepare("DELETE FROM dev_skill_progress WHERE user_id = ?").run([userId]);
    for (const [skillId, rawProgress] of Object.entries(skillProgress)) {
      const progress = Math.round(Number(rawProgress));
      if (!Number.isFinite(progress) || progress < 0 || progress > 100) continue;
      database
        .prepare("INSERT INTO dev_skill_progress (user_id, skill_id, progress) VALUES (?, ?, ?)")
        .run([userId, skillId, progress]);
    }
    await persist();
    sendJson(response, 200, readDeveloperProgress(userId));
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/auth/passkey/register/options") {
    if (authUser()) {
      sendJson(response, 409, { error: "Passkey is already configured" });
      return;
    }
    const options = await createRegistrationOptions();
    sendJson(response, 200, options);
    return;
  }
  if (request.method === "POST" && url.pathname === "/api/auth/passkey/register/verify") {
    const result = await verifyRegistration(await readJson(request));
    if (!result.ok) {
      sendJson(response, 400, result);
      return;
    }
    sendSessionCookie(response, PRIMARY_USER_ID);
    await persist();
    sendJson(response, 201, result);
    return;
  }
  if (request.method === "POST" && url.pathname === "/api/auth/passkey/login/options") {
    const options = await createAuthenticationOptions();
    sendJson(response, 200, options);
    return;
  }
  if (request.method === "POST" && url.pathname === "/api/auth/passkey/login/verify") {
    const result = await verifyLogin(await readJson(request));
    if (!result.ok) {
      sendJson(response, 401, result);
      return;
    }
    sendSessionCookie(response, PRIMARY_USER_ID);
    await persist();
    sendJson(response, 200, result);
    return;
  }
  if (request.method === "POST" && url.pathname === "/api/auth/recovery/restore") {
    const result = restoreRecovery(await readJson(request));
    if (!result.ok) {
      sendJson(response, 401, result);
      return;
    }
    sendSessionCookie(response, PRIMARY_USER_ID);
    await persist();
    sendJson(response, 200, result);
    return;
  }
  if (request.method === "POST" && url.pathname === "/api/auth/recovery/update-passkey/options") {
    if (authenticatedUserId(request) !== PRIMARY_USER_ID) {
      sendJson(response, 401, { error: "Recovery authorization required" });
      return;
    }
    sendJson(response, 200, await createRegistrationOptions("recovery-registration"));
    return;
  }
  if (request.method === "POST" && url.pathname === "/api/auth/recovery/update-passkey") {
    if (authenticatedUserId(request) !== PRIMARY_USER_ID) {
      sendJson(response, 401, { error: "Recovery authorization required" });
      return;
    }
    const result = await verifyRegistration(await readJson(request), "recovery-registration");
    if (!result.ok) {
      sendJson(response, 401, result);
      return;
    }
    sendSessionCookie(response, PRIMARY_USER_ID);
    await persist();
    sendJson(response, 200, result);
    return;
  }

  if (
    process.env.CODENESIS_E2E === "1" &&
    request.method === "POST" &&
    url.pathname === "/api/test/reset"
  ) {
    resetUserState();
    await persist();
    sendJson(response, 200, readState(PRIMARY_USER_ID));
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/attempts") {
    const userId = requireAuthenticated(request, response);
    if (!userId) return;
    const body = await readJson(request);
    const attempt = insertAttempt(body, userId);
    await persist();
    sendJson(response, 201, attempt);
    return;
  }

  const draftMatch = url.pathname.match(/^\/api\/drafts\/([^/]+)\/([^/]+)$/);
  if (draftMatch && request.method === "PUT") {
    const userId = requireAuthenticated(request, response);
    if (!userId) return;
    const body = await readJson(request);
    const draft = upsertDraft(
      decodeURIComponent(draftMatch[1]),
      decodeURIComponent(draftMatch[2]),
      body,
      userId,
    );
    await persist();
    sendJson(response, 200, draft);
    return;
  }

  if (draftMatch && request.method === "DELETE") {
    const userId = requireAuthenticated(request, response);
    if (!userId) return;
    deleteDraft(decodeURIComponent(draftMatch[1]), decodeURIComponent(draftMatch[2]), userId);
    await persist();
    sendEmpty(response, 204);
    return;
  }

  sendJson(response, 404, { error: "Not found" });
}

function readState(userId) {
  const attempts = selectAll(
    `
    SELECT id, challenge_id, challenge_title, language, status, passed, failed, total,
           files_json, output, created_at
    FROM attempts
    WHERE user_id = ?
    ORDER BY created_at DESC
  `,
    [userId],
  ).map((row) => ({
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
    "SELECT challenge_id, language, files_json, updated_at FROM drafts WHERE user_id = ?",
    [userId],
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
  };
}

function readDeveloperProgress(userId) {
  return {
    skillProgress: Object.fromEntries(
      selectAll("SELECT skill_id, progress FROM dev_skill_progress WHERE user_id = ?", [
        userId,
      ]).map((row) => [row.skill_id, row.progress]),
    ),
  };
}

function resetUserState() {
  database.exec(`
    DELETE FROM attempts;
    DELETE FROM drafts;
    DELETE FROM auth_credentials;
    DELETE FROM auth_challenges;
    DELETE FROM auth_sessions;
    DELETE FROM dev_skill_progress;
  `);
}

const RP_ID = process.env.CODENESIS_WEBAUTHN_RP_ID ?? "codenesis.vercel.app";
const ORIGIN = process.env.CODENESIS_WEBAUTHN_ORIGIN ?? "https://codenesis.vercel.app";
const CHALLENGE_TTL_MS = 5 * 60 * 1000;
const SESSION_MAX_AGE_SECONDS = 10 * 365 * 24 * 60 * 60;
const RECOVERY_WORDS =
  "apple bridge candle cloud copper dawn ember forest garden harbor island jasmine kitten lantern meadow narrow ocean pepper quiet river silver thunder velvet willow yellow zephyr anchor breeze comet drift eagle feather".split(
    " ",
  );

function authUser() {
  return selectAll("SELECT * FROM auth_credentials WHERE id = 1")[0];
}
function publicUser(userId) {
  return userId === DEVELOPER_USER_ID
    ? { id: userId, name: "Developer", role: "developer" }
    : { id: PRIMARY_USER_ID, name: "Kirill", role: "owner" };
}
function cookieValue(request, name) {
  const item = (request.headers.cookie ?? "")
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));
  return item ? decodeURIComponent(item.slice(name.length + 1)) : null;
}
function authenticatedUserId(request) {
  if (process.env.CODENESIS_E2E === "1") return PRIMARY_USER_ID;
  const token = cookieValue(request, "codenesis_session");
  if (!token) return null;
  const session = selectAll("SELECT user_id FROM auth_sessions WHERE token_hash = ?", [
    hashToken(token),
  ])[0];
  return session?.user_id ?? null;
}
function requireAuthenticated(request, response) {
  const userId = authenticatedUserId(request);
  if (userId) return userId;
  sendJson(response, 401, { error: "Authentication required" });
  return null;
}
function requireDeveloper(request, response) {
  const userId = authenticatedUserId(request);
  if (DEV_MODE && userId === DEVELOPER_USER_ID) return userId;
  sendJson(response, 403, { error: "Developer session required" });
  return null;
}
function saveChallenge(kind, challenge) {
  database
    .prepare(
      "INSERT INTO auth_challenges (id, challenge, kind, expires_at) VALUES (1, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET challenge=excluded.challenge, kind=excluded.kind, expires_at=excluded.expires_at",
    )
    .run([challenge, kind, Date.now() + CHALLENGE_TTL_MS]);
}
function takeChallenge(kind) {
  const row = selectAll(
    "SELECT challenge, expires_at FROM auth_challenges WHERE id = 1 AND kind = ?",
    [kind],
  )[0];
  database.prepare("DELETE FROM auth_challenges WHERE id = 1").run();
  return row && row.expires_at > Date.now() ? row.challenge : null;
}
function createRecoveryPhrase() {
  return Array.from(randomBytes(12), (byte) => RECOVERY_WORDS[byte % RECOVERY_WORDS.length]).join(
    " ",
  );
}
function hashRecovery(value) {
  const salt = randomBytes(16);
  const key = scryptSync(value, salt, 32, { N: 16384, r: 8, p: 1 });
  return `${salt.toString("base64url")}.${key.toString("base64url")}`;
}
function verifyRecoveryPhrase(value, encoded) {
  try {
    const [salt, hash] = encoded.split(".");
    const expected = Buffer.from(hash, "base64url");
    const actual = scryptSync(value, Buffer.from(salt, "base64url"), expected.length, {
      N: 16384,
      r: 8,
      p: 1,
    });
    return timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}
function normalizePhrase(value) {
  const words = typeof value === "string" ? value.trim().toLowerCase().split(/\s+/) : [];
  return words.length === 12 ? words.join(" ") : null;
}
async function createRegistrationOptions(kind = "registration") {
  const userId = "codenesis-local-user";
  const options = await generateRegistrationOptions({
    rpName: "Codenesis",
    rpID: RP_ID,
    userName: userId,
    userID: new TextEncoder().encode(userId),
    attestationType: "none",
    excludeCredentials: authUser() ? [{ id: authUser().credential_id }] : [],
  });
  saveChallenge(kind, options.challenge);
  return options;
}
async function verifyRegistration(response, kind = "registration") {
  const challenge = takeChallenge(kind);
  if (!challenge) return { ok: false, error: "Challenge expired" };
  try {
    const result = await verifyRegistrationResponse({
      response,
      expectedChallenge: challenge,
      expectedOrigin: ORIGIN,
      expectedRPID: RP_ID,
    });
    if (!result.verified || !result.registrationInfo)
      return { ok: false, error: "Registration failed" };
    const { credential } = result.registrationInfo;
    const old = authUser();
    const now = new Date().toISOString();
    if (kind === "recovery-registration" && !old)
      return { ok: false, error: "Recovery is not available" };
    if (kind === "recovery-registration") {
      database.exec("DELETE FROM auth_sessions");
      database
        .prepare(
          "UPDATE auth_credentials SET credential_id = ?, public_key = ?, counter = ?, updated_at = ? WHERE id = 1",
        )
        .run([
          credential.id,
          Buffer.from(credential.publicKey).toString("base64url"),
          credential.counter,
          now,
        ]);
      return { ok: true };
    }
    const phrase = createRecoveryPhrase();
    database
      .prepare(
        "INSERT OR REPLACE INTO auth_credentials (id,user_id,credential_id,public_key,counter,recovery_hash,created_at,updated_at) VALUES (1,?,?,?,?,?,?,?)",
      )
      .run([
        "codenesis-local-user",
        credential.id,
        Buffer.from(credential.publicKey).toString("base64url"),
        credential.counter,
        hashRecovery(phrase),
        now,
        now,
      ]);
    return {
      ok: true,
      recoveryPhrase: phrase,
      recoveryFile: { type: "codenesis-recovery", version: 1, recoveryPhrase: phrase },
    };
  } catch {
    return { ok: false, error: "Registration failed" };
  }
}
async function createAuthenticationOptions() {
  const user = authUser();
  const options = await generateAuthenticationOptions({
    rpID: RP_ID,
    allowCredentials: user ? [{ id: user.credential_id }] : [],
  });
  saveChallenge("authentication", options.challenge);
  return options;
}
async function verifyLogin(response) {
  const user = authUser();
  const challenge = takeChallenge("authentication");
  if (!user || !challenge) return { ok: false, error: "Challenge expired" };
  try {
    const result = await verifyAuthenticationResponse({
      response,
      expectedChallenge: challenge,
      expectedOrigin: ORIGIN,
      expectedRPID: RP_ID,
      credential: {
        id: user.credential_id,
        publicKey: Buffer.from(user.public_key, "base64url"),
        counter: user.counter,
      },
    });
    if (!result.verified) return { ok: false, error: "Authentication failed" };
    database
      .prepare("UPDATE auth_credentials SET counter = ?, updated_at = ? WHERE id = 1")
      .run([result.authenticationInfo.newCounter, new Date().toISOString()]);
    return { ok: true };
  } catch {
    return { ok: false, error: "Authentication failed" };
  }
}
function restoreRecovery(body) {
  const phrase = normalizePhrase(
    body.recoveryPhrase ?? body.phrase ?? body.recoveryFile?.recoveryPhrase,
  );
  const user = authUser();
  return {
    ok: Boolean(user && phrase && verifyRecoveryPhrase(phrase, user.recovery_hash)),
    ...(phrase ? { recoveryPhrase: phrase } : {}),
  };
}
function isAllowedOrigin(request) {
  const origin = request.headers.origin;
  if (!origin) return true;
  if (DEV_MODE && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) return true;
  return (process.env.CODENESIS_ALLOWED_ORIGINS ?? "http://localhost:5173")
    .split(",")
    .map((value) => value.trim())
    .includes(origin);
}
function sendSessionCookie(response, userId) {
  const token = randomBytes(32).toString("base64url");
  database
    .prepare("INSERT INTO auth_sessions (token_hash, user_id, created_at) VALUES (?, ?, ?)")
    .run([hashToken(token), userId, new Date().toISOString()]);
  const secure = ORIGIN.startsWith("https://") && !DEV_MODE ? "; Secure" : "";
  response.setHeader(
    "Set-Cookie",
    `codenesis_session=${encodeURIComponent(token)}; Path=/; Max-Age=${SESSION_MAX_AGE_SECONDS}; HttpOnly${secure}; SameSite=Lax`,
  );
}
function clearSession(request, response) {
  const token = cookieValue(request, "codenesis_session");
  if (token)
    database.prepare("DELETE FROM auth_sessions WHERE token_hash = ?").run([hashToken(token)]);
  response.setHeader(
    "Set-Cookie",
    `codenesis_session=; Path=/; Max-Age=0; HttpOnly${ORIGIN.startsWith("https://") && !DEV_MODE ? "; Secure" : ""}; SameSite=Lax`,
  );
}
function hashToken(token) {
  return createHash("sha256").update(token).digest("base64url");
}

function constantTimeEqual(left, right) {
  const leftHash = createHash("sha256").update(left).digest();
  const rightHash = createHash("sha256").update(right).digest();
  return timingSafeEqual(leftHash, rightHash);
}

function insertAttempt(body, userId) {
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
        id, user_id, challenge_id, challenge_title, language, status, passed, failed, total,
        files_json, output, created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .run([
      attempt.id,
      userId,
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

function upsertDraft(challengeId, language, body, userId) {
  const draft = {
    challengeId,
    language,
    files: body.files ?? {},
    updatedAt: body.updatedAt ?? new Date().toISOString(),
  };

  database
    .prepare(`
      INSERT INTO drafts (user_id, challenge_id, language, files_json, updated_at)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(user_id, challenge_id, language) DO UPDATE SET
        files_json = excluded.files_json,
        updated_at = excluded.updated_at
    `)
    .run([userId, draft.challengeId, draft.language, JSON.stringify(draft.files), draft.updatedAt]);

  return draft;
}

function deleteDraft(challengeId, language, userId) {
  database
    .prepare("DELETE FROM drafts WHERE user_id = ? AND challenge_id = ? AND language = ?")
    .run([userId, challengeId, language]);
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

  const rawBuffer = Buffer.concat(chunks);
  if (rawBuffer.byteLength > 1_048_576) throw new Error("Request body too large");
  const raw = rawBuffer.toString("utf8");
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
  const allowed = process.env.CODENESIS_ALLOWED_ORIGINS ?? "http://localhost:5173";
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}
