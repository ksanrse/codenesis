import {
  filterChallenges,
  getAllChallenges,
  getChallengeById,
  type Category,
  type ChallengeDefinition,
  type ChallengeMeta,
  type ChallengeSort,
  type Language,
} from "@codenesis/challenges";
import { readable } from "svelte/store";

// The public endpoint is the production default. Vercel can override it with
// VITE_POCKETBASE_URL for staging or a private proxy without changing code.
const POCKETBASE_URL = (
  (import.meta.env.VITE_POCKETBASE_URL as string | undefined) ??
  "https://codenesis-pb.159-195-17-180.nip.io"
).replace(/\/$/, "");

export type CatalogFilter = {
  search?: string;
  minRank?: number;
  maxRank?: number;
  category?: Category;
  group?: string;
  language?: Language;
  sort?: ChallengeSort;
};

export const staticChallenges = getAllChallenges();
let catalog = staticChallenges;
let definitions = new Map<string, ChallengeDefinition>();
let loadPromise: Promise<ChallengeMeta[]> | null = null;

export const catalogStatus = readable<"static" | "loading" | "remote">("static", (set) => {
  if (!POCKETBASE_URL) return () => undefined;
  set("loading");
  void loadChallengeCatalog()
    .then(() => set("remote"))
    .catch(() => set("static"));
  return () => undefined;
});

export function getCatalogChallenges(): ChallengeMeta[] {
  return catalog;
}

export function getCatalogGroups(): string[] {
  return [...new Set(catalog.map((challenge) => challenge.group))].sort((a, b) =>
    a.localeCompare(b),
  );
}

export function filterCatalogChallenges(options: CatalogFilter): ChallengeMeta[] {
  if (!POCKETBASE_URL || catalog === staticChallenges) return filterChallenges(options);
  let result = catalog.filter((challenge) => {
    if (options.minRank !== undefined && challenge.rank < options.minRank) return false;
    if (options.maxRank !== undefined && challenge.rank > options.maxRank) return false;
    if (options.category && challenge.category !== options.category) return false;
    if (options.group && challenge.group !== options.group) return false;
    if (options.language && !challenge.languages.includes(options.language)) return false;
    if (!options.search) return true;
    const query = options.search.toLowerCase();
    return [challenge.title, challenge.description, challenge.group, ...challenge.tags]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });
  if (options.sort === "rank-asc") result = [...result].sort((a, b) => a.rank - b.rank);
  if (options.sort === "rank-desc") result = [...result].sort((a, b) => b.rank - a.rank);
  return result;
}

export function getCatalogChallengeById(id: string): ChallengeDefinition | undefined {
  return definitions.get(id) ?? getChallengeById(id);
}

export async function loadChallengeCatalog(): Promise<ChallengeMeta[]> {
  if (!POCKETBASE_URL) return catalog;
  if (loadPromise) return loadPromise;
  loadPromise = fetch(
    `${POCKETBASE_URL}/api/collections/challenges/records?perPage=500&sort=rank,title`,
    { headers: { Accept: "application/json" } },
  )
    .then(async (response) => {
      if (!response.ok) throw new Error(`PocketBase catalog request failed (${response.status})`);
      const payload = (await response.json()) as { items?: unknown[] };
      const remote = (payload.items ?? [])
        .map(normalizeRecord)
        .filter(Boolean) as ChallengeDefinition[];
      if (!remote.length) throw new Error("PocketBase returned an empty challenge catalog");
      definitions = new Map(remote.map((challenge) => [challenge.id, challenge]));
      catalog = remote.map(toMeta);
      return catalog;
    })
    .catch((error) => {
      loadPromise = null;
      throw error;
    });
  return loadPromise;
}

function normalizeRecord(value: unknown): ChallengeDefinition | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const json = (key: string, fallback: unknown) => {
    const value = record[key];
    if (value === undefined || value === null || value === "") return fallback;
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch {
        return fallback;
      }
    }
    return value;
  };
  const asString = (value: unknown, fallback = "") =>
    typeof value === "string" ? value : fallback;
  const externalId = asString(record.external_id, asString(record.id));
  const staticDefinition = getChallengeById(externalId);
  if (!externalId || !record.title) return null;
  return {
    ...staticDefinition,
    id: externalId,
    title: asString(record.title),
    description: asString(record.description),
    difficulty: asString(record.difficulty, "Starter") as ChallengeDefinition["difficulty"],
    category: asString(record.category, "JavaScript") as Category,
    group: asString(record.group, "JavaScript"),
    languages: json("languages", ["javascript"]) as Language[],
    rank: Number(record.rank ?? 0),
    reputation: Number(record.reputation ?? 0),
    tags: json("tags", []) as string[],
    starterFiles: json("starter_files", {}) as ChallengeDefinition["starterFiles"],
    testFiles: json("test_files", {}) as ChallengeDefinition["testFiles"],
    fullTestFiles: json("full_test_files", undefined) as ChallengeDefinition["fullTestFiles"],
    solutionFiles: json("solution_files", {}) as ChallengeDefinition["solutionFiles"],
    dependencies: json("dependencies", {}) as ChallengeDefinition["dependencies"],
  };
}

function toMeta(challenge: ChallengeDefinition): ChallengeMeta {
  const {
    starterFiles: _starterFiles,
    testFiles: _testFiles,
    fullTestFiles: _fullTestFiles,
    solutionFiles: _solutionFiles,
    dependencies: _dependencies,
    ...meta
  } = challenge;
  return meta;
}
