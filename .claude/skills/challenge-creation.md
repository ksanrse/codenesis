---
name: challenge-creation
description: Create, review, or improve Foruntendo programming challenges, including task prose, examples, starter code, solution, public tests, full tests, hidden edge cases, and lightweight Vitest execution strategy. Use when adding new tasks, expanding a collection, rewriting unclear task descriptions, deciding how many tests are enough, or checking that a task cannot be solved by a cheap hardcoded shortcut.
---

# Challenge Creation

Use this skill when creating or materially changing a programming task. Also use `challenge-rank-calibrator` before assigning or changing F-levels.

## Workflow

1. Define the learning goal in one sentence: what the learner should practice, not just which syntax appears.
2. Define the API contract: exported name, arguments, return value, errors, mutation rules, async behavior, and language/runtime assumptions.
3. Write the task explanation for the learner's current level. Prefer simple Russian prose, concrete context, and examples over terse bullet-only specs.
4. Add public tests for fast feedback and full tests for completion. Public tests should teach the contract; full tests should close loopholes.
5. Add starter code that points to the right API but does not reveal the solution.
6. Add the reference solution.
7. Run or inspect tests and verify that the prose, tests, starter, and solution all describe the same contract.
8. Run `vp check`, `vp test`, and `vp run check:mojibake` when possible.

## Explanation Standard

Each task should include:

- A short context paragraph: why this function exists in real code.
- A clear implementation paragraph: exactly what to write.
- Requirements that are specific enough to test.
- Examples with expected output for the main behavior and at least one edge case.
- A short interface line: `Экспортируй функцию ...`.

Avoid:

- vague phrases like "обработай значение" without saying how;
- unexplained edge cases;
- hiding important behavior only in tests;
- increasing difficulty to compensate for unclear prose.

For detailed prose patterns, read `references/[explanation-patterns.md](http://explanation-patterns.md)`.

### How to Write the Context Paragraph

The context paragraph answers: **where would a real developer write this function?** Name a concrete scenario — a product feature, a module in a real app, a common library pattern. Avoid "эта задача проверяет X" — that's meta-commentary, not context.

Bad: "Функция демонстрирует использование `switch`."
Good: "В платежном интерфейсе сумма хранится отдельно от валюты. Чтобы показать цену, нужно превратить код `"USD"` в символ `"$"`."

If the function involves a non-obvious behavior (JavaScript returns `Infinity` for division by zero, `NaN` propagates silently, `-0 !== 0` for some operations), **name it explicitly in prose** — not only in tests. The learner should not discover this from a failing test.

### How to Write the Implementation Paragraph

Start with `Напиши \`functionName(args)\`:`then describe what to do in active voice. Name the branching structure: "через`switch` выбери", "если ... верни ..., иначе". If there are two distinct behaviors (normal path + error path), say both in the same paragraph.

Bad: "Функция принимает параметры и возвращает результат в зависимости от входных данных."
Good: "Напиши `calculateByOperation(left, right, operation)`: через `switch` выбери арифметику. Деление — особый случай: если `right === 0`, брось ошибку, потому что JavaScript иначе вернёт `Infinity` без предупреждения."

### How to Write Examples

Write examples **before** requirements. They force you to resolve ambiguity early — if you can't write a clear example for a case, the spec is incomplete.

- Cover the happy path with concrete numbers.
- Cover at least one edge case that the learner might miss.
- Cover the error case if the function throws.
- Use the exact format `functionName(input) // output` or `// выбрасывает Error("message")`.

Don't omit the error case from examples even if it feels obvious. The learner should see exactly what message to throw before reading the requirements list.

## Test Sufficiency

Use the minimum test count that proves the contract, then add full-test cases for shortcuts. Do not write thousands of cases unless the task is algorithmic or randomized testing is clearly useful.

Baseline by F-level:

- `F1`: 3-5 public checks, 5-8 full checks.
- `F2`: 4-6 public checks, 7-10 full checks.
- `F3`: 5-8 public checks, 10-14 full checks.
- `F4`: 6-10 public checks, 12-18 full checks.
- `F5`: 8-12 public checks, 16-25 full checks.
- `F6`: 10-15 public checks, 20-35 full checks.
- `F7`: 12-18 public checks, 30-60 full checks.
- `F8`: test by behavior classes, property-style loops, and performance-sensitive cases; justify any large count.

Public tests answer "am I on the right path?". Full tests answer "is this actually correct?".

For loophole and edge-case strategy, read `references/[test-design.md](http://test-design.md)`.

## Vitest Performance Rules

- Keep challenge tests synchronous unless async behavior is the point.
- Prefer table-driven tests over many separate `test(...)` blocks for large case sets.
- Use loops inside one test for broad input matrices when per-case naming is not useful.
- Avoid timers, browser APIs, WebContainer work, and large random datasets unless they are the concept being tested.
- For deterministic pure functions, isolation is usually less important than speed. Do not force costly isolation unless mutation/global state can leak.
- When a task may need many cases, prefer generated arrays with deterministic seeds and a small number of representative assertions.
- If tests become slow, first reduce redundant cases, then consider Vitest pool/isolation tuning in project config.

## Final Self-Check

Before finishing a challenge, answer:

- Can a beginner at this F-level understand what to implement without reading tests?
- Do public tests cover the happy path and one instructive edge case?
- Do full tests reject the obvious hardcoded or partial solutions?
- Is every special JavaScript behavior named in prose?
- Does the solution pass tests without relying on test order?
- Did `challenge-rank-calibrator` confirm the rank?
