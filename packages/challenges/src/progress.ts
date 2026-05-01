import { getChallengeById } from "./registry.ts";

export interface ChallengeCompletionRecord {
  challengeId: string;
  status: string;
}

export function getCompletedChallengeIds(
  records: readonly ChallengeCompletionRecord[],
): Set<string> {
  return new Set(
    records.filter((record) => record.status === "passed").map((record) => record.challengeId),
  );
}

export function getMmrScoreForChallengeIds(challengeIds: Iterable<string>): number {
  return [...new Set(challengeIds)].reduce((score, challengeId) => {
    const challenge = getChallengeById(challengeId);
    return score + (challenge?.reputation ?? 0);
  }, 0);
}

export function getMmrScoreForCompletions(records: readonly ChallengeCompletionRecord[]): number {
  return getMmrScoreForChallengeIds(getCompletedChallengeIds(records));
}
