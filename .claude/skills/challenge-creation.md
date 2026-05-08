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

## Explanation Standard — Feynman Style

Write descriptions like you're talking to a curious beginner, not like documentation. Goal: even a kid should understand what the function does and why before reading requirements. Heavy text walls = bad. Conversation tone = good.

**The rule of thumb:** if the description reads like a Wikipedia paragraph, rewrite it. If it reads like a friend explaining the problem at a whiteboard, keep it.

### Mandatory pieces

Every task description has, in this order:

1. **Title-line metaphor or hook** — one short paragraph that gives a mental picture. Use everyday analogies (objects = boxes with drawers, garbage collector = janitor, etc.) when the concept is abstract. Skip if the function is trivially concrete.
2. **The trap or the "why this is interesting"** — what surprises beginners about this. Pose it as a question or as "одна хитрость" / "одна странная штука". Show the surprising fact as code, not as a sentence.
3. **What to write** — short, direct: `Напиши \`fn(args)\`:` followed by 1-2 sentences. No re-stating the trap from step 2.
4. **Requirements list** — bullet points, specific enough to test. Include the export rule (`экспортируй \`fn\``).
5. **Examples** — at least 3, including one edge case. Format: `\`fn(input)\``→`\`output\`` on separate lines.

### Voice rules

- **Address the reader as "ты"**, not "разработчик" or impersonal. "Ты получаешь...", "представь...", "ты проходишь по..."
- **One fact per line/paragraph.** Do not glue three ideas into one sentence with commas and dashes.
- **Show, don't describe.** If you're explaining what `typeof NaN` returns, write `typeof NaN  // 'number'` instead of "typeof для NaN возвращает строку 'number'".
- **Use questions to set up surprises.** "Знаешь как `typeof` называет `NaN`?" beats "интересно, что typeof для NaN тоже возвращает 'number'".
- **Bytovoy language over textbook language.** "хитрость" not "нюанс", "странная штука" not "особенность", "пропускай" not "отфильтровывай", "ящики" not "свойства" (when introducing the concept; switch to "свойства" once it's established).
- **Cut anything that doesn't help solve the task.** Interesting tangents (`value === value` trick, history of `for..in`, etc.) belong in a footnote or get cut entirely.

### Bad vs good

❌ **Sukhovoi/textbook:**

> Когда нужно пройтись по всем парам ключ-значение объекта, в JavaScript используют цикл for..in. Этот цикл перебирает имена свойств одно за другим, а значения ты получаешь через obj[key]. for..in - старая, базовая конструкция, и хотя сегодня чаще встречаются Object.keys и Object.entries, понимать for..in всё равно нужно, потому что он лежит в основе многих полифилов.

✅ **Feynman:**

> Представь объект как коробку с подписанными ящичками: `{ возраст: 25, имя: 'Аня' }`. Пройтись по всем ящикам можно через `for..in`:
>
> ```js
> for (const key in obj) console.log(key, obj[key]);
> ```
>
> `key` — название ящика, `obj[key]` — что внутри.

### Trap pattern

When the function has a JS gotcha (NaN, `typeof null`, `-0`, `==` coercion, mutation, etc.), structure it like this:

> **Одна хитрость.** Кажется, что [naive idea]. Но в JavaScript [show the surprise as code]:
>
> ```js
> typeof NaN; // 'number'
> ```
>
> Поэтому [the actual rule].

Three beats: naive expectation → demonstrate the surprise → state the fix. No more.

### Examples format

Each example on its own line. `code` → `result`.

```
`sumValues({ a: 1, b: 2 })` → `3`
`sumValues({ a: 1, b: 'x' })` → `1`
`sumValues({ a: NaN, b: 5 })` → `5`
`sumValues({})` → `0`
```

Multi-line cases stay in fenced blocks. Single-line input/output go as backtick→backtick paragraphs (better for narrow screens).

### Avoid

- meta-commentary ("эта задача показывает X", "ты научишься Y") — beginners don't care
- "интерфейс" sections separate from requirements — fold export rule into requirements list
- jargon without payoff (don't introduce "примитивы", "дескрипторы" unless the task hinges on them)
- multi-clause sentences with three commas
- explaining the same trap twice (once in a paragraph, once in requirements)
- listing requirements that the examples already make obvious

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
