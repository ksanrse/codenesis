import { describe, expect, test } from "vite-plus/test";
import {
  CHALLENGE_LEVEL_MMR,
  getAllChallenges,
  getChallengeById,
  getChallengePoints,
  getCompletedChallengeIds,
  getMmrScoreForChallengeIds,
  getMmrScoreForCompletions,
} from "../src/index.ts";

describe("challenge progress domain", () => {
  test("challenge reputation is always derived from current rank", () => {
    for (const challenge of getAllChallenges()) {
      expect(challenge.reputation).toBe(getChallengePoints(challenge.rank));
    }
  });

  test("MMR uses current challenge metadata and counts each solved challenge once", () => {
    const directF1 = getChallengeById("types-truthy-falsy");
    const directF4 = getChallengeById("types-normalize-count");

    expect(directF1?.reputation).toBe(CHALLENGE_LEVEL_MMR[0]);
    expect(directF4?.reputation).toBe(CHALLENGE_LEVEL_MMR[3]);

    expect(
      getMmrScoreForChallengeIds([
        "types-truthy-falsy",
        "types-truthy-falsy",
        "types-normalize-count",
        "missing-challenge",
      ]),
    ).toBe(CHALLENGE_LEVEL_MMR[0] + CHALLENGE_LEVEL_MMR[3]);
  });

  test("MMR ignores failed attempts and duplicate passed attempts", () => {
    const attempts = [
      { challengeId: "types-truthy-falsy", status: "failed" },
      { challengeId: "types-truthy-falsy", status: "passed" },
      { challengeId: "types-truthy-falsy", status: "passed" },
      { challengeId: "switch-state-transition", status: "passed" },
    ];

    expect([...getCompletedChallengeIds(attempts)].sort()).toEqual([
      "switch-state-transition",
      "types-truthy-falsy",
    ]);
    expect(getMmrScoreForCompletions(attempts)).toBe(
      CHALLENGE_LEVEL_MMR[0] + CHALLENGE_LEVEL_MMR[5],
    );
  });
});
