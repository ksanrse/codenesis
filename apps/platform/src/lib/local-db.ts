import type { Language } from "@codenesis/challenges";

export interface ChallengeAttempt {
  id: string;
  challengeId: string;
  challengeTitle: string;
  language: Language;
  status: "passed" | "failed";
  passed: number;
  failed: number;
  total: number;
  files: Record<string, string>;
  output: string;
  createdAt: string;
}

export interface DraftRecord {
  challengeId: string;
  language: Language;
  files: Record<string, string>;
  updatedAt: string;
}

export interface AppDatabase {
  version: 1;
  attempts: ChallengeAttempt[];
  drafts: Record<string, DraftRecord>;
}

const STORAGE_KEY = "codenesis:db:v1";
const LEGACY_STORAGE_KEYS = ["foruntendo:db:v1"];
const PRIMARY_USER_ID = "codenesis-local-user";
const API_BASES = [
  import.meta.env.VITE_CODENESIS_API_URL as string | undefined,
  "/api",
  "http://127.0.0.1:41731/api",
].filter(Boolean) as string[];

let activeUserId = PRIMARY_USER_ID;
let cache = readLocalDatabase();
let serverReady = false;
let cachedSortedAttempts: ChallengeAttempt[] | null = null;

function isLocalDeveloperSession(): boolean {
  return (
    import.meta.env.DEV &&
    typeof window !== "undefined" &&
    sessionStorage.getItem("codenesis:local-dev-session") === "1"
  );
}

function createDatabase(): AppDatabase {
  return {
    version: 1,
    attempts: [],
    drafts: {},
  };
}

function readLocalDatabase(): AppDatabase {
  if (typeof window === "undefined") return createDatabase();

  const databases = localStorageKeys()
    .map(readStoredDatabase)
    .filter((database): database is AppDatabase => database !== null);

  if (!databases.length) return createDatabase();

  const attempts = new Map<string, ChallengeAttempt>();
  const drafts: Record<string, DraftRecord> = {};

  for (const database of databases) {
    for (const attempt of database.attempts) attempts.set(attempt.id, attempt);
    for (const [key, draft] of Object.entries(database.drafts)) {
      if (!drafts[key] || drafts[key].updatedAt < draft.updatedAt) drafts[key] = draft;
    }
  }

  return normalizeDatabase({ attempts: [...attempts.values()], drafts });
}

function localStorageKeys(): string[] {
  if (activeUserId === PRIMARY_USER_ID) return [STORAGE_KEY, ...LEGACY_STORAGE_KEYS];
  return [`${STORAGE_KEY}:${activeUserId}`];
}

function activeStorageKey(): string {
  return activeUserId === PRIMARY_USER_ID ? STORAGE_KEY : `${STORAGE_KEY}:${activeUserId}`;
}

function readStoredDatabase(key: string): AppDatabase | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? normalizeDatabase(JSON.parse(raw) as Partial<AppDatabase>) : null;
  } catch {
    return null;
  }
}

function normalizeDatabase(database: Partial<AppDatabase>): AppDatabase {
  return {
    ...createDatabase(),
    ...database,
    version: 1,
    attempts: database.attempts ?? [],
    drafts: database.drafts ?? {},
  };
}

function writeCache(database: AppDatabase): void {
  cache = normalizeDatabase(database);
  cachedSortedAttempts = null;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(activeStorageKey(), JSON.stringify(cache));
    window.dispatchEvent(new Event("codenesis-db-change"));
  }
}

