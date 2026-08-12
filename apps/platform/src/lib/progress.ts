import { getCompletedChallengeIds, getMmrScoreForCompletions } from "@codenesis/challenges";
import type { ChallengeAttempt } from "./local-db.ts";

export function getPassedChallengeIds(attempts: ChallengeAttempt[]): Set<string> {
  return getCompletedChallengeIds(attempts);
}

export function getMmrScore(attempts: ChallengeAttempt[]): number {
  return getMmrScoreForCompletions(attempts);
}
