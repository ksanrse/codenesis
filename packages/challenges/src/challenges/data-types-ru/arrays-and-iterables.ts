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
  createDataTypeChallenge({
    id: "data-types-array-sparse-holes",
    title: "Разреженный массив с дырами",
    description: `Массивы в JS могут иметь «дыры» — индексы, в которых ничего нет (не \`undefined\`, а вообще ничего). Это разреженные массивы.

\`\`\`js
const arr = [];
arr[5] = 'x';
arr.length        // 6 — длина выросла до 6
arr[2]            // undefined — но это «дыра»
2 in arr          // false — ключа 2 в массиве нет
5 in arr          // true  — ключ 5 есть
arr.forEach((v, i) => console.log(i, v));
// 5 'x' — forEach пропускает дыры!

[1, , 3].length   // 3 — запятая создаёт дыру
[1, , 3].filter(() => true) // [1, 3] — filter тоже пропускает дыры
\`\`\`

**Хитрость.** \`Array(3)\` создаёт массив длины 3 с тремя дырами. А вот \`Array.from({length: 3})\` или \`new Array(3).fill(undefined)\` — заполнит реальными \`undefined\`, и \`map\`/\`forEach\` их обойдут.

**Что написать.** Функцию \`countHoles(arr)\` — возвращает количество «дыр» (индексов от 0 до length-1, по которым нет ключа).

## Требования

1. Пройдись по индексам \`0..arr.length-1\`.
2. Используй \`i in arr\` или \`Object.hasOwn(arr, String(i))\`, чтобы отличить дыру от \`undefined\`.
3. Возвращай число.
4. Экспортируй функцию \`countHoles\`.

## Примеры

\`countHoles([1, 2, 3])\` → \`0\`

\`countHoles([1, , 3])\` → \`1\`

\`countHoles(Array(5))\` → \`5\`

\`countHoles([undefined, undefined])\` → \`0\` (это не дыры, а реальные undefined)`,
    starter: `export function countHoles(arr) {
  // Цикл по индексам, проверка через 'in'
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { countHoles } from './index.js';

describe('countHoles', () => {
  it('плотный массив', () => {
    expect(countHoles([1, 2, 3])).toBe(0);
  });

  it('одна дыра в середине', () => {
    expect(countHoles([1, , 3])).toBe(1);
  });

  it('Array(5) — пять дыр', () => {
    expect(countHoles(Array(5))).toBe(5);
  });

  it('реальные undefined — не дыры', () => {
    expect(countHoles([undefined, undefined])).toBe(0);
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { countHoles } from './index.js';

describe('countHoles', () => {
  it('плотный массив', () => {
    expect(countHoles([1, 2, 3])).toBe(0);
  });

  it('одна дыра в середине', () => {
    expect(countHoles([1, , 3])).toBe(1);
  });

  it('Array(5) — пять дыр', () => {
    expect(countHoles(Array(5))).toBe(5);
  });

  it('реальные undefined — не дыры', () => {
    expect(countHoles([undefined, undefined])).toBe(0);
  });

  it('пустой массив', () => {
    expect(countHoles([])).toBe(0);
  });

  it('две подряд идущие дыры', () => {
    expect(countHoles([1, , , 4])).toBe(2);
  });

  it('массив, удлинённый присваиванием', () => {
    const arr = [];
    arr[5] = 'x';
    expect(countHoles(arr)).toBe(5);
  });

  it('Array.from с length заполняет undefined', () => {
    expect(countHoles(Array.from({ length: 3 }))).toBe(0);
  });
});
`,
    rank: 2,
    tags: ["arrays", "sparse", "holes"],
  }),
  createDataTypeChallenge({
    id: "data-types-array-partition",
    title: "Разделить надвое",
    description: `Финал набора. Часто нужно разбить массив на «подходящие» и «не подходящие» по предикату. Это \`partition\` — пары результатов в одном проходе.

\`\`\`js
partition([1, 2, 3, 4], n => n % 2 === 0)
// [[2, 4], [1, 3]]
\`\`\`

Можно собрать через два \`filter\`, но тогда массив проходится дважды. Один \`reduce\` или \`for..of\` справляется за один проход.

**Что написать.** Функцию \`partition(arr, predicate)\` — возвращает массив из двух массивов: первый с элементами, для которых \`predicate(x)\` truthy, второй — с остальными. Порядок сохраняй.

## Требования

1. Пройди по \`arr\` один раз.
2. Возвращай \`[matched, rest]\`.
3. Не мутируй исходный массив.
4. Сохраняй относительный порядок элементов.
5. Экспортируй функцию \`partition\`.

## Примеры

\`partition([1, 2, 3, 4], n => n % 2 === 0)\` → \`[[2, 4], [1, 3]]\`

\`partition([], () => true)\` → \`[[], []]\`

\`partition([1, 2, 3], () => false)\` → \`[[], [1, 2, 3]]\``,
    starter: `export function partition(arr, predicate) {
  // Один проход, два массива
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { partition } from './index.js';

describe('partition', () => {
  it('разделяет чёт/нечёт', () => {
    expect(partition([1, 2, 3, 4], n => n % 2 === 0)).toEqual([[2, 4], [1, 3]]);
  });

  it('пустой массив', () => {
    expect(partition([], () => true)).toEqual([[], []]);
  });

  it('всё в "не подходит"', () => {
    expect(partition([1, 2, 3], () => false)).toEqual([[], [1, 2, 3]]);
  });

  it('всё в "подходит"', () => {
    expect(partition([1, 2, 3], () => true)).toEqual([[1, 2, 3], []]);
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { partition } from './index.js';

describe('partition', () => {
  it('разделяет чёт/нечёт', () => {
    expect(partition([1, 2, 3, 4], n => n % 2 === 0)).toEqual([[2, 4], [1, 3]]);
  });

  it('пустой массив', () => {
    expect(partition([], () => true)).toEqual([[], []]);
  });

  it('всё в "не подходит"', () => {
    expect(partition([1, 2, 3], () => false)).toEqual([[], [1, 2, 3]]);
  });

  it('всё в "подходит"', () => {
    expect(partition([1, 2, 3], () => true)).toEqual([[1, 2, 3], []]);
  });

  it('сохраняет порядок', () => {
    expect(partition([3, 1, 4, 1, 5, 9, 2, 6], n => n > 3))
      .toEqual([[4, 5, 9, 6], [3, 1, 1, 2]]);
  });

  it('truthy-значения тоже считаются', () => {
    expect(partition(['a', '', 'b', ''], s => s)).toEqual([['a', 'b'], ['', '']]);
  });

  it('не мутирует оригинал', () => {
    const orig = [1, 2, 3];
    partition(orig, n => n > 1);
    expect(orig).toEqual([1, 2, 3]);
  });

  it('предикат получает индекс', () => {
    expect(partition(['a', 'b', 'c'], (_, i) => i % 2 === 0))
      .toEqual([['a', 'c'], ['b']]);
  });
});
`,
    rank: 2,
    tags: ["arrays", "partition", "finale"],
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
  createDataTypeChallenge({
    id: "data-types-array-methods-find-last",
    title: "findLast и findLastIndex",
    description: `\`find\` ищет первый элемент, удовлетворяющий предикату. \`findLast\` — последний. \`findIndex\` и \`findLastIndex\` — то же, но возвращают индекс. Это сэкономит \`reverse()\` или ручной цикл с конца.

\`\`\`js
[1, 2, 3, 4].find(n => n % 2 === 0)         // 2
[1, 2, 3, 4].findLast(n => n % 2 === 0)     // 4
[1, 2, 3, 4].findIndex(n => n % 2 === 0)    // 1
[1, 2, 3, 4].findLastIndex(n => n % 2 === 0) // 3
\`\`\`

Если ничего не нашлось — \`find\`/\`findLast\` возвращают \`undefined\`, \`findIndex\`/\`findLastIndex\` возвращают \`-1\`.

**Что написать.** Функцию \`findFirstAndLast(arr, predicate)\` — возвращает \`{ first, last, firstIndex, lastIndex }\`. Используй встроенные методы.

## Требования

1. Используй \`find\`, \`findLast\`, \`findIndex\`, \`findLastIndex\`.
2. Если ничего не подходит — \`first\` и \`last\` это \`undefined\`, индексы \`-1\`.
3. Экспортируй функцию \`findFirstAndLast\`.

## Примеры

\`\`\`js
findFirstAndLast([1, 2, 3, 4], n => n % 2 === 0)
// { first: 2, last: 4, firstIndex: 1, lastIndex: 3 }

findFirstAndLast([1, 3, 5], n => n % 2 === 0)
// { first: undefined, last: undefined, firstIndex: -1, lastIndex: -1 }
\`\`\``,
    starter: `export function findFirstAndLast(arr, predicate) {
  // arr.find / findLast / findIndex / findLastIndex
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { findFirstAndLast } from './index.js';

describe('findFirstAndLast', () => {
  it('находит чётные', () => {
    expect(findFirstAndLast([1, 2, 3, 4], n => n % 2 === 0))
      .toEqual({ first: 2, last: 4, firstIndex: 1, lastIndex: 3 });
  });

  it('ничего не находит', () => {
    expect(findFirstAndLast([1, 3, 5], n => n % 2 === 0))
      .toEqual({ first: undefined, last: undefined, firstIndex: -1, lastIndex: -1 });
  });

  it('один подходящий — first и last совпадают', () => {
    expect(findFirstAndLast([1, 2, 3], n => n === 2))
      .toEqual({ first: 2, last: 2, firstIndex: 1, lastIndex: 1 });
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { findFirstAndLast } from './index.js';

describe('findFirstAndLast', () => {
  it('находит чётные', () => {
    expect(findFirstAndLast([1, 2, 3, 4], n => n % 2 === 0))
      .toEqual({ first: 2, last: 4, firstIndex: 1, lastIndex: 3 });
  });

  it('ничего не находит', () => {
    expect(findFirstAndLast([1, 3, 5], n => n % 2 === 0))
      .toEqual({ first: undefined, last: undefined, firstIndex: -1, lastIndex: -1 });
  });

  it('один подходящий — first и last совпадают', () => {
    expect(findFirstAndLast([1, 2, 3], n => n === 2))
      .toEqual({ first: 2, last: 2, firstIndex: 1, lastIndex: 1 });
  });

  it('пустой массив', () => {
    expect(findFirstAndLast([], () => true))
      .toEqual({ first: undefined, last: undefined, firstIndex: -1, lastIndex: -1 });
  });

  it('первый и последний по позиции', () => {
    expect(findFirstAndLast(['a', 'b', 'a', 'c', 'a'], s => s === 'a'))
      .toEqual({ first: 'a', last: 'a', firstIndex: 0, lastIndex: 4 });
  });

  it('предикат получает индекс', () => {
    expect(findFirstAndLast([10, 20, 30, 40], (_, i) => i >= 2).firstIndex).toBe(2);
  });
});
`,
    rank: 3,
    tags: ["array-methods", "find-last"],
  }),
  createDataTypeChallenge({
    id: "data-types-array-methods-includes-nan",
    title: "includes находит NaN, indexOf — нет",
    description: `\`Array.prototype.indexOf\` использует \`===\` для сравнения. А \`NaN === NaN\` это \`false\`. Поэтому \`indexOf(NaN)\` всегда возвращает \`-1\`, даже если \`NaN\` в массиве есть.

\`\`\`js
[NaN].indexOf(NaN)   // -1 (!)
[NaN].includes(NaN)  // true   — includes использует SameValueZero, который видит NaN
\`\`\`

\`includes\` использует алгоритм SameValueZero: как \`===\`, но \`NaN === NaN\` считает \`true\`. Различие: \`+0\` и \`-0\` для SameValueZero равны (для \`Object.is\` — нет).

**Что написать.** Функцию \`hasNaN(arr)\` — возвращает \`true\`, если в массиве есть \`NaN\`. Реализуй **через \`includes\`**, не через \`indexOf\` или \`some(Number.isNaN)\`.

## Требования

1. Используй \`arr.includes(NaN)\`.
2. Не используй \`indexOf\`, \`some\`, \`Number.isNaN\` напрямую для решения.
3. Экспортируй функцию \`hasNaN\`.

## Примеры

\`hasNaN([1, NaN, 3])\` → \`true\`

\`hasNaN([1, 2, 3])\` → \`false\`

\`hasNaN([])\` → \`false\``,
    starter: `export function hasNaN(arr) {
  // arr.includes(NaN)
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { hasNaN } from './index.js';

describe('hasNaN', () => {
  it('NaN в середине', () => {
    expect(hasNaN([1, NaN, 3])).toBe(true);
  });

  it('обычный массив без NaN', () => {
    expect(hasNaN([1, 2, 3])).toBe(false);
  });

  it('пустой массив', () => {
    expect(hasNaN([])).toBe(false);
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { hasNaN } from './index.js';

describe('hasNaN', () => {
  it('NaN в середине', () => {
    expect(hasNaN([1, NaN, 3])).toBe(true);
  });

  it('обычный массив без NaN', () => {
    expect(hasNaN([1, 2, 3])).toBe(false);
  });

  it('пустой массив', () => {
    expect(hasNaN([])).toBe(false);
  });

  it('NaN в самом начале', () => {
    expect(hasNaN([NaN, 1, 2])).toBe(true);
  });

  it('NaN в самом конце', () => {
    expect(hasNaN([1, 2, NaN])).toBe(true);
  });

  it('массив только из NaN', () => {
    expect(hasNaN([NaN, NaN, NaN])).toBe(true);
  });

  it('NaN не находится через indexOf — наглядно', () => {
    const arr = [NaN];
    expect(arr.indexOf(NaN)).toBe(-1);
    expect(hasNaN(arr)).toBe(true);
  });

  it('строки без NaN', () => {
    expect(hasNaN(['a', 'b'])).toBe(false);
  });
});
`,
    rank: 3,
    tags: ["array-methods", "includes", "nan"],
  }),
  createDataTypeChallenge({
    id: "data-types-array-methods-immutable-splice",
    title: "Финал: иммутабельный splice",
    description: `Финал набора. \`splice(start, deleteCount, ...items)\` мутирует массив и возвращает удалённые элементы. Это удобно, но в реактивных приложениях (React, Vue) мутация ломает обнаружение изменений.

С 2023 года в JS появились **иммутабельные близнецы**: \`toSorted\`, \`toReversed\`, \`toSpliced\`, \`with\`. Они возвращают новый массив, оригинал не трогают.

\`\`\`js
const arr = [1, 2, 3, 4];
const out = arr.toSpliced(1, 2);  // [1, 4]
arr;                               // [1, 2, 3, 4] — НЕ мутирован

const out2 = arr.toSpliced(1, 0, 'a', 'b');  // [1, 'a', 'b', 2, 3, 4]
\`\`\`

Если \`toSpliced\` ещё не доступен в окружении — собирают вручную через \`slice\`+\`concat\`. Для тренировки попробуем второй путь.

**Что написать.** Функцию \`spliceImmutable(arr, start, deleteCount, ...items)\` — возвращает **новый** массив, в котором с позиции \`start\` удалено \`deleteCount\` элементов и вставлены \`items\`. Оригинал НЕ мутируется. Реализуй через \`slice\` + spread (без \`splice\`, без \`toSpliced\`).

## Требования

1. Не мутируй \`arr\`.
2. Не используй \`Array.prototype.splice\` или \`toSpliced\`.
3. Используй \`slice\` и spread \`[...]\`.
4. Поддержи отрицательные \`start\` (как у \`splice\`: \`-1\` это последний элемент).
5. Экспортируй функцию \`spliceImmutable\`.

## Примеры

\`\`\`js
spliceImmutable([1, 2, 3, 4], 1, 2)
// [1, 4]

spliceImmutable([1, 2, 3, 4], 1, 0, 'a', 'b')
// [1, 'a', 'b', 2, 3, 4]

spliceImmutable([1, 2, 3], -1, 1, 'X')
// [1, 2, 'X']
\`\`\``,
    rank: 4,
    tags: ["array-methods", "immutable", "finale"],
    starter: `export function spliceImmutable(arr, start, deleteCount, ...items) {
  // slice + spread, оригинал не трогать
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { spliceImmutable } from './index.js';

describe('spliceImmutable', () => {
  it('удаляет элементы', () => {
    expect(spliceImmutable([1, 2, 3, 4], 1, 2)).toEqual([1, 4]);
  });

  it('вставляет элементы', () => {
    expect(spliceImmutable([1, 2, 3, 4], 1, 0, 'a', 'b'))
      .toEqual([1, 'a', 'b', 2, 3, 4]);
  });

  it('отрицательный start', () => {
    expect(spliceImmutable([1, 2, 3], -1, 1, 'X')).toEqual([1, 2, 'X']);
  });

  it('не мутирует оригинал', () => {
    const arr = [1, 2, 3, 4];
    spliceImmutable(arr, 1, 2);
    expect(arr).toEqual([1, 2, 3, 4]);
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { spliceImmutable } from './index.js';

describe('spliceImmutable', () => {
  it('удаляет элементы', () => {
    expect(spliceImmutable([1, 2, 3, 4], 1, 2)).toEqual([1, 4]);
  });

  it('вставляет элементы', () => {
    expect(spliceImmutable([1, 2, 3, 4], 1, 0, 'a', 'b'))
      .toEqual([1, 'a', 'b', 2, 3, 4]);
  });

  it('замена через delete + insert', () => {
    expect(spliceImmutable([1, 2, 3, 4], 1, 2, 'X', 'Y'))
      .toEqual([1, 'X', 'Y', 4]);
  });

  it('отрицательный start', () => {
    expect(spliceImmutable([1, 2, 3], -1, 1, 'X')).toEqual([1, 2, 'X']);
  });

  it('не мутирует оригинал', () => {
    const arr = [1, 2, 3, 4];
    spliceImmutable(arr, 1, 2);
    expect(arr).toEqual([1, 2, 3, 4]);
  });

  it('start больше длины — добавляет в конец', () => {
    expect(spliceImmutable([1, 2], 10, 0, 'X')).toEqual([1, 2, 'X']);
  });

  it('deleteCount = 0 без items', () => {
    expect(spliceImmutable([1, 2, 3], 1, 0)).toEqual([1, 2, 3]);
  });

  it('пустой массив, добавление', () => {
    expect(spliceImmutable([], 0, 0, 'a', 'b')).toEqual(['a', 'b']);
  });

  it('start = 0', () => {
    expect(spliceImmutable([1, 2, 3], 0, 1)).toEqual([2, 3]);
  });

  it('возвращает новый массив, не ссылку', () => {
    const arr = [1, 2, 3];
    expect(spliceImmutable(arr, 0, 0)).not.toBe(arr);
  });
});
`,
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
  createDataTypeChallenge({
    id: "data-types-iterable-yield-delegation",
    title: "Делегирование через yield*",
    description: `\`yield*\` внутри генератора — это «вставь сюда всё, что отдаст другой итерируемый объект». Удобно для композиции.

\`\`\`js
function* a() { yield 1; yield 2; }
function* b() {
  yield 0;
  yield* a();   // 1, 2 — все значения a
  yield 3;
}
[...b()] // [0, 1, 2, 3]
\`\`\`

\`yield*\` принимает любой iterable, не только генератор: можно делегировать массиву, Set, Map.

**Что написать.** Генератор-функцию \`concatGenerators(...iterables)\`, который последовательно отдаёт значения из всех переданных iterable'ов через \`yield*\`.

## Требования

1. Используй \`function*\` и \`yield*\` (не пиши вручную через \`for..of\`+\`yield\` — это другая задача).
2. Принимай переменное число аргументов через rest.
3. Каждый аргумент — iterable.
4. Результат — генератор.
5. Экспортируй функцию \`concatGenerators\`.

## Примеры

\`[...concatGenerators([1, 2], [3, 4])]\` → \`[1, 2, 3, 4]\`

\`[...concatGenerators('ab', 'cd')]\` → \`['a', 'b', 'c', 'd']\`

\`[...concatGenerators()]\` → \`[]\`

\`[...concatGenerators(new Set([1, 2]), [3])]\` → \`[1, 2, 3]\``,
    starter: `export function* concatGenerators(...iterables) {
  // Используй yield* для каждого iterable
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { concatGenerators } from './index.js';

describe('concatGenerators', () => {
  it('два массива', () => {
    expect([...concatGenerators([1, 2], [3, 4])]).toEqual([1, 2, 3, 4]);
  });

  it('строки тоже iterable', () => {
    expect([...concatGenerators('ab', 'cd')]).toEqual(['a', 'b', 'c', 'd']);
  });

  it('без аргументов — пусто', () => {
    expect([...concatGenerators()]).toEqual([]);
  });

  it('Set + массив', () => {
    expect([...concatGenerators(new Set([1, 2]), [3])]).toEqual([1, 2, 3]);
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { concatGenerators } from './index.js';

describe('concatGenerators', () => {
  it('два массива', () => {
    expect([...concatGenerators([1, 2], [3, 4])]).toEqual([1, 2, 3, 4]);
  });

  it('строки тоже iterable', () => {
    expect([...concatGenerators('ab', 'cd')]).toEqual(['a', 'b', 'c', 'd']);
  });

  it('без аргументов — пусто', () => {
    expect([...concatGenerators()]).toEqual([]);
  });

  it('Set + массив', () => {
    expect([...concatGenerators(new Set([1, 2]), [3])]).toEqual([1, 2, 3]);
  });

  it('пустые iterables пропускаются', () => {
    expect([...concatGenerators([], [1], [], [2])]).toEqual([1, 2]);
  });

  it('один iterable', () => {
    expect([...concatGenerators([7, 8, 9])]).toEqual([7, 8, 9]);
  });

  it('возвращает генератор', () => {
    const g = concatGenerators([1]);
    expect(typeof g.next).toBe('function');
    expect(typeof g[Symbol.iterator]).toBe('function');
  });

  it('делегирование вложенному генератору', () => {
    function* inner() { yield 10; yield 20; }
    expect([...concatGenerators(inner(), [30])]).toEqual([10, 20, 30]);
  });

  it('повторный перебор не возобновляется', () => {
    const g = concatGenerators([1, 2]);
    expect([...g]).toEqual([1, 2]);
    expect([...g]).toEqual([]);
  });
});
`,
    rank: 4,
    tags: ["iterables", "generator", "yield-delegation"],
  }),
  createDataTypeChallenge({
    id: "data-types-iterable-return-cleanup",
    title: "Уборка через return()",
    description: `Иногда итератор открывает ресурс — файл, соединение, таймер. Если перебор прервался (\`break\`, ошибка, ранний выход из spread), хорошо бы это закрыть. JS поддерживает протокол: у итератора может быть метод \`return()\`, который вызовется автоматически в этих случаях.

\`\`\`js
const iter = {
  [Symbol.iterator]() {
    let i = 0;
    return {
      next() { return i < 3 ? { value: i++, done: false } : { done: true }; },
      return(value) {
        // вызовется при break / ранней остановке
        return { value, done: true };
      }
    };
  }
};

for (const x of iter) {
  if (x === 1) break;  // сработает return()
}
\`\`\`

**Что написать.** Функцию \`makeCleanupIterable(values, onCleanup)\` — возвращает iterable, который перебирает \`values\`. Если перебор прерван досрочно (через \`break\` или \`.return()\`), функция \`onCleanup\` должна быть вызвана **ровно один раз**. Если перебор дошёл до конца — \`onCleanup\` НЕ вызывается.

## Требования

1. Возвращай объект с \`[Symbol.iterator]\`.
2. Итератор должен иметь \`next()\` и \`return()\`.
3. \`return()\` вызывает \`onCleanup\` и возвращает \`{ value: undefined, done: true }\`.
4. Гарантируй, что \`onCleanup\` зовётся максимум один раз.
5. Если перебор завершился сам (закончились значения) — НЕ зовём \`onCleanup\`.
6. Экспортируй функцию \`makeCleanupIterable\`.

## Примеры

Полный перебор \`[...makeCleanupIterable([1, 2, 3], spy)]\` — \`spy\` НЕ вызывается.

\`break\` после первого — \`spy\` вызвался ровно один раз.`,
    starter: `export function makeCleanupIterable(values, onCleanup) {
  // Реализуй [Symbol.iterator] с next() и return()
}
`,
    tests: `import { describe, expect, it, vi } from 'vitest';
import { makeCleanupIterable } from './index.js';

describe('makeCleanupIterable', () => {
  it('полный перебор не зовёт cleanup', () => {
    const spy = vi.fn();
    [...makeCleanupIterable([1, 2, 3], spy)];
    expect(spy).not.toHaveBeenCalled();
  });

  it('break вызывает cleanup', () => {
    const spy = vi.fn();
    for (const x of makeCleanupIterable([1, 2, 3], spy)) {
      if (x === 1) break;
    }
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('пустой values без break — без cleanup', () => {
    const spy = vi.fn();
    [...makeCleanupIterable([], spy)];
    expect(spy).not.toHaveBeenCalled();
  });
});
`,
    fullTests: `import { describe, expect, it, vi } from 'vitest';
import { makeCleanupIterable } from './index.js';

describe('makeCleanupIterable', () => {
  it('полный перебор не зовёт cleanup', () => {
    const spy = vi.fn();
    [...makeCleanupIterable([1, 2, 3], spy)];
    expect(spy).not.toHaveBeenCalled();
  });

  it('break вызывает cleanup', () => {
    const spy = vi.fn();
    for (const x of makeCleanupIterable([1, 2, 3], spy)) {
      if (x === 1) break;
    }
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('return() напрямую вызывает cleanup', () => {
    const spy = vi.fn();
    const iter = makeCleanupIterable([1, 2], spy)[Symbol.iterator]();
    iter.next();
    iter.return();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('cleanup зовётся максимум один раз', () => {
    const spy = vi.fn();
    const iter = makeCleanupIterable([1, 2, 3], spy)[Symbol.iterator]();
    iter.return();
    iter.return();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('пустой values без break — без cleanup', () => {
    const spy = vi.fn();
    [...makeCleanupIterable([], spy)];
    expect(spy).not.toHaveBeenCalled();
  });

  it('возвращает значения по порядку', () => {
    const spy = vi.fn();
    expect([...makeCleanupIterable([10, 20, 30], spy)]).toEqual([10, 20, 30]);
  });

  it('return() возвращает { done: true }', () => {
    const iter = makeCleanupIterable([1, 2], () => {})[Symbol.iterator]();
    const result = iter.return();
    expect(result.done).toBe(true);
  });

  it('итератор имеет return метод', () => {
    const iter = makeCleanupIterable([1], () => {})[Symbol.iterator]();
    expect(typeof iter.return).toBe('function');
  });
});
`,
    rank: 4,
    tags: ["iterables", "return", "cleanup"],
  }),
];
