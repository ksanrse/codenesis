import { createHash } from "node:crypto";

const baseUrl = (process.env.POCKETBASE_URL ?? "http://127.0.0.1:8090").replace(/\/$/, "");
const adminEmail = process.env.POCKETBASE_ADMIN_EMAIL;
const adminPassword = process.env.POCKETBASE_ADMIN_PASSWORD;
const providedToken = process.env.POCKETBASE_TOKEN;

if (!providedToken && (!adminEmail || !adminPassword)) {
  throw new Error(
    "Set POCKETBASE_TOKEN or POCKETBASE_ADMIN_EMAIL and POCKETBASE_ADMIN_PASSWORD before syncing.",
  );
}

const token = providedToken ?? (await authenticate(adminEmail, adminPassword));
const registry = await import("../packages/challenges/dist/index.mjs");
const challenges = registry
  .getAllChallenges()
  .map(({ id }) => registry.getChallengeById(id))
  .filter(Boolean);

await ensureCollection(token);
let created = 0;
let updated = 0;
for (const challenge of challenges) {
  const body = serializeChallenge(challenge);
  const recordId = stablePocketBaseId(challenge.id);
  const existing = await request(`/api/collections/challenges/records/${recordId}`, {
    token,
    optional: true,
  });
  if (existing) {
    await request(`/api/collections/challenges/records/${recordId}`, {
      method: "PATCH",
      token,
      body,
    });
    updated += 1;
  } else {
    await request("/api/collections/challenges/records", {
      method: "POST",
      token,
      body: { id: recordId, ...body },
    });
    created += 1;
  }
}

console.log(
  `PocketBase challenges synced: ${created} created, ${updated} updated, ${challenges.length} total.`,
);

async function authenticate(email, password) {
  const result = await request("/api/collections/_superusers/auth-with-password", {
    method: "POST",
    body: { identity: email, password },
  });
  return result.token;
}

async function ensureCollection(token) {
  const current = await request("/api/collections/challenges", { token, optional: true });
  const body = collectionDefinition();
  if (current) {
    await request(`/api/collections/${current.id}`, { method: "PATCH", token, body });
  } else {
    await request("/api/collections", { method: "POST", token, body });
  }
}

function collectionDefinition() {
  const json = (name) => ({ name, type: "json", required: false });
  return {
    name: "challenges",
    type: "base",
    listRule: "",
    viewRule: "",
    createRule: null,
    updateRule: null,
    deleteRule: null,
    fields: [
      { name: "external_id", type: "text", required: true, max: 200 },
      { name: "title", type: "text", required: true, max: 500 },
      { name: "description", type: "text", required: true, max: 0 },
      { name: "difficulty", type: "text", required: true, max: 32 },
      { name: "category", type: "text", required: true, max: 100 },
      { name: "group", type: "text", required: true, max: 200 },
      json("languages"),
      // PocketBase treats numeric zero as an empty value for `required` validation.
      // Rank 0 is a valid starter level, so keep numeric fields optional and
      // validate their bounds in the importer instead.
      { name: "rank", type: "number", required: false, min: 0, max: 7 },
      { name: "reputation", type: "number", required: false, min: 0 },
      json("tags"),
      json("starter_files"),
      json("test_files"),
      json("full_test_files"),
      json("solution_files"),
      json("dependencies"),
    ],
    indexes: ["CREATE UNIQUE INDEX idx_challenges_external_id ON challenges (external_id)"],
  };
}

function serializeChallenge(challenge) {
  return {
    external_id: challenge.id,
    title: challenge.title,
    description: challenge.description,
    difficulty: challenge.difficulty,
    category: challenge.category,
    group: challenge.group,
    languages: challenge.languages,
    rank: challenge.rank,
    reputation: challenge.reputation,
    tags: challenge.tags,
    starter_files: challenge.starterFiles,
    test_files: challenge.testFiles,
    full_test_files: challenge.fullTestFiles ?? null,
    solution_files: challenge.solutionFiles,
    dependencies: challenge.dependencies,
  };
}

function stablePocketBaseId(value) {
  return createHash("sha256").update(value).digest("hex").slice(0, 15);
}

async function request(path, { method = "GET", token, body, optional = false } = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: token } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (optional && response.status === 404) return null;
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`${method} ${path} failed (${response.status}): ${JSON.stringify(payload)}`);
  }
  return payload;
}