function draftKey(challengeId: string, language: Language): string {
  return `${challengeId}:${language}`;
}

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");

  let lastError: unknown;

  for (const base of API_BASES) {
    try {
      const response = await fetch(`${base}${path}`, {
        ...init,
        credentials: "include",
        headers,
      });

      if (!response.ok) {
        throw new Error(`DB API request failed: ${response.status}`);
      }

      if (response.status === 204) return undefined as T;
      return (await response.json()) as T;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error("DB API request failed");
}

async function syncFromServer(): Promise<void> {
  const userId = activeUserId;
  try {
    const localDatabase = readLocalDatabase();
    const database = await apiRequest<AppDatabase>("/state");
    if (activeUserId !== userId) return;
    serverReady = true;
    writeCache(database);
    await migrateLocalState(localDatabase, database);
  } catch {
    serverReady = false;
  }
}

async function migrateLocalState(
  localDatabase: AppDatabase,
  serverDatabase: AppDatabase,
): Promise<void> {
  const serverAttemptIds = new Set(serverDatabase.attempts.map((attempt) => attempt.id));
  const missingAttempts = localDatabase.attempts.filter(
    (attempt) => !serverAttemptIds.has(attempt.id),
  );
  let changed = false;

  for (const attempt of missingAttempts) {
    try {
      await apiRequest<ChallengeAttempt>("/attempts", {
        method: "POST",
        body: JSON.stringify(attempt),
      });
      changed = true;
    } catch {
      return;
    }
  }

  for (const draft of Object.values(localDatabase.drafts)) {
    const serverDraft = serverDatabase.drafts[draftKey(draft.challengeId, draft.language)];
    if (serverDraft && serverDraft.updatedAt >= draft.updatedAt) continue;

    try {
      await apiRequest<DraftRecord>(
        `/drafts/${encodeURIComponent(draft.challengeId)}/${encodeURIComponent(draft.language)}`,
        {
          method: "PUT",
          body: JSON.stringify(draft),
        },
      );
      changed = true;
    } catch {
      return;
    }
  }

  if (changed) {
    await syncFromServer();
  }
}

export function setDatabaseUser(userId: string): void {
  if (!userId || userId === activeUserId) {
    void syncFromServer();
    return;
  }
  activeUserId = userId;
  cache = readLocalDatabase();
  cachedSortedAttempts = null;
  serverReady = false;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("codenesis-db-change"));
    if (!isLocalDeveloperSession()) void syncFromServer();
  }
}

export function getAttempts(): ChallengeAttempt[] {
  if (cachedSortedAttempts) return cachedSortedAttempts;
  cachedSortedAttempts = [...cache.attempts].sort((left, right) =>
    right.createdAt.localeCompare(left.createdAt),
  );
  return cachedSortedAttempts;
}

export function addAttempt(attempt: Omit<ChallengeAttempt, "id" | "createdAt">): ChallengeAttempt {
  const nextAttempt: ChallengeAttempt = {
    ...attempt,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  writeCache({
    ...cache,
    attempts: [nextAttempt, ...cache.attempts],
  });

  if (serverReady) {
    void apiRequest<ChallengeAttempt>("/attempts", {
      method: "POST",
      body: JSON.stringify(nextAttempt),
    }).catch(() => {
      serverReady = false;
    });
  }

  return nextAttempt;
}

export function getDraft(challengeId: string, language: Language): DraftRecord | undefined {
  return cache.drafts[draftKey(challengeId, language)];
}

export function saveDraft(
  challengeId: string,
  language: Language,
  files: Record<string, string>,
): DraftRecord {
  const nextDraft: DraftRecord = {
    challengeId,
    language,
    files,
    updatedAt: new Date().toISOString(),
  };

  writeCache({
    ...cache,
    drafts: {
      ...cache.drafts,
      [draftKey(challengeId, language)]: nextDraft,
    },
  });

  if (serverReady) {
    void apiRequest<DraftRecord>(
      `/drafts/${encodeURIComponent(challengeId)}/${encodeURIComponent(language)}`,
      {
        method: "PUT",
        body: JSON.stringify(nextDraft),
      },
    ).catch(() => {
      serverReady = false;
    });
  }

  return nextDraft;
}

export function clearDraft(challengeId: string, language: Language): void {
  const nextDrafts = { ...cache.drafts };
  delete nextDrafts[draftKey(challengeId, language)];
  writeCache({ ...cache, drafts: nextDrafts });

  if (serverReady) {
    void apiRequest(`/drafts/${encodeURIComponent(challengeId)}/${encodeURIComponent(language)}`, {
      method: "DELETE",
    }).catch(() => {
      serverReady = false;
    });
  }
}
