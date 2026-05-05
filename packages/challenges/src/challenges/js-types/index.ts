import { getChallengePoints } from "../../ranking.ts";
import type { ChallengeDefinition, ChallengeFile } from "../../types.ts";

interface JsTypeChallengeConfig {
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

function createJsTypeChallenge(config: JsTypeChallengeConfig): ChallengeDefinition {
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
    difficulty: "Starter",
    category: "JavaScript",
    group: "Типы в JavaScript",
    languages: ["javascript"],
    rank: config.rank,
    reputation: getChallengePoints(config.rank),
    tags: ["JS/types", "types", "javascript", ...config.tags],
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

export const jsTypeChallenges: ChallengeDefinition[] = [
  createJsTypeChallenge({
    id: "types-typeof-label",
    title: "Метка typeof",
    description: `Представь: тебе в функцию прилетает что-то. Число? Строка? Кто его знает. Первый вопрос, который ты задаёшь — "а что это вообще такое?". В JS для этого есть оператор \`typeof\`. Он смотрит на значение и возвращает строку с названием типа.

\`\`\`js
typeof 42        // 'number'
typeof 'hello'   // 'string'
typeof true      // 'boolean'
typeof undefined // 'undefined'
\`\`\`

**Что написать.** Функцию \`getTypeLabel(value)\`, которая возвращает ровно то, что выдаёт \`typeof value\`. Никаких хитростей, никакой особой обработки \`null\` или массивов — просто прокидываем результат \`typeof\` наружу.

## Требования

1. Экспортируй функцию \`getTypeLabel(value)\`.
2. Верни строку, которую возвращает оператор \`typeof\`.
3. Не добавляй специальную обработку для \`null\`, массивов или дат.

## Примеры

\`getTypeLabel('hello')\` → \`'string'\`

\`getTypeLabel(42)\` → \`'number'\`

\`getTypeLabel(null)\` → \`'object'\`

\`getTypeLabel(() => {})\` → \`'function'\``,
    starter: `export function getTypeLabel(value) {
  // Верни результат typeof
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { getTypeLabel } from './index.js';

describe('getTypeLabel', () => {
  it('detects common primitive labels', () => {
    expect(getTypeLabel('hello')).toBe('string');
    expect(getTypeLabel(42)).toBe('number');
    expect(getTypeLabel(true)).toBe('boolean');
    expect(getTypeLabel(undefined)).toBe('undefined');
  });

  it('keeps basic JavaScript typeof behavior', () => {
    expect(getTypeLabel(null)).toBe('object');
    expect(getTypeLabel(() => {})).toBe('function');
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { getTypeLabel } from './index.js';

describe('getTypeLabel', () => {
  it('detects all primitive typeof labels used in modern JavaScript', () => {
    expect(getTypeLabel('hello')).toBe('string');
    expect(getTypeLabel(42)).toBe('number');
    expect(getTypeLabel(10n)).toBe('bigint');
    expect(getTypeLabel(Symbol('id'))).toBe('symbol');
    expect(getTypeLabel(true)).toBe('boolean');
    expect(getTypeLabel(undefined)).toBe('undefined');
  });

  it('does not replace JavaScript object/function behavior with custom labels', () => {
    expect(getTypeLabel(null)).toBe('object');
    expect(getTypeLabel([])).toBe('object');
    expect(getTypeLabel(new Date())).toBe('object');
    expect(getTypeLabel({ id: 1 })).toBe('object');
    expect(getTypeLabel(() => {})).toBe('function');
    expect(getTypeLabel(function named() {})).toBe('function');
  });
});
`,
    rank: 0,
    tags: ["typeof", "primitive"],
  }),
  createJsTypeChallenge({
    id: "types-nullish-check",
    title: "Nullish значения",
    description: `Есть разница между "значения нет" и "значение равно нулю". Пользователь не ввёл возраст — это \`null\` или \`undefined\`. Пользователь ввёл \`0\` — это уже ответ, пусть и нулевой. Если их путать, потом удивляешься, почему форма падает на корректных данных.

**Наивный подход.** Кажется, что можно проверить через \`!value\`:

\`\`\`js
if (!value) { /* нет значения */ }
\`\`\`

Но \`!0\`, \`!''\` и \`!false\` тоже дадут \`true\`. Это уже не "нет значения", это просто falsy. **Правило.** Если хочешь поймать именно "ничего" — проверяй на \`null\` и \`undefined\` явно.

**Что написать.** Функцию \`isNullish(value)\`, которая возвращает \`true\` только для \`null\` и \`undefined\`. Всё остальное — \`false\`, даже если оно falsy.

## Требования

1. Экспортируй функцию \`isNullish(value)\`.
2. Для \`null\` верни \`true\`.
3. Для \`undefined\` верни \`true\`.
4. Для \`0\`, \`false\`, \`''\` и остальных значений верни \`false\`.

## Примеры

\`isNullish(null)\` → \`true\`

\`isNullish(undefined)\` → \`true\`

\`isNullish(0)\` → \`false\`

\`isNullish('')\` → \`false\``,
    starter: `export function isNullish(value) {
  // true только для null и undefined
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { isNullish } from './index.js';

describe('isNullish', () => {
  it('accepts null and undefined', () => {
    expect(isNullish(null)).toBe(true);
    expect(isNullish(undefined)).toBe(true);
  });

  it('rejects falsy but defined values', () => {
    expect(isNullish(0)).toBe(false);
    expect(isNullish(false)).toBe(false);
    expect(isNullish('')).toBe(false);
  });
});
`,
    rank: 1,
    tags: ["null", "undefined"],
  }),
  createJsTypeChallenge({
    id: "types-truthy-falsy",
    title: "Truthy или falsy",
    description: `Когда ты пишешь \`if (value)\`, JS сам решает: считать ли это значение "правдой" или "ложью". Список falsy короткий и его можно выучить наизусть: \`false\`, \`0\`, \`-0\`, \`0n\`, \`''\`, \`null\`, \`undefined\`, \`NaN\`. Всё остальное — truthy.

**А что насчёт строки \`"0"\`?** Кажется, ноль же. Но нет:

\`\`\`js
Boolean('0')  // true
Boolean([])   // true
Boolean({})   // true
\`\`\`

Строка \`"0"\` — непустая строка, а пустой массив — это всё-таки объект. Объекты truthy всегда. **Правило.** Truthy/falsy — про значение, а не про "похоже на ноль".

**Что написать.** Функцию \`toTruthiness(value)\`, которая делает то же, что \`Boolean(value)\`: возвращает \`true\` или \`false\` по правилам JS. Не пиши длинный список falsy-значений руками — доверься языку.

## Требования

1. Экспортируй функцию \`toTruthiness(value)\`.
2. Верни \`true\`, если значение truthy.
3. Верни \`false\`, если значение falsy.
4. Не перечисляй все falsy-значения вручную: используй стандартное приведение JavaScript к boolean.

## Примеры

\`toTruthiness(0)\` → \`false\`

\`toTruthiness('')\` → \`false\`

\`toTruthiness('0')\` → \`true\`

\`toTruthiness([])\` → \`true\``,
    starter: `export function toTruthiness(value) {
  // Верни Boolean(value)
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { toTruthiness } from './index.js';

describe('toTruthiness', () => {
  it('handles falsy values', () => {
    expect(toTruthiness(false)).toBe(false);
    expect(toTruthiness(0)).toBe(false);
    expect(toTruthiness('')).toBe(false);
    expect(toTruthiness(null)).toBe(false);
  });

  it('handles truthy values', () => {
    expect(toTruthiness('0')).toBe(true);
    expect(toTruthiness([])).toBe(true);
    expect(toTruthiness({})).toBe(true);
  });
});
`,
    rank: 0,
    tags: ["truthy", "falsy", "boolean"],
  }),
  createJsTypeChallenge({
    id: "types-number-kind",
    title: "Классификация числа",
    description: `Тип \`number\` в JS — это братская могила. Туда попадают и \`42\`, и \`3.14\`, и \`NaN\`, и \`Infinity\`. Все они — \`typeof === 'number'\`. Если просто проверить тип, ты не отличишь нормальное число от поломанного.

**Главная ловушка — \`NaN\`.** Это число, которое означает "результат не получился". И оно не равно само себе:

\`\`\`js
NaN === NaN  // false
\`\`\`

Поэтому проверять надо через \`Number.isNaN(value)\`. Аналогично — \`Number.isFinite\` отсекает \`Infinity\` и \`-Infinity\`, а \`Number.isInteger\` отличает целое от дробного.

**Что написать.** Функцию \`getNumberKind(value)\`, которая раскладывает любое значение по полочкам: \`"not-number"\`, \`"nan"\`, \`"infinity"\`, \`"integer"\` или \`"float"\`.

## Требования

1. Экспортируй функцию \`getNumberKind(value)\`.
2. Если \`value\` не имеет тип \`number\`, верни \`"not-number"\`.
3. Для \`NaN\` верни \`"nan"\`.
4. Для \`Infinity\` и \`-Infinity\` верни \`"infinity"\`.
5. Для целого числа верни \`"integer"\`.
6. Для дробного конечного числа верни \`"float"\`.

## Примеры

\`getNumberKind('42')\` → \`'not-number'\`

\`getNumberKind(Number.NaN)\` → \`'nan'\`

\`getNumberKind(-Infinity)\` → \`'infinity'\`

\`getNumberKind(10)\` → \`'integer'\`

\`getNumberKind(10.5)\` → \`'float'\``,
    starter: `export function getNumberKind(value) {
  // Верни вид числа
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { getNumberKind } from './index.js';

describe('getNumberKind', () => {
  it('rejects non-numbers', () => {
    expect(getNumberKind('42')).toBe('not-number');
    expect(getNumberKind(42n)).toBe('not-number');
  });

  it('detects special numbers', () => {
    expect(getNumberKind(Number.NaN)).toBe('nan');
    expect(getNumberKind(Infinity)).toBe('infinity');
    expect(getNumberKind(-Infinity)).toBe('infinity');
  });

  it('detects integer and float numbers', () => {
    expect(getNumberKind(10)).toBe('integer');
    expect(getNumberKind(-3)).toBe('integer');
    expect(getNumberKind(10.5)).toBe('float');
  });
});
`,
    rank: 2,
    tags: ["number", "nan", "infinity"],
  }),
  createJsTypeChallenge({
    id: "types-numeric-string",
    title: "Числовая строка",
    description: `Форма прислала тебе \`"42"\`. Или \`"42px"\`. Или \` "  3.14  " \`. Или просто \`""\`. Перед тем как считать что-то числом, надо понять — а это вообще число под видом строки?

**Сюрприз номер один.** \`Number('')\` — это \`0\`. Не \`NaN\`, как хотелось бы, а ноль:

\`\`\`js
Number('')      // 0
Number('   ')   // 0
Number('42')    // 42
Number('42px')  // NaN
\`\`\`

То есть пустую строку нужно отсеять отдельно, иначе она просочится как валидное число.

**Сюрприз номер два.** \`Number('Infinity')\` возвращает \`Infinity\` — настоящую бесконечность. Если ты собираешь данные из формы, бесконечность вряд ли валидна. **Правило.** После приведения проверяй через \`Number.isFinite\`, а не просто \`!isNaN\`.

**Что написать.** Функцию \`isNumericString(value)\`, которая возвращает \`true\` только если \`value\` — непустая (после trim) строка, превращающаяся в конечное число.

## Требования

1. Экспортируй функцию \`isNumericString(value)\`.
2. Если \`value\` не строка, верни \`false\`.
3. Для пустой строки и строки из пробелов верни \`false\`.
4. Для строки, которую можно превратить в конечное число, верни \`true\`.
5. Для \`NaN\`, \`Infinity\` и текста с лишними символами верни \`false\`.

## Примеры

\`isNumericString('42')\` → \`true\`

\`isNumericString(' 3.14 ')\` → \`true\`

\`isNumericString('')\` → \`false\`

\`isNumericString('Infinity')\` → \`false\`

\`isNumericString('10px')\` → \`false\`

\`isNumericString(42)\` → \`false\``,
    starter: `export function isNumericString(value) {
  // true только для непустых строк, которые дают конечное число
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { isNumericString } from './index.js';

describe('isNumericString', () => {
  it('accepts numeric strings', () => {
    expect(isNumericString('42')).toBe(true);
    expect(isNumericString(' 3.14 ')).toBe(true);
    expect(isNumericString('-10')).toBe(true);
  });

  it('rejects empty or non-finite strings', () => {
    expect(isNumericString('')).toBe(false);
    expect(isNumericString('   ')).toBe(false);
    expect(isNumericString('Infinity')).toBe(false);
  });

  it('rejects non-strings and words', () => {
    expect(isNumericString(42)).toBe(false);
    expect(isNumericString('10px')).toBe(false);
  });
});
`,
    rank: 3,
    tags: ["string", "number-conversion"],
  }),
  createJsTypeChallenge({
    id: "types-container-kind",
    title: "Контейнер или объект",
    description: `Спрашиваешь \`typeof\` у массива — получаешь \`"object"\`. У даты — \`"object"\`. У \`null\` — внезапно тоже \`"object"\`. У обычного объекта — \`"object"\`. Все одинаковые, как пельмени в кастрюле, а в коде их надо различать.

\`\`\`js
typeof []           // 'object'
typeof new Date()   // 'object'
typeof null         // 'object'
typeof { a: 1 }     // 'object'
\`\`\`

**Как выкручиваться.** Для массива есть \`Array.isArray(value)\` — это самый надёжный способ. Для даты — \`value instanceof Date\`. Для \`null\` — прямое сравнение \`value === null\`. И только если ничего из этого не сработало, перед тобой обычный объект.

**Порядок важен.** Сначала отсекай \`null\`, потом массив, потом дату, потом всё остальное. Иначе \`null\` пройдёт первую же проверку \`typeof === 'object'\` и сломает логику.

**Что написать.** Функцию \`getContainerKind(value)\`, которая возвращает один из ярлыков: \`"array"\`, \`"date"\`, \`"null"\`, \`"object"\` или \`"other"\` (для всего, что не объект).

## Требования

1. Экспортируй функцию \`getContainerKind(value)\`.
2. Для массива верни \`"array"\`.
3. Для \`Date\` верни \`"date"\`.
4. Для \`null\` верни \`"null"\`.
5. Для обычного объекта верни \`"object"\`.
6. Для остальных значений верни \`"other"\`.

## Примеры

\`getContainerKind([])\` → \`'array'\`

\`getContainerKind(new Date())\` → \`'date'\`

\`getContainerKind(null)\` → \`'null'\`

\`getContainerKind({ id: 1 })\` → \`'object'\`

\`getContainerKind('text')\` → \`'other'\``,
    starter: `export function getContainerKind(value) {
  // Различи array, null, date, object и other
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { getContainerKind } from './index.js';

describe('getContainerKind', () => {
  it('detects object-like containers', () => {
    expect(getContainerKind([])).toBe('array');
    expect(getContainerKind(new Date('2026-04-28'))).toBe('date');
    expect(getContainerKind({ id: 1 })).toBe('object');
  });

  it('handles null and other values', () => {
    expect(getContainerKind(null)).toBe('null');
    expect(getContainerKind('text')).toBe('other');
    expect(getContainerKind(() => {})).toBe('other');
  });
});
`,
    rank: 2,
    tags: ["array", "object", "date", "null"],
  }),
  createJsTypeChallenge({
    id: "types-primitive-check",
    title: "Примитив или ссылка",
    description: `Думай о примитиве как о монетке в кармане: достал, отдал, забыл. А объект — это адрес квартиры: ты передаёшь не саму квартиру, а где её искать. Изменишь по адресу — изменится у всех, у кого этот адрес есть.

\`\`\`js
let a = 5;
let b = a;     // b — копия числа
b = 10;
// a всё ещё 5

let x = { v: 5 };
let y = x;     // y — тот же адрес
y.v = 10;
// x.v тоже 10
\`\`\`

Примитивы — это \`string\`, \`number\`, \`boolean\`, \`bigint\`, \`symbol\`, \`undefined\` и \`null\`. Всё остальное (объекты, массивы, функции) — ссылочные значения.

**Главная подстава.** \`typeof null === 'object'\`. Это исторический баг JS, его так и не починили. Но \`null\` — это примитив, что бы ни говорил \`typeof\`. Поэтому проверку на \`null\` делай отдельно, до \`typeof\`.

**Что написать.** Функцию \`isPrimitive(value)\`, которая возвращает \`true\` для примитивов (включая \`null\`) и \`false\` для объектов, массивов и функций.

## Требования

1. Экспортируй функцию \`isPrimitive(value)\`.
2. Для \`string\`, \`number\`, \`boolean\`, \`bigint\`, \`symbol\`, \`undefined\` и \`null\` верни \`true\`.
3. Для объектов, массивов и функций верни \`false\`.
4. Обработай \`null\` отдельно.

## Примеры

\`isPrimitive(null)\` → \`true\`

\`isPrimitive('x')\` → \`true\`

\`isPrimitive(Symbol('id'))\` → \`true\`

\`isPrimitive({})\` → \`false\`

\`isPrimitive([])\` → \`false\`

\`isPrimitive(() => {})\` → \`false\``,
    starter: `export function isPrimitive(value) {
  // null тоже считается примитивным значением
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { isPrimitive } from './index.js';

describe('isPrimitive', () => {
  it('accepts primitive values', () => {
    expect(isPrimitive(null)).toBe(true);
    expect(isPrimitive(undefined)).toBe(true);
    expect(isPrimitive('x')).toBe(true);
    expect(isPrimitive(1)).toBe(true);
    expect(isPrimitive(Symbol('id'))).toBe(true);
  });

  it('rejects objects and functions', () => {
    expect(isPrimitive({})).toBe(false);
    expect(isPrimitive([])).toBe(false);
    expect(isPrimitive(() => {})).toBe(false);
  });
});
`,
    rank: 2,
    tags: ["primitive", "reference"],
  }),
  createJsTypeChallenge({
    id: "types-normalize-count",
    title: "Нормализация количества",
    description: `Корзина в интернет-магазине. Пользователь вбил в поле "сколько штук" что-то — и тебе с этим жить. Может прийти \`5\`, может \`"7.8"\`, может \`""\`, может \`"10px"\`, а может и \`-3\` от особо одарённого. Купить \`-3\` яблока нельзя, поэтому всё подозрительное лучше превратить в \`0\`.

**Стратегия.** Прогоняешь через \`Number(value)\`, потом отрезаешь дробную часть \`Math.floor\`, потом проверяешь — конечное ли это, неотрицательное ли. Если что-то не так — \`0\`.

\`\`\`js
Number('7.8')   // 7.8
Math.floor(7.8) // 7
Number('10px')  // NaN — отсекаем
Number('')      // 0   — формально валидно, но пусто
\`\`\`

**Та самая подстава.** \`Number('')\` равно \`0\`. Если пустая строка для тебя означает "пользователь ничего не ввёл", лучше явно вернуть \`0\` через ветку с проверкой пустоты — иначе \`0\` от пустого поля смешается с реальным \`0\`. В этой задаче и так, и так результат \`0\`, но в боевом коде это часто разные кейсы.

**Что написать.** Функцию \`normalizeCount(value)\`, которая возвращает безопасное неотрицательное целое или \`0\`.

## Требования

1. Экспортируй функцию \`normalizeCount(value)\`.
2. Числа и числовые строки приведи к \`number\`.
3. Дробную часть отбрось через \`Math.floor\`.
4. Для отрицательных значений, \`NaN\`, \`Infinity\` и пустых строк верни \`0\`.
5. Результат всегда должен быть неотрицательным числом.

## Примеры

\`normalizeCount(5)\` → \`5\`

\`normalizeCount(5.9)\` → \`5\`

\`normalizeCount(' 7.8 ')\` → \`7\`

\`normalizeCount(-1)\` → \`0\`

\`normalizeCount('10px')\` → \`0\`

\`normalizeCount(Infinity)\` → \`0\``,
    starter: `export function normalizeCount(input) {
  // Верни безопасное целое количество
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { normalizeCount } from './index.js';

describe('normalizeCount', () => {
  it('normalizes numbers and numeric strings', () => {
    expect(normalizeCount(5)).toBe(5);
    expect(normalizeCount(5.9)).toBe(5);
    expect(normalizeCount('12')).toBe(12);
    expect(normalizeCount(' 7.8 ')).toBe(7);
  });

  it('rejects invalid counts', () => {
    expect(normalizeCount(-1)).toBe(0);
    expect(normalizeCount('')).toBe(0);
    expect(normalizeCount('10px')).toBe(0);
    expect(normalizeCount(Infinity)).toBe(0);
  });
});
`,
    rank: 3,
    tags: ["coercion", "forms", "number"],
  }),
  createJsTypeChallenge({
    id: "types-strict-same",
    title: "Одинаковый тип и значение",
    description: `В JS три способа сравнить значения, и они врут по-разному. \`==\` приводит типы и считает \`1 == "1"\`. \`===\` не приводит, но всё ещё считает \`NaN !== NaN\` и \`0 === -0\`. А ты хочешь честное сравнение: те же типы, то же значение, без сюрпризов с \`NaN\`.

\`\`\`js
NaN === NaN      // false (!)
0 === -0         // true  (!)
Object.is(NaN, NaN)  // true
Object.is(0, -0)     // false
\`\`\`

**Правило.** \`Object.is\` — это \`===\` с двумя поправками: \`NaN\` равен самому себе, а \`0\` и \`-0\` — разные. Для проверки "одинаковость по типу и значению без подвохов" это самый точный инструмент.

**Что написать.** Функцию \`isSameTypedValue(left, right)\`, которая возвращает результат \`Object.is(left, right)\`.

## Требования

1. Экспортируй функцию \`isSameTypedValue(left, right)\`.
2. Используй сравнение без приведения типов.
3. \`1\` и \`"1"\` должны считаться разными.
4. \`false\` и \`0\` должны считаться разными.
5. \`NaN\` и \`NaN\` должны считаться одинаковыми.
6. \`0\` и \`-0\` должны считаться разными.

## Примеры

\`isSameTypedValue(10, 10)\` → \`true\`

\`isSameTypedValue(NaN, NaN)\` → \`true\`

\`isSameTypedValue(10, '10')\` → \`false\`

\`isSameTypedValue(0, -0)\` → \`false\`

\`isSameTypedValue(false, 0)\` → \`false\``,
    starter: `export function isSameTypedValue(left, right) {
  // Проверь тип и значение без неявного приведения
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { isSameTypedValue } from './index.js';

describe('isSameTypedValue', () => {
  it('matches same typed values', () => {
    expect(isSameTypedValue(10, 10)).toBe(true);
    expect(isSameTypedValue('10', '10')).toBe(true);
    expect(isSameTypedValue(Number.NaN, Number.NaN)).toBe(true);
  });

  it('rejects coercion and Object.is differences', () => {
    expect(isSameTypedValue(10, '10')).toBe(false);
    expect(isSameTypedValue(0, -0)).toBe(false);
    expect(isSameTypedValue(false, 0)).toBe(false);
  });
});
`,
    rank: 0,
    tags: ["equality", "object-is"],
  }),
  createJsTypeChallenge({
    id: "types-display-text",
    title: "Текст для отображения",
    description: `Тебе надо вывести значение в лог или подставить в кнопку. Любое значение. Вроде бы просто — \`'' + value\` или \`\\\`\${value}\\\`\` — и готово. Но JS подсунет тебе мину.

**Мина.** Конкатенация с \`Symbol\` бросает исключение:

\`\`\`js
const id = Symbol('id');
'' + id;          // TypeError!
\\\`id is \${id}\\\`;  // тоже TypeError!
\`\`\`

А вот \`String(id)\` отработает спокойно и вернёт \`"Symbol(id)"\`. Поэтому для безопасного приведения к строке всегда используй \`String(value)\`, а не оператор \`+\`.

**Что написать.** Функцию \`toDisplayText(value)\`, которая для любого значения возвращает его строковое представление через \`String\`. Никаких исключений на ровном месте.

## Требования

1. Экспортируй функцию \`toDisplayText(value)\`.
2. Для \`null\` верни строку \`"null"\`.
3. Для \`undefined\` верни строку \`"undefined"\`.
4. Для строки верни саму строку.
5. Для числа, boolean, bigint и symbol верни безопасное строковое представление.

## Примеры

\`toDisplayText(null)\` → \`'null'\`

\`toDisplayText(undefined)\` → \`'undefined'\`

\`toDisplayText('hello')\` → \`'hello'\`

\`toDisplayText(42)\` → \`'42'\`

\`toDisplayText(10n)\` → \`'10'\`

\`toDisplayText(Symbol('id'))\` → \`'Symbol(id)'\``,
    starter: `export function toDisplayText(value) {
  // Верни безопасную строку для отображения
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { toDisplayText } from './index.js';

describe('toDisplayText', () => {
  it('handles empty values explicitly', () => {
    expect(toDisplayText(null)).toBe('null');
    expect(toDisplayText(undefined)).toBe('undefined');
  });

  it('handles primitive display values', () => {
    expect(toDisplayText('hello')).toBe('hello');
    expect(toDisplayText(42)).toBe('42');
    expect(toDisplayText(false)).toBe('false');
    expect(toDisplayText(10n)).toBe('10');
  });

  it('handles symbols without throwing', () => {
    expect(toDisplayText(Symbol('id'))).toBe('Symbol(id)');
  });
});
`,
    rank: 0,
    tags: ["string-conversion", "symbol", "ui"],
  }),
  createJsTypeChallenge({
    id: "types-safe-add",
    title: "Безопасное сложение",
    description: `\`number\` и \`bigint\` — два разных числовых типа в JS, и они принципиально не дружат. Попробуй сложить — получишь \`TypeError\`:

\`\`\`js
2 + 3n   // TypeError: Cannot mix BigInt and other types
\`\`\`

Это не баг, это специально. \`bigint\` бесконечно точный, \`number\` — нет. Если бы JS просто сконвертил один в другой, ты бы тихо терял точность на больших числах. Поэтому язык требует, чтобы ты определился сам.

**Стратегия.** Перед сложением проверяешь \`typeof\` обоих аргументов. Оба \`number\` — складываешь как числа. Оба \`bigint\` — складываешь как bigint. Что-то одно или мусор — кидаешь свою ошибку с понятным текстом, а не дожидаешься, пока её бросит сам JS.

**Ещё момент.** Для \`number\` стоит отсечь \`NaN\` и \`Infinity\` — формально они \`number\`, но складывать их обычно бессмысленно. Используй \`Number.isFinite\`.

**Что написать.** Функцию \`safeAdd(left, right)\`. Складывает только однотипные числовые значения. Для всего остального — \`throw new Error('Incompatible numeric types')\`.

## Требования

1. Экспортируй функцию \`safeAdd(left, right)\`.
2. Если оба значения имеют тип \`number\`, верни их сумму.
3. Если оба значения имеют тип \`bigint\`, верни их сумму.
4. Если типы разные или значения не числа/bigint, выброси ошибку \`"Incompatible numeric types"\`.
5. Не допускай runtime-ошибку при смешивании \`number\` и \`bigint\`.
6. Для \`number\` принимай только конечные числа.

## Примеры

\`safeAdd(2, 3)\` → \`5\`

\`safeAdd(0.5, 1.5)\` → \`2\`

\`safeAdd(2n, 3n)\` → \`5n\`

\`safeAdd(2, 3n)\` → бросает \`Incompatible numeric types\`

\`safeAdd(Infinity, 1)\` → бросает \`Incompatible numeric types\`

\`safeAdd('2', '3')\` → бросает \`Incompatible numeric types\``,
    starter: `export function safeAdd(left, right) {
  // Сложи number с number или bigint с bigint
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { safeAdd } from './index.js';

describe('safeAdd', () => {
  it('adds finite numbers', () => {
    expect(safeAdd(2, 3)).toBe(5);
    expect(safeAdd(0.5, 1.5)).toBe(2);
  });

  it('adds bigints', () => {
    expect(safeAdd(2n, 3n)).toBe(5n);
  });

  it('rejects incompatible numeric values', () => {
    expect(() => safeAdd(2, 3n)).toThrow('Incompatible numeric types');
    expect(() => safeAdd(Infinity, 1)).toThrow('Incompatible numeric types');
    expect(() => safeAdd('2', '3')).toThrow('Incompatible numeric types');
  });
});
`,
    rank: 3,
    tags: ["bigint", "number", "errors"],
  }),
  createJsTypeChallenge({
    id: "types-json-kind",
    title: "JSON-совместимый тип",
    description: `JSON — это бедный родственник JavaScript. В нём всего шесть типов: строка, число, boolean, \`null\`, массив, объект. Всё. Никаких функций, \`undefined\`, symbol или bigint.

**Что делает \`JSON.stringify\`?** Тихо съедает то, что не понимает, и это коварно:

\`\`\`js
JSON.stringify({ a: 1, b: undefined, c: () => {} })
// '{"a":1}' — b и c просто исчезли!

JSON.stringify(10n)
// TypeError: Do not know how to serialize a BigInt
\`\`\`

То есть либо данные потеряются молча, либо упадёт исключение. Если ты собираешься что-то сериализовать, лучше заранее проверить, что внутри только JSON-совместимые значения.

**Что написать.** Функцию \`getJsonKind(value)\`, которая отвечает на вопрос "а что это с точки зрения JSON?". Возвращает \`"null"\`, \`"array"\`, \`"object"\`, \`"string"\`, \`"number"\` или \`"boolean"\`. Всё, что JSON не переживёт — \`"unsupported"\`.

## Требования

1. Экспортируй функцию \`getJsonKind(value)\`.
2. Для \`null\` верни \`"null"\`.
3. Для массива верни \`"array"\`.
4. Для обычного объекта верни \`"object"\`.
5. Для \`string\`, \`number\` и \`boolean\` верни их тип.
6. Для значений, которые не являются JSON-значениями, верни \`"unsupported"\`.

## Примеры

\`getJsonKind(null)\` → \`'null'\`

\`getJsonKind([])\` → \`'array'\`

\`getJsonKind({ ok: true })\` → \`'object'\`

\`getJsonKind('text')\` → \`'string'\`

\`getJsonKind(undefined)\` → \`'unsupported'\`

\`getJsonKind(10n)\` → \`'unsupported'\`

\`getJsonKind(() => {})\` → \`'unsupported'\``,
    starter: `export function getJsonKind(value) {
  // Верни JSON-категорию значения
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { getJsonKind } from './index.js';

describe('getJsonKind', () => {
  it('detects JSON-supported containers and primitives', () => {
    expect(getJsonKind(null)).toBe('null');
    expect(getJsonKind([])).toBe('array');
    expect(getJsonKind({ ok: true })).toBe('object');
    expect(getJsonKind('text')).toBe('string');
    expect(getJsonKind(10)).toBe('number');
    expect(getJsonKind(false)).toBe('boolean');
  });

  it('rejects unsupported JSON values', () => {
    expect(getJsonKind(undefined)).toBe('unsupported');
    expect(getJsonKind(() => {})).toBe('unsupported');
    expect(getJsonKind(Symbol('id'))).toBe('unsupported');
    expect(getJsonKind(10n)).toBe('unsupported');
  });
});
`,
    rank: 3,
    tags: ["json", "unsupported", "serialization"],
  }),
];
