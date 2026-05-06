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
// Symbol
// ---------------------------------------------------------------------------

export const symbolChallenges: ChallengeDefinition[] = [
  createDataTypeChallenge({
    id: "data-types-create-enum",
    title: "Создать enum через Symbol",
    description: `Представь: ты хранишь статусы заказа — \`const PENDING = 0, DONE = 1\`. Проблема? Ничто не мешает сравнить \`PENDING === 0\` и получить \`true\` — статус перепутается с обычным числом. Symbol это исправляет: каждый Symbol уникален, даже если описание совпадает.

\`\`\`js
Symbol('RED') === Symbol('RED') // false — всегда уникальный!
typeof Symbol('RED')            // 'symbol'
Symbol('RED').description        // 'RED'
\`\`\`

**Что написать.** Функцию \`createEnum(names)\`, которая принимает массив строк и возвращает замороженный объект, где каждый ключ — строка из массива, а значение — уникальный \`Symbol\` с этим именем в описании.

## Требования

1. Каждое значение — \`Symbol(name)\`.
2. Результат заморожен через \`Object.freeze\`.
3. Экспортируй функцию \`createEnum\`.

## Примеры

\`createEnum(['RED', 'GREEN'])\` → \`{ RED: Symbol(RED), GREEN: Symbol(GREEN) }\`

\`typeof createEnum(['A']).A\` → \`'symbol'\`

\`createEnum(['X', 'X']).X\` — значение для последнего \`'X'\` (оба Symbol уникальны, но ключ перезаписывается)`,
    starter: `export function createEnum(names) {
  // Пройдись по names, создай объект с Symbol-значениями, заморозь
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { createEnum } from './index.js';

describe('createEnum', () => {
  it('значения имеют тип symbol', () => {
    const e = createEnum(['A', 'B']);
    expect(typeof e.A).toBe('symbol');
    expect(typeof e.B).toBe('symbol');
  });

  it('описание символа совпадает с ключом', () => {
    const e = createEnum(['RED']);
    expect(e.RED.description).toBe('RED');
  });

  it('два символа с одним описанием не равны', () => {
    const a = createEnum(['X']).X;
    const b = createEnum(['X']).X;
    expect(a).not.toBe(b);
  });

  it('объект заморожен', () => {
    const e = createEnum(['A']);
    expect(Object.isFrozen(e)).toBe(true);
  });

  it('все ключи из массива присутствуют', () => {
    const e = createEnum(['UP', 'DOWN', 'LEFT']);
    expect(Object.keys(e).sort()).toEqual(['DOWN', 'LEFT', 'UP']);
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { createEnum } from './index.js';

describe('createEnum', () => {
  it('значения имеют тип symbol', () => {
    const e = createEnum(['A', 'B']);
    expect(typeof e.A).toBe('symbol');
    expect(typeof e.B).toBe('symbol');
  });

  it('описание символа совпадает с ключом', () => {
    const e = createEnum(['RED']);
    expect(e.RED.description).toBe('RED');
  });

  it('два символа с одним описанием не равны', () => {
    const a = createEnum(['X']).X;
    const b = createEnum(['X']).X;
    expect(a).not.toBe(b);
  });

  it('объект заморожен', () => {
    const e = createEnum(['A']);
    expect(Object.isFrozen(e)).toBe(true);
  });

  it('все ключи из массива присутствуют', () => {
    const e = createEnum(['UP', 'DOWN', 'LEFT']);
    expect(Object.keys(e).sort()).toEqual(['DOWN', 'LEFT', 'UP']);
  });

  it('пустой массив — пустой замороженный объект', () => {
    const e = createEnum([]);
    expect(Object.keys(e)).toEqual([]);
    expect(Object.isFrozen(e)).toBe(true);
  });

  it('одиночный ключ', () => {
    const e = createEnum(['SOLO']);
    expect(typeof e.SOLO).toBe('symbol');
    expect(e.SOLO.description).toBe('SOLO');
  });

  it('значения не являются строками или числами', () => {
    const e = createEnum(['A', 'B']);
    expect(typeof e.A).not.toBe('string');
    expect(typeof e.A).not.toBe('number');
  });

  it('значения внутри одного enum уникальны', () => {
    const e = createEnum(['A', 'B', 'C']);
    expect(e.A).not.toBe(e.B);
    expect(e.B).not.toBe(e.C);
    expect(e.A).not.toBe(e.C);
  });

  it('toString возвращает Symbol(name)', () => {
    const e = createEnum(['OK']);
    expect(e.OK.toString()).toBe('Symbol(OK)');
  });
});
`,
    rank: 2,
    tags: ["symbol", "enum", "freeze"],
  }),
  createDataTypeChallenge({
    id: "data-types-make-iterable",
    title: "Сделать объект итерируемым",
    description: `В JS \`for..of\` и \`[...spread]\` работают через «контракт»: у объекта должен быть метод \`[Symbol.iterator]()\`, который возвращает итератор. Итератор — просто объект с методом \`next()\`, который при каждом вызове отдаёт \`{ value, done }\`.

\`\`\`js
const obj = {
  [Symbol.iterator]() {
    let i = 0;
    const data = [10, 20, 30];
    return {
      next() {
        return i < data.length
          ? { value: data[i++], done: false }
          : { done: true };
      }
    };
  }
};

[...obj] // [10, 20, 30] — работает!
\`\`\`

**Что написать.** Функцию \`makeIterable(obj, values)\` — возвращает новый объект со всеми свойствами \`obj\` плюс \`[Symbol.iterator]\`, который при переборе отдаёт элементы из \`values\`.

## Требования

1. Скопируй все собственные свойства \`obj\` в новый объект.
2. Добавь метод \`[Symbol.iterator]\`, который перебирает \`values\`.
3. Исходный \`obj\` не мутируй.
4. Повторный перебор должен начинаться сначала.
5. Экспортируй функцию \`makeIterable\`.

## Примеры

\`[...makeIterable({}, [1, 2, 3])]\` → \`[1, 2, 3]\`

\`makeIterable({ name: 'test' }, []).name\` → \`'test'\`

\`[...makeIterable({}, ['a', 'b'])]\` → \`['a', 'b']\``,
    starter: `export function makeIterable(obj, values) {
  // Скопируй свойства obj и добавь [Symbol.iterator]
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { makeIterable } from './index.js';

describe('makeIterable', () => {
  it('spread отдаёт все значения', () => {
    expect([...makeIterable({}, [1, 2, 3])]).toEqual([1, 2, 3]);
  });

  it('свойства оригинала сохраняются', () => {
    const result = makeIterable({ name: 'test', x: 42 }, []);
    expect(result.name).toBe('test');
    expect(result.x).toBe(42);
  });

  it('пустые values — пустой spread', () => {
    expect([...makeIterable({}, [])]).toEqual([]);
  });

  it('for..of работает', () => {
    const collected = [];
    for (const v of makeIterable({}, [10, 20])) collected.push(v);
    expect(collected).toEqual([10, 20]);
  });

  it('повторный перебор начинается сначала', () => {
    const iter = makeIterable({}, [1, 2]);
    expect([...iter]).toEqual([1, 2]);
    expect([...iter]).toEqual([1, 2]);
  });

  it('оригинал не мутируется', () => {
    const orig = { a: 1 };
    makeIterable(orig, [1]);
    expect(orig[Symbol.iterator]).toBeUndefined();
  });

  it('Symbol.iterator — функция', () => {
    const iter = makeIterable({}, [1]);
    expect(typeof iter[Symbol.iterator]).toBe('function');
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { makeIterable } from './index.js';

describe('makeIterable', () => {
  it('spread отдаёт все значения', () => {
    expect([...makeIterable({}, [1, 2, 3])]).toEqual([1, 2, 3]);
  });

  it('свойства оригинала сохраняются', () => {
    const result = makeIterable({ name: 'test', x: 42 }, []);
    expect(result.name).toBe('test');
    expect(result.x).toBe(42);
  });

  it('пустые values — пустой spread', () => {
    expect([...makeIterable({}, [])]).toEqual([]);
  });

  it('for..of работает', () => {
    const collected = [];
    for (const v of makeIterable({}, [10, 20])) collected.push(v);
    expect(collected).toEqual([10, 20]);
  });

  it('повторный перебор начинается сначала', () => {
    const iter = makeIterable({}, [1, 2]);
    expect([...iter]).toEqual([1, 2]);
    expect([...iter]).toEqual([1, 2]);
  });

  it('оригинал не мутируется', () => {
    const orig = { a: 1 };
    makeIterable(orig, [1]);
    expect(orig[Symbol.iterator]).toBeUndefined();
  });

  it('Symbol.iterator — функция', () => {
    const iter = makeIterable({}, [1]);
    expect(typeof iter[Symbol.iterator]).toBe('function');
  });

  it('Array.from работает', () => {
    expect(Array.from(makeIterable({}, [5, 6]))).toEqual([5, 6]);
  });

  it('деструктуризация работает', () => {
    const [a, b] = makeIterable({}, [10, 20, 30]);
    expect(a).toBe(10);
    expect(b).toBe(20);
  });

  it('значения разных типов', () => {
    expect([...makeIterable({}, ['a', 1, true, null])]).toEqual(['a', 1, true, null]);
  });

  it('большой массив values', () => {
    const vals = Array.from({ length: 100 }, (_, i) => i);
    expect([...makeIterable({}, vals)]).toEqual(vals);
  });

  it('порядок значений сохраняется', () => {
    expect([...makeIterable({}, [3, 1, 2])]).toEqual([3, 1, 2]);
  });

  it('итератор вручную — next() и done', () => {
    const iter = makeIterable({}, [42])[Symbol.iterator]();
    const first = iter.next();
    expect(first.value).toBe(42);
    expect(first.done).toBe(false);
    const second = iter.next();
    expect(second.done).toBe(true);
  });

  it('несколько свойств объекта не теряются', () => {
    const result = makeIterable({ a: 1, b: 2, c: 3 }, []);
    expect(result.a).toBe(1);
    expect(result.b).toBe(2);
    expect(result.c).toBe(3);
  });
});
`,
    rank: 3,
    tags: ["symbol", "iterator", "protocol"],
  }),
];

