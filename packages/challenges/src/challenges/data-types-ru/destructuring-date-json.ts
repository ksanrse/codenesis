import { getChallengePoints } from "../../ranking.ts";
import type { ChallengeDefinition, ChallengeFile } from "../../types.ts";

interface DataTypesChallengeConfig {
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

function createDataTypesChallenge(config: DataTypesChallengeConfig): ChallengeDefinition {
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

export const destructuringChallenges: ChallengeDefinition[] = [
  createDataTypesChallenge({
    id: "data-types-destructuring-swap",
    title: "Поменять местами через массив",
    description: `Представь: у тебя две переменные, и ты хочешь поменять их значения. Раньше для этого нужна была временная переменная — \`tmp = a; a = b; b = tmp\`. С деструктуризацией массива всё гораздо короче.

\`\`\`js
let a = 1, b = 2;
[a, b] = [b, a];
// теперь a = 2, b = 1
\`\`\`

Ловушка тут такая: если забудешь квадратные скобки слева, никакого обмена не произойдёт — будет просто присваивание массива в одну переменную.

**Что написать.** Функцию \`swap(a, b)\`, которая принимает два значения и возвращает массив \`[b, a]\` — то есть с переставленными местами элементами. Можно через возврат литерала, можно через деструктуризацию во временный массив — главное, чтобы порядок был обратным.

## Требования

1. Верни массив из двух элементов.
2. Первым элементом должен быть второй аргумент, вторым — первый.
3. Не мутируй ничего — просто верни новый массив.
4. Экспортируй функцию \`swap\`.

## Примеры

\`swap(1, 2)\` → \`[2, 1]\`

\`swap('a', 'b')\` → \`['b', 'a']\`

\`swap(null, undefined)\` → \`[undefined, null]\``,
    rank: 1,
    tags: ["destructuring"],
    starter: `export function swap(a, b) {
  // Верни [b, a]
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { swap } from './index.js';

describe('swap', () => {
  it('swaps two numbers', () => {
    expect(swap(1, 2)).toEqual([2, 1]);
  });

  it('swaps two strings', () => {
    expect(swap('a', 'b')).toEqual(['b', 'a']);
  });

  it('handles null and undefined', () => {
    expect(swap(null, undefined)).toEqual([undefined, null]);
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { swap } from './index.js';

describe('swap', () => {
  it('swaps two numbers', () => {
    expect(swap(1, 2)).toEqual([2, 1]);
  });

  it('swaps two strings', () => {
    expect(swap('a', 'b')).toEqual(['b', 'a']);
  });

  it('handles null and undefined', () => {
    expect(swap(null, undefined)).toEqual([undefined, null]);
  });

  it('preserves object references', () => {
    const obj = { x: 1 };
    const arr = [1, 2];
    const result = swap(obj, arr);
    expect(result[0]).toBe(arr);
    expect(result[1]).toBe(obj);
  });

  it('returns a new array each call', () => {
    const a = swap(1, 2);
    const b = swap(1, 2);
    expect(a).not.toBe(b);
    expect(a).toEqual(b);
  });
});
`,
  }),
  createDataTypesChallenge({
    id: "data-types-destructuring-head-tail",
    title: "Голова и хвост массива",
    description: `Часто нужно отделить первый элемент массива от всех остальных — это классика рекурсивных алгоритмов и обработки списков. Деструктуризация с rest-оператором делает это в одну строку.

\`\`\`js
const [first, ...others] = [1, 2, 3, 4];
// first = 1, others = [2, 3, 4]
\`\`\`

Ловушка: если массив пустой, \`first\` станет \`undefined\`, а \`others\` — пустым массивом. Это нормально, не нужно специально проверять длину.

**Что написать.** Функцию \`headTail(arr)\`, которая возвращает объект \`{ head, tail }\`. \`head\` — это первый элемент, \`tail\` — массив со всеми остальными. Используй именно деструктуризацию с rest, а не \`arr[0]\` и \`arr.slice(1)\`.

## Требования

1. Верни объект с полями \`head\` и \`tail\`.
2. \`head\` равен первому элементу массива (или \`undefined\` для пустого).
3. \`tail\` всегда массив, для пустого входа — пустой массив.
4. Используй \`[head, ...tail]\` деструктуризацию.
5. Экспортируй функцию \`headTail\`.

## Примеры

\`headTail([1, 2, 3])\` → \`{ head: 1, tail: [2, 3] }\`

\`headTail(['a'])\` → \`{ head: 'a', tail: [] }\`

\`headTail([])\` → \`{ head: undefined, tail: [] }\``,
    rank: 1,
    tags: ["destructuring"],
    starter: `export function headTail(arr) {
  // Используй [head, ...tail]
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { headTail } from './index.js';

describe('headTail', () => {
  it('splits a typical array', () => {
    expect(headTail([1, 2, 3])).toEqual({ head: 1, tail: [2, 3] });
  });

  it('handles a single-element array', () => {
    expect(headTail(['a'])).toEqual({ head: 'a', tail: [] });
  });

  it('handles an empty array', () => {
    expect(headTail([])).toEqual({ head: undefined, tail: [] });
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { headTail } from './index.js';

describe('headTail', () => {
  it('splits a typical array', () => {
    expect(headTail([1, 2, 3])).toEqual({ head: 1, tail: [2, 3] });
  });

  it('handles a single-element array', () => {
    expect(headTail(['a'])).toEqual({ head: 'a', tail: [] });
  });

  it('handles an empty array', () => {
    expect(headTail([])).toEqual({ head: undefined, tail: [] });
  });

  it('preserves element types in tail', () => {
    expect(headTail([1, 'two', null, { x: 1 }])).toEqual({
      head: 1,
      tail: ['two', null, { x: 1 }],
    });
  });

  it('does not mutate the input array', () => {
    const input = [1, 2, 3];
    headTail(input);
    expect(input).toEqual([1, 2, 3]);
  });
});
`,
  }),
  createDataTypesChallenge({
    id: "data-types-destructuring-defaults",
    title: "Заполнить пробелы значениями по умолчанию",
    description: `Бывает: в функцию приходит объект с пользовательскими настройками, а у тебя есть набор значений по умолчанию. Нужно слить их так, чтобы то, что задал пользователь, осталось, а недостающие поля заполнились дефолтами.

\`\`\`js
const defaults = { color: 'red', size: 10 };
const opts = { size: 20 };
const merged = { ...defaults, ...opts };
// { color: 'red', size: 20 }
\`\`\`

Ловушка: порядок спреда важен. Если поставить \`opts\` первым, дефолты затрут пользовательские значения. Запомни: то, что хочешь сохранить — спредь последним.

**Что написать.** Функцию \`applyDefaults(opts, defaults)\`, которая возвращает новый объект. Поля из \`opts\` имеют приоритет, недостающие берутся из \`defaults\`.

## Требования

1. Верни новый объект, не мутируй \`opts\` и \`defaults\`.
2. Поля из \`opts\` побеждают одноимённые поля \`defaults\`.
3. Все поля \`defaults\`, которых нет в \`opts\`, должны попасть в результат.
4. Используй спред-оператор и/или деструктуризацию.
5. Экспортируй функцию \`applyDefaults\`.

## Примеры

\`applyDefaults({ size: 20 }, { color: 'red', size: 10 })\` → \`{ color: 'red', size: 20 }\`

\`applyDefaults({}, { a: 1 })\` → \`{ a: 1 }\`

\`applyDefaults({ a: 2 }, { a: 1, b: 3 })\` → \`{ a: 2, b: 3 }\``,
    rank: 2,
    tags: ["destructuring"],
    starter: `export function applyDefaults(opts, defaults) {
  // Слить через спред: defaults сначала, opts сверху
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { applyDefaults } from './index.js';

describe('applyDefaults', () => {
  it('keeps user options over defaults', () => {
    expect(applyDefaults({ size: 20 }, { color: 'red', size: 10 })).toEqual({
      color: 'red',
      size: 20,
    });
  });

  it('uses defaults for missing keys', () => {
    expect(applyDefaults({}, { a: 1 })).toEqual({ a: 1 });
  });

  it('keeps unique keys from both objects', () => {
    expect(applyDefaults({ a: 2 }, { a: 1, b: 3 })).toEqual({ a: 2, b: 3 });
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { applyDefaults } from './index.js';

describe('applyDefaults', () => {
  it('keeps user options over defaults', () => {
    expect(applyDefaults({ size: 20 }, { color: 'red', size: 10 })).toEqual({
      color: 'red',
      size: 20,
    });
  });

  it('uses defaults for missing keys', () => {
    expect(applyDefaults({}, { a: 1 })).toEqual({ a: 1 });
  });

  it('keeps unique keys from both objects', () => {
    expect(applyDefaults({ a: 2 }, { a: 1, b: 3 })).toEqual({ a: 2, b: 3 });
  });

  it('does not mutate inputs', () => {
    const opts = { x: 1 };
    const defaults = { x: 0, y: 2 };
    applyDefaults(opts, defaults);
    expect(opts).toEqual({ x: 1 });
    expect(defaults).toEqual({ x: 0, y: 2 });
  });

  it('returns a new object', () => {
    const opts = { a: 1 };
    const result = applyDefaults(opts, { b: 2 });
    expect(result).not.toBe(opts);
  });
});
`,
  }),
  createDataTypesChallenge({
    id: "data-types-destructuring-rename",
    title: "Переименовать при разборе объекта",
    description: `В деструктуризации можно не только вытащить поле, но и сразу дать ему другое имя. Это удобно, когда внешнее имя поля длинное или конфликтует с уже существующей переменной.

\`\`\`js
const user = { firstName: 'Ivan', lastName: 'Petrov' };
const { firstName: first, lastName: last } = user;
// first = 'Ivan', last = 'Petrov'
\`\`\`

Ловушка: синтаксис \`x: y\` тут читается наоборот по сравнению с литералом объекта. Слева — имя поля в объекте, справа — имя переменной, в которую кладём.

**Что написать.** Функцию \`extractName(user)\`, которая принимает объект с полями \`firstName\` и \`lastName\`, через деструктуризацию переименовывает их в \`first\` и \`last\`, и возвращает строку \`"\${first} \${last}"\`.

## Требования

1. Используй деструктуризацию с переименованием — \`{ firstName: first, lastName: last }\`.
2. Верни строку из имени и фамилии через пробел.
3. Не используй прямой доступ через \`user.firstName\` — должна быть именно деструктуризация.
4. Экспортируй функцию \`extractName\`.

## Примеры

\`extractName({ firstName: 'Ivan', lastName: 'Petrov' })\` → \`'Ivan Petrov'\`

\`extractName({ firstName: 'Anna', lastName: 'Smith' })\` → \`'Anna Smith'\``,
    rank: 2,
    tags: ["destructuring"],
    starter: `export function extractName(user) {
  // Деструктуризация с переименованием:
  // const { firstName: first, lastName: last } = user;
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { extractName } from './index.js';

describe('extractName', () => {
  it('builds a full name from first and last', () => {
    expect(extractName({ firstName: 'Ivan', lastName: 'Petrov' })).toBe('Ivan Petrov');
  });

  it('works with another pair of names', () => {
    expect(extractName({ firstName: 'Anna', lastName: 'Smith' })).toBe('Anna Smith');
  });

  it('joins with a single space', () => {
    const result = extractName({ firstName: 'A', lastName: 'B' });
    expect(result).toBe('A B');
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { extractName } from './index.js';

describe('extractName', () => {
  it('builds a full name from first and last', () => {
    expect(extractName({ firstName: 'Ivan', lastName: 'Petrov' })).toBe('Ivan Petrov');
  });

  it('works with another pair of names', () => {
    expect(extractName({ firstName: 'Anna', lastName: 'Smith' })).toBe('Anna Smith');
  });

  it('joins with a single space', () => {
    expect(extractName({ firstName: 'A', lastName: 'B' })).toBe('A B');
  });

  it('ignores extra fields on the user object', () => {
    expect(
      extractName({ firstName: 'Ivan', lastName: 'Petrov', age: 30, email: 'x@y.z' }),
    ).toBe('Ivan Petrov');
  });

  it('preserves whitespace inside the name parts', () => {
    expect(extractName({ firstName: 'Mary Jane', lastName: 'Watson' })).toBe(
      'Mary Jane Watson',
    );
  });
});
`,
  }),
];

export const dateChallenges: ChallengeDefinition[] = [
  createDataTypesChallenge({
    id: "data-types-date-format-iso",
    title: "Дата в формате YYYY-MM-DD",
    description: `Представь: тебе нужно показать дату в логе или в URL. Полный ISO-формат \`2024-03-15T00:00:00.000Z\` слишком длинный — обычно достаточно куска \`YYYY-MM-DD\`. Чтобы собрать его, надо взять год, месяц и число, а потом дополнить однозначные значения нулём слева.

\`\`\`js
const d = new Date('2024-03-05T00:00:00Z');
String(d.getUTCMonth() + 1).padStart(2, '0'); // '03'
\`\`\`

Ловушка: \`getUTCMonth\` возвращает месяцы от \`0\` до \`11\` — март это \`2\`, не \`3\`. Не забудь прибавить единицу. И ещё: используй UTC-методы, иначе результат будет зависеть от часового пояса машины.

**Что написать.** Функцию \`formatISODate(date)\`, которая принимает объект \`Date\` и возвращает строку вида \`'YYYY-MM-DD'\`. Используй \`getUTCFullYear\`, \`getUTCMonth\`, \`getUTCDate\` и \`padStart(2, '0')\`.

## Требования

1. Год — четыре цифры, месяц и число — по две, с ведущим нулём при необходимости.
2. Месяц — это \`getUTCMonth() + 1\`.
3. Используй только UTC-методы, не \`getMonth\`/\`getDate\`.
4. Разделитель — дефис.
5. Экспортируй функцию \`formatISODate\`.

## Примеры

\`formatISODate(new Date('2024-03-15T00:00:00Z'))\` → \`'2024-03-15'\`

\`formatISODate(new Date('2024-01-05T00:00:00Z'))\` → \`'2024-01-05'\`

\`formatISODate(new Date('1999-12-31T00:00:00Z'))\` → \`'1999-12-31'\``,
    rank: 1,
    tags: ["date"],
    starter: `export function formatISODate(date) {
  // getUTCFullYear, getUTCMonth + 1, getUTCDate
  // String(...).padStart(2, '0') для месяца и дня
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { formatISODate } from './index.js';

describe('formatISODate', () => {
  it('formats a typical date', () => {
    expect(formatISODate(new Date('2024-03-15T00:00:00Z'))).toBe('2024-03-15');
  });

  it('pads single-digit month and day', () => {
    expect(formatISODate(new Date('2024-01-05T00:00:00Z'))).toBe('2024-01-05');
  });

  it('handles last day of the year', () => {
    expect(formatISODate(new Date('1999-12-31T00:00:00Z'))).toBe('1999-12-31');
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { formatISODate } from './index.js';

describe('formatISODate', () => {
  it('formats a typical date', () => {
    expect(formatISODate(new Date('2024-03-15T00:00:00Z'))).toBe('2024-03-15');
  });

  it('pads single-digit month and day', () => {
    expect(formatISODate(new Date('2024-01-05T00:00:00Z'))).toBe('2024-01-05');
  });

  it('handles last day of the year', () => {
    expect(formatISODate(new Date('1999-12-31T00:00:00Z'))).toBe('1999-12-31');
  });

  it('handles first day of the year', () => {
    expect(formatISODate(new Date('2000-01-01T00:00:00Z'))).toBe('2000-01-01');
  });

  it('uses UTC accessors so timezone does not matter', () => {
    expect(formatISODate(new Date('2024-06-15T23:59:59Z'))).toBe('2024-06-15');
  });

  it('formats leap day correctly', () => {
    expect(formatISODate(new Date('2024-02-29T00:00:00Z'))).toBe('2024-02-29');
  });
});
`,
  }),
  createDataTypesChallenge({
    id: "data-types-date-add-days",
    title: "Прибавить дни к дате",
    description: `Бывает нужно посчитать "через 7 дней" или "5 дней назад". Ручная арифметика по миллисекундам — неудобно и ошибкоёмко: легко споткнуться на переходе на летнее время. Лучше использовать \`setUTCDate\` — он сам обработает переход через границу месяца и года.

\`\`\`js
const d = new Date('2024-03-15T00:00:00Z');
const copy = new Date(d);
copy.setUTCDate(copy.getUTCDate() + 7);
// 2024-03-22
\`\`\`

Ловушка: \`setUTCDate\` мутирует объект. Если просто вызвать его на пришедшей дате, ты испортишь данные у вызывающего кода. Всегда сначала копируй.

**Что написать.** Функцию \`addDays(date, n)\`, которая возвращает НОВЫЙ объект \`Date\` со сдвигом на \`n\` дней. \`n\` может быть отрицательным — тогда дата сдвигается назад. Исходный \`date\` не трогать.

## Требования

1. Возвращай новый \`Date\`, исходный не мутируй.
2. Используй \`setUTCDate\`, чтобы корректно проходить границы месяцев.
3. Поддержи отрицательный \`n\`.
4. Экспортируй функцию \`addDays\`.

## Примеры

\`addDays(new Date('2024-03-15T00:00:00Z'), 7)\` → \`Date '2024-03-22T00:00:00Z'\`

\`addDays(new Date('2024-03-01T00:00:00Z'), -1)\` → \`Date '2024-02-29T00:00:00Z'\`

\`addDays(new Date('2024-12-31T00:00:00Z'), 1)\` → \`Date '2025-01-01T00:00:00Z'\``,
    rank: 2,
    tags: ["date"],
    starter: `export function addDays(date, n) {
  // const copy = new Date(date);
  // copy.setUTCDate(copy.getUTCDate() + n);
  // return copy;
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { addDays } from './index.js';

describe('addDays', () => {
  it('adds days within the same month', () => {
    const result = addDays(new Date('2024-03-15T00:00:00Z'), 7);
    expect(result.toISOString()).toBe('2024-03-22T00:00:00.000Z');
  });

  it('subtracts days across a month boundary', () => {
    const result = addDays(new Date('2024-03-01T00:00:00Z'), -1);
    expect(result.toISOString()).toBe('2024-02-29T00:00:00.000Z');
  });

  it('crosses year boundary', () => {
    const result = addDays(new Date('2024-12-31T00:00:00Z'), 1);
    expect(result.toISOString()).toBe('2025-01-01T00:00:00.000Z');
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { addDays } from './index.js';

describe('addDays', () => {
  it('adds days within the same month', () => {
    const result = addDays(new Date('2024-03-15T00:00:00Z'), 7);
    expect(result.toISOString()).toBe('2024-03-22T00:00:00.000Z');
  });

  it('subtracts days across a month boundary', () => {
    const result = addDays(new Date('2024-03-01T00:00:00Z'), -1);
    expect(result.toISOString()).toBe('2024-02-29T00:00:00.000Z');
  });

  it('crosses year boundary', () => {
    const result = addDays(new Date('2024-12-31T00:00:00Z'), 1);
    expect(result.toISOString()).toBe('2025-01-01T00:00:00.000Z');
  });

  it('does not mutate the input date', () => {
    const input = new Date('2024-03-15T00:00:00Z');
    const before = input.toISOString();
    addDays(input, 30);
    expect(input.toISOString()).toBe(before);
  });

  it('returns a new Date instance', () => {
    const input = new Date('2024-03-15T00:00:00Z');
    const result = addDays(input, 1);
    expect(result).not.toBe(input);
    expect(result instanceof Date).toBe(true);
  });

  it('handles zero offset', () => {
    const input = new Date('2024-03-15T00:00:00Z');
    const result = addDays(input, 0);
    expect(result.toISOString()).toBe(input.toISOString());
  });
});
`,
  }),
  createDataTypesChallenge({
    id: "data-types-date-days-between",
    title: "Сколько дней между датами",
    description: `Тебе дали две даты, нужно сказать, сколько дней между ними. Это именно количество дней, без учёта порядка — то есть всегда положительное число. Идея простая: вычесть одно из другого, поделить на количество миллисекунд в дне, взять модуль и округлить.

\`\`\`js
const ms = Math.abs(a - b);
const days = Math.round(ms / (1000 * 60 * 60 * 24));
\`\`\`

Ловушка: оператор \`-\` на \`Date\` неявно приводит их к числам (миллисекундам с эпохи), и это нормально. А вот без \`Math.abs\` ты получишь отрицательное число, если первая дата позже второй.

**Что написать.** Функцию \`daysBetween(a, b)\`, которая возвращает целое неотрицательное число дней между двумя датами.

## Требования

1. Результат — целое число (используй \`Math.round\`).
2. Результат всегда \`>= 0\`, порядок аргументов не важен.
3. В одном дне \`1000 * 60 * 60 * 24\` миллисекунд.
4. Экспортируй функцию \`daysBetween\`.

## Примеры

\`daysBetween(new Date('2024-03-15T00:00:00Z'), new Date('2024-03-22T00:00:00Z'))\` → \`7\`

\`daysBetween(new Date('2024-03-22T00:00:00Z'), new Date('2024-03-15T00:00:00Z'))\` → \`7\`

\`daysBetween(new Date('2024-01-01T00:00:00Z'), new Date('2024-12-31T00:00:00Z'))\` → \`365\``,
    rank: 2,
    tags: ["date"],
    starter: `export function daysBetween(a, b) {
  // Math.abs(a - b) / (1000 * 60 * 60 * 24), затем Math.round
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { daysBetween } from './index.js';

describe('daysBetween', () => {
  it('counts days within a month', () => {
    expect(
      daysBetween(new Date('2024-03-15T00:00:00Z'), new Date('2024-03-22T00:00:00Z')),
    ).toBe(7);
  });

  it('is symmetric', () => {
    expect(
      daysBetween(new Date('2024-03-22T00:00:00Z'), new Date('2024-03-15T00:00:00Z')),
    ).toBe(7);
  });

  it('counts days across a leap year', () => {
    expect(
      daysBetween(new Date('2024-01-01T00:00:00Z'), new Date('2024-12-31T00:00:00Z')),
    ).toBe(365);
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { daysBetween } from './index.js';

describe('daysBetween', () => {
  it('counts days within a month', () => {
    expect(
      daysBetween(new Date('2024-03-15T00:00:00Z'), new Date('2024-03-22T00:00:00Z')),
    ).toBe(7);
  });

  it('is symmetric', () => {
    expect(
      daysBetween(new Date('2024-03-22T00:00:00Z'), new Date('2024-03-15T00:00:00Z')),
    ).toBe(7);
  });

  it('counts days across a leap year', () => {
    expect(
      daysBetween(new Date('2024-01-01T00:00:00Z'), new Date('2024-12-31T00:00:00Z')),
    ).toBe(365);
  });

  it('returns 0 for the same date', () => {
    const d = new Date('2024-06-15T00:00:00Z');
    expect(daysBetween(d, new Date(d))).toBe(0);
  });

  it('always returns a non-negative integer', () => {
    const result = daysBetween(
      new Date('2024-03-22T00:00:00Z'),
      new Date('2024-03-15T00:00:00Z'),
    );
    expect(Number.isInteger(result)).toBe(true);
    expect(result).toBeGreaterThanOrEqual(0);
  });

  it('handles a year boundary', () => {
    expect(
      daysBetween(new Date('2023-12-31T00:00:00Z'), new Date('2024-01-01T00:00:00Z')),
    ).toBe(1);
  });
});
`,
  }),
  createDataTypesChallenge({
    id: "data-types-date-is-weekend",
    title: "Это выходной?",
    description: `Календарная задача: сказать, попадает ли дата на выходной. У \`Date\` есть метод \`getUTCDay\` — он возвращает день недели от \`0\` до \`6\`, где \`0\` — воскресенье, а \`6\` — суббота.

\`\`\`js
new Date('2024-03-16T00:00:00Z').getUTCDay(); // 6 — суббота
new Date('2024-03-17T00:00:00Z').getUTCDay(); // 0 — воскресенье
\`\`\`

Ловушка: в некоторых странах неделя начинается с воскресенья, в других — с понедельника. Тут это не важно: нам нужны именно дни \`0\` и \`6\`. И снова используй UTC-метод, чтобы ответ не зависел от часового пояса машины.

**Что написать.** Функцию \`isWeekend(date)\`, которая возвращает \`true\` для субботы и воскресенья и \`false\` для остальных дней.

## Требования

1. Используй \`getUTCDay\`, не \`getDay\`.
2. Воскресенье — \`0\`, суббота — \`6\`.
3. Возвращай \`true\` или \`false\`, не \`1\`/\`0\`.
4. Экспортируй функцию \`isWeekend\`.

## Примеры

\`isWeekend(new Date('2024-03-16T00:00:00Z'))\` → \`true\` (суббота)

\`isWeekend(new Date('2024-03-17T00:00:00Z'))\` → \`true\` (воскресенье)

\`isWeekend(new Date('2024-03-18T00:00:00Z'))\` → \`false\` (понедельник)`,
    rank: 2,
    tags: ["date"],
    starter: `export function isWeekend(date) {
  // const day = date.getUTCDay();
  // return day === 0 || day === 6;
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { isWeekend } from './index.js';

describe('isWeekend', () => {
  it('returns true for Saturday', () => {
    expect(isWeekend(new Date('2024-03-16T00:00:00Z'))).toBe(true);
  });

  it('returns true for Sunday', () => {
    expect(isWeekend(new Date('2024-03-17T00:00:00Z'))).toBe(true);
  });

  it('returns false for Monday', () => {
    expect(isWeekend(new Date('2024-03-18T00:00:00Z'))).toBe(false);
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { isWeekend } from './index.js';

describe('isWeekend', () => {
  it('returns true for Saturday', () => {
    expect(isWeekend(new Date('2024-03-16T00:00:00Z'))).toBe(true);
  });

  it('returns true for Sunday', () => {
    expect(isWeekend(new Date('2024-03-17T00:00:00Z'))).toBe(true);
  });

  it('returns false for Monday', () => {
    expect(isWeekend(new Date('2024-03-18T00:00:00Z'))).toBe(false);
  });

  it('returns false for every weekday', () => {
    expect(isWeekend(new Date('2024-03-18T00:00:00Z'))).toBe(false);
    expect(isWeekend(new Date('2024-03-19T00:00:00Z'))).toBe(false);
    expect(isWeekend(new Date('2024-03-20T00:00:00Z'))).toBe(false);
    expect(isWeekend(new Date('2024-03-21T00:00:00Z'))).toBe(false);
    expect(isWeekend(new Date('2024-03-22T00:00:00Z'))).toBe(false);
  });

  it('returns a boolean, not a number', () => {
    const result = isWeekend(new Date('2024-03-16T00:00:00Z'));
    expect(typeof result).toBe('boolean');
  });
});
`,
  }),
];

export const jsonChallenges: ChallengeDefinition[] = [
  createDataTypesChallenge({
    id: "data-types-json-safe-parse",
    title: "Безопасный JSON.parse",
    description: `\`JSON.parse\` бросает \`SyntaxError\` на любой невалидной строке — даже на пустой. В реальном коде такое поведение постоянно ломает поток: данные пришли из \`localStorage\` или сетевого ответа, и кидать исключение каждый раз неудобно. Часто проще получить \`null\` и идти дальше.

\`\`\`js
try {
  return JSON.parse(s);
} catch {
  return null;
}
\`\`\`

Ловушка: не путай \`null\` (наш sentinel) и \`null\` как валидный результат разбора строки \`'null'\`. По контракту здесь \`safeJsonParse('null')\` тоже вернёт \`null\` — и это нормально, потому что строка \`'null'\` валидна.

**Что написать.** Функцию \`safeJsonParse(s)\`, которая возвращает результат \`JSON.parse\` или \`null\`, если разбор провалился.

## Требования

1. На валидной строке возвращай распарсенное значение.
2. На невалидной — возвращай \`null\`, не пробрасывай ошибку.
3. Используй \`try/catch\`.
4. Экспортируй функцию \`safeJsonParse\`.

## Примеры

\`safeJsonParse('{"a":1}')\` → \`{ a: 1 }\`

\`safeJsonParse('not json')\` → \`null\`

\`safeJsonParse('')\` → \`null\``,
    rank: 1,
    tags: ["json"],
    starter: `export function safeJsonParse(s) {
  // try { JSON.parse(s) } catch { null }
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { safeJsonParse } from './index.js';

describe('safeJsonParse', () => {
  it('parses valid JSON object', () => {
    expect(safeJsonParse('{"a":1}')).toEqual({ a: 1 });
  });

  it('returns null on invalid input', () => {
    expect(safeJsonParse('not json')).toBe(null);
  });

  it('returns null on empty string', () => {
    expect(safeJsonParse('')).toBe(null);
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { safeJsonParse } from './index.js';

describe('safeJsonParse', () => {
  it('parses valid JSON object', () => {
    expect(safeJsonParse('{"a":1}')).toEqual({ a: 1 });
  });

  it('parses valid JSON array', () => {
    expect(safeJsonParse('[1,2,3]')).toEqual([1, 2, 3]);
  });

  it('returns null on invalid input', () => {
    expect(safeJsonParse('not json')).toBe(null);
  });

  it('returns null on empty string', () => {
    expect(safeJsonParse('')).toBe(null);
  });

  it('parses primitive values', () => {
    expect(safeJsonParse('42')).toBe(42);
    expect(safeJsonParse('"hi"')).toBe('hi');
    expect(safeJsonParse('true')).toBe(true);
  });

  it('returns null on truncated JSON', () => {
    expect(safeJsonParse('{"a":')).toBe(null);
  });
});
`,
  }),
  createDataTypesChallenge({
    id: "data-types-json-deep-clone",
    title: "Глубокий клон через JSON",
    description: `Самый ленивый способ получить глубокую копию объекта — прогнать его через \`JSON.stringify\` и \`JSON.parse\`. Получится новое дерево, не связанное с исходным.

\`\`\`js
const copy = JSON.parse(JSON.stringify(obj));
\`\`\`

Ловушка большая: этот трюк работает только для JSON-совместимых данных. Функции, \`undefined\`, \`Symbol\` и циклические ссылки он либо съест, либо упадёт. \`Date\` превратится в строку. Для настоящего глубокого клона объектов с такими типами нужен \`structuredClone\`. Но для обычных DTO с числами, строками, массивами и вложенными объектами JSON-трюк работает быстро и в одну строку.

**Что написать.** Функцию \`deepCloneJson(obj)\`, которая возвращает копию через \`JSON.parse(JSON.stringify(obj))\`.

## Требования

1. Используй \`JSON.parse\` и \`JSON.stringify\`.
2. Возвращаемый объект не должен быть тем же \`obj\` (\`!== obj\`).
3. Вложенные объекты тоже копируются — изменения копии не должны менять оригинал.
4. Экспортируй функцию \`deepCloneJson\`.

## Примеры

\`deepCloneJson({ a: 1 })\` → новый объект \`{ a: 1 }\`

\`deepCloneJson({ a: { b: 2 } }).a\` !== оригинальный \`obj.a\``,
    rank: 2,
    tags: ["json"],
    starter: `export function deepCloneJson(obj) {
  // JSON.parse(JSON.stringify(obj))
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { deepCloneJson } from './index.js';

describe('deepCloneJson', () => {
  it('clones a flat object', () => {
    const obj = { a: 1, b: 'two' };
    const clone = deepCloneJson(obj);
    expect(clone).toEqual(obj);
    expect(clone).not.toBe(obj);
  });

  it('clones nested objects deeply', () => {
    const obj = { a: { b: 2 } };
    const clone = deepCloneJson(obj);
    expect(clone.a).not.toBe(obj.a);
    expect(clone.a).toEqual({ b: 2 });
  });

  it('clones arrays', () => {
    const arr = [1, [2, 3]];
    const clone = deepCloneJson(arr);
    expect(clone).toEqual(arr);
    expect(clone).not.toBe(arr);
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { deepCloneJson } from './index.js';

describe('deepCloneJson', () => {
  it('clones a flat object', () => {
    const obj = { a: 1, b: 'two' };
    const clone = deepCloneJson(obj);
    expect(clone).toEqual(obj);
    expect(clone).not.toBe(obj);
  });

  it('clones nested objects deeply', () => {
    const obj = { a: { b: 2 } };
    const clone = deepCloneJson(obj);
    expect(clone.a).not.toBe(obj.a);
    expect(clone.a).toEqual({ b: 2 });
  });

  it('clones arrays', () => {
    const arr = [1, [2, 3]];
    const clone = deepCloneJson(arr);
    expect(clone).toEqual(arr);
    expect(clone).not.toBe(arr);
  });

  it('mutating the clone does not change the original', () => {
    const obj = { list: [1, 2, 3] };
    const clone = deepCloneJson(obj);
    clone.list.push(4);
    expect(obj.list).toEqual([1, 2, 3]);
  });

  it('clones primitive top-level values', () => {
    expect(deepCloneJson(42)).toBe(42);
    expect(deepCloneJson('hello')).toBe('hello');
    expect(deepCloneJson(null)).toBe(null);
  });
});
`,
  }),
  createDataTypesChallenge({
    id: "data-types-json-stringify-pretty",
    title: "Красиво форматированный JSON",
    description: `\`JSON.stringify(obj)\` без аргументов выдаёт строку в одну строчку — машинам нормально, человеку читать сложно. У метода есть третий параметр \`space\`: число пробелов отступа или строка-разделитель.

\`\`\`js
JSON.stringify({ a: 1, b: { c: 2 } }, null, 2);
// {
//   "a": 1,
//   "b": {
//     "c": 2
//   }
// }
\`\`\`

Ловушка: второй параметр \`replacer\` тут \`null\`. Если случайно передать туда что-то другое, поведение поменяется. И второе: \`space\` ограничен десятью пробелами — больше JS просто проигнорирует.

**Что написать.** Функцию \`stringifyPretty(obj, indent = 2)\`, которая возвращает форматированную JSON-строку с отступом \`indent\` пробелов.

## Требования

1. Используй \`JSON.stringify\` с третьим аргументом.
2. Параметр \`indent\` имеет значение по умолчанию \`2\`.
3. Второй аргумент (\`replacer\`) равен \`null\`.
4. Экспортируй функцию \`stringifyPretty\`.

## Примеры

\`stringifyPretty({ a: 1 })\` → \`'{\\n  "a": 1\\n}'\`

\`stringifyPretty({ a: 1 }, 4)\` → отступ 4 пробела

\`stringifyPretty([1, 2])\` → \`'[\\n  1,\\n  2\\n]'\``,
    rank: 2,
    tags: ["json"],
    starter: `export function stringifyPretty(obj, indent = 2) {
  // JSON.stringify(obj, null, indent)
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { stringifyPretty } from './index.js';

describe('stringifyPretty', () => {
  it('uses two spaces by default', () => {
    expect(stringifyPretty({ a: 1 })).toBe('{\\n  "a": 1\\n}');
  });

  it('respects a custom indent', () => {
    expect(stringifyPretty({ a: 1 }, 4)).toBe('{\\n    "a": 1\\n}');
  });

  it('formats arrays', () => {
    expect(stringifyPretty([1, 2])).toBe('[\\n  1,\\n  2\\n]');
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { stringifyPretty } from './index.js';

describe('stringifyPretty', () => {
  it('uses two spaces by default', () => {
    expect(stringifyPretty({ a: 1 })).toBe('{\\n  "a": 1\\n}');
  });

  it('respects a custom indent', () => {
    expect(stringifyPretty({ a: 1 }, 4)).toBe('{\\n    "a": 1\\n}');
  });

  it('formats arrays', () => {
    expect(stringifyPretty([1, 2])).toBe('[\\n  1,\\n  2\\n]');
  });

  it('formats nested objects', () => {
    const result = stringifyPretty({ a: { b: 2 } });
    expect(result).toBe('{\\n  "a": {\\n    "b": 2\\n  }\\n}');
  });

  it('produces valid JSON that round-trips', () => {
    const original = { name: 'Ivan', tags: ['a', 'b'], nested: { n: 1 } };
    const text = stringifyPretty(original);
    expect(JSON.parse(text)).toEqual(original);
  });

  it('uses null replacer (does not skip values)', () => {
    const text = stringifyPretty({ a: 1, b: 2 });
    expect(text.includes('"a"')).toBe(true);
    expect(text.includes('"b"')).toBe(true);
  });
});
`,
  }),
  createDataTypesChallenge({
    id: "data-types-json-omit-fields",
    title: "JSON без секретных полей",
    description: `Когда сериализуешь объект для лога или ответа клиенту, иногда часть полей нельзя показывать — пароли, токены, внутренние идентификаторы. У \`JSON.stringify\` есть второй параметр \`replacer\` — функция \`(key, value)\`, которая решает, что попадёт в результат. Возврат \`undefined\` из replacer выкидывает поле.

\`\`\`js
JSON.stringify(obj, (key, value) =>
  keysToOmit.includes(key) ? undefined : value
);
\`\`\`

Ловушка: replacer вызывается на КАЖДОМ узле дерева, включая вложенные объекты. Это и хорошо — поле скроется на любой глубине. Но это значит, что нельзя проверять глубину или путь "вручную": работать должно как чистый фильтр по имени.

**Что написать.** Функцию \`stringifyExcept(obj, keysToOmit)\`, которая возвращает JSON-строку без перечисленных ключей. Используй replacer-функцию.

## Требования

1. Используй replacer-функцию во втором аргументе \`JSON.stringify\`.
2. Поля из \`keysToOmit\` должны убираться на любой глубине вложенности.
3. Если ключ не в списке — оставь \`value\` как есть.
4. Не используй заранее заданный \`indent\` — пускай выводит компактно.
5. Экспортируй функцию \`stringifyExcept\`.

## Примеры

\`stringifyExcept({ a: 1, b: 2 }, ['b'])\` → \`'{"a":1}'\`

\`stringifyExcept({ user: { name: 'I', password: 'x' } }, ['password'])\` → \`'{"user":{"name":"I"}}'\`

\`stringifyExcept({ a: 1 }, [])\` → \`'{"a":1}'\``,
    rank: 3,
    tags: ["json"],
    starter: `export function stringifyExcept(obj, keysToOmit) {
  // JSON.stringify(obj, (key, value) =>
  //   keysToOmit.includes(key) ? undefined : value
  // );
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { stringifyExcept } from './index.js';

describe('stringifyExcept', () => {
  it('omits a top-level key', () => {
    expect(stringifyExcept({ a: 1, b: 2 }, ['b'])).toBe('{"a":1}');
  });

  it('omits a nested key', () => {
    expect(
      stringifyExcept({ user: { name: 'I', password: 'x' } }, ['password']),
    ).toBe('{"user":{"name":"I"}}');
  });

  it('returns full JSON when omit list is empty', () => {
    expect(stringifyExcept({ a: 1 }, [])).toBe('{"a":1}');
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { stringifyExcept } from './index.js';

describe('stringifyExcept', () => {
  it('omits a top-level key', () => {
    expect(stringifyExcept({ a: 1, b: 2 }, ['b'])).toBe('{"a":1}');
  });

  it('omits a nested key', () => {
    expect(
      stringifyExcept({ user: { name: 'I', password: 'x' } }, ['password']),
    ).toBe('{"user":{"name":"I"}}');
  });

  it('returns full JSON when omit list is empty', () => {
    expect(stringifyExcept({ a: 1 }, [])).toBe('{"a":1}');
  });

  it('omits multiple keys at once', () => {
    expect(
      stringifyExcept({ a: 1, b: 2, c: 3 }, ['a', 'c']),
    ).toBe('{"b":2}');
  });

  it('omits a key at multiple depths', () => {
    const obj = { secret: 'top', inner: { secret: 'deep', keep: 1 } };
    expect(stringifyExcept(obj, ['secret'])).toBe('{"inner":{"keep":1}}');
  });

  it('produces output that re-parses without omitted keys', () => {
    const obj = { a: 1, password: 'x', nested: { password: 'y', ok: true } };
    const parsed = JSON.parse(stringifyExcept(obj, ['password']));
    expect(parsed).toEqual({ a: 1, nested: { ok: true } });
  });
});
`,
  }),
];
