# Challenge Package Guidance

This package is the source of truth for challenge metadata, task text, tests, solutions, collections, ranks, and MMR values. Also follow the repository root `AGENTS.md`.

## Challenge Content

- Write task descriptions like a teacher, not like a terse API note. The user should understand the situation, the target function, the expected behavior, and the edge cases without guessing.
- Keep theory short and useful. Explain why the construct matters, then move quickly to the concrete function the user must implement.
- Use Russian for task explanations and requirements. Keep code identifiers, test names, and language terms in English when that is the natural programming term.
- Use inline code formatting for function names, literals, operators, and return values.
- Always include a working reference solution and tests that match the written contract.

## Difficulty And MMR

- Task `rank` is zero-based and maps to F-levels through `src/ranking.ts`: `0` means F1, `7` means F8.
- Do not use ranks above `7`. F8 is reserved for expert-level tasks: complex polyfills, mini-interpreters, non-trivial algorithms, or behavior with many edge cases.
- When assigning a rank, read `RANK_BANDS` in `src/ranking.ts` and choose the level by required reasoning, not by topic name.
- Recompute `reputation` through `getChallengePoints(rank)` instead of hardcoding MMR.
- Keep completion and profile MMR rules in `src/progress.ts`. MMR must be calculated from the current challenge metadata, not from a rank or reputation value stored on an old attempt.

## Build And Verification

- After changing challenge content or ranking data, run `vp run build -r` so packages that consume built challenge output do not read stale data.
- Run `vp check` and `vp test` when possible.
- Always run `vp run check:mojibake` after editing Russian text.