// ---------------------------------------------------------------------------
// BigInt
// ---------------------------------------------------------------------------

export const bigintChallenges: ChallengeDefinition[] = [
  createDataTypeChallenge({
    id: "data-types-big-add",
    title: "Сложение больших чисел",
    description: `У обычных чисел в JS есть потолок: \`Number.MAX_SAFE_INTEGER\` = 9007199254740991. Выше — математика ломается:

\`\`\`js
9007199254740992 + 1 // 9007199254740992 (!) — тот же ответ
9007199254740992 + 2 // 9007199254740994 — прыгнул через одно
\`\`\`

BigInt это чинит. Добавь суффикс \`n\` или используй \`BigInt(строка)\`:

\`\`\`js
BigInt('9007199254740993') + 1n // 9007199254740994n — верно!
String(100n)                    // '100' — без суффикса
\`\`\`

**Что написать.** Функцию \`bigAdd(a, b)\` — принимает две строки с большими числами, возвращает их сумму как строку.

## Требования

1. Конвертируй строки в BigInt через \`BigInt(a)\`.
2. Сложи и верни \`String(результат)\`.
3. Экспортируй функцию \`bigAdd\`.

## Примеры

\`bigAdd('9007199254740993', '1')\` → \`'9007199254740994'\`

\`bigAdd('0', '0')\` → \`'0'\`

\`bigAdd('-5', '10')\` → \`'5'\``,
    starter: `export function bigAdd(a, b) {
  // BigInt(a) + BigInt(b), верни строку
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { bigAdd } from './index.js';

describe('bigAdd', () => {
  it('складывает большие числа', () => {
    expect(bigAdd('9007199254740993', '1')).toBe('9007199254740994');
  });

  it('ноль плюс ноль', () => {
    expect(bigAdd('0', '0')).toBe('0');
  });

  it('отрицательное и положительное', () => {
    expect(bigAdd('-5', '10')).toBe('5');
  });

  it('возвращает строку', () => {
    expect(typeof bigAdd('1', '2')).toBe('string');
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { bigAdd } from './index.js';

describe('bigAdd', () => {
  it('складывает большие числа', () => {
    expect(bigAdd('9007199254740993', '1')).toBe('9007199254740994');
  });

  it('ноль плюс ноль', () => {
    expect(bigAdd('0', '0')).toBe('0');
  });

  it('отрицательное и положительное', () => {
    expect(bigAdd('-5', '10')).toBe('5');
  });

  it('возвращает строку', () => {
    expect(typeof bigAdd('1', '2')).toBe('string');
  });

  it('маленькие числа тоже работают', () => {
    expect(bigAdd('2', '3')).toBe('5');
  });

  it('оба отрицательных', () => {
    expect(bigAdd('-10', '-20')).toBe('-30');
  });

  it('очень большие числа (20+ цифр)', () => {
    expect(bigAdd('99999999999999999999', '1')).toBe('100000000000000000000');
  });

  it('результат не содержит суффикс n', () => {
    expect(bigAdd('1', '1').includes('n')).toBe(false);
  });
});
`,
    rank: 1,
    tags: ["bigint", "arithmetic"],
  }),
  createDataTypeChallenge({
    id: "data-types-big-factorial",
    title: "Факториал через BigInt",
    description: `Обычный Number-факториал ломается быстро:

\`\`\`js
let f = 1;
for (let i = 2; i <= 170; i++) f *= i;
// При i = 171 получаем Infinity
\`\`\`

BigInt не имеет такого ограничения — умножай хоть до 1000!:

\`\`\`js
let f = 1n;
for (let i = 2n; i <= 5n; i++) f *= i;
// f === 120n
\`\`\`

**Одна хитрость.** BigInt нельзя смешивать с Number напрямую: \`2n * 3\` выбросит TypeError. Либо всё BigInt, либо конвертируй через \`BigInt(n)\`.

**Что написать.** Функцию \`bigFactorial(n)\`, которая считает \`n!\` через BigInt и возвращает результат как строку.

## Требования

1. \`0! = 1\` и \`1! = 1\`.
2. Используй BigInt-умножение в цикле.
3. Верни \`String(результат)\`.
4. Экспортируй функцию \`bigFactorial\`.

## Примеры

\`bigFactorial(0)\` → \`'1'\`

\`bigFactorial(5)\` → \`'120'\`

\`bigFactorial(20)\` → \`'2432902008176640000'\``,
    starter: `export function bigFactorial(n) {
  // Цикл с BigInt-умножением, верни строку
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { bigFactorial } from './index.js';

describe('bigFactorial', () => {
  it('0! = 1', () => {
    expect(bigFactorial(0)).toBe('1');
  });

  it('1! = 1', () => {
    expect(bigFactorial(1)).toBe('1');
  });

  it('5! = 120', () => {
    expect(bigFactorial(5)).toBe('120');
  });

  it('10! = 3628800', () => {
    expect(bigFactorial(10)).toBe('3628800');
  });

  it('20! корректен', () => {
    expect(bigFactorial(20)).toBe('2432902008176640000');
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { bigFactorial } from './index.js';

describe('bigFactorial', () => {
  it('0! = 1', () => {
    expect(bigFactorial(0)).toBe('1');
  });

  it('1! = 1', () => {
    expect(bigFactorial(1)).toBe('1');
  });

  it('2! = 2', () => {
    expect(bigFactorial(2)).toBe('2');
  });

  it('3! = 6', () => {
    expect(bigFactorial(3)).toBe('6');
  });

  it('5! = 120', () => {
    expect(bigFactorial(5)).toBe('120');
  });

  it('10! = 3628800', () => {
    expect(bigFactorial(10)).toBe('3628800');
  });

  it('13! = 6227020800', () => {
    expect(bigFactorial(13)).toBe('6227020800');
  });

  it('20! корректен', () => {
    expect(bigFactorial(20)).toBe('2432902008176640000');
  });

  it('50! — очень длинное число', () => {
    const result = bigFactorial(50);
    expect(result).toBe('30414093201713378043612608166064768844377641568960512000000000000');
  });

  it('возвращает строку', () => {
    expect(typeof bigFactorial(5)).toBe('string');
  });

  it('результат не содержит n', () => {
    expect(bigFactorial(10).includes('n')).toBe(false);
  });
});
`,
    rank: 2,
    tags: ["bigint", "factorial", "loop"],
  }),
];

