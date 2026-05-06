import { getChallengePoints } from "../../ranking.ts";
import type { ChallengeDefinition, ChallengeFile } from "../../types.ts";

interface DataTypeChallengeConfig {
  id: string;
  title: string;
  description: string;
  starter: string;
  tests: string;
  fullTests?: string;
  rank: number;
  tags: string[];
}

const emptyLangs: ChallengeFile[] = [];

function createDataTypeChallenge(config: DataTypeChallengeConfig): ChallengeDefinition {
  const starterFiles: ChallengeFile[] = [
    {
      path: "src/index.js",
      content: config.starter,
    },
  ];
  const testFiles: ChallengeFile[] = [
    {
      path: "src/index.test.js",
      content: config.tests,
    },
  ];
  const fullTestFiles: ChallengeFile[] = [
    {
      path: "src/index.full.test.js",
      content: config.fullTests ?? config.tests,
    },
  ];

  return {
    id: config.id,
    title: config.title,
    description: config.description,
    difficulty: config.rank <= 2 ? "Starter" : "Mid",
    category: "JavaScript",
    group: "Типы данных",
    languages: ["javascript"],
    rank: config.rank,
    reputation: getChallengePoints(config.rank),
    tags: ["JS/data-types", "data-types", "javascript", ...config.tags],
    starterFiles: {
      javascript: starterFiles,
      typescript: emptyLangs,
      react: emptyLangs,
      svelte: emptyLangs,
      vue: emptyLangs,
    },
    testFiles: {
      javascript: testFiles,
      typescript: emptyLangs,
      react: emptyLangs,
      svelte: emptyLangs,
      vue: emptyLangs,
    },
    fullTestFiles: {
      javascript: fullTestFiles,
      typescript: emptyLangs,
      react: emptyLangs,
      svelte: emptyLangs,
      vue: emptyLangs,
    },
    solutionFiles: {
      javascript: emptyLangs,
      typescript: emptyLangs,
      react: emptyLangs,
      svelte: emptyLangs,
      vue: emptyLangs,
    },
    dependencies: {
      javascript: {},
      typescript: {},
      react: {},
      svelte: {},
      vue: {},
    },
  };
}

// ---------------------------------------------------------------------------
// Advanced Polyfills (F6–F7)
// ---------------------------------------------------------------------------

