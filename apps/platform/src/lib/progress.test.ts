import { describe, expect, test } from "vite-plus/test";
import { CHALLENGE_LEVEL_MMR } from "@foruntendo/challenges";
import type { ChallengeAttempt } from "./local-db.ts";
import { getMmrScore, getPassedChallengeIds } from "./progress.ts";

function attempt(
  challengeId: string,
  status: ChallengeAttempt["status"],
  total = 100,
): ChallengeAttempt {
  return {
    id: `${challengeId}:${status}`,
    challengeId,
    challengeTitle: challengeId,
    language: "javascript",
    status,
    passed: status === "passed" ? 1 : 0,
    failed: status === "passed" ? 0 : 1,
    total,
    files: {},
    output: "",
    createdAt: "2026-04-30T00:00:00.000Z",
  };
}

describe("platform progress adapter", () => {
  test("profile MMR is derived from current challenge difficulty, not stored attempts", () => {
    const attempts = [
      attempt("types-truthy-falsy", "passed"),
      attempt("types-truthy-falsy", "passed"),
      attempt("switch-state-transition", "failed"),
      attempt("switch-state-transition", "passed"),
    ];

    expect([...getPassedChallengeIds(attempts)].sort()).toEqual([
      "switch-state-transition",
      "types-truthy-falsy",
    ]);
    expect(getMmrScore(attempts)).toBe(CHALLENGE_LEVEL_MMR[0] + CHALLENGE_LEVEL_MMR[5]);
  });
});
