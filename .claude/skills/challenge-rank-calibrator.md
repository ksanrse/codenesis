---
name: challenge-rank-calibrator
description: Assign and audit programming challenge difficulty levels from F1 to F8 using a deterministic rubric. Use when creating, reviewing, or recalibrating coding tasks, challenge descriptions, tests, full tests, starter code, or collection difficulty metadata.
---

# Challenge Rank Calibrator

Use this skill before adding or changing a coding challenge difficulty. Read the challenge description, requirements, starter code, public tests, hidden/full tests, and solution when available. Assign the lowest F-level that fully covers the hardest behavior required by the tests.

## Workflow

1. Identify the actual contract from tests and solution, not only from prose.
2. Score the required behavior using the dimensions below.
3. Pick the lowest matching F-level.
4. If prose and tests disagree, flag the task as needing content repair before final ranking.
5. Explain the decision in one short paragraph: main difficulty driver, why lower levels are insufficient, and whether the rank should be changed.

For Foruntendo challenge source files, remember that `rank` is zero-based: `rank: 0` renders as F1, `rank: 7` renders as F8.

## F-Level Rubric

- `F1`: One direct operation or syntax use. No branching beyond a single obvious expression. Suitable for first contact with a concept.
- `F2`: One simple rule with one small guard or conversion. The learner applies a known operator or construct in a single straightforward function.
- `F3`: Several explicit input cases, one edge case, or a small `if`/`switch` decision table. Still local and easy to trace.
- `F4`: Multiple rules where order or grouping matters, or a few edge cases can break a naive solution. Requires careful reading but no broad design.
- `F5`: A compact real utility: callbacks, object/array traversal, validation, mutation control, or a contract with several independent branches.
- `F6`: A small reusable abstraction or mini API: state transitions, wrapper functions, command routing, simple polyfill behavior, or non-trivial fallback semantics.
- `F7`: A larger algorithmic or specification-like implementation: reducer semantics, component behavior, async/search interaction, or several connected constraints.
- `F8`: Expert/competition level. Requires advanced algorithms, interpreters, parsers, hard performance constraints, or deep JavaScript semantics. Do not assign F8 to normal educational polyfills or small interpreters.

## Scoring Dimensions

Use these signals to justify the final F-level:

- Concept novelty: first syntax contact is lower; combining concepts is higher.
- Branching count: more independent cases usually increases rank.
- Edge cases: `NaN`, `-0`, sparse arrays, `this`, async timing, mutation, and error contracts increase rank.
- Statefulness: remembered state, caches, transitions, or wrappers increase rank.
- API fidelity: matching a built-in method or spec details increases rank.
- Algorithmic load: recursion, search, sorting, parsing, or complexity constraints increase rank.
- Readability burden: unclear contract means fix prose, not increase rank.

## Output Format

For each task, produce:

```text
slug: <task-slug>
current: F<n>
recommended: F<n>
change: yes|no
reason: <short explanation>
content_issue: <none or mismatch to fix>
```

## Automation

For a quick first pass, run `scripts/rank_hint.mjs` with a JSON object containing coarse task features. The script returns a baseline rank. Human review is still required because tests and solutions can contain hidden complexity.