export const dtPolyfillChallenges: ChallengeDefinition[] = [
  createDataTypeChallenge({
    id: "data-types-my-flat",
    title: "Полифил Array.flat",
    description: `\`Array.prototype.flat(depth)\` разворачивает вложенные массивы. \`[1, [2, [3]]].flat(1)\` → \`[1, 2, [3]]\` — один уровень. С \`Infinity\` — всё до дна.

\`\`\`js
[1, [2, [3]]].flat()         // [1, 2, [3]] — глубина 1 по умолчанию
[1, [2, [3]]].flat(Infinity) // [1, 2, 3]   — полная развёртка
[1, [2], 3].flat(0)          // [1, [2], 3] — глубина 0: ничего не делай
\`\`\`

**Как это работает внутри.** Рекурсивно обходишь массив. Если элемент — массив и \`depth > 0\` — рекурсия с \`depth - 1\`. Иначе — элемент идёт в результат как есть.

**Что написать.** Функцию \`myFlat(arr, depth = 1)\` — свою реализацию \`flat\`.

## Требования

1. \`depth = 1\` по умолчанию.
2. Разворачивай только \`Array.isArray\`-элементы.
3. \`depth = 0\` — верни поверхностную копию без разворачивания.
4. \`depth = Infinity\` — полная рекурсия.
5. Не мутируй исходный массив.
6. Экспортируй функцию \`myFlat\`.

## Примеры

\`myFlat([1, [2, 3]])\` → \`[1, 2, 3]\`

\`myFlat([1, [2, [3]]], 1)\` → \`[1, 2, [3]]\`

\`myFlat([1, [2, [3]]], Infinity)\` → \`[1, 2, 3]\`

\`myFlat([[1], [2], [3]])\` → \`[1, 2, 3]\``,
    starter: `export function myFlat(arr, depth = 1) {
  // Рекурсивно разворачивай вложенные массивы до указанной глубины
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { myFlat } from './index.js';

describe('myFlat', () => {
  it('один уровень вложенности', () => {
    expect(myFlat([1, [2, 3]])).toEqual([1, 2, 3]);
  });

  it('depth 1 не трогает второй уровень', () => {
    expect(myFlat([1, [2, [3]]], 1)).toEqual([1, 2, [3]]);
  });

  it('Infinity разворачивает всё', () => {
    expect(myFlat([1, [2, [3, [4]]]], Infinity)).toEqual([1, 2, 3, 4]);
  });

  it('depth 0 — поверхностная копия', () => {
    expect(myFlat([1, [2], 3], 0)).toEqual([1, [2], 3]);
  });

  it('уже плоский массив', () => {
    expect(myFlat([1, 2, 3])).toEqual([1, 2, 3]);
  });

  it('пустой массив', () => {
    expect(myFlat([])).toEqual([]);
  });

  it('несколько вложенных на одном уровне', () => {
    expect(myFlat([[1], [2], [3]])).toEqual([1, 2, 3]);
  });

  it('смешанные типы', () => {
    expect(myFlat([1, 'a', [true, [null]]])).toEqual([1, 'a', true, [null]]);
  });

  it('глубокая вложенность с depth 2', () => {
    expect(myFlat([1, [2, [3, [4]]]], 2)).toEqual([1, 2, 3, [4]]);
  });

  it('не мутирует исходный массив', () => {
    const orig = [1, [2, 3]];
    myFlat(orig);
    expect(orig).toEqual([1, [2, 3]]);
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { myFlat } from './index.js';

describe('myFlat', () => {
  it('один уровень вложенности', () => {
    expect(myFlat([1, [2, 3]])).toEqual([1, 2, 3]);
  });

  it('depth 1 не трогает второй уровень', () => {
    expect(myFlat([1, [2, [3]]], 1)).toEqual([1, 2, [3]]);
  });

  it('Infinity разворачивает всё', () => {
    expect(myFlat([1, [2, [3, [4]]]], Infinity)).toEqual([1, 2, 3, 4]);
  });

  it('depth 0 — поверхностная копия', () => {
    expect(myFlat([1, [2], 3], 0)).toEqual([1, [2], 3]);
  });

  it('уже плоский массив', () => {
    expect(myFlat([1, 2, 3])).toEqual([1, 2, 3]);
  });

  it('пустой массив', () => {
    expect(myFlat([])).toEqual([]);
  });

  it('несколько вложенных на одном уровне', () => {
    expect(myFlat([[1], [2], [3]])).toEqual([1, 2, 3]);
  });

  it('смешанные типы', () => {
    expect(myFlat([1, 'a', [true, [null]]])).toEqual([1, 'a', true, [null]]);
  });

  it('глубокая вложенность с depth 2', () => {
    expect(myFlat([1, [2, [3, [4]]]], 2)).toEqual([1, 2, 3, [4]]);
  });

  it('не мутирует исходный массив', () => {
    const orig = [1, [2, 3]];
    myFlat(orig);
    expect(orig).toEqual([1, [2, 3]]);
  });

  it('строки не разворачиваются как массивы', () => {
    expect(myFlat(['abc', ['def']])).toEqual(['abc', 'def']);
  });

  it('null и undefined в массиве не трогаются', () => {
    expect(myFlat([null, [undefined, [1]]])).toEqual([null, undefined, [1]]);
  });

  it('одноэлементные вложенные массивы', () => {
    expect(myFlat([[[1]], [[2]]], 1)).toEqual([[1], [2]]);
  });

  it('depth 3', () => {
    expect(myFlat([1, [2, [3, [4, [5]]]]], 3)).toEqual([1, 2, 3, 4, [5]]);
  });

  it('большой плоский массив', () => {
    const big = Array.from({ length: 100 }, (_, i) => i);
    expect(myFlat(big)).toEqual(big);
  });

  it('вложенные пустые массивы', () => {
    expect(myFlat([[], [[]], [1]])).toEqual([[], 1]);
  });

  it('пять уровней с Infinity', () => {
    expect(myFlat([[[[[42]]]]], Infinity)).toEqual([42]);
  });

  it('depth 0 возвращает новый массив', () => {
    const orig = [1, 2];
    const result = myFlat(orig, 0);
    expect(result).toEqual(orig);
    expect(result).not.toBe(orig);
  });

  it('смешанные глубины на одном уровне', () => {
    expect(myFlat([1, [2], [3, [4]], 5])).toEqual([1, 2, 3, [4], 5]);
  });

  it('объекты внутри массивов не разворачиваются', () => {
    expect(myFlat([{ a: 1 }, [{ b: 2 }]])).toEqual([{ a: 1 }, { b: 2 }]);
  });
});
`,
    rank: 5,
    tags: ["polyfill", "array", "flat", "recursion"],
  }),
  createDataTypeChallenge({
    id: "data-types-deep-clone",
    title: "Глубокое клонирование",
    description: `\`JSON.parse(JSON.stringify(x))\` — быстрый клон, но он теряет \`Date\`, \`RegExp\`, \`Map\`, \`Set\`, \`undefined\` и \`NaN\`:

\`\`\`js
const d = new Date();
JSON.parse(JSON.stringify(d)) // строка, не Date!

JSON.parse(JSON.stringify({ a: undefined })) // {} — ключ пропал
JSON.parse(JSON.stringify({ a: NaN }))       // { a: null } — NaN стал null
\`\`\`

\`structuredClone\` решает большинство проблем, но понимать, как он работает внутри — полезно.

**Что написать.** Функцию \`deepClone(val)\` — рекурсивный клон, который умеет копировать: примитивы, \`null\`, объекты, массивы, \`Date\`, \`RegExp\`, \`Map\`, \`Set\`.

## Требования

1. Примитивы (\`number\`, \`string\`, \`boolean\`, \`undefined\`, \`null\`, \`symbol\`, \`bigint\`) — возвращай как есть.
2. \`Date\` — \`new Date(d.getTime())\`.
3. \`RegExp\` — \`new RegExp(r.source, r.flags)\`.
4. \`Map\` — новый Map с рекурсивно клонированными парами.
5. \`Set\` — новый Set с рекурсивно клонированными значениями.
6. Массивы — рекурсивно клонируй каждый элемент.
7. Объекты — рекурсивно клонируй каждое собственное свойство.
8. Циклические ссылки обрабатывать не нужно.
9. Экспортируй функцию \`deepClone\`.

## Примеры

\`deepClone(42)\` → \`42\`

\`deepClone({ a: [1, 2] })\` → \`{ a: [1, 2] }\` (новый объект и массив)

\`deepClone(new Date('2024-01-01'))\` → новый \`Date\` с тем же временем

\`deepClone(new Map([['k', { v: 1 }]]))\` → новый \`Map\` с клонированным значением`,
    starter: `export function deepClone(val) {
  // Проверяй тип, рекурсивно клонируй вложенные структуры
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { deepClone } from './index.js';

describe('deepClone', () => {
  it('примитив — число', () => {
    expect(deepClone(42)).toBe(42);
  });

  it('примитив — строка', () => {
    expect(deepClone('hello')).toBe('hello');
  });

  it('null', () => {
    expect(deepClone(null)).toBe(null);
  });

  it('простой объект', () => {
    const orig = { a: 1, b: 'x' };
    const clone = deepClone(orig);
    expect(clone).toEqual(orig);
    expect(clone).not.toBe(orig);
  });

  it('вложенный объект', () => {
    const orig = { a: { b: { c: 3 } } };
    const clone = deepClone(orig);
    expect(clone).toEqual(orig);
    expect(clone.a).not.toBe(orig.a);
    expect(clone.a.b).not.toBe(orig.a.b);
  });

  it('массив', () => {
    const orig = [1, [2, 3]];
    const clone = deepClone(orig);
    expect(clone).toEqual(orig);
    expect(clone).not.toBe(orig);
    expect(clone[1]).not.toBe(orig[1]);
  });

  it('Date', () => {
    const d = new Date('2024-06-15');
    const clone = deepClone(d);
    expect(clone.getTime()).toBe(d.getTime());
    expect(clone).not.toBe(d);
  });

  it('RegExp', () => {
    const r = /abc/gi;
    const clone = deepClone(r);
    expect(clone.source).toBe(r.source);
    expect(clone.flags).toBe(r.flags);
    expect(clone).not.toBe(r);
  });

  it('Map', () => {
    const m = new Map([['a', { x: 1 }]]);
    const clone = deepClone(m);
    expect(clone.get('a')).toEqual({ x: 1 });
    expect(clone.get('a')).not.toBe(m.get('a'));
  });

  it('Set', () => {
    const s = new Set([1, 2, 3]);
    const clone = deepClone(s);
    expect([...clone]).toEqual([1, 2, 3]);
    expect(clone).not.toBe(s);
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { deepClone } from './index.js';

describe('deepClone', () => {
  it('примитив — число', () => {
    expect(deepClone(42)).toBe(42);
  });

  it('примитив — строка', () => {
    expect(deepClone('hello')).toBe('hello');
  });

  it('примитив — boolean', () => {
    expect(deepClone(true)).toBe(true);
  });

  it('undefined', () => {
    expect(deepClone(undefined)).toBeUndefined();
  });

  it('null', () => {
    expect(deepClone(null)).toBe(null);
  });

  it('NaN сохраняется', () => {
    expect(Number.isNaN(deepClone(NaN))).toBe(true);
  });

  it('простой объект', () => {
    const orig = { a: 1, b: 'x' };
    const clone = deepClone(orig);
    expect(clone).toEqual(orig);
    expect(clone).not.toBe(orig);
  });

  it('вложенный объект', () => {
    const orig = { a: { b: { c: 3 } } };
    const clone = deepClone(orig);
    expect(clone).toEqual(orig);
    expect(clone.a).not.toBe(orig.a);
    expect(clone.a.b).not.toBe(orig.a.b);
  });

  it('массив', () => {
    const orig = [1, [2, 3]];
    const clone = deepClone(orig);
    expect(clone).toEqual(orig);
    expect(clone).not.toBe(orig);
    expect(clone[1]).not.toBe(orig[1]);
  });

  it('массив объектов', () => {
    const orig = [{ a: 1 }, { b: 2 }];
    const clone = deepClone(orig);
    expect(clone).toEqual(orig);
    expect(clone[0]).not.toBe(orig[0]);
  });

  it('Date', () => {
    const d = new Date('2024-06-15T10:30:00Z');
    const clone = deepClone(d);
    expect(clone.getTime()).toBe(d.getTime());
    expect(clone).not.toBe(d);
    expect(clone instanceof Date).toBe(true);
  });

  it('RegExp', () => {
    const r = /abc/gi;
    const clone = deepClone(r);
    expect(clone.source).toBe(r.source);
    expect(clone.flags).toBe(r.flags);
    expect(clone).not.toBe(r);
    expect(clone instanceof RegExp).toBe(true);
  });

  it('Map с вложенными объектами', () => {
    const m = new Map([['a', { x: 1 }], ['b', { y: [2] }]]);
    const clone = deepClone(m);
    expect(clone.get('a')).toEqual({ x: 1 });
    expect(clone.get('a')).not.toBe(m.get('a'));
    expect(clone.get('b').y).not.toBe(m.get('b').y);
    expect(clone instanceof Map).toBe(true);
  });

  it('Set с объектами', () => {
    const obj = { a: 1 };
    const s = new Set([obj]);
    const clone = deepClone(s);
    const clonedValues = [...clone];
    expect(clonedValues[0]).toEqual(obj);
    expect(clonedValues[0]).not.toBe(obj);
    expect(clone instanceof Set).toBe(true);
  });

  it('Set с примитивами', () => {
    const s = new Set([1, 'a', true]);
    const clone = deepClone(s);
    expect([...clone]).toEqual([1, 'a', true]);
  });

  it('объект с undefined-значением', () => {
    const orig = { a: undefined, b: 1 };
    const clone = deepClone(orig);
    expect(clone.a).toBeUndefined();
    expect('a' in clone).toBe(true);
  });

  it('пустой объект', () => {
    const clone = deepClone({});
    expect(clone).toEqual({});
  });

  it('пустой массив', () => {
    const clone = deepClone([]);
    expect(clone).toEqual([]);
  });

  it('пустой Map и Set', () => {
    expect(deepClone(new Map()).size).toBe(0);
    expect(deepClone(new Set()).size).toBe(0);
  });

  it('глубокая вложенность (3 уровня)', () => {
    const orig = { a: { b: { c: { d: [1, 2] } } } };
    const clone = deepClone(orig);
    expect(clone).toEqual(orig);
    clone.a.b.c.d.push(3);
    expect(orig.a.b.c.d).toEqual([1, 2]);
  });

  it('Date внутри объекта', () => {
    const orig = { date: new Date('2024-01-01') };
    const clone = deepClone(orig);
    expect(clone.date.getTime()).toBe(orig.date.getTime());
    expect(clone.date).not.toBe(orig.date);
  });

  it('Map внутри массива', () => {
    const m = new Map([['k', 1]]);
    const orig = [m];
    const clone = deepClone(orig);
    expect(clone[0].get('k')).toBe(1);
    expect(clone[0]).not.toBe(m);
  });

  it('мутация клона не влияет на оригинал', () => {
    const orig = { items: [{ name: 'a' }] };
    const clone = deepClone(orig);
    clone.items[0].name = 'b';
    expect(orig.items[0].name).toBe('a');
  });

  it('RegExp с флагами', () => {
    const r = /test/gims;
    const clone = deepClone(r);
    expect(clone.flags).toBe(r.flags);
  });
});
`,
    rank: 5,
    tags: ["polyfill", "clone", "recursion"],
  }),
  createDataTypeChallenge({
    id: "data-types-deep-equal",
    title: "Глубокое сравнение",
    description: `\`===\` сравнивает объекты по ссылке: \`{ a: 1 } === { a: 1 }\` даёт \`false\`. Глубокое сравнение проверяет каждое вложенное значение рекурсивно.

\`\`\`js
{ a: 1 } === { a: 1 }  // false — разные ссылки
deepEqual({ a: 1 }, { a: 1 }) // true — содержимое одинаковое
\`\`\`

**Сложность.** Нужно различать массивы, объекты и Date. Примитивы сравнивать через \`Object.is\` (чтобы \`NaN === NaN\` и \`+0 !== -0\`). У объектов — одинаковые ключи и рекурсивно одинаковые значения.

**Что написать.** Функцию \`deepEqual(a, b)\` — рекурсивное глубокое сравнение.

## Требования

1. Примитивы (включая \`null\`, \`undefined\`) — через \`Object.is(a, b)\`.
2. Разные типы (\`Array\` vs \`Object\`, \`Date\` vs \`Object\`) — \`false\`.
3. \`Date\` — сравнивай \`getTime()\`.
4. Массивы — одинаковая длина + каждый элемент \`deepEqual\`.
5. Объекты — одинаковый набор ключей + каждое значение \`deepEqual\`.
6. Экспортируй функцию \`deepEqual\`.

## Примеры

\`deepEqual({ a: 1 }, { a: 1 })\` → \`true\`

\`deepEqual([1, [2]], [1, [2]])\` → \`true\`

\`deepEqual(NaN, NaN)\` → \`true\`

\`deepEqual({ a: { b: 1 } }, { a: { b: 2 } })\` → \`false\`

\`deepEqual(new Date('2024-01-01'), new Date('2024-01-01'))\` → \`true\``,
    starter: `export function deepEqual(a, b) {
  // Примитивы — Object.is, затем проверь тип и рекурсивно сравнивай
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { deepEqual } from './index.js';

describe('deepEqual', () => {
  it('равные числа', () => {
    expect(deepEqual(1, 1)).toBe(true);
  });

  it('разные числа', () => {
    expect(deepEqual(1, 2)).toBe(false);
  });

  it('NaN равен NaN', () => {
    expect(deepEqual(NaN, NaN)).toBe(true);
  });

  it('+0 не равен -0', () => {
    expect(deepEqual(0, -0)).toBe(false);
  });

  it('null и undefined', () => {
    expect(deepEqual(null, null)).toBe(true);
    expect(deepEqual(null, undefined)).toBe(false);
  });

  it('одинаковые строки', () => {
    expect(deepEqual('abc', 'abc')).toBe(true);
  });

  it('простые объекты', () => {
    expect(deepEqual({ a: 1 }, { a: 1 })).toBe(true);
    expect(deepEqual({ a: 1 }, { a: 2 })).toBe(false);
  });

  it('разные ключи', () => {
    expect(deepEqual({ a: 1 }, { b: 1 })).toBe(false);
  });

  it('вложенные объекты', () => {
    expect(deepEqual({ a: { b: 1 } }, { a: { b: 1 } })).toBe(true);
    expect(deepEqual({ a: { b: 1 } }, { a: { b: 2 } })).toBe(false);
  });

  it('массивы', () => {
    expect(deepEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(deepEqual([1, 2], [1, 2, 3])).toBe(false);
  });

  it('вложенные массивы', () => {
    expect(deepEqual([1, [2, 3]], [1, [2, 3]])).toBe(true);
  });

  it('Date', () => {
    expect(deepEqual(new Date('2024-01-01'), new Date('2024-01-01'))).toBe(true);
    expect(deepEqual(new Date('2024-01-01'), new Date('2024-01-02'))).toBe(false);
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { deepEqual } from './index.js';

describe('deepEqual', () => {
  it('равные числа', () => {
    expect(deepEqual(1, 1)).toBe(true);
  });

  it('разные числа', () => {
    expect(deepEqual(1, 2)).toBe(false);
  });

  it('NaN равен NaN', () => {
    expect(deepEqual(NaN, NaN)).toBe(true);
  });

  it('+0 не равен -0', () => {
    expect(deepEqual(0, -0)).toBe(false);
  });

  it('null и undefined', () => {
    expect(deepEqual(null, null)).toBe(true);
    expect(deepEqual(null, undefined)).toBe(false);
    expect(deepEqual(undefined, undefined)).toBe(true);
  });

  it('одинаковые строки', () => {
    expect(deepEqual('abc', 'abc')).toBe(true);
  });

  it('разные строки', () => {
    expect(deepEqual('abc', 'def')).toBe(false);
  });

  it('boolean', () => {
    expect(deepEqual(true, true)).toBe(true);
    expect(deepEqual(true, false)).toBe(false);
  });

  it('простые объекты', () => {
    expect(deepEqual({ a: 1 }, { a: 1 })).toBe(true);
    expect(deepEqual({ a: 1 }, { a: 2 })).toBe(false);
  });

  it('разные ключи', () => {
    expect(deepEqual({ a: 1 }, { b: 1 })).toBe(false);
  });

  it('лишний ключ', () => {
    expect(deepEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
  });

  it('вложенные объекты', () => {
    expect(deepEqual({ a: { b: 1 } }, { a: { b: 1 } })).toBe(true);
    expect(deepEqual({ a: { b: 1 } }, { a: { b: 2 } })).toBe(false);
  });

  it('три уровня вложенности', () => {
    expect(deepEqual(
      { a: { b: { c: [1, 2] } } },
      { a: { b: { c: [1, 2] } } },
    )).toBe(true);
  });

  it('массивы', () => {
    expect(deepEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(deepEqual([1, 2], [1, 2, 3])).toBe(false);
  });

  it('вложенные массивы', () => {
    expect(deepEqual([1, [2, 3]], [1, [2, 3]])).toBe(true);
    expect(deepEqual([1, [2, 3]], [1, [2, 4]])).toBe(false);
  });

  it('массив vs объект', () => {
    expect(deepEqual([1, 2], { 0: 1, 1: 2 })).toBe(false);
  });

  it('Date', () => {
    expect(deepEqual(new Date('2024-01-01'), new Date('2024-01-01'))).toBe(true);
    expect(deepEqual(new Date('2024-01-01'), new Date('2024-01-02'))).toBe(false);
  });

  it('Date vs объект', () => {
    expect(deepEqual(new Date('2024-01-01'), {})).toBe(false);
  });

  it('пустые объекты', () => {
    expect(deepEqual({}, {})).toBe(true);
  });

  it('пустые массивы', () => {
    expect(deepEqual([], [])).toBe(true);
  });

  it('null vs объект', () => {
    expect(deepEqual(null, {})).toBe(false);
    expect(deepEqual({}, null)).toBe(false);
  });

  it('массив объектов', () => {
    expect(deepEqual(
      [{ a: 1 }, { b: 2 }],
      [{ a: 1 }, { b: 2 }],
    )).toBe(true);
  });

  it('объект с массивом', () => {
    expect(deepEqual(
      { items: [1, 2, 3] },
      { items: [1, 2, 3] },
    )).toBe(true);
  });

  it('разные типы примитивов', () => {
    expect(deepEqual(1, '1')).toBe(false);
    expect(deepEqual(0, false)).toBe(false);
    expect(deepEqual('', false)).toBe(false);
  });

  it('undefined значение в объекте', () => {
    expect(deepEqual({ a: undefined }, { a: undefined })).toBe(true);
    expect(deepEqual({ a: undefined }, {})).toBe(false);
  });

  it('вложенная Date внутри объекта', () => {
    const d = '2024-06-15';
    expect(deepEqual(
      { created: new Date(d) },
      { created: new Date(d) },
    )).toBe(true);
  });

  it('NaN внутри массива', () => {
    expect(deepEqual([NaN, 1], [NaN, 1])).toBe(true);
  });

  it('NaN внутри объекта', () => {
    expect(deepEqual({ x: NaN }, { x: NaN })).toBe(true);
  });

  it('одинаковый объект равен себе', () => {
    const obj = { a: [1, 2] };
    expect(deepEqual(obj, obj)).toBe(true);
  });

  it('порядок ключей не важен', () => {
    expect(deepEqual({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true);
  });

  it('большой объект', () => {
    const a = Object.fromEntries(Array.from({ length: 50 }, (_, i) => [\`k\${i}\`, i]));
    const b = Object.fromEntries(Array.from({ length: 50 }, (_, i) => [\`k\${i}\`, i]));
    expect(deepEqual(a, b)).toBe(true);
  });
});
`,
    rank: 6,
    tags: ["polyfill", "comparison", "recursion"],
  }),
];
