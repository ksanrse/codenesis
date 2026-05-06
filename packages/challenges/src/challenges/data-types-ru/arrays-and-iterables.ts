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

export const arrayChallenges: ChallengeDefinition[] = [
  createDataTypeChallenge({
    id: "data-types-array-remove-at",
    title: "Удалить по индексу",
    description: `Тебе дали массив, и нужно "вырезать" элемент по индексу. Соблазн — позвать \`arr.splice(i, 1)\` и забыть. Ловушка: \`splice\` меняет исходный массив. А наш контракт — не трогать вход и вернуть НОВЫЙ массив.

**Что написать.** Функцию \`removeAt(arr, i)\`, которая возвращает копию массива без элемента с индексом \`i\`. Хорошие инструменты — \`.slice\` и \`.filter\`, оба без мутаций.

## Требования

1. Не мутируй входной массив.
2. Если \`i\` за пределами длины — верни копию исходного массива.
3. Экспортируй функцию \`removeAt\`.

## Примеры

\`removeAt([1, 2, 3], 1)\` → \`[1, 3]\`

\`removeAt(['a', 'b', 'c'], 0)\` → \`['b', 'c']\`

\`removeAt([1, 2], 5)\` → \`[1, 2]\``,
    starter: `export function removeAt(arr, i) {
  // Подсказка: arr.slice(0, i).concat(arr.slice(i + 1))
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { removeAt } from './index.js';

describe('removeAt', () => {
  it('removes element at given index', () => {
    expect(removeAt([1, 2, 3], 1)).toEqual([1, 3]);
  });

  it('removes first element', () => {
    expect(removeAt(['a', 'b', 'c'], 0)).toEqual(['b', 'c']);
  });

  it('removes last element', () => {
    expect(removeAt([1, 2, 3], 2)).toEqual([1, 2]);
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { removeAt } from './index.js';

describe('removeAt', () => {
  it('removes element at given index', () => {
    expect(removeAt([1, 2, 3], 1)).toEqual([1, 3]);
  });

  it('removes first element', () => {
    expect(removeAt(['a', 'b', 'c'], 0)).toEqual(['b', 'c']);
  });

  it('removes last element', () => {
    expect(removeAt([1, 2, 3], 2)).toEqual([1, 2]);
  });

  it('returns copy when index is out of range', () => {
    expect(removeAt([1, 2], 5)).toEqual([1, 2]);
  });

  it('handles empty array', () => {
    expect(removeAt([], 0)).toEqual([]);
  });

  it('does not mutate input', () => {
    const input = [1, 2, 3];
    removeAt(input, 1);
    expect(input).toEqual([1, 2, 3]);
  });
});
`,
    rank: 0,
    tags: ["arrays"],
  }),
  createDataTypeChallenge({
    id: "data-types-array-last-n",
    title: "Последние N элементов",
    description: `Часто нужны "последние N записей": лог, история, недавние сообщения. Если N больше длины массива — это не ошибка, просто отдаём что есть.

**Что написать.** Функцию \`lastN(arr, n)\`, которая возвращает НОВЫЙ массив с последними \`n\` элементами. Если \`n\` больше длины — возвращаем копию всего массива.

## Требования

1. Не мутируй вход.
2. Если \`n >= arr.length\`, верни копию массива целиком.
3. Если \`n <= 0\`, верни пустой массив.
4. Экспортируй функцию \`lastN\`.

## Примеры

\`lastN([1, 2, 3, 4], 2)\` → \`[3, 4]\`

\`lastN([1, 2, 3], 5)\` → \`[1, 2, 3]\`

\`lastN(['a', 'b'], 0)\` → \`[]\``,
    starter: `export function lastN(arr, n) {
  // Подсказка: arr.slice(Math.max(0, arr.length - n))
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { lastN } from './index.js';

describe('lastN', () => {
  it('returns last n elements', () => {
    expect(lastN([1, 2, 3, 4], 2)).toEqual([3, 4]);
  });

  it('returns whole array when n exceeds length', () => {
    expect(lastN([1, 2, 3], 5)).toEqual([1, 2, 3]);
  });

  it('returns empty when n is zero', () => {
    expect(lastN(['a', 'b'], 0)).toEqual([]);
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { lastN } from './index.js';

describe('lastN', () => {
  it('returns last n elements', () => {
    expect(lastN([1, 2, 3, 4], 2)).toEqual([3, 4]);
  });

  it('returns whole array when n exceeds length', () => {
    expect(lastN([1, 2, 3], 5)).toEqual([1, 2, 3]);
  });

  it('returns empty when n is zero or negative', () => {
    expect(lastN(['a', 'b'], 0)).toEqual([]);
    expect(lastN(['a', 'b'], -1)).toEqual([]);
  });

  it('handles empty input', () => {
    expect(lastN([], 3)).toEqual([]);
  });

  it('does not mutate input', () => {
    const input = [1, 2, 3];
    lastN(input, 2);
    expect(input).toEqual([1, 2, 3]);
  });
});
`,
    rank: 0,
    tags: ["arrays"],
  }),
  createDataTypeChallenge({
    id: "data-types-array-chunk",
    title: "Разбить на куски",
    description: `Представь: у тебя список из 23 заказов, а UI показывает по 5 в строке. Нужно разрезать массив на куски одинакового размера. Последний кусок может оказаться короче — это нормально.

**Что написать.** Функцию \`chunk(arr, size)\`, которая делит массив на массивы длины \`size\`. Последний кусок берёт всё, что осталось.

## Требования

1. Размер каждого куска, кроме последнего, ровно \`size\`.
2. Если массив пустой, верни \`[]\`.
3. Не мутируй вход.
4. Экспортируй функцию \`chunk\`.

## Примеры

\`chunk([1, 2, 3, 4, 5], 2)\` → \`[[1, 2], [3, 4], [5]]\`

\`chunk(['a', 'b', 'c', 'd'], 2)\` → \`[['a', 'b'], ['c', 'd']]\`

\`chunk([1, 2, 3], 5)\` → \`[[1, 2, 3]]\``,
    starter: `export function chunk(arr, size) {
  // Подсказка: цикл с шагом size и slice
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { chunk } from './index.js';

describe('chunk', () => {
  it('splits into equal groups', () => {
    expect(chunk(['a', 'b', 'c', 'd'], 2)).toEqual([['a', 'b'], ['c', 'd']]);
  });

  it('keeps shorter tail', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  it('wraps small array into one chunk', () => {
    expect(chunk([1, 2, 3], 5)).toEqual([[1, 2, 3]]);
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { chunk } from './index.js';

describe('chunk', () => {
  it('splits into equal groups', () => {
    expect(chunk(['a', 'b', 'c', 'd'], 2)).toEqual([['a', 'b'], ['c', 'd']]);
  });

  it('keeps shorter tail', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  it('wraps small array into one chunk', () => {
    expect(chunk([1, 2, 3], 5)).toEqual([[1, 2, 3]]);
  });

  it('handles empty array', () => {
    expect(chunk([], 3)).toEqual([]);
  });

  it('handles size of 1', () => {
    expect(chunk([1, 2, 3], 1)).toEqual([[1], [2], [3]]);
  });

  it('does not mutate input', () => {
    const input = [1, 2, 3, 4];
    chunk(input, 2);
    expect(input).toEqual([1, 2, 3, 4]);
  });
});
`,
    rank: 1,
    tags: ["arrays"],
  }),
  createDataTypeChallenge({
    id: "data-types-array-unique-push",
    title: "Добавить, если ещё нет",
    description: `Корзина магазина: пользователь два раза кликнул "добавить". Дублей быть не должно. Простой \`push\` тут не годится — нужно сначала проверить.

**Что написать.** Функцию \`uniquePush(arr, value)\`, которая возвращает НОВЫЙ массив с добавленным \`value\`. Если \`value\` уже встречается (по \`===\`), вернёт копию исходного массива без изменений.

## Требования

1. Сравнивай через \`===\`.
2. Не мутируй вход.
3. Возвращай новый массив всегда.
4. Экспортируй функцию \`uniquePush\`.

## Примеры

\`uniquePush([1, 2], 3)\` → \`[1, 2, 3]\`

\`uniquePush([1, 2, 3], 2)\` → \`[1, 2, 3]\`

\`uniquePush([], 'a')\` → \`['a']\``,
    starter: `export function uniquePush(arr, value) {
  // Подсказка: arr.includes(value) ? [...arr] : [...arr, value]
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { uniquePush } from './index.js';

describe('uniquePush', () => {
  it('appends new value', () => {
    expect(uniquePush([1, 2], 3)).toEqual([1, 2, 3]);
  });

  it('skips duplicate', () => {
    expect(uniquePush([1, 2, 3], 2)).toEqual([1, 2, 3]);
  });

  it('appends to empty array', () => {
    expect(uniquePush([], 'a')).toEqual(['a']);
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { uniquePush } from './index.js';

describe('uniquePush', () => {
  it('appends new value', () => {
    expect(uniquePush([1, 2], 3)).toEqual([1, 2, 3]);
  });

  it('skips duplicate', () => {
    expect(uniquePush([1, 2, 3], 2)).toEqual([1, 2, 3]);
  });

  it('appends to empty array', () => {
    expect(uniquePush([], 'a')).toEqual(['a']);
  });

  it('uses strict equality', () => {
    expect(uniquePush([1, 2, 3], '2')).toEqual([1, 2, 3, '2']);
  });

  it('returns a new array, not the same reference', () => {
    const input = [1, 2];
    const out = uniquePush(input, 3);
    expect(out).not.toBe(input);
  });

  it('does not mutate input', () => {
    const input = [1, 2, 3];
    uniquePush(input, 4);
    expect(input).toEqual([1, 2, 3]);
  });
});
`,
    rank: 1,
    tags: ["arrays"],
  }),
];

