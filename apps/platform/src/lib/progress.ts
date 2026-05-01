import { getCompletedChallengeIds, getMmrScoreForCompletions } from "@foruntendo/challenges";
import type { ChallengeAttempt } from "./local-db.ts";

export function getPassedChallengeIds(attempts: ChallengeAttempt[]): Set<string> {
  return getCompletedChallengeIds(attempts);
}

export function getMmrScore(attempts: ChallengeAttempt[]): number {
  return getMmrScoreForCompletions(attempts);
}
