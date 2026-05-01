# Challenge Source Guidance

Challenge folders contain the actual learning content. Also follow `packages/challenges/AGENTS.md`.

## Rank Calibration

- Before adding or changing a challenge rank, use the `challenge-rank-calibrator` skill from the local Codex skills directory.
- Ranks in source are zero-based: `rank: 0` renders as F1, `rank: 7` renders as F8.
- Calibrate by required reasoning, not by topic name. A `switch` task can be F1, and a tiny polyfill can be F5+ only if the contract has real edge cases.
- F1: one direct operation, no branching beyond the taught construct.
- F2: one simple rule across a few fixed values.
- F3: several input cases or one real edge case, still one compact function.
- F4: multiple rules whose order matters, grouping, or small normalization.
- F5: careful contract reading, small decomposition, callbacks, objects, or mutation concerns.
- F6: state, wrappers, mini-API behavior, or robust behavior across repeated calls.
- F7: component-like or engine-like tasks with several connected constraints.
- F8: reserve for expert tasks: complex polyfills, interpreters, advanced algorithms, or very broad compatibility requirements.

## Content Contract

- Before adding or materially rewriting a task, use the `challenge-creation` skill from the local Codex skills directory.
- The description, starter export name, tests, full tests, and solution must describe the same API.
- If tests expect throwing, the description must say which error text is expected.
- If tests use a special JavaScript behavior (`Object.is`, `NaN`, `-0`, `Symbol`, `bigint`), name it in the task text.
- Keep examples close to the tested behavior so the user solves the task instead of guessing the contract.