// ---------------------------------------------------------------------------
// Type Coercion
// ---------------------------------------------------------------------------

export const coercionChallenges: ChallengeDefinition[] = [
  createDataTypeChallenge({
    id: "data-types-truthy-count",
    title: "Подсчёт truthy",
    description: `В JS любое значение можно привести к boolean. Есть ровно 8 «falsy»-значений — всё остальное «truthy»:

\`\`\`js
Boolean(0)         // false
Boolean('')        // false
Boolean(null)      // false
Boolean(undefined) // false
Boolean(NaN)       // false
Boolean(false)     // false
Boolean(0n)        // false — BigInt-ноль тоже falsy
Boolean(-0)        // false — да, минус ноль существует

Boolean([])        // true — пустой массив truthy!
Boolean({})        // true — пустой объект тоже!
Boolean('0')       // true — строка '0' не пустая!
\`\`\`

**Хитрость.** Новички часто думают, что \`[]\` и \`{}\` falsy, потому что «пустые». Нет — falsy только 8 конкретных значений, остальное truthy.

**Что написать.** Функцию \`truthyCount(arr)\`, которая считает количество truthy-элементов в массиве.

## Требования

1. Truthy — значение, для которого \`Boolean(val) === true\`.
2. Верни количество как число.
3. Экспортируй функцию \`truthyCount\`.

## Примеры

\`truthyCount([1, 0, '', 'hello'])\` → \`2\`

\`truthyCount([null, undefined, NaN])\` → \`0\`

\`truthyCount([[], {}, false])\` → \`2\``,
    starter: `export function truthyCount(arr) {
  // Посчитай элементы, где Boolean(val) === true
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { truthyCount } from './index.js';

describe('truthyCount', () => {
  it('смешанный массив', () => {
    expect(truthyCount([1, 0, '', 'hello'])).toBe(2);
  });

  it('все falsy', () => {
    expect(truthyCount([null, undefined, NaN])).toBe(0);
  });

  it('пустой массив и объект — truthy', () => {
    expect(truthyCount([[], {}, false])).toBe(2);
  });

  it('пустой массив — ноль', () => {
    expect(truthyCount([])).toBe(0);
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { truthyCount } from './index.js';

describe('truthyCount', () => {
  it('смешанный массив', () => {
    expect(truthyCount([1, 0, '', 'hello'])).toBe(2);
  });

  it('все falsy', () => {
    expect(truthyCount([null, undefined, NaN])).toBe(0);
  });

  it('пустой массив и объект — truthy', () => {
    expect(truthyCount([[], {}, false])).toBe(2);
  });

  it('пустой массив — ноль', () => {
    expect(truthyCount([])).toBe(0);
  });

  it('-0 falsy', () => {
    expect(truthyCount([-0, 1])).toBe(1);
  });

  it('строка "0" truthy', () => {
    expect(truthyCount(['0', ''])).toBe(1);
  });

  it('строка "false" truthy', () => {
    expect(truthyCount(['false', false])).toBe(1);
  });

  it('все truthy', () => {
    expect(truthyCount([1, 'a', true, [], {}])).toBe(5);
  });

  it('пробел — truthy строка', () => {
    expect(truthyCount([' ', '\\t'])).toBe(2);
  });
});
`,
    rank: 1,
    tags: ["coercion", "boolean", "truthy"],
  }),
  createDataTypeChallenge({
    id: "data-types-object-is",
    title: "Полифил Object.is",
    description: `\`===\` — строгое сравнение. Но даже у него есть два квирка:

\`\`\`js
NaN === NaN   // false — единственное значение, не равное самому себе!
+0 === -0     // true  — но это разные штуки (1/+0 = Infinity, 1/-0 = -Infinity)
\`\`\`

\`Object.is()\` исправляет оба:

\`\`\`js
Object.is(NaN, NaN) // true
Object.is(+0, -0)   // false
Object.is(1, 1)     // true — в остальном как ===
\`\`\`

**Как детектить?** \`NaN !== NaN\` всегда true — значит, если \`a !== a\` и \`b !== b\`, оба NaN. Для \`-0\`: деление \`1/0 === Infinity\`, а \`1/(-0) === -Infinity\`.

**Что написать.** Функцию \`objectIs(a, b)\` — полифил \`Object.is\` без использования самого \`Object.is\`.

## Требования

1. \`NaN\` равен \`NaN\`.
2. \`+0\` НЕ равен \`-0\`.
3. Всё остальное — как \`===\`.
4. Не используй \`Object.is\`.
5. Экспортируй функцию \`objectIs\`.

## Примеры

\`objectIs(NaN, NaN)\` → \`true\`

\`objectIs(0, -0)\` → \`false\`

\`objectIs(1, 1)\` → \`true\`

\`objectIs('a', 'a')\` → \`true\`

\`objectIs(null, undefined)\` → \`false\``,
    starter: `export function objectIs(a, b) {
  // Обработай NaN и -0 отдельно, остальное — ===
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { objectIs } from './index.js';

describe('objectIs', () => {
  it('NaN равен NaN', () => {
    expect(objectIs(NaN, NaN)).toBe(true);
  });

  it('+0 не равен -0', () => {
    expect(objectIs(0, -0)).toBe(false);
  });

  it('одинаковые числа равны', () => {
    expect(objectIs(1, 1)).toBe(true);
  });

  it('одинаковые строки равны', () => {
    expect(objectIs('a', 'a')).toBe(true);
  });

  it('null не равен undefined', () => {
    expect(objectIs(null, undefined)).toBe(false);
  });

  it('null равен null', () => {
    expect(objectIs(null, null)).toBe(true);
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { objectIs } from './index.js';

describe('objectIs', () => {
  it('NaN равен NaN', () => {
    expect(objectIs(NaN, NaN)).toBe(true);
  });

  it('+0 не равен -0', () => {
    expect(objectIs(0, -0)).toBe(false);
  });

  it('одинаковые числа равны', () => {
    expect(objectIs(1, 1)).toBe(true);
  });

  it('одинаковые строки равны', () => {
    expect(objectIs('a', 'a')).toBe(true);
  });

  it('null не равен undefined', () => {
    expect(objectIs(null, undefined)).toBe(false);
  });

  it('null равен null', () => {
    expect(objectIs(null, null)).toBe(true);
  });

  it('undefined равен undefined', () => {
    expect(objectIs(undefined, undefined)).toBe(true);
  });

  it('-0 равен -0', () => {
    expect(objectIs(-0, -0)).toBe(true);
  });

  it('+0 равен +0', () => {
    expect(objectIs(0, 0)).toBe(true);
  });

  it('true не равен false', () => {
    expect(objectIs(true, false)).toBe(false);
  });

  it('Infinity равен Infinity', () => {
    expect(objectIs(Infinity, Infinity)).toBe(true);
  });

  it('Infinity не равен -Infinity', () => {
    expect(objectIs(Infinity, -Infinity)).toBe(false);
  });

  it('разные объекты не равны', () => {
    expect(objectIs({}, {})).toBe(false);
  });

  it('один и тот же объект равен себе', () => {
    const obj = {};
    expect(objectIs(obj, obj)).toBe(true);
  });
});
`,
    rank: 2,
    tags: ["coercion", "comparison", "polyfill"],
  }),
  createDataTypeChallenge({
    id: "data-types-parse-form-values",
    title: "Разбор формы",
    description: `HTML-формы всегда возвращают строки. \`input.value\` — это \`'25'\`, не \`25\`. Если бэкенд получает \`{ age: '25', active: 'true', score: 'null' }\` — нужно привести значения к правильным JS-типам.

\`\`\`js
Number('25')      // 25 — можно конвертировать
Number('')        // 0  — ловушка! Пустая строка даёт ноль
Number('hello')   // NaN — не число
\`\`\`

**Хитрость.** Пустую строку нельзя превращать в \`0\` — это не число, это «пользователь ничего не ввёл». А \`'Infinity'\` лучше оставить строкой.

**Что написать.** Функцию \`parseFormValues(obj)\` — принимает объект со строковыми значениями, возвращает новый объект с приведёнными типами.

## Требования

1. \`'null'\` → \`null\`.
2. \`'undefined'\` → \`undefined\`.
3. \`'true'\` → \`true\`, \`'false'\` → \`false\`.
4. Числовые строки → число (через \`Number()\`), но только если строка не пустая, не состоит из пробелов и результат конечен (\`isFinite\`).
5. Всё остальное — оставь строкой.
6. Исходный объект не мутируй.
7. Экспортируй функцию \`parseFormValues\`.

## Примеры

\`parseFormValues({ age: '25' })\` → \`{ age: 25 }\`

\`parseFormValues({ ok: 'true' })\` → \`{ ok: true }\`

\`parseFormValues({ x: 'null' })\` → \`{ x: null }\`

\`parseFormValues({ s: 'hello' })\` → \`{ s: 'hello' }\`

\`parseFormValues({ e: '' })\` → \`{ e: '' }\``,
    starter: `export function parseFormValues(obj) {
  // Пройдись по ключам, приведи строковые значения к нужным типам
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { parseFormValues } from './index.js';

describe('parseFormValues', () => {
  it('числовая строка → число', () => {
    expect(parseFormValues({ age: '25' })).toEqual({ age: 25 });
  });

  it('"true" → true', () => {
    expect(parseFormValues({ ok: 'true' })).toEqual({ ok: true });
  });

  it('"false" → false', () => {
    expect(parseFormValues({ ok: 'false' })).toEqual({ ok: false });
  });

  it('"null" → null', () => {
    expect(parseFormValues({ x: 'null' })).toEqual({ x: null });
  });

  it('обычная строка без изменений', () => {
    expect(parseFormValues({ s: 'hello' })).toEqual({ s: 'hello' });
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { parseFormValues } from './index.js';

describe('parseFormValues', () => {
  it('числовая строка → число', () => {
    expect(parseFormValues({ age: '25' })).toEqual({ age: 25 });
  });

  it('"true" → true', () => {
    expect(parseFormValues({ ok: 'true' })).toEqual({ ok: true });
  });

  it('"false" → false', () => {
    expect(parseFormValues({ ok: 'false' })).toEqual({ ok: false });
  });

  it('"null" → null', () => {
    expect(parseFormValues({ x: 'null' })).toEqual({ x: null });
  });

  it('"undefined" → undefined', () => {
    const result = parseFormValues({ x: 'undefined' });
    expect(result.x).toBeUndefined();
  });

  it('обычная строка без изменений', () => {
    expect(parseFormValues({ s: 'hello' })).toEqual({ s: 'hello' });
  });

  it('пустая строка остаётся строкой', () => {
    expect(parseFormValues({ e: '' })).toEqual({ e: '' });
  });

  it('пробельная строка остаётся строкой', () => {
    expect(parseFormValues({ s: '  ' })).toEqual({ s: '  ' });
  });

  it('"0" → 0', () => {
    expect(parseFormValues({ n: '0' })).toEqual({ n: 0 });
  });

  it('отрицательное дробное число', () => {
    expect(parseFormValues({ n: '-3.14' })).toEqual({ n: -3.14 });
  });

  it('"Infinity" остаётся строкой', () => {
    expect(parseFormValues({ n: 'Infinity' })).toEqual({ n: 'Infinity' });
  });

  it('"NaN" остаётся строкой', () => {
    expect(parseFormValues({ n: 'NaN' })).toEqual({ n: 'NaN' });
  });

  it('не мутирует оригинал', () => {
    const orig = { a: '1' };
    parseFormValues(orig);
    expect(orig.a).toBe('1');
  });

  it('несколько ключей сразу', () => {
    expect(parseFormValues({
      name: 'Аня',
      age: '25',
      active: 'true',
      score: 'null',
    })).toEqual({
      name: 'Аня',
      age: 25,
      active: true,
      score: null,
    });
  });
});
`,
    rank: 2,
    tags: ["coercion", "parsing", "form"],
  }),
];
