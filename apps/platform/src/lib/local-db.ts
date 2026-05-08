import type { Language } from "@foruntendo/challenges";

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
  activeCollectionId?: string;
}

const STORAGE_KEY = "foruntendo:db:v1";
const API_BASES = [
  import.meta.env.VITE_FORUNTENDO_API_URL as string | undefined,
  "/api",
  "http://127.0.0.1:41731/api",
].filter(Boolean) as string[];

let cache = readLocalDatabase();
let serverReady = false;
let cachedSortedAttempts: ChallengeAttempt[] | null = null;

function createDatabase(): AppDatabase {
  return {
    version: 1,
    attempts: [],
    drafts: {},
  };
}

function readLocalDatabase(): AppDatabase {
  if (typeof window === "undefined") return createDatabase();

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDatabase();
    const parsed = JSON.parse(raw) as AppDatabase;
    return normalizeDatabase(parsed);
  } catch {
    return createDatabase();
  }
}

function normalizeDatabase(database: Partial<AppDatabase>): AppDatabase {
  const activeCollectionId = database.activeCollectionId?.trim() || undefined;

  return {
    ...createDatabase(),
    ...database,
    version: 1,
    attempts: database.attempts ?? [],
    drafts: database.drafts ?? {},
    activeCollectionId,
  };
}

function writeCache(database: AppDatabase): void {
  cache = normalizeDatabase(database);
  cachedSortedAttempts = null;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
    window.dispatchEvent(new Event("foruntendo-db-change"));
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
  try {
    const localDatabase = readLocalDatabase();
    const database = await apiRequest<AppDatabase>("/state");
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

  if (
    localDatabase.activeCollectionId &&
    localDatabase.activeCollectionId !== serverDatabase.activeCollectionId
  ) {
    try {
      await apiRequest("/settings/active-collection", {
        method: "PUT",
        body: JSON.stringify({ collectionId: localDatabase.activeCollectionId }),
      });
      changed = true;
    } catch {
      return;
    }
  }

  if (changed) {
    await syncFromServer();
  }
}

if (typeof window !== "undefined") {
  void syncFromServer();
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

export function getActiveCollectionId(): string | undefined {
  return cache.activeCollectionId;
}

export function setActiveCollectionId(collectionId: string | undefined): void {
  writeCache({ ...cache, activeCollectionId: collectionId });

  if (serverReady) {
    void apiRequest("/settings/active-collection", {
      method: "PUT",
      body: JSON.stringify({ collectionId }),
    }).catch(() => {
      serverReady = false;
    });
  }
}
