import type { ChallengeCollection } from "@foruntendo/challenges";
import type { ChallengeAttempt } from "./local-db.ts";
import { getPassedChallengeIds } from "./progress.ts";

export interface CollectionProgress {
  completed: number;
  total: number;
  percent: number;
}

export function getCollectionProgress(
  collection: ChallengeCollection,
  attempts: ChallengeAttempt[],
): CollectionProgress {
  const passedChallengeIds = getPassedChallengeIds(attempts);
  const completed = collection.challengeIds.filter((id) => passedChallengeIds.has(id)).length;
  const total = collection.challengeCount;

  return {
    completed,
    total,
    percent: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}