export const arrayMethodsChallenges: ChallengeDefinition[] = [
  createDataTypeChallenge({
    id: "data-types-array-methods-sum-by",
    title: "Сумма по полю",
    description: `У тебя список заказов, и нужна суммарная стоимость. Каждый раз писать цикл — скучно. \`reduce\` создан ровно для такого: накапливаем число, читая что нужно через функцию-извлекатель.

**Что написать.** Функцию \`sumBy(arr, fn)\`, которая суммирует \`fn(item)\` по всем элементам. Стартовое значение — ноль.

## Требования

1. Используй \`reduce\` или эквивалент.
2. Для пустого массива верни \`0\`.
3. Не мутируй вход.
4. Экспортируй функцию \`sumBy\`.

## Примеры

\`sumBy([1, 2, 3], x => x)\` → \`6\`

\`sumBy([{ n: 1 }, { n: 2 }], o => o.n)\` → \`3\`

\`sumBy([], x => x)\` → \`0\``,
    starter: `export function sumBy(arr, fn) {
  // Подсказка: arr.reduce((a, x) => a + fn(x), 0)
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { sumBy } from './index.js';

describe('sumBy', () => {
  it('sums numbers via identity', () => {
    expect(sumBy([1, 2, 3], (x) => x)).toBe(6);
  });

  it('sums object fields', () => {
    expect(sumBy([{ n: 1 }, { n: 2 }, { n: 3 }], (o) => o.n)).toBe(6);
  });

  it('returns zero for empty array', () => {
    expect(sumBy([], (x) => x)).toBe(0);
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { sumBy } from './index.js';

describe('sumBy', () => {
  it('sums numbers via identity', () => {
    expect(sumBy([1, 2, 3], (x) => x)).toBe(6);
  });

  it('sums object fields', () => {
    expect(sumBy([{ n: 1 }, { n: 2 }, { n: 3 }], (o) => o.n)).toBe(6);
  });

  it('returns zero for empty array', () => {
    expect(sumBy([], (x) => x)).toBe(0);
  });

  it('supports negative values', () => {
    expect(sumBy([1, -2, 3], (x) => x)).toBe(2);
  });

  it('does not mutate input', () => {
    const input = [1, 2, 3];
    sumBy(input, (x) => x * 2);
    expect(input).toEqual([1, 2, 3]);
  });
});
`,
    rank: 1,
    tags: ["array-methods"],
  }),
  createDataTypeChallenge({
    id: "data-types-array-methods-group-by",
    title: "Группировка по ключу",
    description: `Список людей нужно разложить по возрасту, заказы — по статусу, числа — на чёт/нечет. Это группировка: по каждому элементу вычисляем ключ, добавляем в "ведро".

**Что написать.** Функцию \`groupBy(arr, keyFn)\`, которая возвращает объект. Ключ — результат \`keyFn(item)\`, значение — массив элементов с таким ключом. Порядок внутри массивов сохраняется.

## Требования

1. Возвращай простой объект.
2. Сохраняй порядок элементов внутри каждой группы.
3. Для пустого массива верни \`{}\`.
4. Экспортируй функцию \`groupBy\`.

## Примеры

\`groupBy([1, 2, 3, 4], n => n % 2)\` → \`{ 0: [2, 4], 1: [1, 3] }\`

\`groupBy(['ab', 'cd', 'e'], s => s.length)\` → \`{ 1: ['e'], 2: ['ab', 'cd'] }\`

\`groupBy([], x => x)\` → \`{}\``,
    starter: `export function groupBy(arr, keyFn) {
  // Подсказка: reduce, аккумулятор - объект, клади в acc[key] ?? []
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { groupBy } from './index.js';

describe('groupBy', () => {
  it('splits numbers by parity', () => {
    expect(groupBy([1, 2, 3, 4], (n) => n % 2)).toEqual({ 0: [2, 4], 1: [1, 3] });
  });

  it('groups by string length', () => {
    expect(groupBy(['ab', 'cd', 'e'], (s) => s.length)).toEqual({ 1: ['e'], 2: ['ab', 'cd'] });
  });

  it('returns empty object for empty input', () => {
    expect(groupBy([], (x) => x)).toEqual({});
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { groupBy } from './index.js';

describe('groupBy', () => {
  it('splits numbers by parity', () => {
    expect(groupBy([1, 2, 3, 4], (n) => n % 2)).toEqual({ 0: [2, 4], 1: [1, 3] });
  });

  it('groups by string length', () => {
    expect(groupBy(['ab', 'cd', 'e'], (s) => s.length)).toEqual({ 1: ['e'], 2: ['ab', 'cd'] });
  });

  it('returns empty object for empty input', () => {
    expect(groupBy([], (x) => x)).toEqual({});
  });

  it('preserves order within group', () => {
    const result = groupBy([3, 1, 5, 2, 4], (n) => (n > 2 ? 'big' : 'small'));
    expect(result).toEqual({ big: [3, 5, 4], small: [1, 2] });
  });

  it('works with object items', () => {
    const items = [
      { type: 'a', v: 1 },
      { type: 'b', v: 2 },
      { type: 'a', v: 3 },
    ];
    const result = groupBy(items, (o) => o.type);
    expect(result).toEqual({
      a: [{ type: 'a', v: 1 }, { type: 'a', v: 3 }],
      b: [{ type: 'b', v: 2 }],
    });
  });

  it('does not mutate input', () => {
    const input = [1, 2, 3];
    groupBy(input, (n) => n);
    expect(input).toEqual([1, 2, 3]);
  });
});
`,
    rank: 2,
    tags: ["array-methods"],
  }),
  createDataTypeChallenge({
    id: "data-types-array-methods-sort-by-key",
    title: "Сортировка по полю",
    description: `Тебе пришли пользователи, и их нужно отсортировать по возрасту. Соблазн — \`arr.sort(...)\`. Ловушка: \`sort\` мутирует исходный массив. Возьми копию через \`[...arr]\` или \`.slice()\`, затем сортируй.

**Что написать.** Функцию \`sortByKey(arr, key)\`, которая возвращает НОВЫЙ массив, отсортированный по возрастанию \`item[key]\`. Сортировка стабильная (одинаковые ключи сохраняют исходный порядок).

## Требования

1. Не мутируй входной массив.
2. Сортируй по возрастанию.
3. Сортировка должна быть стабильной для равных ключей.
4. Экспортируй функцию \`sortByKey\`.

## Примеры

\`sortByKey([{ n: 3 }, { n: 1 }, { n: 2 }], 'n')\` → \`[{ n: 1 }, { n: 2 }, { n: 3 }]\`

\`sortByKey([{ id: 2, t: 'b' }, { id: 1, t: 'a' }], 'id')\` → \`[{ id: 1, t: 'a' }, { id: 2, t: 'b' }]\``,
    starter: `export function sortByKey(arr, key) {
  // Подсказка: [...arr].sort((a, b) => a[key] - b[key]) или сравнение строк
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { sortByKey } from './index.js';

describe('sortByKey', () => {
  it('sorts by numeric key ascending', () => {
    expect(sortByKey([{ n: 3 }, { n: 1 }, { n: 2 }], 'n')).toEqual([{ n: 1 }, { n: 2 }, { n: 3 }]);
  });

  it('sorts by string key ascending', () => {
    expect(sortByKey([{ s: 'b' }, { s: 'a' }, { s: 'c' }], 's')).toEqual([
      { s: 'a' },
      { s: 'b' },
      { s: 'c' },
    ]);
  });

  it('returns empty array for empty input', () => {
    expect(sortByKey([], 'x')).toEqual([]);
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { sortByKey } from './index.js';

describe('sortByKey', () => {
  it('sorts by numeric key ascending', () => {
    expect(sortByKey([{ n: 3 }, { n: 1 }, { n: 2 }], 'n')).toEqual([{ n: 1 }, { n: 2 }, { n: 3 }]);
  });

  it('sorts by string key ascending', () => {
    expect(sortByKey([{ s: 'b' }, { s: 'a' }, { s: 'c' }], 's')).toEqual([
      { s: 'a' },
      { s: 'b' },
      { s: 'c' },
    ]);
  });

  it('is stable for equal keys', () => {
    const input = [
      { id: 1, tag: 'a' },
      { id: 1, tag: 'b' },
      { id: 0, tag: 'c' },
      { id: 1, tag: 'd' },
    ];
    expect(sortByKey(input, 'id')).toEqual([
      { id: 0, tag: 'c' },
      { id: 1, tag: 'a' },
      { id: 1, tag: 'b' },
      { id: 1, tag: 'd' },
    ]);
  });

  it('returns empty array for empty input', () => {
    expect(sortByKey([], 'x')).toEqual([]);
  });

  it('does not mutate input', () => {
    const input = [{ n: 3 }, { n: 1 }, { n: 2 }];
    const snapshot = JSON.parse(JSON.stringify(input));
    sortByKey(input, 'n');
    expect(input).toEqual(snapshot);
  });
});
`,
    rank: 2,
    tags: ["array-methods"],
  }),
  createDataTypeChallenge({
    id: "data-types-array-methods-flatten",
    title: "Распрямить массив",
    description: `Вложенные массивы — частая история: дерево комментариев, ответы по группам, всё подряд. Иногда нужно "развернуть" один уровень, иногда — несколько. \`Array.prototype.flat\` уже есть, но мы напишем свой, чтобы понять рекурсию.

**Что написать.** Функцию \`flatten(arr, depth = 1)\`, которая разворачивает вложенные массивы до глубины \`depth\`. Уровни глубже остаются как есть.

## Требования

1. По умолчанию \`depth = 1\`.
2. \`depth = 0\` означает "не разворачивать", возвращай копию.
3. Не мутируй вход.
4. Экспортируй функцию \`flatten\`.

## Примеры

\`flatten([1, [2, [3]]], 1)\` → \`[1, 2, [3]]\`

\`flatten([1, [2, [3]]], 2)\` → \`[1, 2, 3]\`

\`flatten([1, [2, [3, [4]]]], 0)\` → \`[1, [2, [3, [4]]]]\``,
    starter: `export function flatten(arr, depth = 1) {
  // Подсказка: рекурсия. Если depth > 0 и элемент массив - flatten(элемент, depth - 1)
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { flatten } from './index.js';

describe('flatten', () => {
  it('flattens one level by default', () => {
    expect(flatten([1, [2, [3]]])).toEqual([1, 2, [3]]);
  });

  it('flattens to given depth', () => {
    expect(flatten([1, [2, [3]]], 2)).toEqual([1, 2, 3]);
  });

  it('returns copy when depth is zero', () => {
    expect(flatten([1, [2, [3]]], 0)).toEqual([1, [2, [3]]]);
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { flatten } from './index.js';

describe('flatten', () => {
  it('flattens one level by default', () => {
    expect(flatten([1, [2, [3]]])).toEqual([1, 2, [3]]);
  });

  it('flattens to given depth', () => {
    expect(flatten([1, [2, [3]]], 2)).toEqual([1, 2, 3]);
  });

  it('returns copy when depth is zero', () => {
    expect(flatten([1, [2, [3]]], 0)).toEqual([1, [2, [3]]]);
  });

  it('handles already flat array', () => {
    expect(flatten([1, 2, 3], 5)).toEqual([1, 2, 3]);
  });

  it('handles empty array', () => {
    expect(flatten([], 3)).toEqual([]);
  });

  it('flattens deeper structures', () => {
    expect(flatten([1, [2, [3, [4, [5]]]]], 3)).toEqual([1, 2, 3, 4, [5]]);
  });

  it('does not mutate input', () => {
    const input = [1, [2, [3]]];
    flatten(input, 2);
    expect(input).toEqual([1, [2, [3]]]);
  });
});
`,
    rank: 3,
    tags: ["array-methods"],
  }),
];

export const iterableChallenges: ChallengeDefinition[] = [
  createDataTypeChallenge({
    id: "data-types-iterable-range",
    title: "Ленивый диапазон",
    description: `Хочется писать \`for (const i of range(0, 1_000_000_000))\` и не съесть всю память. Секрет — итераторы. Объект сам решает, что отдавать на каждом шаге, и не строит массив целиком. Лениво, можно прервать в любой момент.

**Что написать.** Функцию \`range(start, end, step = 1)\`, которая возвращает итерируемый объект (с методом \`[Symbol.iterator]\`). Он отдаёт значения \`start, start + step, ...\` пока меньше \`end\`. Само \`end\` НЕ включается.

## Требования

1. Возвращай объект с методом \`[Symbol.iterator]\`.
2. По умолчанию \`step = 1\`.
3. Если \`start >= end\` (при положительном \`step\`), не отдавай ничего.
4. Не строй массив заранее, генерируй на лету.
5. Экспортируй функцию \`range\`.

## Примеры

\`[...range(0, 3)]\` → \`[0, 1, 2]\`

\`[...range(0, 10, 3)]\` → \`[0, 3, 6, 9]\`

\`[...range(5, 5)]\` → \`[]\``,
    starter: `export function range(start, end, step = 1) {
  // Подсказка: верни { [Symbol.iterator]() { let cur = start; return { next() { ... } } } }
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { range } from './index.js';

describe('range', () => {
  it('yields integers from start to end exclusive', () => {
    expect([...range(0, 3)]).toEqual([0, 1, 2]);
  });

  it('uses given step', () => {
    expect([...range(0, 10, 3)]).toEqual([0, 3, 6, 9]);
  });

  it('returns nothing when start equals end', () => {
    expect([...range(5, 5)]).toEqual([]);
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { range } from './index.js';

describe('range', () => {
  it('yields integers from start to end exclusive', () => {
    expect([...range(0, 3)]).toEqual([0, 1, 2]);
  });

  it('uses given step', () => {
    expect([...range(0, 10, 3)]).toEqual([0, 3, 6, 9]);
  });

  it('returns nothing when start equals end', () => {
    expect([...range(5, 5)]).toEqual([]);
  });

  it('returns nothing when start beyond end with positive step', () => {
    expect([...range(10, 5)]).toEqual([]);
  });

  it('works with for-of and is iterable', () => {
    const collected = [];
    for (const v of range(1, 4)) collected.push(v);
    expect(collected).toEqual([1, 2, 3]);
  });

  it('can be re-iterated', () => {
    const r = range(0, 3);
    expect([...r]).toEqual([0, 1, 2]);
    expect([...r]).toEqual([0, 1, 2]);
  });
});
`,
    rank: 2,
    tags: ["iterables"],
  }),
  createDataTypeChallenge({
    id: "data-types-iterable-take",
    title: "Взять первые N",
    description: `У тебя бесконечный поток событий, а UI показывает первые 10. Звать \`Array.from\` нельзя — он попытается съесть всю последовательность. Нужен ленивый \`take\`: проходит ровно столько, сколько попросили, и останавливается.

**Что написать.** Функцию \`take(iter, n)\`, которая возвращает итерируемый объект. Он отдаёт первые \`n\` значений из \`iter\` (любого итерируемого) и останавливается. Если в \`iter\` меньше \`n\` элементов — отдаст сколько есть.

## Требования

1. Возвращай итерируемый объект (с \`[Symbol.iterator]\`).
2. Не вызывай \`next\` исходного итератора больше \`n\` раз.
3. \`n <= 0\` → ничего не отдавай.
4. Экспортируй функцию \`take\`.

## Примеры

\`[...take([1, 2, 3, 4], 2)]\` → \`[1, 2]\`

\`[...take([1, 2], 5)]\` → \`[1, 2]\`

\`[...take([1, 2, 3], 0)]\` → \`[]\``,
    starter: `export function take(iter, n) {
  // Подсказка: вернуть { [Symbol.iterator]() { ... } }, считать отданные элементы
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { take } from './index.js';

describe('take', () => {
  it('takes first n from array', () => {
    expect([...take([1, 2, 3, 4], 2)]).toEqual([1, 2]);
  });

  it('takes everything when n exceeds length', () => {
    expect([...take([1, 2], 5)]).toEqual([1, 2]);
  });

  it('returns nothing when n is zero', () => {
    expect([...take([1, 2, 3], 0)]).toEqual([]);
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { take } from './index.js';

describe('take', () => {
  it('takes first n from array', () => {
    expect([...take([1, 2, 3, 4], 2)]).toEqual([1, 2]);
  });

  it('takes everything when n exceeds length', () => {
    expect([...take([1, 2], 5)]).toEqual([1, 2]);
  });

  it('returns nothing when n is zero or negative', () => {
    expect([...take([1, 2, 3], 0)]).toEqual([]);
    expect([...take([1, 2, 3], -1)]).toEqual([]);
  });

  it('does not over-consume the source iterator', () => {
    let calls = 0;
    const source = {
      [Symbol.iterator]() {
        let i = 0;
        return {
          next() {
            calls += 1;
            return { value: i++, done: false };
          },
        };
      },
    };
    Array.from(take(source, 3));
    expect(calls).toBe(3);
  });

  it('handles empty iterable', () => {
    expect([...take([], 3)]).toEqual([]);
  });
});
`,
    rank: 3,
    tags: ["iterables"],
  }),
  createDataTypeChallenge({
    id: "data-types-iterable-zip-with",
    title: "Сшить две последовательности",
    description: `Две колонки одной таблицы: имена и возрасты. Хочется пройти по парам и склеить как угодно. \`zipWith\` берёт два итерируемых и комбинирующую функцию, возвращает итерируемое результатов. Когда одна сторона кончилась — стоп.

**Что написать.** Функцию \`zipWith(a, b, fn)\`, которая возвращает итерируемое \`fn(itemA, itemB)\` пар. Длина результата — минимум длин входов.

## Требования

1. Возвращай итерируемый объект.
2. Останавливайся, когда любой из источников исчерпан.
3. Не строй массивы заранее, обрабатывай лениво.
4. Экспортируй функцию \`zipWith\`.

## Примеры

\`[...zipWith([1, 2, 3], [10, 20, 30], (a, b) => a + b)]\` → \`[11, 22, 33]\`

\`[...zipWith(['a', 'b'], [1, 2, 3], (s, n) => s + n)]\` → \`['a1', 'b2']\`

\`[...zipWith([], [1, 2], (a, b) => a)]\` → \`[]\``,
    starter: `export function zipWith(a, b, fn) {
  // Подсказка: получи итераторы через [Symbol.iterator](), вызывай next пока done нет
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { zipWith } from './index.js';

describe('zipWith', () => {
  it('combines pairs with function', () => {
    expect([...zipWith([1, 2, 3], [10, 20, 30], (a, b) => a + b)]).toEqual([11, 22, 33]);
  });

  it('stops at shorter input', () => {
    expect([...zipWith(['a', 'b'], [1, 2, 3], (s, n) => s + n)]).toEqual(['a1', 'b2']);
  });

  it('returns empty when one input is empty', () => {
    expect([...zipWith([], [1, 2], (a, b) => a)]).toEqual([]);
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { zipWith } from './index.js';

describe('zipWith', () => {
  it('combines pairs with function', () => {
    expect([...zipWith([1, 2, 3], [10, 20, 30], (a, b) => a + b)]).toEqual([11, 22, 33]);
  });

  it('stops at shorter input', () => {
    expect([...zipWith(['a', 'b'], [1, 2, 3], (s, n) => s + n)]).toEqual(['a1', 'b2']);
  });

  it('returns empty when one input is empty', () => {
    expect([...zipWith([], [1, 2], (a, b) => a)]).toEqual([]);
  });

  it('works with custom iterables', () => {
    const ones = {
      [Symbol.iterator]() {
        let i = 0;
        return {
          next() {
            i += 1;
            return i <= 3 ? { value: 1, done: false } : { value: undefined, done: true };
          },
        };
      },
    };
    expect([...zipWith(ones, [10, 20, 30, 40], (a, b) => a + b)]).toEqual([11, 21, 31]);
  });

  it('does not over-consume', () => {
    let aCalls = 0;
    const a = {
      [Symbol.iterator]() {
        return {
          next() {
            aCalls += 1;
            if (aCalls > 2) return { value: undefined, done: true };
            return { value: aCalls, done: false };
          },
        };
      },
    };
    Array.from(zipWith(a, [10, 20, 30, 40], (x, y) => x + y));
    expect(aCalls).toBe(3);
  });
});
`,
    rank: 3,
    tags: ["iterables"],
  }),
  createDataTypeChallenge({
    id: "data-types-iterable-take-while",
    title: "Брать, пока истина",
    description: `Поток отсортированных чисел, и нужны те, что меньше 100. Как только встретили первое не подходящее — стоп, дальше не смотрим. Это \`takeWhile\`: жадно отдаём элементы, пока предикат говорит "да", и отрубаемся при первом "нет".

**Что написать.** Функцию \`takeWhile(iter, predicate)\`, которая возвращает итерируемое. Идём по \`iter\` и отдаём элементы, пока \`predicate(item)\` истинен. Как только \`predicate\` вернул \`false\` — конец, оставшиеся элементы не запрашиваем.

## Требования

1. Возвращай итерируемый объект.
2. На первом \`false\` от \`predicate\` останавливайся, не вызывая \`predicate\` дальше.
3. Не строй массивы заранее.
4. Экспортируй функцию \`takeWhile\`.

## Примеры

\`[...takeWhile([1, 2, 3, 4, 1], n => n < 4)]\` → \`[1, 2, 3]\`

\`[...takeWhile([10, 20, 30], n => n < 5)]\` → \`[]\`

\`[...takeWhile([1, 2, 3], n => true)]\` → \`[1, 2, 3]\``,
    starter: `export function takeWhile(iter, predicate) {
  // Подсказка: верни итерируемое, в next() читай элемент и проверяй predicate
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { takeWhile } from './index.js';

describe('takeWhile', () => {
  it('yields while predicate is true', () => {
    expect([...takeWhile([1, 2, 3, 4, 1], (n) => n < 4)]).toEqual([1, 2, 3]);
  });

  it('yields nothing when first item fails predicate', () => {
    expect([...takeWhile([10, 20, 30], (n) => n < 5)]).toEqual([]);
  });

  it('yields all when predicate always true', () => {
    expect([...takeWhile([1, 2, 3], () => true)]).toEqual([1, 2, 3]);
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { takeWhile } from './index.js';

describe('takeWhile', () => {
  it('yields while predicate is true', () => {
    expect([...takeWhile([1, 2, 3, 4, 1], (n) => n < 4)]).toEqual([1, 2, 3]);
  });

  it('yields nothing when first item fails predicate', () => {
    expect([...takeWhile([10, 20, 30], (n) => n < 5)]).toEqual([]);
  });

  it('yields all when predicate always true', () => {
    expect([...takeWhile([1, 2, 3], () => true)]).toEqual([1, 2, 3]);
  });

  it('handles empty iterable', () => {
    expect([...takeWhile([], () => true)]).toEqual([]);
  });

  it('does not consume more than needed after first false', () => {
    let calls = 0;
    const source = {
      [Symbol.iterator]() {
        let i = 0;
        return {
          next() {
            calls += 1;
            i += 1;
            return { value: i, done: false };
          },
        };
      },
    };
    Array.from(takeWhile(source, (n) => n < 3));
    expect(calls).toBe(3);
  });

  it('works with custom iterables', () => {
    const nums = {
      [Symbol.iterator]() {
        let i = 0;
        return {
          next() {
            i += 1;
            return i <= 5 ? { value: i, done: false } : { value: undefined, done: true };
          },
        };
      },
    };
    expect([...takeWhile(nums, (n) => n <= 3)]).toEqual([1, 2, 3]);
  });
});
`,
    rank: 4,
    tags: ["iterables"],
  }),
];
