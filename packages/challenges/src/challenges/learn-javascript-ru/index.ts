import { getChallengePoints } from "../../ranking.ts";
import type { ChallengeDefinition, ChallengeFile } from "../../types.ts";

interface LearnJsChallengeConfig {
  id: string;
  title: string;
  description: string;
  starter: string;
  tests: string;
  group: string;
  tag: string;
  rank: number;
  tags: string[];
}

const emptyLangs: ChallengeFile[] = [];

function createLearnJsChallenge(config: LearnJsChallengeConfig): ChallengeDefinition {
  const starterFiles: ChallengeFile[] = [{ path: "src/index.js", content: config.starter }];
  const testFiles: ChallengeFile[] = [{ path: "src/index.test.js", content: config.tests }];

  return {
    id: config.id,
    title: config.title,
    description: config.description,
    difficulty: config.rank < 4 ? "Starter" : "Mid",
    category: "JavaScript",
    group: config.group,
    languages: ["javascript"],
    rank: config.rank,
    reputation: getChallengePoints(config.rank),
    tags: [config.tag, "javascript", ...config.tags],
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

export const arrowFunctionChallenges: ChallengeDefinition[] = [
  createLearnJsChallenge({
    id: "arrow-square",
    title: "Квадрат стрелкой",
    rank: 0,
    group: "Стрелочные функции",
    tag: "JS/arrow-functions",
    description: `Представь стрелочную функцию как короткую формулу: слева вход, справа выход. Никакого \`function\`, никаких лишних букв — просто стрелка \`=>\`.

\`\`\`js
const double = (n) => n * 2;
\`\`\`

**Что написать.** Функцию \`square(value)\`. Получает число, возвращает его квадрат.

## Требования

1. Экспортируй константу \`square\` со стрелочной функцией.
2. Верни число, умноженное само на себя.
3. Имя должно остаться \`square\` — тесты импортируют именно его.

## Примеры

\`square(4)\` → \`16\`

\`square(-3)\` → \`9\`

\`square(0)\` → \`0\``,
    starter: `export const square = (value) => {
  // Верни квадрат value
};
`,
    tests: `import { describe, expect, it } from 'vitest';
import { square } from './index.js';

describe('square', () => {
  it('squares numbers', () => {
    expect(square(4)).toBe(16);
    expect(square(-3)).toBe(9);
  });
});
`,
    tags: ["arrow-functions", "expression-body"],
  }),
  createLearnJsChallenge({
    id: "arrow-full-name",
    title: "Полное имя",
    rank: 1,
    group: "Стрелочные функции",
    tag: "JS/arrow-functions",
    description: `Данные о людях редко приходят чистыми. Имя \`'  Grace '\` с пробелами по краям — обычное дело: где-то скопировали из Excel, где-то форма не подрезала.

Чтобы убрать пробелы, у строк есть метод \`trim\`:

\`\`\`js
'  Grace '.trim()  // 'Grace'
\`\`\`

**Что написать.** Функцию \`getFullName(user)\`. Берёт объект с \`firstName\` и \`lastName\`, чистит пробелы и склеивает через один пробел.

## Требования

1. Экспортируй \`getFullName\` как стрелочную функцию.
2. Используй \`firstName\` и \`lastName\` из объекта.
3. Подрежь пробелы по краям у каждого поля.

## Примеры

\`getFullName({ firstName: 'Ada', lastName: 'Lovelace' })\` → \`'Ada Lovelace'\`

\`getFullName({ firstName: '  Grace ', lastName: ' Hopper ' })\` → \`'Grace Hopper'\`

\`getFullName({ firstName: 'Linus', lastName: 'Torvalds' })\` → \`'Linus Torvalds'\``,
    starter: `export const getFullName = (user) => {
  // user = { firstName, lastName }
};
`,
    tests: `import { describe, expect, it } from 'vitest';
import { getFullName } from './index.js';

describe('getFullName', () => {
  it('joins trimmed names', () => {
    expect(getFullName({ firstName: 'Ada', lastName: 'Lovelace' })).toBe('Ada Lovelace');
    expect(getFullName({ firstName: '  Grace ', lastName: ' Hopper ' })).toBe('Grace Hopper');
  });
});
`,
    tags: ["objects", "strings"],
  }),
  createLearnJsChallenge({
    id: "arrow-positive-numbers",
    title: "Только положительные",
    rank: 1,
    group: "Стрелочные функции",
    tag: "JS/arrow-functions",
    description: `\`filter\` — это сито для массива. Ты даёшь правило, оно оставляет только те элементы, для которых правило вернуло \`true\`.

\`\`\`js
[1, -2, 3].filter((n) => n > 0)  // [1, 3]
\`\`\`

Исходный массив остаётся целым — \`filter\` всегда отдаёт новый.

**Одна тонкость.** Ноль не считается положительным числом. Условие должно быть строгим: \`n > 0\`, не \`n >= 0\`.

**Что написать.** Функцию \`getPositiveNumbers(numbers)\`. Возвращает новый массив только с числами больше нуля.

## Требования

1. Экспортируй \`getPositiveNumbers\`.
2. Верни новый массив, исходный не трогай.
3. Оставь только значения строго больше \`0\`.

## Примеры

\`getPositiveNumbers([-2, 0, 3, 7, -1])\` → \`[3, 7]\`

\`getPositiveNumbers([0, 0, 0])\` → \`[]\`

\`getPositiveNumbers([1, 2, 3])\` → \`[1, 2, 3]\``,
    starter: `export const getPositiveNumbers = (numbers) => {
  // Верни положительные числа
};
`,
    tests: `import { describe, expect, it } from 'vitest';
import { getPositiveNumbers } from './index.js';

describe('getPositiveNumbers', () => {
  it('filters positives', () => {
    const source = [-2, 0, 3, 7, -1];
    expect(getPositiveNumbers(source)).toEqual([3, 7]);
    expect(source).toEqual([-2, 0, 3, 7, -1]);
  });
});
`,
    tags: ["arrays", "callbacks"],
  }),
  createLearnJsChallenge({
    id: "arrow-user-names",
    title: "Имена пользователей",
    rank: 2,
    group: "Стрелочные функции",
    tag: "JS/arrow-functions",
    description: `Из API часто приходит список объектов, а тебе нужен только один столбец — например, имена. Соблазнительное решение:

\`\`\`js
users.map((u) => u.name)
\`\`\`

**Одна засада.** Что если у кого-то нет поля \`name\`?

\`\`\`js
[{ name: 'Ada' }, {}].map((u) => u.name)  // ['Ada', undefined]
\`\`\`

Тебе нужны только настоящие имена — \`undefined\` в результате не место. Сначала отсей пустые объекты через \`filter\`, потом вытащи имена через \`map\`.

**Что написать.** Функцию \`getUserNames(users)\`. Возвращает массив имён, пропуская объекты без \`name\`.

## Требования

1. Экспортируй \`getUserNames\`.
2. Верни массив строк.
3. Без \`undefined\` в результате.
4. Порядок сохраняется.

## Примеры

\`getUserNames([{ name: 'Ada' }, {}, { name: 'Grace' }])\` → \`['Ada', 'Grace']\`

\`getUserNames([{}, {}])\` → \`[]\`

\`getUserNames([{ name: 'Linus' }])\` → \`['Linus']\``,
    starter: `export const getUserNames = (users) => {
  // Верни массив имен
};
`,
    tests: `import { describe, expect, it } from 'vitest';
import { getUserNames } from './index.js';

describe('getUserNames', () => {
  it('returns only existing names', () => {
    expect(getUserNames([{ name: 'Ada' }, {}, { name: 'Grace' }])).toEqual(['Ada', 'Grace']);
  });
});
`,
    tags: ["arrays", "objects"],
  }),
  createLearnJsChallenge({
    id: "arrow-vat",
    title: "Цена с НДС",
    rank: 2,
    group: "Стрелочные функции",
    tag: "JS/arrow-functions",
    description: `НДС в России — обычно 20%. Чтобы каждый раз не передавать \`0.2\` в функцию, поставь это значение прямо в сигнатуре:

\`\`\`js
const addVat = (price, rate = 0.2) => /* ... */;
\`\`\`

Если \`rate\` не передан — будет \`0.2\`. Передал свой — будет твой.

**Странная штука.** Дробные числа в JavaScript бывают коварны:

\`\`\`js
0.1 + 0.2  // 0.30000000000000004
\`\`\`

Поэтому сумму нужно округлять до двух знаков. Хитрый способ — умножить на 100, округлить, поделить обратно:

\`\`\`js
Math.round(value * 100) / 100
\`\`\`

**Что написать.** Функцию \`addVat(price, rate = 0.2)\`. Прибавляет налог к цене и возвращает число с двумя знаками после запятой.

## Требования

1. Экспортируй \`addVat\` со значением \`rate\` по умолчанию \`0.2\`.
2. Верни \`price + price * rate\`.
3. Округли до двух знаков и верни число (не строку).

## Примеры

\`addVat(100)\` → \`120\`

\`addVat(99.99, 0.1)\` → \`109.99\`

\`addVat(50, 0)\` → \`50\``,
    starter: `export const addVat = (price, rate = 0.2) => {
  // Верни цену с НДС
};
`,
    tests: `import { describe, expect, it } from 'vitest';
import { addVat } from './index.js';

describe('addVat', () => {
  it('uses default rate', () => {
    expect(addVat(100)).toBe(120);
  });

  it('accepts custom rate and rounds', () => {
    expect(addVat(99.99, 0.1)).toBe(109.99);
  });
});
`,
    tags: ["default-parameters", "numbers"],
  }),
  createLearnJsChallenge({
    id: "arrow-multiplier",
    title: "Фабрика множителей",
    rank: 3,
    group: "Стрелочные функции",
    tag: "JS/arrow-functions",
    description: `Представь автомат, который выдаёт другие автоматы — каждый настроен на свой множитель. Заказал автомат для удвоения — он умеет только удваивать. Заказал для утроения — только утраивает.

\`\`\`js
const double = makeMultiplier(2);
const triple = makeMultiplier(3);
double(5);  // 10
triple(5);  // 15
\`\`\`

Это работает потому, что внутренняя функция помнит \`factor\` из внешней — даже после того, как внешняя завершилась. В JS это называется **замыкание**.

\`\`\`js
const makeMultiplier = (factor) => (n) => n * factor;
\`\`\`

\`double\` и \`triple\` — независимы: у каждого свой \`factor\`, они друг другу не мешают.

**Что написать.** Функцию \`makeMultiplier(factor)\`. Возвращает функцию, которая умножает свой аргумент на \`factor\`.

## Требования

1. Экспортируй \`makeMultiplier\`.
2. Верни функцию, а не сразу число.
3. Внутренняя функция использует \`factor\` из внешней.

## Примеры

\`makeMultiplier(2)(8)\` → \`16\`

\`makeMultiplier(3)(8)\` → \`24\`

\`makeMultiplier(10)(7)\` → \`70\``,
    starter: `export const makeMultiplier = (factor) => {
  // Верни стрелочную функцию
};
`,
    tests: `import { describe, expect, it } from 'vitest';
import { makeMultiplier } from './index.js';

describe('makeMultiplier', () => {
  it('keeps factor in closure', () => {
    const double = makeMultiplier(2);
    const triple = makeMultiplier(3);
    expect(double(8)).toBe(16);
    expect(triple(8)).toBe(24);
  });
});
`,
    tags: ["closures", "higher-order-functions"],
  }),
  createLearnJsChallenge({
    id: "arrow-sort-by-score",
    title: "Сортировка по score",
    rank: 4,
    group: "Стрелочные функции",
    tag: "JS/arrow-functions",
    description: `У \`sort\` есть подлая особенность: он сортирует массив **на месте** и заодно возвращает его же.

\`\`\`js
const arr = [3, 1, 2];
arr.sort();
arr;  // [1, 2, 3] — исходный массив изменился!
\`\`\`

Если кто-то снаружи держит ссылку на этот массив — он удивится. Защититься просто: сделать копию через \`[...players]\`, а уже её сортировать.

**Сортировка по убыванию.** \`sort\` хочет компаратор, который возвращает отрицательное, нулевое или положительное число. Для убывания:

\`\`\`js
players.sort((a, b) => b.score - a.score)
\`\`\`

\`b - a\` (а не \`a - b\`) — сначала большие.

**Что написать.** Функцию \`sortByScoreDesc(players)\`. Возвращает новый массив игроков от большего \`score\` к меньшему.

## Требования

1. Экспортируй \`sortByScoreDesc\`.
2. Сортируй по убыванию \`score\`.
3. Исходный массив не мутируй.

## Примеры

\`sortByScoreDesc([{ score: 2 }, { score: 9 }, { score: 5 }])\` → \`[{ score: 9 }, { score: 5 }, { score: 2 }]\`

\`sortByScoreDesc([{ score: 1 }])\` → \`[{ score: 1 }]\`

\`sortByScoreDesc([])\` → \`[]\``,
    starter: `export const sortByScoreDesc = (players) => {
  // Верни отсортированную копию
};
`,
    tests: `import { describe, expect, it } from 'vitest';
import { sortByScoreDesc } from './index.js';

describe('sortByScoreDesc', () => {
  it('sorts without mutation', () => {
    const players = [{ name: 'A', score: 2 }, { name: 'B', score: 9 }, { name: 'C', score: 5 }];
    expect(sortByScoreDesc(players).map((player) => player.name)).toEqual(['B', 'C', 'A']);
    expect(players.map((player) => player.name)).toEqual(['A', 'B', 'C']);
  });
});
`,
    tags: ["arrays", "sort"],
  }),
];

export const javascriptSpecialChallenges: ChallengeDefinition[] = [
  createLearnJsChallenge({
    id: "specials-nullish-title",
    title: "Название по умолчанию",
    rank: 1,
    group: "Особенности JavaScript",
    tag: "JS/specials",
    description: `Знаешь, в чём разница между "значения нет" и "значение есть, просто оно пустое"? Для JS это две разные вещи.

\`null\` и \`undefined\` — "ничего нет". А \`''\` (пустая строка) — это уже значение, просто короткое.

Многие пишут такой код:

\`\`\`js
title || 'Untitled'
\`\`\`

И получают сюрприз: \`''\` тоже становится \`'Untitled'\`, потому что \`||\` срабатывает на любом falsy. Если пользователь специально оставил название пустым — ты заменишь его обратно.

Поэтому есть отдельный оператор \`??\` — нулевое слияние. Он срабатывает **только** на \`null\` и \`undefined\`:

\`\`\`js
'' ?? 'Untitled'         // ''
null ?? 'Untitled'       // 'Untitled'
undefined ?? 'Untitled'  // 'Untitled'
\`\`\`

**Что написать.** Функцию \`getDisplayTitle(title)\`. Если \`title\` — \`null\` или \`undefined\`, верни \`'Untitled'\`. Иначе верни как есть.

## Требования

1. Экспортируй \`getDisplayTitle\`.
2. Заменяй только \`null\` и \`undefined\`.
3. Пустая строка должна остаться пустой строкой.

## Примеры

\`getDisplayTitle(null)\` → \`'Untitled'\`

\`getDisplayTitle(undefined)\` → \`'Untitled'\`

\`getDisplayTitle('')\` → \`''\`

\`getDisplayTitle('Docs')\` → \`'Docs'\``,
    starter: `export function getDisplayTitle(title) {
  // Верни title или значение по умолчанию
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { getDisplayTitle } from './index.js';

describe('getDisplayTitle', () => {
  it('uses default only for nullish values', () => {
    expect(getDisplayTitle(null)).toBe('Untitled');
    expect(getDisplayTitle(undefined)).toBe('Untitled');
    expect(getDisplayTitle('')).toBe('');
    expect(getDisplayTitle('Docs')).toBe('Docs');
  });
});
`,
    tags: ["nullish", "defaults"],
  }),
  createLearnJsChallenge({
    id: "specials-same-type",
    title: "Значение и тип",
    rank: 0,
    group: "Особенности JavaScript",
    tag: "JS/specials",
    description: `В JavaScript есть два знака равенства: \`==\` и \`===\`. Кажется одинаково, но на деле это разные вселенные.

\`==\` пытается быть умным и приводит типы. И иногда это приводит к чудесам:

\`\`\`js
0 == false     // true
'1' == 1       // true
'' == 0        // true
null == undefined  // true
\`\`\`

\`===\` (строгое равенство) ничего не приводит — сравнивает как есть, по значению и по типу:

\`\`\`js
0 === false    // false
'1' === 1      // false
\`\`\`

Хорошее правило: всегда писать \`===\`, кроме редких случаев, когда тебе действительно нужно поведение \`==\`.

**Что написать.** Функцию \`isSameValueAndType(a, b)\`. Возвращает \`true\`, только если \`a\` и \`b\` равны без всяких преобразований.

## Требования

1. Экспортируй \`isSameValueAndType\`.
2. Используй \`===\`.
3. Никаких преобразований к строке или числу перед сравнением.

## Примеры

\`isSameValueAndType(1, 1)\` → \`true\`

\`isSameValueAndType(1, '1')\` → \`false\`

\`isSameValueAndType(false, 0)\` → \`false\``,
    starter: `export function isSameValueAndType(a, b) {
  // Верни true только для строгого равенства
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { isSameValueAndType } from './index.js';

describe('isSameValueAndType', () => {
  it('does not coerce values', () => {
    expect(isSameValueAndType(1, 1)).toBe(true);
    expect(isSameValueAndType(1, '1')).toBe(false);
    expect(isSameValueAndType(false, 0)).toBe(false);
  });
});
`,
    tags: ["strict-equality", "types"],
  }),
  createLearnJsChallenge({
    id: "specials-safe-city",
    title: "Безопасный город",
    rank: 2,
    group: "Особенности JavaScript",
    tag: "JS/specials",
    description: `Представь матрёшку: \`user → address → city\`. Чтобы достать город, надо открыть три фигурки по порядку. А что если средней фигурки нет?

\`\`\`js
const user = null;
user.address.city;  // TypeError: Cannot read property 'address' of null
\`\`\`

Программа падает на первой же дырке. Раньше это лечили через \`&&\`-цепочки длиной в полстраницы. Сейчас есть оператор \`?.\` — опциональная цепочка:

\`\`\`js
user?.address?.city  // undefined вместо ошибки
\`\`\`

Если в любой точке встретится \`null\` или \`undefined\` — вся цепочка сразу превращается в \`undefined\`, без падения.

Дальше подставить дефолт — дело \`??\` или \`||\`:

\`\`\`js
user?.address?.city ?? 'unknown'
\`\`\`

**Что написать.** Функцию \`getUserCity(user)\`. Возвращает \`user.address.city\` если он есть, иначе \`'unknown'\`.

## Требования

1. Экспортируй \`getUserCity\`.
2. Безопасно обработай \`null\` и отсутствующие поля.
3. Если города нет — верни \`'unknown'\`.

## Примеры

\`getUserCity({ address: { city: 'Moscow' } })\` → \`'Moscow'\`

\`getUserCity({ address: {} })\` → \`'unknown'\`

\`getUserCity(null)\` → \`'unknown'\``,
    starter: `export function getUserCity(user) {
  // Верни user.address.city или "unknown"
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { getUserCity } from './index.js';

describe('getUserCity', () => {
  it('reads nested city safely', () => {
    expect(getUserCity({ address: { city: 'Moscow' } })).toBe('Moscow');
    expect(getUserCity({ address: {} })).toBe('unknown');
    expect(getUserCity(null)).toBe('unknown');
  });
});
`,
    tags: ["optional-chaining", "objects"],
  }),
  createLearnJsChallenge({
    id: "specials-first-divisible",
    title: "Первое делимое",
    rank: 2,
    group: "Особенности JavaScript",
    tag: "JS/specials",
    description: `Когда ищешь нужный товар на полке, ты не пересчитываешь всю полку — берёшь первый подходящий и идёшь к кассе. Так же и в коде: проверять весь массив, когда нужен один элемент — пустая трата.

В JavaScript есть оператор \`%\` — остаток от деления. Если \`a % b\` равен нулю — значит, \`a\` делится на \`b\` нацело:

\`\`\`js
12 % 6   // 0  → 12 делится на 6
14 % 6   // 2  → не делится
\`\`\`

Чтобы остановиться на первом совпадении, удобно использовать обычный \`for\` с \`return\`. Дошёл до подходящего — выдал, дальше не идёшь.

**Что написать.** Функцию \`findFirstDivisible(values, divisor)\`. Возвращает первое число из массива, которое делится на \`divisor\` без остатка. Нет такого — \`null\`.

## Требования

1. Экспортируй \`findFirstDivisible\`.
2. Проверяй через \`%\`.
3. Верни **первое** подходящее число (не последнее).
4. Если совпадений нет — \`null\`.

## Примеры

\`findFirstDivisible([5, 7, 12, 18], 6)\` → \`12\`

\`findFirstDivisible([5, 7, 11], 3)\` → \`null\`

\`findFirstDivisible([4, 8, 12], 4)\` → \`4\``,
    starter: `export function findFirstDivisible(values, divisor) {
  // Найди первое подходящее число
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { findFirstDivisible } from './index.js';

describe('findFirstDivisible', () => {
  it('returns first divisible value', () => {
    expect(findFirstDivisible([5, 7, 12, 18], 6)).toBe(12);
    expect(findFirstDivisible([5, 7, 11], 3)).toBe(null);
  });
});
`,
    tags: ["loops", "control-flow"],
  }),
  createLearnJsChallenge({
    id: "specials-access-label",
    title: "Метка доступа",
    rank: 3,
    group: "Особенности JavaScript",
    tag: "JS/specials",
    description: `Когда условий много, легко скатиться в лестницу из \`if/else if/else\` глубиной в десять уровней. После третьего вложенного \`if\` ты уже не помнишь, при каких условиях оказался в текущей ветке.

Хитрость — сначала отсеивать стоп-факторы и сразу выходить через \`return\`:

\`\`\`js
if (!user.active) return 'blocked';
if (user.age < 18) return 'minor';
// дальше — только активные взрослые
\`\`\`

Этот приём называют **early return** или "ранний возврат". После каждой проверки оставшийся код упрощается, потому что часть случаев уже отсечена.

**Порядок проверок имеет значение.** \`blocked\` побеждает \`minor\` — заблокированный 16-летний всё равно \`'blocked'\`, а не \`'minor'\`.

**Что написать.** Функцию \`getAccessLabel(user)\`. Возвращает строку с уровнем доступа.

## Требования

1. Экспортируй \`getAccessLabel\`.
2. \`active: false\` → \`'blocked'\` (раньше всех остальных проверок).
3. \`age < 18\` → \`'minor'\`.
4. Активный взрослый с \`paid: true\` → \`'full'\`.
5. Остальные активные взрослые → \`'trial'\`.

## Примеры

\`getAccessLabel({ active: false, age: 30, paid: true })\` → \`'blocked'\`

\`getAccessLabel({ active: true, age: 16, paid: true })\` → \`'minor'\`

\`getAccessLabel({ active: true, age: 30, paid: true })\` → \`'full'\`

\`getAccessLabel({ active: true, age: 30, paid: false })\` → \`'trial'\``,
    starter: `export function getAccessLabel(user) {
  // Верни метку доступа
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { getAccessLabel } from './index.js';

describe('getAccessLabel', () => {
  it('classifies access', () => {
    expect(getAccessLabel({ active: false, age: 30, paid: true })).toBe('blocked');
    expect(getAccessLabel({ active: true, age: 16, paid: true })).toBe('minor');
    expect(getAccessLabel({ active: true, age: 30, paid: true })).toBe('full');
    expect(getAccessLabel({ active: true, age: 30, paid: false })).toBe('trial');
  });
});
`,
    tags: ["conditions", "early-return"],
  }),
  createLearnJsChallenge({
    id: "specials-normalize-number",
    title: "Нормализация числа",
    rank: 3,
    group: "Особенности JavaScript",
    tag: "JS/specials",
    description: `Из формы всё приходит строками — даже число \`42\` пользователь набирает как \`'42'\`. Перед вычислениями строку надо честно превратить в число.

\`Number(value)\` пытается преобразовать что угодно в число, но результат бывает странным:

\`\`\`js
Number('42')      // 42       ✓
Number('abc')     // NaN
Number('')        // 0        ← сюрприз!
Number(Infinity)  // Infinity
\`\`\`

**Странная штука.** \`Number('')\` — это \`0\`. Пустая строка превращается в ноль, как будто это нормально.

Поэтому одного \`Number()\` мало. Нужен фильтр на финальное значение: \`Number.isFinite(n)\` отсекает и \`NaN\`, и \`Infinity\`, и \`-Infinity\` — оставляет только нормальные конечные числа.

\`\`\`js
Number.isFinite(NaN)       // false
Number.isFinite(Infinity)  // false
Number.isFinite(42)        // true
\`\`\`

А пустую строку отлови отдельно — её \`Number\` молча превратит в \`0\`.

**Что написать.** Функцию \`normalizeNumber(value)\`. Возвращает конечное число — или \`null\`, если значение не число.

## Требования

1. Экспортируй \`normalizeNumber\`.
2. Строка \`'42'\` → \`42\`.
3. Обычное число — без изменений.
4. \`''\`, \`'abc'\`, \`Infinity\` → \`null\`.
5. Возвращай именно \`null\`, не \`0\` или \`undefined\`.

## Примеры

\`normalizeNumber('42')\` → \`42\`

\`normalizeNumber(3.5)\` → \`3.5\`

\`normalizeNumber('')\` → \`null\`

\`normalizeNumber('abc')\` → \`null\`

\`normalizeNumber(Infinity)\` → \`null\``,
    starter: `export function normalizeNumber(value) {
  // Верни number или null
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { normalizeNumber } from './index.js';

describe('normalizeNumber', () => {
  it('normalizes finite numbers', () => {
    expect(normalizeNumber('42')).toBe(42);
    expect(normalizeNumber(3.5)).toBe(3.5);
  });

  it('rejects unsafe values', () => {
    expect(normalizeNumber('')).toBe(null);
    expect(normalizeNumber('abc')).toBe(null);
    expect(normalizeNumber(Infinity)).toBe(null);
  });
});
`,
    tags: ["numbers", "nan"],
  }),
];

export const codeQualityChallenges: ChallengeDefinition[] = [
  createLearnJsChallenge({
    id: "quality-fix-average",
    title: "Почини среднее",
    rank: 2,
    group: "Качество кода",
    tag: "JS/code-quality",
    description: `Тебе досталась функция, которая считает среднее арифметическое — и считает неправильно. Найди баг и почини.

Загляни в стартовый код:

\`\`\`js
for (const value of values) {
  total = value;
}
\`\`\`

Видишь? \`total = value\` вместо \`total += value\`. Один символ — и вместо суммы получается просто последнее число массива.

**Ещё один баг — деление на ноль.** Если массив пустой, \`values.length\` равен \`0\`, и \`total / 0\` даст \`NaN\`. Это нужно отдельно отловить и вернуть \`0\`.

**Что починить.** Функцию \`getAverage(values)\`. Возвращает среднее арифметическое массива чисел. Для пустого массива — \`0\`.

## Требования

1. Экспортируй \`getAverage\`.
2. Считай настоящую сумму (через \`+=\`).
3. Дели сумму на количество.
4. Пустой массив → \`0\`, не \`NaN\`.

## Примеры

\`getAverage([2, 4, 6])\` → \`4\`

\`getAverage([10, 20])\` → \`15\`

\`getAverage([])\` → \`0\``,
    starter: `export function getAverage(values) {
  let total = 0;

  for (const value of values) {
    total = value;
  }

  return total / values.length;
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { getAverage } from './index.js';

describe('getAverage', () => {
  it('returns arithmetic average', () => {
    expect(getAverage([2, 4, 6])).toBe(4);
    expect(getAverage([10, 20])).toBe(15);
  });

  it('handles empty arrays', () => {
    expect(getAverage([])).toBe(0);
  });
});
`,
    tags: ["debugging", "tests"],
  }),
  createLearnJsChallenge({
    id: "quality-early-return",
    title: "Ранний возврат",
    rank: 3,
    group: "Качество кода",
    tag: "JS/code-quality",
    description: `Сравни два варианта одной и той же логики. Сначала через вложенные \`if\`:

\`\`\`js
if (user.active) {
  if (cart.total >= 1000) {
    if (user.vip) {
      return 0.2;
    } else {
      return 0.1;
    }
  } else {
    return 0;
  }
} else {
  return 0;
}
\`\`\`

А теперь через ранний возврат:

\`\`\`js
if (!user.active) return 0;
if (cart.total < 1000) return 0;
if (user.vip) return 0.2;
return 0.1;
\`\`\`

Один и тот же результат. Но второй вариант читается сверху вниз как чек-лист: "не активен — мимо, корзина мала — мимо, VIP — двадцать процентов, иначе — десять".

Глубокая вложенность утомляет глаза. Ранний \`return\` сразу выкидывает плохие случаи и оставляет основной поток на одном уровне.

**Что написать.** Функцию \`getDiscount(user, cart)\`. Возвращает размер скидки.

## Требования

1. Экспортируй \`getDiscount\`.
2. \`user.active\` не \`true\` → \`0\`.
3. \`cart.total < 1000\` → \`0\`.
4. VIP → \`0.2\`.
5. Иначе → \`0.1\`.

## Примеры

\`getDiscount({ active: false, vip: true }, { total: 5000 })\` → \`0\`

\`getDiscount({ active: true, vip: true }, { total: 500 })\` → \`0\`

\`getDiscount({ active: true, vip: true }, { total: 5000 })\` → \`0.2\`

\`getDiscount({ active: true, vip: false }, { total: 5000 })\` → \`0.1\``,
    starter: `export function getDiscount(user, cart) {
  // Сделай функцию простой для чтения
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { getDiscount } from './index.js';

describe('getDiscount', () => {
  it('rejects inactive users and small carts', () => {
    expect(getDiscount({ active: false, vip: true }, { total: 5000 })).toBe(0);
    expect(getDiscount({ active: true, vip: true }, { total: 500 })).toBe(0);
  });

  it('returns discount by status', () => {
    expect(getDiscount({ active: true, vip: true }, { total: 5000 })).toBe(0.2);
    expect(getDiscount({ active: true, vip: false }, { total: 5000 })).toBe(0.1);
  });
});
`,
    tags: ["coding-style", "early-return"],
  }),
  createLearnJsChallenge({
    id: "quality-readable-flags",
    title: "Понятные флаги",
    rank: 4,
    group: "Качество кода",
    tag: "JS/code-quality",
    description: `Прочитай это вслух за один вдох:

\`\`\`js
return post.title && post.body && (user.role === 'editor' || user.role === 'admin') && !user.blocked;
\`\`\`

Получилось? Глаза запинаются на третьей операции, а через неделю сам автор не вспомнит, что тут проверяется.

Хитрость — давать кусочкам имена:

\`\`\`js
const hasContent = post.title && post.body;
const isEditor = user.role === 'editor' || user.role === 'admin';
const isAllowed = isEditor && !user.blocked;
return hasContent && isAllowed;
\`\`\`

Промежуточные переменные ничего не стоят, зато превращают шифр в человеческий текст. Имена сами объясняют, что и зачем проверяется.

**Что написать.** Функцию \`canPublish(post, user)\`. Возвращает \`true\`, если посту можно выйти.

## Требования

1. Экспортируй \`canPublish\`.
2. У поста должны быть непустые \`title\` и \`body\`.
3. Роль — \`'editor'\` или \`'admin'\`.
4. \`user.blocked\` равно \`true\` → \`false\`.
5. Используй промежуточные переменные с понятными именами.

## Примеры

\`canPublish({ title: 'A', body: 'B' }, { role: 'editor' })\` → \`true\`

\`canPublish({ title: 'A', body: 'B' }, { role: 'admin', blocked: true })\` → \`false\`

\`canPublish({ title: '', body: 'B' }, { role: 'admin' })\` → \`false\`

\`canPublish({ title: 'A', body: 'B' }, { role: 'viewer' })\` → \`false\``,
    starter: `export function canPublish(post, user) {
  // Реализуй без неочевидных сокращений
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { canPublish } from './index.js';

describe('canPublish', () => {
  it('allows editors and admins with complete posts', () => {
    expect(canPublish({ title: 'A', body: 'B' }, { role: 'editor' })).toBe(true);
    expect(canPublish({ title: 'A', body: 'B' }, { role: 'admin' })).toBe(true);
  });

  it('rejects incomplete posts and blocked users', () => {
    expect(canPublish({ title: '', body: 'B' }, { role: 'admin' })).toBe(false);
    expect(canPublish({ title: 'A', body: 'B' }, { role: 'viewer' })).toBe(false);
    expect(canPublish({ title: 'A', body: 'B' }, { role: 'admin', blocked: true })).toBe(false);
  });
});
`,
    tags: ["ninja-code", "conditions"],
  }),
  createLearnJsChallenge({
    id: "quality-debug-trace",
    title: "Трассировка шагов",
    rank: 4,
    group: "Качество кода",
    tag: "JS/code-quality",
    description: `Когда конвейер из десяти шагов выдал не то — где сломалось? \`console.log\` после каждого шага работает, но захламляет код.

Удобнее — собирать промежуточные значения в массив. Это и есть **трассировка**: история значения по шагам.

\`\`\`js
runWithTrace(2, [
  (x) => x + 3,   // шаг 1: 5
  (x) => x * 4,   // шаг 2: 20
  (x) => x - 5,   // шаг 3: 15
]);
// { result: 15, trace: [5, 20, 15] }
\`\`\`

Начальное значение \`2\` в \`trace\` **не входит** — туда идут только результаты после применения функций.

**Что написать.** Функцию \`runWithTrace(initial, steps)\`. Прогоняет \`initial\` через все функции из \`steps\` по очереди.

## Требования

1. Экспортируй \`runWithTrace\`.
2. Начни со значения \`initial\`.
3. Применяй функции из \`steps\` по очереди к текущему значению.
4. В \`trace\` записывай результат **после** каждого шага (без начального значения).
5. Верни \`{ result, trace }\`.

## Примеры

\`runWithTrace(2, [(x) => x + 3, (x) => x * 4, (x) => x - 5])\` → \`{ result: 15, trace: [5, 20, 15] }\`

\`runWithTrace(10, [])\` → \`{ result: 10, trace: [] }\`

\`runWithTrace(0, [(x) => x + 1])\` → \`{ result: 1, trace: [1] }\``,
    starter: `export function runWithTrace(initial, steps) {
  // Верни финальный результат и массив промежуточных значений
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { runWithTrace } from './index.js';

describe('runWithTrace', () => {
  it('returns result and trace', () => {
    const output = runWithTrace(2, [
      (value) => value + 3,
      (value) => value * 4,
      (value) => value - 5,
    ]);

    expect(output).toEqual({ result: 15, trace: [5, 20, 15] });
  });
});
`,
    tags: ["debugging", "callbacks"],
  }),
  createLearnJsChallenge({
    id: "quality-comment-worthy",
    title: "Комментарий по делу",
    rank: 2,
    group: "Качество кода",
    tag: "JS/code-quality",
    description: `Сравни два комментария:

\`\`\`js
// прибавляем 1 к i
i = i + 1;
\`\`\`

Бесполезен — код и так очевиден.

\`\`\`js
// 408 Request Timeout и 429 Too Many Requests — клиент может попробовать ещё раз;
// 5xx — сервер сам сигнализирует, что временно сломан
return status === 408 || status === 429 || (status >= 500 && status < 600);
\`\`\`

Полезен — объясняет **почему** именно эти числа, а не другие.

Хорошее имя функции часто заменяет комментарий. \`isRetryableStatus\` сразу говорит, что внутри — правило про повтор. Если код из тела всё равно требует комментария, — значит, там есть знание, которое не удалось выразить именами.

**Какие статусы повторяемы.** \`408\` (таймаут), \`429\` (слишком много запросов) и весь диапазон \`5xx\` (\`500–599\`). Остальные — нет: \`400\` Bad Request с тем же телом всё равно вернёт ошибку.

**Что написать.** Функцию \`isRetryableStatus(status)\`. Возвращает \`true\` для повторяемых HTTP-статусов.

## Требования

1. Экспортируй \`isRetryableStatus\`.
2. \`true\` для \`408\` и \`429\`.
3. \`true\` для \`500\`–\`599\` включительно.
4. \`false\` для всего остального.

## Примеры

\`isRetryableStatus(408)\` → \`true\`

\`isRetryableStatus(429)\` → \`true\`

\`isRetryableStatus(503)\` → \`true\`

\`isRetryableStatus(404)\` → \`false\`

\`isRetryableStatus(600)\` → \`false\``,
    starter: `export function isRetryableStatus(status) {
  // Название функции должно объяснять правило лучше комментария
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { isRetryableStatus } from './index.js';

describe('isRetryableStatus', () => {
  it('accepts retryable statuses', () => {
    expect(isRetryableStatus(408)).toBe(true);
    expect(isRetryableStatus(429)).toBe(true);
    expect(isRetryableStatus(503)).toBe(true);
  });

  it('rejects non-retryable statuses', () => {
    expect(isRetryableStatus(400)).toBe(false);
    expect(isRetryableStatus(404)).toBe(false);
    expect(isRetryableStatus(600)).toBe(false);
  });
});
`,
    tags: ["comments", "naming"],
  }),
];

export const polyfillChallenges: ChallengeDefinition[] = [
  createLearnJsChallenge({
    id: "polyfill-my-includes",
    title: "myIncludes",
    rank: 4,
    group: "Полифилы",
    tag: "JS/polyfills",
    description: `**Полифил** — это твоя собственная реализация метода, который и так есть в языке. Зачем? Чтобы понять, как он работает изнутри.

\`includes\` отвечает на вопрос: "это значение есть в массиве?". С первого взгляда — в одну строчку через \`indexOf\`. Но есть пара ловушек.

**Хитрость 1. Отрицательный \`fromIndex\`.** Если передать \`-2\`, поиск должен начаться за два элемента до конца. Формула: \`Math.max(array.length + fromIndex, 0)\`.

**Хитрость 2. \`NaN\`.** \`indexOf\` использует \`===\`, а \`NaN === NaN\` — это \`false\`. Знаешь, как программно сравнить два \`NaN\`?

\`\`\`js
NaN === NaN          // false  — да-да, JS такой
Number.isNaN(NaN)    // true
\`\`\`

Поэтому в полифиле нужно отдельно проверять: если оба значения — \`NaN\`, считаем их равными.

**Что написать.** Функцию \`myIncludes(array, searchElement, fromIndex = 0)\`. Возвращает \`true\`, если \`searchElement\` есть в массиве начиная с \`fromIndex\`.

## Требования

1. Экспортируй \`myIncludes\`.
2. Не вызывай встроенный \`array.includes\`.
3. Отрицательный \`fromIndex\` отсчитывай от конца.
4. \`NaN\` считается равным \`NaN\`.

## Примеры

\`myIncludes([1, 2, 3], 2)\` → \`true\`

\`myIncludes([1, 2, 3], 1, 1)\` → \`false\`

\`myIncludes([1, 2, 3], 2, -2)\` → \`true\`

\`myIncludes([1, NaN, 3], NaN)\` → \`true\``,
    starter: `export function myIncludes(array, searchElement, fromIndex = 0) {
  // Реализуй includes без вызова array.includes
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { myIncludes } from './index.js';

describe('myIncludes', () => {
  it('finds values with fromIndex', () => {
    expect(myIncludes([1, 2, 3], 2)).toBe(true);
    expect(myIncludes([1, 2, 3], 1, 1)).toBe(false);
    expect(myIncludes([1, 2, 3], 2, -2)).toBe(true);
  });

  it('finds NaN', () => {
    expect(myIncludes([1, NaN, 3], NaN)).toBe(true);
  });
});
`,
    tags: ["polyfill", "arrays", "es2016"],
  }),
  createLearnJsChallenge({
    id: "polyfill-my-find",
    title: "myFind",
    rank: 4,
    group: "Полифилы",
    tag: "JS/polyfills",
    description: `\`find\` — как поиск ключа в кармане. Нашёл — выдал, дальше не лезешь.

\`\`\`js
[3, 8, 10].find((n) => n > 5)  // 8
\`\`\`

Тут важно две вещи. Первая — остановиться на первом совпадении (а не пройти весь массив). Вторая — ничего не нашёл, верни \`undefined\` (а не \`null\` или \`-1\`).

**Что передаёт \`predicate\`.** Не только значение — ещё индекс и весь массив:

\`\`\`js
predicate(value, index, array)
\`\`\`

Большинство колбэков использует только \`value\`, но тесты могут проверить, что ты передаёшь все три аргумента.

**Что написать.** Функцию \`myFind(array, predicate)\`. Возвращает первый элемент, для которого \`predicate\` вернул truthy. Иначе — \`undefined\`.

## Требования

1. Экспортируй \`myFind\`.
2. Не вызывай встроенный \`array.find\`.
3. Вызывай \`predicate(value, index, array)\`.
4. Верни первый подходящий элемент.
5. Не нашёл — \`undefined\`.

## Примеры

\`myFind([3, 8, 10], (v) => v > 5)\` → \`8\`

\`myFind([3, 4], (v) => v > 5)\` → \`undefined\`

\`myFind([4, 5, 6], (_, i) => i === 1)\` → \`5\``,
    starter: `export function myFind(array, predicate) {
  // Реализуй find без вызова array.find
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { myFind } from './index.js';

describe('myFind', () => {
  it('returns first matching value', () => {
    expect(myFind([3, 8, 10], (value) => value > 5)).toBe(8);
    expect(myFind([3, 4], (value) => value > 5)).toBe(undefined);
  });

  it('passes index and array', () => {
    const source = [4, 5, 6];
    expect(myFind(source, (value, index, array) => array === source && index === 1)).toBe(5);
  });
});
`,
    tags: ["polyfill", "arrays", "callbacks"],
  }),
  createLearnJsChallenge({
    id: "polyfill-my-some",
    title: "mySome",
    rank: 4,
    group: "Полифилы",
    tag: "JS/polyfills",
    description: `\`some\` — это вопрос "есть ли хоть один?". В массиве \`[1, 3, 8]\` есть хоть одно чётное число? Да, \`8\`. Значит \`some\` → \`true\`.

\`\`\`js
[1, 3, 8].some((n) => n % 2 === 0)  // true
[1, 3, 5].some((n) => n % 2 === 0)  // false
\`\`\`

Ключевая деталь — **короткое замыкание**. Как только нашёл первый подходящий элемент, дальше можно не идти. Если массив на миллион элементов, а нужный лежит на втором месте — остальные \`999_998\` проверять незачем.

\`\`\`js
let calls = 0;
mySome([2, 4, 6], () => { calls++; return true; });
calls;  // 1, не 3
\`\`\`

**Что написать.** Функцию \`mySome(array, predicate)\`. Возвращает \`true\`, если хотя бы один элемент проходит проверку.

## Требования

1. Экспортируй \`mySome\`.
2. Не вызывай встроенный \`array.some\`.
3. Вызывай \`predicate(value, index, array)\`.
4. Остановись на первом совпадении.
5. Нет совпадений → \`false\`.

## Примеры

\`mySome([1, 3, 8], (v) => v % 2 === 0)\` → \`true\`

\`mySome([1, 3, 5], (v) => v % 2 === 0)\` → \`false\`

\`mySome([], () => true)\` → \`false\``,
    starter: `export function mySome(array, predicate) {
  // Реализуй some без вызова array.some
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { mySome } from './index.js';

describe('mySome', () => {
  it('checks if any value matches', () => {
    expect(mySome([1, 3, 8], (value) => value % 2 === 0)).toBe(true);
    expect(mySome([1, 3, 5], (value) => value % 2 === 0)).toBe(false);
  });

  it('stops after a match', () => {
    let calls = 0;
    mySome([2, 4, 6], () => {
      calls += 1;
      return true;
    });
    expect(calls).toBe(1);
  });
});
`,
    tags: ["polyfill", "arrays", "short-circuit"],
  }),
  createLearnJsChallenge({
    id: "polyfill-my-every",
    title: "myEvery",
    rank: 4,
    group: "Полифилы",
    tag: "JS/polyfills",
    description: `\`every\` — это вопрос "все ли подходят?". \`some\` останавливается на первом успехе, \`every\` — на первом провале.

\`\`\`js
[2, 4, 6].every((n) => n % 2 === 0)  // true
[2, 3, 6].every((n) => n % 2 === 0)  // false (споткнулся на 3)
\`\`\`

**Странная штука.** Как думаешь, что вернёт \`every\` для пустого массива?

\`\`\`js
[].every(() => false)  // true
\`\`\`

Да, \`true\`. Это математическое соглашение: "всё, чего нет, удовлетворяет любому условию". Звучит парадоксально, но если разобраться: чтобы вернуть \`false\`, нужно найти хотя бы один не подходящий элемент. В пустом массиве искать нечего. Значит, провалов нет — значит, все подходят.

**Что написать.** Функцию \`myEvery(array, predicate)\`. Возвращает \`true\`, если все элементы проходят проверку.

## Требования

1. Экспортируй \`myEvery\`.
2. Не вызывай встроенный \`array.every\`.
3. Вызывай \`predicate(value, index, array)\`.
4. Останавливайся на первом провале.
5. Пустой массив → \`true\`.

## Примеры

\`myEvery([2, 4, 6], (v) => v % 2 === 0)\` → \`true\`

\`myEvery([2, 3, 6], (v) => v % 2 === 0)\` → \`false\`

\`myEvery([], () => false)\` → \`true\``,
    starter: `export function myEvery(array, predicate) {
  // Реализуй every без вызова array.every
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { myEvery } from './index.js';

describe('myEvery', () => {
  it('checks all values', () => {
    expect(myEvery([2, 4, 6], (value) => value % 2 === 0)).toBe(true);
    expect(myEvery([2, 3, 6], (value) => value % 2 === 0)).toBe(false);
    expect(myEvery([], () => false)).toBe(true);
  });
});
`,
    tags: ["polyfill", "arrays", "short-circuit"],
  }),
  createLearnJsChallenge({
    id: "polyfill-my-map",
    title: "myMap",
    rank: 4,
    group: "Полифилы",
    tag: "JS/polyfills",
    description: `Представь конвейер на заводе: на одной стороне ставят детали, на другой выходят детали побольше или покрашенные. Сколько вошло — столько и вышло, в том же порядке.

Это и есть \`map\`. Каждый элемент преобразуется по своему правилу, длина массива не меняется.

\`\`\`js
[1, 2, 3].map((n) => n * 10)  // [10, 20, 30]
\`\`\`

**Главное правило — не трогай исходный.** \`map\` возвращает **новый** массив. Если ты пишешь \`array[i] = callback(array[i])\`, ты ломаешь оригинал — это уже не \`map\`.

\`\`\`js
const result = [];
for (let i = 0; i < array.length; i++) {
  result.push(callback(array[i], i, array));
}
\`\`\`

**Что написать.** Функцию \`myMap(array, callback)\`. Возвращает новый массив той же длины с преобразованными элементами.

## Требования

1. Экспортируй \`myMap\`.
2. Не вызывай встроенный \`array.map\`.
3. Вызывай \`callback(value, index, array)\`.
4. Длина результата равна длине входа.
5. Исходный массив не меняй.

## Примеры

\`myMap([3, 4, 5], (v, i) => v + i)\` → \`[3, 5, 7]\`

\`myMap([1, 2, 3], (v) => v * 10)\` → \`[10, 20, 30]\`

\`myMap([], (v) => v)\` → \`[]\``,
    starter: `export function myMap(array, callback) {
  // Реализуй map без вызова array.map
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { myMap } from './index.js';

describe('myMap', () => {
  it('maps values with index', () => {
    const source = [3, 4, 5];
    expect(myMap(source, (value, index) => value + index)).toEqual([3, 5, 7]);
    expect(source).toEqual([3, 4, 5]);
  });
});
`,
    tags: ["polyfill", "arrays", "callbacks"],
  }),
  createLearnJsChallenge({
    id: "polyfill-my-filter",
    title: "myFilter",
    rank: 4,
    group: "Полифилы",
    tag: "JS/polyfills",
    description: `Если \`map\` — конвейер, то \`filter\` — сито. На входе массив, на выходе тоже массив, но только из тех элементов, которые прошли проверку. Длина может уменьшиться (или стать нулевой).

\`\`\`js
[1, 2, 3, 4].filter((n) => n > 2)  // [3, 4]
\`\`\`

Логика простая: пройти массив, для каждого вызвать \`predicate\`, и если вернул truthy — положить в результат.

\`\`\`js
const result = [];
for (let i = 0; i < array.length; i++) {
  if (predicate(array[i], i, array)) {
    result.push(array[i]);
  }
}
\`\`\`

И, как и в \`map\` — **исходный массив не трогаем**. Возвращаем новый.

**Что написать.** Функцию \`myFilter(array, predicate)\`. Возвращает новый массив из элементов, прошедших проверку.

## Требования

1. Экспортируй \`myFilter\`.
2. Не вызывай встроенный \`array.filter\`.
3. Вызывай \`predicate(value, index, array)\`.
4. Добавляй только подходящие элементы.
5. Исходный массив не меняй.

## Примеры

\`myFilter([1, 2, 3, 4], (v) => v > 2)\` → \`[3, 4]\`

\`myFilter(['a', 'b', 'c'], (_, i) => i !== 1)\` → \`['a', 'c']\`

\`myFilter([1, 2, 3], () => false)\` → \`[]\``,
    starter: `export function myFilter(array, predicate) {
  // Реализуй filter без вызова array.filter
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { myFilter } from './index.js';

describe('myFilter', () => {
  it('filters values', () => {
    expect(myFilter([1, 2, 3, 4], (value) => value > 2)).toEqual([3, 4]);
  });

  it('passes index', () => {
    expect(myFilter(['a', 'b', 'c'], (_value, index) => index !== 1)).toEqual(['a', 'c']);
  });
});
`,
    tags: ["polyfill", "arrays", "callbacks"],
  }),
  createLearnJsChallenge({
    id: "polyfill-my-reduce",
    title: "myReduce",
    rank: 6,
    group: "Полифилы",
    tag: "JS/polyfills",
    description: `\`reduce\` — самый универсальный из всех методов массива. Он сворачивает массив в одно значение по любому правилу: сумму, произведение, максимум, объект, новый массив — что угодно.

\`\`\`js
[1, 2, 3].reduce((acc, n) => acc + n, 0)  // 6
\`\`\`

\`acc\` (аккумулятор) — то, что переносится из шага в шаг. На каждом шаге \`reducer\` получает старый \`acc\` и текущее значение, возвращает новый \`acc\`.

**Сложность тут — два режима.**

**Режим 1: с \`initialValue\`.** Простой. Аккумулятор начинается с \`initialValue\`, обходим весь массив.

**Режим 2: без \`initialValue\`.** Аккумулятор берётся из первого элемента массива, обход начинается со второго:

\`\`\`js
[2, 3, 4].reduce((acc, n) => acc * n)  // 24
// шаг 1: acc=2, n=3 → 6
// шаг 2: acc=6, n=4 → 24
\`\`\`

**Странная штука.** Что если массив пустой и \`initialValue\` не передан?

\`\`\`js
[].reduce((acc, n) => acc + n)  // TypeError: Reduce of empty array with no initial value
\`\`\`

JS специально бросает \`TypeError\` — у него нет ни первого элемента, ни запасного значения, нечего возвращать. Это нужно повторить.

Различить режимы можно по \`arguments.length\` или через явную проверку \`initialValue !== undefined\` (но осторожно: \`undefined\` может быть и легитимным начальным значением — лучше \`arguments.length\`).

**Что написать.** Функцию \`myReduce(array, reducer, initialValue)\`. Сворачивает массив в одно значение.

## Требования

1. Экспортируй \`myReduce\`.
2. Не вызывай встроенный \`array.reduce\`.
3. Вызывай \`reducer(accumulator, value, index, array)\`.
4. Поддержи оба режима: с \`initialValue\` и без него.
5. Пустой массив без \`initialValue\` → \`TypeError\`.

## Примеры

\`myReduce([1, 2, 3], (acc, v) => acc + v, 10)\` → \`16\`

\`myReduce([2, 3, 4], (acc, v) => acc * v)\` → \`24\`

\`myReduce([], (acc, v) => acc + v)\` → \`TypeError\``,
    starter: `export function myReduce(array, reducer, initialValue) {
  // Реализуй reduce без вызова array.reduce
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { myReduce } from './index.js';

describe('myReduce', () => {
  it('reduces with initial value', () => {
    expect(myReduce([1, 2, 3], (total, value) => total + value, 10)).toBe(16);
  });

  it('reduces without initial value', () => {
    expect(myReduce([2, 3, 4], (total, value) => total * value)).toBe(24);
  });

  it('throws for empty array without initial value', () => {
    expect(() => myReduce([], (total, value) => total + value)).toThrow(TypeError);
  });
});
`,
    tags: ["polyfill", "arrays", "reduce"],
  }),
];

export const objectsBasicsChallenges: ChallengeDefinition[] = [
  createLearnJsChallenge({
    id: "objects-create-user",
    title: "Создай объект пользователя",
    rank: 0,
    group: "Объекты",
    tag: "JS/objects-basics",
    description: `Представь карточку в картотеке: одна карточка — один человек. На ней написано имя, возраст, права доступа. Так и в JavaScript — пользователя описывают одним объектом, а не тремя разрозненными переменными.

Создать его проще всего литералом — фигурными скобками со всеми полями сразу:

\`\`\`js
const user = { name: 'Ada', age: 36 };
\`\`\`

Есть ещё \`new Object()\`, но в живом коде ты его почти не встретишь.

**Что написать.** Функцию \`createUser(name, age)\`. Она собирает карточку из трёх полей: \`name\`, \`age\` и \`isAdmin: false\`. Новый человек всегда заходит обычным юзером — админство выдают потом, отдельно.

## Требования

1. Используй литерал \`{ ... }\`, не \`new Object()\`.
2. Поля называются ровно \`name\`, \`age\`, \`isAdmin\`.
3. \`isAdmin\` всегда \`false\`.
4. Экспортируй функцию \`createUser\`.

## Примеры

\`createUser('Ada', 36)\` → \`{ name: 'Ada', age: 36, isAdmin: false }\`

\`createUser('Grace', 85)\` → \`{ name: 'Grace', age: 85, isAdmin: false }\`

\`createUser('X', 1).isAdmin\` → \`false\``,
    starter: `export function createUser(name, age) {
  // Верни объект-литерал с тремя полями
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { createUser } from './index.js';

describe('createUser', () => {
  it('returns object literal with name, age, isAdmin', () => {
    expect(createUser('Ada', 36)).toEqual({ name: 'Ada', age: 36, isAdmin: false });
    expect(createUser('Grace', 85)).toEqual({ name: 'Grace', age: 85, isAdmin: false });
  });

  it('isAdmin is always false', () => {
    expect(createUser('X', 1).isAdmin).toBe(false);
  });
});
`,
    tags: ["objects", "literals"],
  }),
  createLearnJsChallenge({
    id: "objects-read-property",
    title: "Чтение свойства",
    rank: 1,
    group: "Объекты",
    tag: "JS/objects-basics",
    description: `У объекта два способа достать свойство. Точка — короткая: \`user.name\`. Скобки — универсальные: \`user["name"]\`.

**Когда точка не подходит.** Точка хочет видеть буквальное имя справа. А что если имя лежит в переменной?

\`\`\`js
const key = 'name';
user.key       // ищет поле "key", не то что нужно
user[key]      // подставит 'name', прочитает правильно
\`\`\`

Скобки умеют и это, и пробелы, и дефисы — всё, что точка не может.

**Что написать.** Функцию \`readProperty(obj, key)\`. Имя ключа приходит аргументом — значит, скобки. Если такого ключа нет, \`obj[key]\` сам вернёт \`undefined\`, отдельную проверку писать не нужно.

## Требования

1. Используй \`obj[key]\`.
2. Не пиши \`if\` для отсутствующего ключа.
3. Работай с ключами, в которых есть пробелы.
4. Экспортируй функцию \`readProperty\`.

## Примеры

\`readProperty({ name: 'Ada' }, 'name')\` → \`'Ada'\`

\`readProperty({ 'first name': 'Grace' }, 'first name')\` → \`'Grace'\`

\`readProperty({ a: 1 }, 'b')\` → \`undefined\``,
    starter: `export function readProperty(obj, key) {
  // Прочти свойство по динамическому ключу
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { readProperty } from './index.js';

describe('readProperty', () => {
  it('reads simple keys', () => {
    expect(readProperty({ name: 'Ada' }, 'name')).toBe('Ada');
  });

  it('reads keys with spaces', () => {
    expect(readProperty({ 'first name': 'Grace' }, 'first name')).toBe('Grace');
  });

  it('returns undefined for missing keys', () => {
    expect(readProperty({ a: 1 }, 'b')).toBe(undefined);
  });
});
`,
    tags: ["objects", "bracket-notation"],
  }),
  createLearnJsChallenge({
    id: "objects-computed-key",
    title: "Динамический ключ",
    rank: 2,
    group: "Объекты",
    tag: "JS/objects-basics",
    description: `Имя поля приходит в переменной. Что делать?

**Ловушка.** Кажется логичным написать так:

\`\`\`js
const key = 'id';
const obj = { key: 7 };
// obj === { key: 7 }, а не { id: 7 }
\`\`\`

JavaScript воспринял \`key\` буквально как имя поля. Чтобы он подставил *значение* переменной, имя оборачивают в квадратные скобки:

\`\`\`js
const obj = { [key]: 7 };  // { id: 7 }
\`\`\`

Это называется вычисляемое свойство. Внутри скобок может стоять любое выражение.

**Что написать.** Функцию \`makeEntry(key, value)\`. Возвращает объект ровно с одним полем — именем из \`key\`, значением из \`value\`.

## Требования

1. Используй \`{ [key]: value }\`.
2. В результате должно быть только одно свойство.
3. Экспортируй функцию \`makeEntry\`.

## Примеры

\`makeEntry('id', 7)\` → \`{ id: 7 }\`

\`makeEntry('name', 'Ada')\` → \`{ name: 'Ada' }\`

\`Object.keys(makeEntry('x', 1))\` → \`['x']\``,
    starter: `export function makeEntry(key, value) {
  // Используй вычисляемое имя свойства
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { makeEntry } from './index.js';

describe('makeEntry', () => {
  it('builds object with computed key', () => {
    expect(makeEntry('id', 7)).toEqual({ id: 7 });
    expect(makeEntry('name', 'Ada')).toEqual({ name: 'Ada' });
  });

  it('does not add extra fields', () => {
    expect(Object.keys(makeEntry('x', 1))).toEqual(['x']);
  });
});
`,
    tags: ["objects", "computed-properties"],
  }),
  createLearnJsChallenge({
    id: "objects-has-key",
    title: "Есть ли свойство",
    rank: 2,
    group: "Объекты",
    tag: "JS/objects-basics",
    description: `Как проверить, что у объекта есть поле? Первая мысль — сравнить с \`undefined\`:

\`\`\`js
if (obj[key] === undefined) // поля нет?
\`\`\`

**Странная штука.** Поле может *существовать* и при этом *содержать* \`undefined\`. Это валидное значение, его можно записать руками:

\`\`\`js
const obj = { a: undefined };
obj.a === undefined  // true
'a' in obj           // true — поле-то есть!
\`\`\`

Сравнение врёт. Честную проверку делает оператор \`in\` — он смотрит на факт существования ключа, не на значение.

**Что написать.** Функцию \`hasKey(obj, key)\`. Возвращает \`true\`, если ключ есть в объекте, даже если значение — \`undefined\`.

## Требования

1. Используй оператор \`in\`.
2. Свойство со значением \`undefined\` считается существующим.
3. Несуществующий ключ — \`false\`.
4. Экспортируй функцию \`hasKey\`.

## Примеры

\`hasKey({ a: 1 }, 'a')\` → \`true\`

\`hasKey({ a: undefined }, 'a')\` → \`true\`

\`hasKey({ a: 1 }, 'b')\` → \`false\``,
    starter: `export function hasKey(obj, key) {
  // Используй оператор in, не сравнение с undefined
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { hasKey } from './index.js';

describe('hasKey', () => {
  it('returns true for existing key', () => {
    expect(hasKey({ a: 1 }, 'a')).toBe(true);
  });

  it('returns true even when value is undefined', () => {
    expect(hasKey({ a: undefined }, 'a')).toBe(true);
  });

  it('returns false for missing key', () => {
    expect(hasKey({ a: 1 }, 'b')).toBe(false);
  });
});
`,
    tags: ["objects", "in-operator"],
  }),
  createLearnJsChallenge({
    id: "objects-sum-values",
    title: "Сумма числовых значений",
    rank: 3,
    group: "Объекты",
    tag: "JS/objects-basics",
    description: `Представь объект как коробку с подписанными ящичками: \`{ возраст: 25, имя: 'Аня' }\`. Пройтись по всем ящикам можно через \`for..in\`:

\`\`\`js
for (const key in obj) console.log(key, obj[key]);
\`\`\`

\`key\` — название ящика, \`obj[key]\` — что внутри.

**Одна хитрость.** Кажется, что отфильтровать числа просто: \`typeof value === 'number'\`. Но в JavaScript есть странная штука — \`NaN\` ('не число'). Знаешь как её называет \`typeof\`?

\`\`\`js
typeof NaN  // 'number'
\`\`\`

Да, JavaScript считает \`NaN\` числом. Если такое значение попадёт в сумму — вся сумма превратится в \`NaN\`. Поэтому \`NaN\` отдельно отсеивают через \`Number.isNaN(value)\`.

**Что написать.** Функцию \`sumValues(obj)\`. Она проходит по объекту, складывает числа, пропускает всё остальное (включая \`NaN\`). Пустой объект → \`0\`.

## Требования

1. Используй \`for..in\`.
2. Складывай только значения, у которых \`typeof === 'number'\`.
3. \`NaN\` пропускай.
4. Пустой объект → \`0\`.
5. Экспортируй функцию \`sumValues\`.

## Примеры

\`sumValues({ a: 1, b: 2, c: 3 })\` → \`6\`

\`sumValues({ x: 5, y: 'no', z: 10 })\` → \`15\`

\`sumValues({ a: 1, b: NaN, c: 2 })\` → \`3\`

\`sumValues({})\` → \`0\``,
    starter: `export function sumValues(obj) {
  // Просуммируй числовые значения через for..in
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { sumValues } from './index.js';

describe('sumValues', () => {
  it('sums numeric values', () => {
    expect(sumValues({ a: 1, b: 2, c: 3 })).toBe(6);
  });

  it('skips non-number values', () => {
    expect(sumValues({ x: 5, y: 'no', z: 10, w: true })).toBe(15);
  });

  it('skips NaN', () => {
    expect(sumValues({ a: 1, b: NaN, c: 2 })).toBe(3);
  });

  it('returns 0 for empty object', () => {
    expect(sumValues({})).toBe(0);
  });
});
`,
    tags: ["objects", "for-in"],
  }),
  createLearnJsChallenge({
    id: "polyfill-my-keys",
    title: "myKeys",
    rank: 4,
    group: "Объекты",
    tag: "JS/objects-basics",
    description: `\`Object.keys\` возвращает массив имён собственных свойств. Сейчас ты соберёшь его сам — заодно увидишь, что значит "собственное".

**Собственное против унаследованного.** \`for..in\` обходит и поля объекта, и поля его прототипа. Если ты не хочешь чужого — отсеивай через \`hasOwnProperty\`:

\`\`\`js
Object.prototype.hasOwnProperty.call(obj, key)
\`\`\`

Почему такой формальный вызов через \`.call\`? Потому что бывают объекты вообще без прототипа (\`Object.create(null)\`), и у них \`obj.hasOwnProperty\` не существует. А \`Object.prototype.hasOwnProperty.call\` всегда работает.

**Порядок имеет значение.** \`for..in\` сначала отдаёт ключи, похожие на целые числа, по возрастанию (\`'1'\`, \`'2'\`, \`'10'\`), потом строковые — в порядке добавления. Этот порядок надо сохранить.

**Что написать.** Функцию \`myKeys(obj)\` — без вызова самого \`Object.keys\`.

## Требования

1. Не используй \`Object.keys\`, \`Object.getOwnPropertyNames\`, \`Reflect.ownKeys\`.
2. Перебирай через \`for..in\`.
3. Отсеивай унаследованное через \`Object.prototype.hasOwnProperty.call\`.
4. Сохрани порядок \`for..in\`.
5. Экспортируй функцию \`myKeys\`.

## Примеры

\`myKeys({ a: 1, b: 2 })\` → \`['a', 'b']\`

\`myKeys({ 2: 'x', 1: 'y', a: 'z' })\` → \`['1', '2', 'a']\`

\`myKeys({})\` → \`[]\``,
    starter: `export function myKeys(obj) {
  // Реализуй Object.keys без вызова Object.keys
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { myKeys } from './index.js';

describe('myKeys', () => {
  it('returns own keys', () => {
    expect(myKeys({ a: 1, b: 2 })).toEqual(['a', 'b']);
  });

  it('skips inherited keys', () => {
    const parent = { inherited: 1 };
    const child = Object.create(parent);
    child.own = 2;
    expect(myKeys(child)).toEqual(['own']);
  });

  it('orders integer keys ascending then string keys in insertion order', () => {
    expect(myKeys({ 2: 'x', 1: 'y', a: 'z' })).toEqual(['1', '2', 'a']);
  });

  it('returns empty array for empty object', () => {
    expect(myKeys({})).toEqual([]);
  });
});
`,
    tags: ["polyfill", "objects", "object-keys"],
  }),
];

export const objectCopyChallenges: ChallengeDefinition[] = [
  createLearnJsChallenge({
    id: "copy-same-reference",
    title: "Это один объект?",
    rank: 1,
    group: "Копирование объектов",
    tag: "JS/object-copy",
    description: `Представь, что объекты живут в большом складе, а переменные — это бумажки с адресом. Когда ты пишешь \`let b = a\`, ты копируешь *бумажку*, а не сам ящик. Обе бумажки указывают на один и тот же ящик.

С примитивами не так — там копируется само значение. С объектами — только адрес.

**Странная штука.** Два литерала с одинаковыми полями — это два разных ящика на складе:

\`\`\`js
{ a: 1 } === { a: 1 }  // false
\`\`\`

\`===\` для объектов сравнивает не содержимое, а адреса. Один и тот же объект он узнает, два близнеца — никогда.

**Что написать.** Функцию \`areSameObject(a, b)\`. Возвращает \`true\`, если \`a\` и \`b\` — один и тот же объект в памяти. Содержимое не сравнивай — только ссылки.

## Требования

1. Используй строгое \`===\`.
2. Не разворачивай поля.
3. Экспортируй функцию \`areSameObject\`.

## Примеры

\`\`\`js
const x = { a: 1 };
areSameObject(x, x);              // true
areSameObject({ a: 1 }, { a: 1 }); // false
\`\`\``,
    starter: `export function areSameObject(a, b) {
  // Сравни ссылки строго
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { areSameObject } from './index.js';

describe('areSameObject', () => {
  it('returns true for same reference', () => {
    const x = { a: 1 };
    expect(areSameObject(x, x)).toBe(true);
  });

  it('returns false for distinct objects with same content', () => {
    expect(areSameObject({ a: 1 }, { a: 1 })).toBe(false);
  });
});
`,
    tags: ["objects", "reference-equality"],
  }),
  createLearnJsChallenge({
    id: "copy-merge-defaults",
    title: "Слияние с дефолтами",
    rank: 2,
    group: "Копирование объектов",
    tag: "JS/object-copy",
    description: `Представь форму с настройками: \`size: 'M'\`, \`color: 'red'\` — это значения по умолчанию. Пользователь меняет цвет на синий. Тебе нужен один объект, где дефолты подставлены, а пользовательские поля их перекрыли.

\`Object.assign\` это и делает. Поля из правых источников перезаписывают левые:

\`\`\`js
Object.assign({}, defaults, overrides);
\`\`\`

**Важная привычка.** Первым аргументом — пустой \`{}\`. Иначе \`Object.assign\` запишет всё прямо в \`defaults\`, и оригинал испортится. Spread \`{ ...defaults, ...overrides }\` делает то же самое, но всегда создаёт новый объект — мутации не будет.

**Что написать.** Функцию \`mergeWithDefaults(defaults, overrides)\`. Возвращает новый объект, где \`overrides\` перекрывают \`defaults\`. Ни один из аргументов не трогаем.

## Требования

1. Используй \`Object.assign({}, defaults, overrides)\` или \`{ ...defaults, ...overrides }\`.
2. Не мутируй ни \`defaults\`, ни \`overrides\`.
3. Возвращай всегда новый объект — даже если \`overrides\` пустой.
4. Экспортируй функцию \`mergeWithDefaults\`.

## Примеры

\`\`\`js
mergeWithDefaults({ size: 'M', color: 'red' }, { color: 'blue' });
// { size: 'M', color: 'blue' }

mergeWithDefaults({ a: 1 }, {}); // { a: 1 } — новый объект, не ссылка
\`\`\``,
    starter: `export function mergeWithDefaults(defaults, overrides) {
  // Слей объекты, не мутируя источники
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { mergeWithDefaults } from './index.js';

describe('mergeWithDefaults', () => {
  it('overrides defaults', () => {
    expect(mergeWithDefaults({ size: 'M', color: 'red' }, { color: 'blue' })).toEqual({
      size: 'M',
      color: 'blue',
    });
  });

  it('does not mutate inputs', () => {
    const defaults = { a: 1 };
    const overrides = { b: 2 };
    mergeWithDefaults(defaults, overrides);
    expect(defaults).toEqual({ a: 1 });
    expect(overrides).toEqual({ b: 2 });
  });

  it('returns a new object even with empty overrides', () => {
    const defaults = { a: 1 };
    const result = mergeWithDefaults(defaults, {});
    expect(result).toEqual({ a: 1 });
    expect(result).not.toBe(defaults);
  });
});
`,
    tags: ["objects", "object-assign"],
  }),
  createLearnJsChallenge({
    id: "copy-shallow-clone",
    title: "Поверхностная копия",
    rank: 3,
    group: "Копирование объектов",
    tag: "JS/object-copy",
    description: `Представь, что ты ксерокопируешь коробку с другими коробками внутри. Поверхностная копия — это когда ты делаешь новую внешнюю коробку, но внутрь *кладёшь те же самые* внутренние коробки. Снаружи всё своё, внутри — общее.

\`\`\`js
const source = { a: 1, b: { c: 2 } };
const copy = { ...source };
copy.b === source.b  // true — внутренний объект общий
\`\`\`

**Хитрость.** Меняешь верхний уровень — оригинал цел:

\`\`\`js
copy.a = 99;       // source.a всё ещё 1
\`\`\`

А вот вложенное — общее:

\`\`\`js
copy.b.c = 99;     // и source.b.c тоже стал 99
\`\`\`

Если нужна полная независимость до самого дна — это уже глубокая копия, она в следующей задаче.

**Что написать.** Функцию \`shallowClone(obj)\`. Возвращает новый объект с теми же полями верхнего уровня. Вложенные остаются по ссылке.

## Требования

1. Результат — новый объект (\`shallowClone(obj) !== obj\`).
2. Копируй только верхний уровень.
3. Вложенные объекты — по ссылке.
4. Можно \`Object.assign({}, obj)\` или \`{ ...obj }\`.
5. Экспортируй функцию \`shallowClone\`.

## Примеры

\`\`\`js
const source = { a: 1, b: { c: 2 } };
const copy = shallowClone(source);
copy.a = 99;       // source.a остался 1
copy.b.c = 99;     // source.b.c тоже стал 99 — общая ссылка
\`\`\``,
    starter: `export function shallowClone(obj) {
  // Скопируй верхний уровень, не углубляйся
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { shallowClone } from './index.js';

describe('shallowClone', () => {
  it('returns a new object', () => {
    const source = { a: 1 };
    const copy = shallowClone(source);
    expect(copy).toEqual({ a: 1 });
    expect(copy).not.toBe(source);
  });

  it('shares nested references', () => {
    const nested = { c: 2 };
    const source = { a: 1, b: nested };
    const copy = shallowClone(source);
    expect(copy.b).toBe(nested);
  });

  it('mutating copy top level does not affect original', () => {
    const source = { a: 1 };
    const copy = shallowClone(source);
    copy.a = 99;
    expect(source.a).toBe(1);
  });
});
`,
    tags: ["objects", "shallow-copy"],
  }),
  createLearnJsChallenge({
    id: "copy-deep-clone",
    title: "Глубокая копия",
    rank: 4,
    group: "Копирование объектов",
    tag: "JS/object-copy",
    description: `Возвращаемся к коробкам. Глубокая копия — это когда ты ксерокопируешь не только внешнюю коробку, но и каждую вложенную, и каждую внутри них. После этого оригинал и копия полностью независимы — меняй что угодно, на любой глубине.

Алгоритм рекурсивный и короткий:

1. Примитив (\`number\`, \`string\`, \`boolean\`, \`null\`, \`undefined\`) — вернуть как есть.
2. Массив — создать новый массив, склонировать каждый элемент.
3. Объект — создать новый объект, склонировать каждое поле.

В реальной жизни есть \`structuredClone\` и \`JSON.parse(JSON.stringify(obj))\` — но чтобы понять, как оно устроено, лучше один раз написать самому.

**Что написать.** Функцию \`deepClone(value)\`. Объекты и массивы клонируй до самого дна, примитивы возвращай как есть. Циклических ссылок на входе не будет — защищаться от них не нужно.

## Требования

1. Не используй \`structuredClone\` или \`JSON.parse(JSON.stringify(...))\`.
2. Поддержи объекты и массивы любой вложенности.
3. Вложенные объекты в копии должны быть новыми (\`copy.b !== source.b\`).
4. Примитивы возвращай как есть.
5. Экспортируй функцию \`deepClone\`.

## Примеры

\`\`\`js
const source = { a: { b: 1 } };
const copy = deepClone(source);
copy.a.b = 99;
// source.a.b всё ещё 1 — клон полностью независим

deepClone([1, [2, 3]]); // [1, [2, 3]] — вложенный массив тоже новый
\`\`\`

\`deepClone(5)\` → \`5\`

\`deepClone(null)\` → \`null\``,
    starter: `export function deepClone(value) {
  // Рекурсивно скопируй объекты и массивы
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { deepClone } from './index.js';

describe('deepClone', () => {
  it('clones primitives as-is', () => {
    expect(deepClone(5)).toBe(5);
    expect(deepClone('hi')).toBe('hi');
    expect(deepClone(null)).toBe(null);
  });

  it('clones nested objects', () => {
    const source = { a: 1, b: { c: 2 } };
    const copy = deepClone(source);
    expect(copy).toEqual(source);
    expect(copy).not.toBe(source);
    expect(copy.b).not.toBe(source.b);
  });

  it('clones arrays', () => {
    const source = [1, [2, 3]];
    const copy = deepClone(source);
    expect(copy).toEqual([1, [2, 3]]);
    expect(copy[1]).not.toBe(source[1]);
  });

  it('mutation of copy does not affect original', () => {
    const source = { a: { b: 1 } };
    const copy = deepClone(source);
    copy.a.b = 99;
    expect(source.a.b).toBe(1);
  });
});
`,
    tags: ["objects", "deep-copy"],
  }),
  createLearnJsChallenge({
    id: "polyfill-my-object-assign",
    title: "myObjectAssign",
    rank: 4,
    group: "Копирование объектов",
    tag: "JS/object-copy",
    description: `\`Object.assign(target, ...sources)\` копирует поля из источников в \`target\`, перезаписывая совпадения, и возвращает \`target\`. Сейчас ты соберёшь его сам.

**Три правила, о которых легко забыть.**

1. \`null\` и \`undefined\` среди источников молча игнорируются — это удобно, не надо писать \`if\` на опциональные аргументы.
2. Копируются только *собственные* свойства, не унаследованные через прототип.
3. Возвращается именно \`target\` — тот же самый объект, что пришёл первым аргументом. Это его смысл — мутация.

**Что написать.** Функцию \`myObjectAssign(target, ...sources)\`. Без вызова самого \`Object.assign\` и без spread.

## Требования

1. Не используй \`Object.assign\` и spread для слияния.
2. Перебирай через \`for..in\` + проверку \`hasOwnProperty\`.
3. Более поздние источники перезаписывают более ранние.
4. \`null\` и \`undefined\` среди источников пропускай.
5. Возвращай \`target\` (тот же объект).
6. Экспортируй функцию \`myObjectAssign\`.

## Примеры

\`\`\`js
myObjectAssign({ a: 1 }, { b: 2 }, { a: 99 }); // { a: 99, b: 2 }

const t = {};
myObjectAssign(t, { x: 1 }) === t; // true — тот же объект

myObjectAssign({ a: 1 }, null, undefined, { b: 2 }); // { a: 1, b: 2 }
\`\`\``,
    starter: `export function myObjectAssign(target, ...sources) {
  // Реализуй Object.assign без вызова Object.assign
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { myObjectAssign } from './index.js';

describe('myObjectAssign', () => {
  it('copies own properties', () => {
    expect(myObjectAssign({}, { a: 1, b: 2 })).toEqual({ a: 1, b: 2 });
  });

  it('overwrites with later sources', () => {
    expect(myObjectAssign({ a: 1 }, { b: 2 }, { a: 99 })).toEqual({ a: 99, b: 2 });
  });

  it('returns target reference', () => {
    const target = {};
    expect(myObjectAssign(target, { x: 1 })).toBe(target);
  });

  it('skips null and undefined sources', () => {
    expect(myObjectAssign({ a: 1 }, null, undefined, { b: 2 })).toEqual({ a: 1, b: 2 });
  });

  it('skips inherited properties of sources', () => {
    const proto = { inherited: 'no' };
    const source = Object.create(proto);
    source.own = 'yes';
    expect(myObjectAssign({}, source)).toEqual({ own: 'yes' });
  });
});
`,
    tags: ["polyfill", "objects", "object-assign"],
  }),
];

export const garbageCollectionChallenges: ChallengeDefinition[] = [
  createLearnJsChallenge({
    id: "gc-find-reachable",
    title: "Достижимые узлы",
    rank: 4,
    group: "Сборка мусора",
    tag: "JS/garbage-collection",
    description: `Сборщик мусора — это уборщик, который ходит по комнатам и решает: эта вещь ещё кому-то нужна? Если до неё можно дойти от входной двери (корня) по цепочке "одно держит другое" — оставляем. Если нет — выкидываем.

В этой задаче ты пишешь обход для такого уборщика. Граф — это объект:

\`\`\`js
{ a: ['b'], b: ['c'], c: [], d: ['a'] }
\`\`\`

Ключ — узел, массив — на кого он ссылается. Корни — список тех, кто считается живым изначально.

**Подвох — циклы.** Объекты могут ссылаться друг на друга по кругу: \`a → b → a\`. Если просто идти по ссылкам, обход зациклится навсегда. Лекарство — хранить уже посещённые в \`Set\` и не заходить в них второй раз.

**Что написать.** Функцию \`findReachable(graph, roots)\`. Возвращает \`Set\` всех ID, до которых можно дойти от корней. Корни тоже включи. Если в \`roots\` пришёл ID, которого нет в \`graph\` — всё равно считаем его достижимым (корень есть корень).

## Требования

1. Возвращай \`Set\` строк-ID.
2. Не зацикливайся на циклах.
3. Если ID нет в \`graph\` — считай, что у него нет исходящих ссылок, не падай.
4. Корни всегда в результате.
5. Экспортируй функцию \`findReachable\`.

## Примеры

\`\`\`js
const graph = { a: ['b'], b: ['c'], c: [], d: ['a'] };
findReachable(graph, ['a']); // Set { 'a', 'b', 'c' } — 'd' недостижим

const cycle = { a: ['b'], b: ['a'] };
findReachable(cycle, ['a']); // Set { 'a', 'b' }

findReachable({}, ['solo']); // Set { 'solo' }
\`\`\``,
    starter: `export function findReachable(graph, roots) {
  // Обойди граф от корней, верни Set достижимых ID
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { findReachable } from './index.js';

describe('findReachable', () => {
  it('marks all reachable from root', () => {
    const graph = { a: ['b'], b: ['c'], c: [], d: ['a'] };
    expect(findReachable(graph, ['a'])).toEqual(new Set(['a', 'b', 'c']));
  });

  it('handles cycles', () => {
    const graph = { a: ['b'], b: ['a'] };
    expect(findReachable(graph, ['a'])).toEqual(new Set(['a', 'b']));
  });

  it('treats roots as reachable even when missing in graph', () => {
    expect(findReachable({}, ['solo'])).toEqual(new Set(['solo']));
  });

  it('handles multiple roots', () => {
    const graph = { a: ['b'], c: ['d'], d: [] };
    expect(findReachable(graph, ['a', 'c'])).toEqual(new Set(['a', 'b', 'c', 'd']));
  });
});
`,
    tags: ["graph-traversal", "reachability"],
  }),
  createLearnJsChallenge({
    id: "polyfill-mark-and-sweep",
    title: "markAndSweep",
    rank: 5,
    group: "Сборка мусора",
    tag: "JS/garbage-collection",
    description: `Mark-and-sweep — классический алгоритм уборщика. Две фазы:

- **mark** — пройди от корней, пометь всех, до кого дошёл.
- **sweep** — пройди по всему графу, всё непомеченное — мусор.

**Самое красивое в этом алгоритме.** Представь два объекта, которые держат друг друга, но снаружи на них никто не указывает — этакий замкнутый островок. Старый алгоритм reference counting считал ссылки и не мог такой остров удалить — каждый из двоих "видел" другого. А mark-and-sweep смотрит сверху: на остров не ведёт ни одна тропинка от корня — значит, выбрасываем целиком.

**Что написать.** Функцию \`markAndSweep(graph, roots)\`. Граф — \`{ [id]: ['otherId', ...] }\`, как в прошлой задаче. Возвращай \`{ alive, collected }\`:
- \`alive\` — ID из \`graph\`, до которых можно дойти от корней.
- \`collected\` — ID из \`graph\`, до которых дойти нельзя.

Оба массива отсортируй обычным строковым сравнением. Сам \`graph\` не меняй.

## Требования

1. Реализуй обе фазы.
2. \`alive\` и \`collected\` — отсортированные массивы.
3. Циклы обрабатывай корректно.
4. Не мутируй \`graph\`.
5. Экспортируй функцию \`markAndSweep\`.

## Примеры

\`\`\`js
const graph = { a: ['b'], b: [], c: ['d'], d: ['c'] };
markAndSweep(graph, ['a']);
// { alive: ['a', 'b'], collected: ['c', 'd'] }
// цикл c-d — остров без входа, весь в мусор

markAndSweep({ a: ['b'], b: ['c'], c: [] }, ['a']);
// { alive: ['a', 'b', 'c'], collected: [] }

markAndSweep({ x: ['y'], y: ['x'], z: [] }, ['z']);
// { alive: ['z'], collected: ['x', 'y'] }
\`\`\``,
    starter: `export function markAndSweep(graph, roots) {
  // Mark all reachable, sweep the rest
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { markAndSweep } from './index.js';

describe('markAndSweep', () => {
  it('separates alive and collected', () => {
    const graph = { a: ['b'], b: [], c: ['d'], d: ['c'] };
    expect(markAndSweep(graph, ['a'])).toEqual({ alive: ['a', 'b'], collected: ['c', 'd'] });
  });

  it('keeps unreachable cycle in collected', () => {
    const graph = { x: ['y'], y: ['x'], z: [] };
    expect(markAndSweep(graph, ['z'])).toEqual({ alive: ['z'], collected: ['x', 'y'] });
  });

  it('does not mutate input graph', () => {
    const graph = { a: ['b'], b: [] };
    const snapshot = JSON.parse(JSON.stringify(graph));
    markAndSweep(graph, ['a']);
    expect(graph).toEqual(snapshot);
  });

  it('all nodes alive when all reachable', () => {
    const graph = { a: ['b'], b: ['c'], c: [] };
    expect(markAndSweep(graph, ['a'])).toEqual({ alive: ['a', 'b', 'c'], collected: [] });
  });
});
`,
    tags: ["polyfill", "graph-traversal", "mark-and-sweep"],
  }),
];

export const objectMethodsChallenges: ChallengeDefinition[] = [
  createLearnJsChallenge({
    id: "methods-greet",
    title: "Метод приветствия",
    rank: 1,
    group: "Методы объекта",
    tag: "JS/object-methods",
    description: `Функция, лежащая в свойстве объекта, называется методом. И ей нужен способ обратиться к данным своего объекта — иначе метод "поздороваться" будет здороваться с одним и тем же именем для всех.

\`this\` — это волшебное слово, которое внутри метода указывает на объект "перед точкой":

\`\`\`js
ada.greet();    // внутри greet this === ada
grace.greet();  // внутри тот же метод, но this === grace
\`\`\`

Одна функция, разные \`this\` — каждый получает своё.

**Маленькая красота синтаксиса.** В литерале можно писать коротко:

\`\`\`js
{ greet() { ... } }   // вместо { greet: function () { ... } }
\`\`\`

**Что написать.** Функцию \`createGreeter(name)\`. Возвращает объект с полем \`name\` и методом \`greet()\`, который читает имя *через \`this.name\`* и возвращает \`"Hello, <name>"\`. Не через замыкание — иначе если кто-то поменяет \`obj.name\`, метод этого не заметит.

## Требования

1. Объект имеет поле \`name\` и метод \`greet\`.
2. \`greet\` читает имя через \`this.name\`.
3. Используй краткий синтаксис \`greet() { ... }\`.
4. Экспортируй функцию \`createGreeter\`.

## Примеры

\`\`\`js
const ada = createGreeter('Ada');
ada.greet();          // 'Hello, Ada'

ada.name = 'Lovelace';
ada.greet();          // 'Hello, Lovelace' — метод видит свежее имя
\`\`\``,
    starter: `export function createGreeter(name) {
  // Верни объект с методом greet, который читает this.name
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { createGreeter } from './index.js';

describe('createGreeter', () => {
  it('greets with own name', () => {
    expect(createGreeter('Ada').greet()).toBe('Hello, Ada');
    expect(createGreeter('Grace').greet()).toBe('Hello, Grace');
  });

  it('reads name from this, not from closure', () => {
    const ada = createGreeter('Ada');
    ada.name = 'Lovelace';
    expect(ada.greet()).toBe('Hello, Lovelace');
  });
});
`,
    tags: ["methods", "this"],
  }),
  createLearnJsChallenge({
    id: "methods-counter",
    title: "Счётчик с методами",
    rank: 2,
    group: "Методы объекта",
    tag: "JS/object-methods",
    description: `Счётчик — отличный пример объекта со своим состоянием. У него есть число и три кнопки: плюс, минус, посмотреть. Каждый счётчик живёт своей жизнью.

Если положить число в замыкание — снаружи к нему не подойдёшь. Если положить прямо в \`this.value\` — оно видно, отлаживается, сериализуется в JSON. Так и сделаем.

\`\`\`js
const a = createCounter();
const b = createCounter();
a.inc(); a.inc();
b.inc();
// a.value === 2, b.value === 1 — каждый сам по себе
\`\`\`

Если бы \`value\` лежало в общей переменной модуля — оба счётчика дрались бы за одно число.

**Что написать.** Функцию \`createCounter()\`. Возвращает объект с \`value: 0\` и тремя методами:
- \`inc()\` — \`+1\`, возвращает новое значение.
- \`dec()\` — \`-1\`, возвращает новое значение.
- \`get()\` — возвращает текущее без изменений.

## Требования

1. Состояние — в \`this.value\`, не в замыкании.
2. \`inc\` и \`dec\` возвращают новое значение.
3. \`get\` возвращает текущее.
4. Разные счётчики независимы.
5. Экспортируй функцию \`createCounter\`.

## Примеры

\`\`\`js
const c = createCounter();
c.inc(); // 1
c.inc(); // 2
c.dec(); // 1
c.get(); // 1
\`\`\``,
    starter: `export function createCounter() {
  // Верни объект со счётчиком и тремя методами
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { createCounter } from './index.js';

describe('createCounter', () => {
  it('increments and decrements via this', () => {
    const c = createCounter();
    expect(c.inc()).toBe(1);
    expect(c.inc()).toBe(2);
    expect(c.dec()).toBe(1);
    expect(c.get()).toBe(1);
  });

  it('counters are independent', () => {
    const a = createCounter();
    const b = createCounter();
    a.inc();
    a.inc();
    b.inc();
    expect(a.get()).toBe(2);
    expect(b.get()).toBe(1);
  });
});
`,
    tags: ["methods", "this", "state"],
  }),
  createLearnJsChallenge({
    id: "methods-call-by-name",
    title: "Вызов метода по имени",
    rank: 3,
    group: "Методы объекта",
    tag: "JS/object-methods",
    description: `\`this\` в JavaScript решается *в момент вызова*, а не там, где функция была написана. Кто стоит слева от точки — тот и \`this\`.

**Странная штука — потеря this.** Смотри:

\`\`\`js
const obj = { x: 5, getX() { return this.x } };
const fn = obj.getX;   // вытащили метод в переменную
fn();                  // в строгом режиме — TypeError, this === undefined
\`\`\`

Слева от точки никого нет — \`this\` пропал. Это происходит каждый раз, когда метод передают в \`setTimeout\`, в обработчик события, в \`map\`. Решений несколько: \`bind\`, стрелка-обёртка, или прямой вызов через скобки — \`obj['methodName']()\` сохраняет \`this\`, потому что слева от \`[\` всё ещё стоит \`obj\`.

**Что написать.** Функцию \`callMethod(obj, methodName, ...args)\`. Вызови метод по его имени-строке, передай аргументы, верни результат. \`this\` должен остаться равен \`obj\` — поэтому вызывай через \`obj[methodName](...args)\`.

## Требования

1. Вызывай через \`obj[methodName](...args)\`.
2. Поддержи любое число аргументов.
3. Возвращай результат вызова.
4. Экспортируй функцию \`callMethod\`.

## Примеры

\`\`\`js
const obj = { x: 5, getX() { return this.x } };
callMethod(obj, 'getX');                   // 5

const adder = { a: 2, add(b) { return this.a + b } };
callMethod(adder, 'add', 3);               // 5

const sum = { sum(...nums) { return nums.reduce((a, b) => a + b, 0) } };
callMethod(sum, 'sum', 1, 2, 3, 4);        // 10
\`\`\``,
    starter: `export function callMethod(obj, methodName, ...args) {
  // Вызови метод так, чтобы this остался obj
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { callMethod } from './index.js';

describe('callMethod', () => {
  it('keeps this bound to object', () => {
    const obj = {
      x: 5,
      getX() {
        return this.x;
      },
    };
    expect(callMethod(obj, 'getX')).toBe(5);
  });

  it('passes arguments', () => {
    const obj = {
      a: 2,
      add(b) {
        return this.a + b;
      },
    };
    expect(callMethod(obj, 'add', 3)).toBe(5);
  });

  it('passes multiple arguments', () => {
    const obj = {
      sum(...numbers) {
        return numbers.reduce((acc, n) => acc + n, 0);
      },
    };
    expect(callMethod(obj, 'sum', 1, 2, 3, 4)).toBe(10);
  });
});
`,
    tags: ["methods", "this", "bracket-call"],
  }),
  createLearnJsChallenge({
    id: "methods-shape-area",
    title: "Площадь фигуры",
    rank: 3,
    group: "Методы объекта",
    tag: "JS/object-methods",
    description: `Прямоугольник и квадрат считают площадь одинаково — \`width * height\`. У квадрата просто \`width === height\`. Если каждый объявит свой собственный \`area\`, у тебя будут две копии одной формулы — и любую правку придётся делать дважды.

Решение простое — вынеси \`area\` в одну функцию и присвой её обоим. Метод не знает, чем он управляет — ему достаточно \`this.width\` и \`this.height\`:

\`\`\`js
function area() { return this.width * this.height; }
\`\`\`

Это первый шаг к идее прототипов — но об этом позже.

**Что написать.** Две функции:
- \`createRectangle(width, height)\` — возвращает объект с \`width\`, \`height\` и \`area()\`.
- \`createSquare(side)\` — возвращает объект с \`width: side\`, \`height: side\` и тем же \`area()\`.

Код \`area\` пиши один раз, присваивай обоим.

## Требования

1. Оба объекта имеют \`area()\`, читающую через \`this\`.
2. Код \`area\` не дублируй — одна общая функция.
3. Поменялось поле — \`area()\` возвращает новое значение.
4. Экспортируй \`createRectangle\` и \`createSquare\`.

## Примеры

\`\`\`js
createRectangle(3, 4).area(); // 12
createSquare(5).area();       // 25

const r = createRectangle(2, 3);
r.width = 10;
r.area(); // 30 — метод читает свежие поля
\`\`\``,
    starter: `export function createRectangle(width, height) {
  // Верни объект с width, height, area()
}

export function createSquare(side) {
  // Верни объект-квадрат с тем же методом area()
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { createRectangle, createSquare } from './index.js';

describe('shape methods', () => {
  it('rectangle computes area via this', () => {
    expect(createRectangle(3, 4).area()).toBe(12);
  });

  it('square computes area via this', () => {
    expect(createSquare(5).area()).toBe(25);
  });

  it('reflects field changes', () => {
    const r = createRectangle(2, 3);
    r.width = 10;
    expect(r.area()).toBe(30);
  });
});
`,
    tags: ["methods", "this", "shapes"],
  }),
  createLearnJsChallenge({
    id: "polyfill-bind-this",
    title: "bindThis",
    rank: 5,
    group: "Методы объекта",
    tag: "JS/object-methods",
    description: `\`bind\` решает проблему "потери this" из прошлой задачи. Он создаёт новую функцию, у которой \`this\` зафиксирован навсегда:

\`\`\`js
const bound = obj.method.bind(obj);
setTimeout(bound, 100);  // this внутри останется obj
\`\`\`

Сейчас ты его соберёшь сам — без вызова настоящего \`bind\`. Помогут \`call\` или \`apply\` — они умеют подставлять \`this\` в момент вызова:

\`\`\`js
fn.call(context, a, b, c);    // вызвать fn так, чтобы this === context
fn.apply(context, [a, b, c]); // то же, но аргументы массивом
\`\`\`

В настоящем \`bind\` есть ещё карринг (фиксация первых аргументов) — здесь его не делаем, фиксируем только \`this\`.

**Что написать.** Функцию \`bindThis(fn, context)\`. Возвращает функцию, которая при любом вызове использует \`context\` как \`this\` для \`fn\` и пробрасывает все аргументы.

## Требования

1. Не используй \`Function.prototype.bind\`.
2. Используй \`call\` или \`apply\`.
3. Возвращай *функцию*, а не результат вызова.
4. Аргументы передавай в \`fn\` целиком.
5. Экспортируй функцию \`bindThis\`.

## Примеры

\`\`\`js
const obj = { x: 10, getX() { return this.x } };
const fn = bindThis(obj.getX, obj);
fn();                          // 10

const adder = { base: 5, add(a, b) { return this.base + a + b } };
const f = bindThis(adder.add, adder);
f(2, 3);                       // 10
\`\`\``,
    starter: `export function bindThis(fn, context) {
  // Верни функцию, которая всегда вызывает fn с this = context
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { bindThis } from './index.js';

describe('bindThis', () => {
  it('binds this to context', () => {
    const obj = {
      x: 10,
      getX() {
        return this.x;
      },
    };
    const fn = bindThis(obj.getX, obj);
    expect(fn()).toBe(10);
  });

  it('passes arguments through', () => {
    const obj = {
      base: 5,
      add(a, b) {
        return this.base + a + b;
      },
    };
    const fn = bindThis(obj.add, obj);
    expect(fn(2, 3)).toBe(10);
  });

  it('returns a function, not a value', () => {
    const fn = bindThis(function () {
      return 1;
    }, {});
    expect(typeof fn).toBe('function');
  });
});
`,
    tags: ["polyfill", "methods", "bind"],
  }),
];

export const constructorNewChallenges: ChallengeDefinition[] = [
  createLearnJsChallenge({
    id: "constructor-user",
    title: "Конструктор User",
    rank: 2,
    group: "Конструкторы и new",
    tag: "JS/constructor-new",
    description: `Когда нужно сделать сто похожих объектов, литералы руками писать нудно. На этот случай есть функции-конструкторы — обычные функции, которые вызывают через \`new\`. По соглашению их называют с большой буквы: \`User\`, \`Order\`, \`Animal\` — это сигнал читателю "меня вызывают через new".

**Что делает \`new\`** под капотом:

1. Создаёт пустой объект.
2. Делает его \`this\` на время вызова функции.
3. Выполняет тело — оно заполняет \`this\`.
4. Возвращает этот \`this\`.

Поэтому в теле конструктора достаточно присвоений \`this.field = value\` — без \`return\`. Оператор \`new\` сам вернёт собранный объект.

**Что написать.** Функцию-конструктор \`User(name, age)\`. Внутри: \`this.name = name\` и \`this.age = age\`. \`return\` не пиши.

## Требования

1. Используется с \`new\`.
2. Присвой \`this.name = name\` и \`this.age = age\`.
3. Не пиши \`return\`.
4. Экспортируй функцию \`User\`.

## Примеры

\`\`\`js
const ada = new User('Ada', 36);
// ada.name === 'Ada', ada.age === 36

const grace = new User('Grace', 85);
// разные экземпляры независимы
\`\`\``,
    starter: `export function User(name, age) {
  // Заполни this
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { User } from './index.js';

describe('User', () => {
  it('creates instance via new', () => {
    const ada = new User('Ada', 36);
    expect(ada.name).toBe('Ada');
    expect(ada.age).toBe(36);
  });

  it('different instances are independent', () => {
    const a = new User('A', 1);
    const b = new User('B', 2);
    a.name = 'Z';
    expect(b.name).toBe('B');
  });
});
`,
    tags: ["constructor", "new"],
  }),
  createLearnJsChallenge({
    id: "constructor-with-method",
    title: "Конструктор с методом",
    rank: 3,
    group: "Конструкторы и new",
    tag: "JS/constructor-new",
    description: `Внутри конструктора можно класть не только поля, но и функции — это и будут методы экземпляра:

\`\`\`js
function Greeter(name) {
  this.name = name;
  this.sayHi = function () { return 'Hi, ' + this.name; };
}
\`\`\`

После \`new\` каждый экземпляр получит свой \`sayHi\`. Внутри метода \`this\` всё так же — это объект, через который вызвали.

**Один минус.** Каждый \`new Greeter\` создаёт *свою копию* функции \`sayHi\`. На сотне пользователей — сотня одинаковых функций в памяти. Лекарство — \`prototype\`, до него учебник скоро дойдёт. Сейчас этот минус терпим — пишем как написано.

И ещё — имя читай через \`this.name\`, не через замыкание над параметром. Иначе если кто-то поменяет \`obj.name\`, метод не заметит.

**Что написать.** Конструктор \`Greeter(name)\`. Поле \`this.name\`, метод \`this.sayHi\`, который возвращает \`"Hi, <name>"\`.

## Требования

1. \`this.name = name\`.
2. \`this.sayHi = function () { return 'Hi, ' + this.name; }\`.
3. Метод читает имя через \`this.name\`.
4. Экспортируй функцию \`Greeter\`.

## Примеры

\`\`\`js
const ada = new Greeter('Ada');
ada.sayHi();          // 'Hi, Ada'

ada.name = 'Lovelace';
ada.sayHi();          // 'Hi, Lovelace'
\`\`\``,
    starter: `export function Greeter(name) {
  // Запиши name и добавь sayHi через this
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { Greeter } from './index.js';

describe('Greeter', () => {
  it('returns greeting via method', () => {
    expect(new Greeter('Ada').sayHi()).toBe('Hi, Ada');
  });

  it('reads name via this', () => {
    const g = new Greeter('Ada');
    g.name = 'Lovelace';
    expect(g.sayHi()).toBe('Hi, Lovelace');
  });
});
`,
    tags: ["constructor", "methods"],
  }),
  createLearnJsChallenge({
    id: "constructor-counter",
    title: "Конструктор Counter",
    rank: 4,
    group: "Конструкторы и new",
    tag: "JS/constructor-new",
    description: `Конструктор может принимать аргументы — это удобно, чтобы задать начальное состояние:

\`\`\`js
const c = new Counter(10);  // счётчик с десяти, не с нуля
\`\`\`

Сравни с альтернативой — создать счётчик с нуля и вручную вызвать \`inc\` десять раз. \`new Counter(10)\` короче и понятнее.

Внутри: \`this.value = start\`, методы — присвоением функций к \`this\`, как в предыдущей задаче. Каждый \`new\` даёт независимый объект со своим \`this.value\`.

**Что написать.** Конструктор \`Counter(start)\`. Поле \`this.value = start\`. Два метода:
- \`inc()\` — \`+1\`, возвращает новое значение.
- \`get()\` — возвращает текущее без изменений.

## Требования

1. \`new Counter(5).get()\` → \`5\`.
2. \`inc\` меняет \`this.value\`, возвращает новое значение.
3. \`get\` возвращает текущее.
4. Экземпляры независимы.
5. Экспортируй функцию \`Counter\`.

## Примеры

\`\`\`js
const c = new Counter(10);
c.inc(); // 11
c.inc(); // 12
c.get(); // 12

const a = new Counter(0);
const b = new Counter(100);
a.inc();
// a.get() === 1, b.get() === 100
\`\`\``,
    starter: `export function Counter(start) {
  // Сохрани start в this.value и добавь методы
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { Counter } from './index.js';

describe('Counter', () => {
  it('starts from given value', () => {
    expect(new Counter(5).get()).toBe(5);
  });

  it('inc updates and returns new value', () => {
    const c = new Counter(10);
    expect(c.inc()).toBe(11);
    expect(c.inc()).toBe(12);
    expect(c.get()).toBe(12);
  });

  it('instances are independent', () => {
    const a = new Counter(0);
    const b = new Counter(100);
    a.inc();
    expect(b.get()).toBe(100);
  });
});
`,
    tags: ["constructor", "state"],
  }),
  createLearnJsChallenge({
    id: "constructor-new-target",
    title: "Только через new",
    rank: 4,
    group: "Конструкторы и new",
    tag: "JS/constructor-new",
    description: `Конструктор кто-нибудь рано или поздно вызовет без \`new\` — забыл. Что тогда происходит?

\`\`\`js
Animal('cat');  // без new — что внутри this?
\`\`\`

Без \`new\` функция выполняется обычно. \`this\` — либо глобальный объект (нестрогий режим), либо \`undefined\` (строгий). Строчки \`this.x = ...\` или загадят глобал, или упадут с ошибкой. В обоих случаях больно.

**Защитный приём — \`new.target\`.** Это специальное мета-выражение. Внутри функции, вызванной через \`new\`, оно равно самой функции. Без \`new\` — \`undefined\`. Отсюда и проверка:

\`\`\`js
if (!new.target) throw new Error('...');
\`\`\`

**Что написать.** Конструктор \`Animal(name)\`. В первой строке проверь \`new.target\`. Если без \`new\` — брось \`new Error('Animal must be called with new')\` (текст ровно такой). Если всё ок — \`this.name = name\`.

## Требования

1. В первой строке проверь \`new.target\`.
2. Без \`new\` — брось \`new Error('Animal must be called with new')\`.
3. С \`new\` — присвой \`this.name = name\`.
4. Экспортируй функцию \`Animal\`.

## Примеры

\`new Animal('cat').name\` → \`'cat'\`

\`Animal('cat')\` → выбрасывает \`Error('Animal must be called with new')\``,
    starter: `export function Animal(name) {
  // Используй new.target для защиты конструктора
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { Animal } from './index.js';

describe('Animal', () => {
  it('creates instance with new', () => {
    expect(new Animal('cat').name).toBe('cat');
  });

  it('throws when called without new', () => {
    expect(() => Animal('cat')).toThrow('Animal must be called with new');
  });
});
`,
    tags: ["constructor", "new-target"],
  }),
  createLearnJsChallenge({
    id: "polyfill-my-new",
    title: "myNew",
    rank: 6,
    group: "Конструкторы и new",
    tag: "JS/constructor-new",
    description: `\`new\` — не магия, а четыре понятных шага. Сейчас ты его соберёшь сам.

**Алгоритм:**

1. Создать новый объект с прототипом \`Constructor.prototype\` — \`Object.create(Constructor.prototype)\`. Это нужно, чтобы методы из прототипа были доступны на новом объекте.
2. Вызвать конструктор так, чтобы внутри \`this\` был этим новым объектом — \`Constructor.apply(instance, args)\`.
3. Если конструктор *вернул объект* — отдать его.
4. Иначе — отдать \`instance\`.

**Странная штука — асимметрия return.** Конструктор может явно что-то вернуть. Если это объект — он заменяет \`this\`. Если примитив — *игнорируется*:

\`\`\`js
function Box() { return { custom: true } }
new Box();           // { custom: true } — объект победил this

function P() { this.a = 1; return 42 }
new P();             // { a: 1 } — число 42 потерялось
\`\`\`

Объект побеждает, примитив тихо теряется.

**Что написать.** Функцию \`myNew(Constructor, ...args)\`, повторяющую \`new\`. Сам \`new\` внутри не используй.

## Требования

1. Не используй ключевое слово \`new\`.
2. Создай объект через \`Object.create(Constructor.prototype)\`.
3. Вызови \`Constructor.apply(instance, args)\`.
4. Если результат — объект, верни его. Иначе — верни \`instance\`.
5. Экспортируй функцию \`myNew\`.

## Примеры

\`\`\`js
function Point(x, y) { this.x = x; this.y = y }
Point.prototype.sum = function () { return this.x + this.y };
const p = myNew(Point, 1, 2);
// p.x === 1, p.y === 2, p.sum() === 3
// Object.getPrototypeOf(p) === Point.prototype

function Box() { return { custom: true } }
myNew(Box);          // { custom: true }

function P() { this.a = 1; return 42 }
myNew(P).a;          // 1
\`\`\``,
    starter: `export function myNew(Constructor, ...args) {
  // Имитируй оператор new в четыре шага
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { myNew } from './index.js';

describe('myNew', () => {
  it('builds instance with prototype link', () => {
    function Point(x, y) {
      this.x = x;
      this.y = y;
    }
    Point.prototype.sum = function () {
      return this.x + this.y;
    };
    const p = myNew(Point, 1, 2);
    expect(p.x).toBe(1);
    expect(p.y).toBe(2);
    expect(p.sum()).toBe(3);
    expect(Object.getPrototypeOf(p)).toBe(Point.prototype);
  });

  it('returns explicit object from constructor', () => {
    function Box() {
      return { custom: true };
    }
    expect(myNew(Box)).toEqual({ custom: true });
  });

  it('ignores primitive return', () => {
    function P() {
      this.a = 1;
      return 42;
    }
    expect(myNew(P).a).toBe(1);
  });

  it('passes arguments', () => {
    function Sum(a, b, c) {
      this.total = a + b + c;
    }
    expect(myNew(Sum, 1, 2, 3).total).toBe(6);
  });
});
`,
    tags: ["polyfill", "constructor", "new"],
  }),
];

export const optionalChainingChallenges: ChallengeDefinition[] = [
  createLearnJsChallenge({
    id: "chain-safe-street",
    title: "Безопасный адрес",
    rank: 1,
    group: "Опциональная цепочка",
    tag: "JS/optional-chaining",
    description: `У одного пользователя есть адрес, у другого нет. \`user.address.street\` для второго упадёт:

\`\`\`js
user.address       // null
user.address.street // TypeError: Cannot read properties of null
\`\`\`

Раньше писали так: \`user && user.address && user.address.street\` — длинно, имя повторяется три раза. Теперь есть \`?.\`:

\`\`\`js
user?.address?.street
\`\`\`

Если слева от \`?.\` стоит \`null\` или \`undefined\` — цепочка молча отдаёт \`undefined\`, дальше не идёт.

**Тонкость.** \`?.\` срабатывает *только на \`null\` и \`undefined\`*. \`0\`, \`''\`, \`false\` — это валидные значения, цепочка через них спокойно идёт. В этом отличие от \`&&\`, который останавливается на любом falsy.

**Что написать.** Функцию \`getStreet(user)\`. Возвращает \`user.address.street\` через \`?.\`. Если по пути встретился \`null\` или \`undefined\` — \`undefined\`.

## Требования

1. Используй \`user?.address?.street\`.
2. Не используй \`try/catch\` и \`&&\`.
3. \`getStreet(null)\` не должен падать.
4. Экспортируй функцию \`getStreet\`.

## Примеры

\`getStreet({ address: { street: 'Baker St' } })\` → \`'Baker St'\`

\`getStreet({ address: null })\` → \`undefined\`

\`getStreet({})\` → \`undefined\`

\`getStreet(null)\` → \`undefined\``,
    starter: `export function getStreet(user) {
  // Используй ?. для безопасного чтения
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { getStreet } from './index.js';

describe('getStreet', () => {
  it('reads existing street', () => {
    expect(getStreet({ address: { street: 'Baker St' } })).toBe('Baker St');
  });

  it('returns undefined for missing address', () => {
    expect(getStreet({ address: null })).toBe(undefined);
    expect(getStreet({})).toBe(undefined);
  });

  it('returns undefined for null user', () => {
    expect(getStreet(null)).toBe(undefined);
    expect(getStreet(undefined)).toBe(undefined);
  });
});
`,
    tags: ["optional-chaining", "objects"],
  }),
  createLearnJsChallenge({
    id: "chain-call-method",
    title: "Опциональный вызов",
    rank: 2,
    group: "Опциональная цепочка",
    tag: "JS/optional-chaining",
    description: `У объекта может быть метод, а может и не быть — в старой версии API его нет, в новой появился. \`obj.start()\` без метода даст \`TypeError: start is not a function\`.

Раньше защищались через \`if (typeof obj.start === 'function')\`. Теперь — \`?.\` перед скобками вызова:

\`\`\`js
obj.start?.();
\`\`\`

Если \`obj.start\` — \`null\` или \`undefined\`, вызов просто не происходит, всё выражение даёт \`undefined\`. Если функция — вызывается.

Часто и сам объект может отсутствовать, и метод. Тогда комбинация:

\`\`\`js
obj?.start?.();   // обе развилки безопасны
\`\`\`

**Что написать.** Функцию \`safeStart(obj)\`. Вызови \`obj.start()\` через \`?.\` и верни результат. Если объекта или метода нет — \`undefined\`.

## Требования

1. Используй \`obj?.start?.()\`.
2. Не используй \`if\` и \`typeof\`.
3. Возвращай результат или \`undefined\`.
4. Экспортируй функцию \`safeStart\`.

## Примеры

\`safeStart({ start: () => 42 })\` → \`42\`

\`safeStart({})\` → \`undefined\`

\`safeStart(null)\` → \`undefined\``,
    starter: `export function safeStart(obj) {
  // Вызови start через ?.()
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { safeStart } from './index.js';

describe('safeStart', () => {
  it('calls start when present', () => {
    expect(safeStart({ start: () => 42 })).toBe(42);
  });

  it('returns undefined when start is missing', () => {
    expect(safeStart({})).toBe(undefined);
  });

  it('returns undefined when obj is nullish', () => {
    expect(safeStart(null)).toBe(undefined);
    expect(safeStart(undefined)).toBe(undefined);
  });
});
`,
    tags: ["optional-chaining", "method-call"],
  }),
  createLearnJsChallenge({
    id: "chain-bracket-key",
    title: "Динамический ключ безопасно",
    rank: 3,
    group: "Опциональная цепочка",
    tag: "JS/optional-chaining",
    description: `\`?.\` работает и со скобками. Запись \`obj?.[key]\` значит: если \`obj\` — \`null\` или \`undefined\`, всё выражение даёт \`undefined\`; иначе читается \`obj[key]\`.

Это пригождается, когда имя ключа динамическое, и сам объект тоже может пропасть. Классика — обработка события: \`event.target?.[someProperty]\`. Элемент уже мог быть удалён (\`event.target === null\`), а имя свойства мы взяли из конфига. Без \`?.[]\` пришлось бы писать тернарник.

Если у \`obj\` нужного ключа нет — \`obj[key]\` сам вернёт \`undefined\`, защищаться от этого не надо. \`?.\` спасает только от \`null\`/\`undefined\` *самого объекта*.

**Что написать.** Функцию \`readByKey(obj, key)\`. Возвращает \`obj[key]\` через \`?.[]\`. Если \`obj\` — \`null\` или \`undefined\`, отдай \`undefined\`.

## Требования

1. Используй \`obj?.[key]\`.
2. \`obj === null\`/\`undefined\` → \`undefined\` без падения.
3. Отсутствие ключа отдельно не обрабатывай.
4. Экспортируй функцию \`readByKey\`.

## Примеры

\`readByKey({ a: 1, b: 2 }, 'b')\` → \`2\`

\`readByKey({ a: 1 }, 'b')\` → \`undefined\`

\`readByKey(null, 'a')\` → \`undefined\`

\`readByKey(undefined, 'a')\` → \`undefined\``,
    starter: `export function readByKey(obj, key) {
  // Используй ?.[key]
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { readByKey } from './index.js';

describe('readByKey', () => {
  it('reads dynamic key', () => {
    expect(readByKey({ a: 1, b: 2 }, 'b')).toBe(2);
  });

  it('returns undefined for missing key', () => {
    expect(readByKey({ a: 1 }, 'b')).toBe(undefined);
  });

  it('returns undefined for nullish obj', () => {
    expect(readByKey(null, 'a')).toBe(undefined);
    expect(readByKey(undefined, 'a')).toBe(undefined);
  });
});
`,
    tags: ["optional-chaining", "bracket-notation"],
  }),
  createLearnJsChallenge({
    id: "chain-deep-default",
    title: "Глубокое значение с дефолтом",
    rank: 4,
    group: "Опциональная цепочка",
    tag: "JS/optional-chaining",
    description: `Путь к значению пришёл массивом — например, \`['user', 'address', 'city']\`. \`?.\` для массива в цикле не работает (он умеет только буквальные имена), значит, обход пишем руками.

**Хитрость — что считать "значения нет".** Соблазн написать \`if (!current) return defaultValue\`. Не делай так:

\`\`\`js
if (!0)      // true — но 0 валиден!
if (!'')     // true — но '' валиден!
if (!false)  // true — но false валиден!
\`\`\`

\`!\` режет всё falsy. А нам нужно отличить "поля нет" от "поле есть и равно нулю". Лекарство — \`current == null\` (двойное равно ловит \`null\` и \`undefined\`, но не \`0\`/\`''\`/\`false\`).

**Что написать.** Функцию \`getNestedValue(obj, path, defaultValue)\`. Иди по ключам \`path\`. Если в какой-то точке текущее значение — \`null\`/\`undefined\`, верни \`defaultValue\`. Иначе — что нашли. Для пустого пути — сам \`obj\`.

## Требования

1. Поддержи путь любой длины, включая пустой.
2. \`defaultValue\` возвращается только при \`null\`/\`undefined\`.
3. \`0\`, \`''\`, \`false\` — валидные значения.
4. Пустой \`path\` → сам \`obj\` (или \`defaultValue\`, если \`obj\` нулевой).
5. Экспортируй функцию \`getNestedValue\`.

## Примеры

\`getNestedValue({ a: { b: { c: 42 } } }, ['a', 'b', 'c'], 0)\` → \`42\`

\`getNestedValue({ a: { b: null } }, ['a', 'b', 'c'], 'def')\` → \`'def'\`

\`getNestedValue({ a: { b: 0 } }, ['a', 'b'], 'def')\` → \`0\`

\`getNestedValue({}, ['a', 'b'], 'def')\` → \`'def'\`

\`getNestedValue(null, ['a'], 'def')\` → \`'def'\``,
    starter: `export function getNestedValue(obj, path, defaultValue) {
  // Пройди путь, верни defaultValue при null/undefined
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { getNestedValue } from './index.js';

describe('getNestedValue', () => {
  it('reads deep path', () => {
    expect(getNestedValue({ a: { b: { c: 42 } } }, ['a', 'b', 'c'], 0)).toBe(42);
  });

  it('returns default on broken path', () => {
    expect(getNestedValue({ a: { b: null } }, ['a', 'b', 'c'], 'def')).toBe('def');
  });

  it('keeps zero and empty string', () => {
    expect(getNestedValue({ a: { b: 0 } }, ['a', 'b'], 'def')).toBe(0);
    expect(getNestedValue({ a: { b: '' } }, ['a', 'b'], 'def')).toBe('');
    expect(getNestedValue({ a: { b: false } }, ['a', 'b'], 'def')).toBe(false);
  });

  it('returns default for null obj', () => {
    expect(getNestedValue(null, ['a'], 'def')).toBe('def');
  });

  it('returns default for empty obj', () => {
    expect(getNestedValue({}, ['a', 'b'], 'def')).toBe('def');
  });
});
`,
    tags: ["optional-chaining", "nullish-coalescing"],
  }),
  createLearnJsChallenge({
    id: "polyfill-get-path",
    title: "getPath",
    rank: 4,
    group: "Опциональная цепочка",
    tag: "JS/optional-chaining",
    description: `\`?.\` — это сахар над обычным циклом с проверкой. Сейчас ты этот цикл и напишешь.

**Алгоритм:**

\`\`\`js
let current = obj;
for (const key of path) {
  if (current == null) return undefined;
  current = current[key];
}
return current;
\`\`\`

Двойное равно \`== null\` ловит и \`null\`, и \`undefined\` за один шаг — это идиома, которой не надо бояться.

**Краевые случаи:**
- Пустой путь — цикл не выполнится ни разу, вернётся сам \`obj\`.
- \`obj\` сам \`null\`/\`undefined\` — первая же проверка вернёт \`undefined\`.
- На пути встретился \`null\` — \`undefined\`.
- В конце пути нашли \`0\`, \`''\`, \`false\` — это валидные значения, их не трогаем.

**Что написать.** Функцию \`getPath(obj, path)\`. Без \`?.\` и без \`try/catch\` — только цикл и проверка \`== null\`.

## Требования

1. Не используй \`?.\` и \`try/catch\`.
2. Используй \`current == null\`.
3. Любая длина пути, включая 0.
4. Пустой путь → сам \`obj\`.
5. \`null\`/\`undefined\` по дороге → \`undefined\`.
6. Экспортируй функцию \`getPath\`.

## Примеры

\`getPath({ a: { b: { c: 42 } } }, ['a', 'b', 'c'])\` → \`42\`

\`getPath({ a: null }, ['a', 'b'])\` → \`undefined\`

\`getPath(null, ['a'])\` → \`undefined\`

\`getPath({ a: 1 }, [])\` → \`{ a: 1 }\`

\`getPath({ a: 0 }, ['a'])\` → \`0\``,
    starter: `export function getPath(obj, path) {
  // Имитируй ?. через цикл и проверку на null/undefined
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { getPath } from './index.js';

describe('getPath', () => {
  it('reads existing path', () => {
    expect(getPath({ a: { b: { c: 42 } } }, ['a', 'b', 'c'])).toBe(42);
  });

  it('returns undefined for broken path', () => {
    expect(getPath({ a: null }, ['a', 'b'])).toBe(undefined);
    expect(getPath({}, ['a', 'b'])).toBe(undefined);
  });

  it('returns undefined for null obj', () => {
    expect(getPath(null, ['a'])).toBe(undefined);
    expect(getPath(undefined, ['a'])).toBe(undefined);
  });

  it('returns obj for empty path', () => {
    const obj = { a: 1 };
    expect(getPath(obj, [])).toBe(obj);
  });

  it('keeps falsy values', () => {
    expect(getPath({ a: 0 }, ['a'])).toBe(0);
    expect(getPath({ a: '' }, ['a'])).toBe('');
    expect(getPath({ a: false }, ['a'])).toBe(false);
  });
});
`,
    tags: ["polyfill", "optional-chaining"],
  }),
];

export const objectToPrimitiveChallenges: ChallengeDefinition[] = [
  createLearnJsChallenge({
    id: "toprim-money-string",
    title: "Деньги как строка",
    rank: 3,
    group: "Преобразование в примитив",
    tag: "JS/object-toprimitive",
    description: `Представь, что объект попал в \`alert\`, в шаблонную строку или в \`+\` со строкой. JavaScript должен спросить у объекта: "а какой ты примитив?" — и объект отвечает через специальный метод.

Главный канал ответа — \`[Symbol.toPrimitive](hint)\`. \`hint\` подсказывает контекст, и бывает трёх видов:
- \`'string'\` — нужен строковый примитив (\`String(obj)\`, шаблонные строки).
- \`'number'\` — нужно число (\`+obj\`, \`<\`, \`>\`).
- \`'default'\` — JavaScript не уверен (\`obj + что-то\`, \`obj == ...\`).

Money — приятный пример. В строке хочется видеть \`"100 USD"\`, в числе — само \`amount\`, чтобы можно было сравнивать суммы.

**Что написать.** Функцию \`createMoney(amount, currency)\`. Возвращает объект с полями \`amount\`, \`currency\` и методом \`[Symbol.toPrimitive](hint)\`. На hint \`'string'\` верни \`amount + ' ' + currency\`. На остальные — само \`amount\`.

## Требования

1. Объект имеет поля \`amount\` и \`currency\`.
2. Реализуй \`[Symbol.toPrimitive](hint)\`.
3. \`'string'\` → \`amount + ' ' + currency\`.
4. Остальное → \`amount\`.
5. Экспортируй функцию \`createMoney\`.

## Примеры

\`\`\`js
const m = createMoney(100, 'USD');
String(m);             // '100 USD'
\\\`Cost: \${m}\\\`;          // 'Cost: 100 USD'
+m;                    // 100
m.amount;              // 100
m.currency;            // 'USD'
\`\`\``,
    starter: `export function createMoney(amount, currency) {
  // Верни объект с Symbol.toPrimitive
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { createMoney } from './index.js';

describe('createMoney', () => {
  it('converts to string with currency', () => {
    expect(String(createMoney(100, 'USD'))).toBe('100 USD');
    expect(\`Cost: \${createMoney(50, 'EUR')}\`).toBe('Cost: 50 EUR');
  });

  it('converts to number with amount', () => {
    expect(+createMoney(100, 'USD')).toBe(100);
  });

  it('exposes fields', () => {
    const m = createMoney(7, 'GBP');
    expect(m.amount).toBe(7);
    expect(m.currency).toBe('GBP');
  });
});
`,
    tags: ["symbol-to-primitive", "string-hint"],
  }),
  createLearnJsChallenge({
    id: "toprim-money-hints",
    title: "Все три хинта",
    rank: 4,
    group: "Преобразование в примитив",
    tag: "JS/object-toprimitive",
    description: `Теперь различим все три hint по-настоящему. Каждому соответствуют свои операции:

- **\`'string'\`** — \`String(obj)\`, шаблонная строка, вывод на экран.
- **\`'number'\`** — унарный \`+obj\`, сравнения \`<\`, \`>\`, математика с числом.
- **\`'default'\`** — бинарный \`+\` (могло быть и число, и строка) и \`obj == primitive\`. JavaScript здесь не уверен.

**Стратегия для Money.** \`'string'\` и \`'default'\` оба отдают \`'100 USD'\` — конкатенация через \`+\` приводит к строковому представлению, как и \`String()\`. А \`'number'\` отдаёт само \`amount\`, чтобы сравнения по сумме работали:

\`\`\`js
createMoney(50, 'USD') > createMoney(20, 'USD');  // true — через число
\`\`\`

Используй *только* \`[Symbol.toPrimitive]\` — без \`toString\` и \`valueOf\`. Они для следующей задачи.

**Что написать.** Функцию \`createMoney(amount, currency)\` с \`[Symbol.toPrimitive](hint)\`:
- \`'string'\` → \`amount + ' ' + currency\`
- \`'number'\` → \`amount\`
- \`'default'\` → \`amount + ' ' + currency\`

## Требования

1. \`String(createMoney(100, 'USD'))\` → \`'100 USD'\`.
2. \`+createMoney(100, 'USD')\` → \`100\`.
3. \`createMoney(100, 'USD') + ''\` → \`'100 USD'\`.
4. Только \`[Symbol.toPrimitive]\` — без \`toString\` и \`valueOf\`.
5. Экспортируй функцию \`createMoney\`.

## Примеры

\`\`\`js
const m = createMoney(100, 'USD');
String(m);                            // '100 USD'
+m;                                   // 100
m + '';                               // '100 USD'
m > createMoney(50, 'USD');           // true
\`\`\``,
    starter: `export function createMoney(amount, currency) {
  // Различи три hint в Symbol.toPrimitive
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { createMoney } from './index.js';

describe('createMoney with hints', () => {
  it('string hint returns formatted', () => {
    expect(String(createMoney(100, 'USD'))).toBe('100 USD');
  });

  it('number hint returns amount', () => {
    expect(+createMoney(100, 'USD')).toBe(100);
    expect(createMoney(50, 'EUR') > createMoney(20, 'EUR')).toBe(true);
  });

  it('default hint returns formatted', () => {
    expect(createMoney(100, 'USD') + '').toBe('100 USD');
  });
});
`,
    tags: ["symbol-to-primitive", "hints"],
  }),
  createLearnJsChallenge({
    id: "toprim-fallback",
    title: "Без Symbol.toPrimitive",
    rank: 4,
    group: "Преобразование в примитив",
    tag: "JS/object-toprimitive",
    description: `\`Symbol.toPrimitive\` — это новый канал. До него и сейчас в его отсутствие JavaScript обращается к двум более старым методам: \`toString\` и \`valueOf\`.

**Порядок зависит от hint:**

- \`'string'\` — сначала \`toString\`, потом \`valueOf\`.
- \`'number'\` или \`'default'\` — сначала \`valueOf\`, потом \`toString\`.

Логика историческая: \`toString\` про строки, \`valueOf\` про числа, кого хотим — того и спрашиваем первым. Если первый вернул объект (а не примитив), пробуем второй. Если оба вернули объект — \`TypeError\`.

**Ловкий трюк.** Сделаем таймер: \`toString\` отдаёт \`'5s'\`, \`valueOf\` — число \`5\`.

\`\`\`js
String(t);    // '5s' — hint 'string', сработал toString
+t;           // 5 — hint 'number', сработал valueOf
t + 1;        // 6 — hint 'default', valueOf первым → число + число
\`\`\`

В логах красиво, в арифметике корректно — за счёт того, что разные hint берут разные методы.

**Что написать.** Функцию \`createTimer(seconds)\`. Объект с \`toString()\` (возвращает \`seconds + 's'\`) и \`valueOf()\` (возвращает \`seconds\`). Без \`Symbol.toPrimitive\`.

## Требования

1. \`toString\` → \`seconds + 's'\`.
2. \`valueOf\` → \`seconds\`.
3. Не реализуй \`Symbol.toPrimitive\`.
4. Экспортируй функцию \`createTimer\`.

## Примеры

\`\`\`js
const t = createTimer(5);
String(t);    // '5s'
+t;           // 5
t + 1;        // 6
\`\`\``,
    starter: `export function createTimer(seconds) {
  // Реализуй toString и valueOf, без Symbol.toPrimitive
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { createTimer } from './index.js';

describe('createTimer', () => {
  it('toString returns formatted', () => {
    expect(String(createTimer(5))).toBe('5s');
  });

  it('valueOf returns number', () => {
    expect(+createTimer(10)).toBe(10);
  });

  it('default hint uses valueOf first', () => {
    expect(createTimer(5) + 1).toBe(6);
  });

  it('does not define Symbol.toPrimitive', () => {
    expect(createTimer(1)[Symbol.toPrimitive]).toBe(undefined);
  });
});
`,
    tags: ["to-string", "value-of"],
  }),
  createLearnJsChallenge({
    id: "polyfill-to-primitive",
    title: "toPrimitive",
    rank: 6,
    group: "Преобразование в примитив",
    tag: "JS/object-toprimitive",
    description: `\`ToPrimitive\` — это та операция, которую движок выполняет всякий раз, когда объект попадает в место, требующее примитив. Сейчас ты её соберёшь сам.

**Алгоритм:**

1. Если \`input\` не объект (примитив или \`null\`) — вернуть как есть.
2. Если у объекта есть \`Symbol.toPrimitive\` — вызвать с \`hint\`. Примитив на выходе — отлично, объект — \`TypeError\` (контракт нарушен).
3. Иначе — \`toString\`/\`valueOf\`, порядок зависит от hint:
   - \`'string'\` → сначала \`toString\`, потом \`valueOf\`.
   - \`'number'\` или \`'default'\` → сначала \`valueOf\`, потом \`toString\`.
4. Каждый метод проверяем: есть ли он и вернул ли примитив. Первый, кто вернул примитив, выигрывает.
5. Если оба отсутствуют или вернули объект — \`TypeError\`.

**Что считается примитивом.** \`undefined\`, \`null\`, \`boolean\`, \`number\`, \`string\`, \`bigint\`, \`symbol\`. Всё остальное — объект. Удобная проверка:

\`\`\`js
(typeof value !== 'object' && typeof value !== 'function') || value === null
\`\`\`

\`null\` сам по себе примитив, хотя \`typeof null === 'object'\` (старый баг языка). Возвращай его как \`null\`.

**Что написать.** Функцию \`toPrimitive(input, hint)\` по алгоритму выше.

## Требования

1. Не объект → как есть.
2. \`null\` → \`null\`.
3. Поддержи \`'string'\`, \`'number'\`, \`'default'\`.
4. Сначала \`Symbol.toPrimitive\`, если есть.
5. Если \`Symbol.toPrimitive\` вернул объект — \`TypeError\`.
6. Иначе \`toString\`/\`valueOf\` в правильном порядке.
7. Оба провалились — \`TypeError\`.
8. Экспортируй функцию \`toPrimitive\`.

## Примеры

\`toPrimitive(7, 'string')\` → \`7\`

\`toPrimitive(null, 'default')\` → \`null\`

\`toPrimitive({ [Symbol.toPrimitive]: () => 42 }, 'number')\` → \`42\`

\`toPrimitive({ toString: () => 'hi', valueOf: () => 5 }, 'string')\` → \`'hi'\`

\`toPrimitive({ toString: () => 'hi', valueOf: () => 5 }, 'number')\` → \`5\`

\`toPrimitive({ valueOf: () => ({}), toString: () => 'S' }, 'number')\` → \`'S'\`

\`toPrimitive({ toString: () => ({}), valueOf: () => ({}) }, 'string')\` → выбрасывает \`TypeError\``,
    starter: `export function toPrimitive(input, hint) {
  // Реализуй ToPrimitive по спецификации
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { toPrimitive } from './index.js';

describe('toPrimitive', () => {
  it('returns primitive input as-is', () => {
    expect(toPrimitive(7, 'string')).toBe(7);
    expect(toPrimitive('hi', 'number')).toBe('hi');
    expect(toPrimitive(null, 'default')).toBe(null);
    expect(toPrimitive(undefined, 'default')).toBe(undefined);
  });

  it('uses Symbol.toPrimitive when present', () => {
    const obj = { [Symbol.toPrimitive]: (h) => (h === 'string' ? 'S' : 42) };
    expect(toPrimitive(obj, 'number')).toBe(42);
    expect(toPrimitive(obj, 'string')).toBe('S');
  });

  it('throws TypeError when Symbol.toPrimitive returns object', () => {
    const obj = { [Symbol.toPrimitive]: () => ({}) };
    expect(() => toPrimitive(obj, 'number')).toThrow(TypeError);
  });

  it('uses toString first for string hint', () => {
    const obj = { toString: () => 'S', valueOf: () => 5 };
    expect(toPrimitive(obj, 'string')).toBe('S');
  });

  it('uses valueOf first for number hint', () => {
    const obj = { toString: () => 'S', valueOf: () => 5 };
    expect(toPrimitive(obj, 'number')).toBe(5);
  });

  it('uses valueOf first for default hint', () => {
    const obj = { toString: () => 'S', valueOf: () => 5 };
    expect(toPrimitive(obj, 'default')).toBe(5);
  });

  it('falls back to second method when first returns object', () => {
    const obj = { valueOf: () => ({}), toString: () => 'S' };
    expect(toPrimitive(obj, 'number')).toBe('S');
  });

  it('throws when both methods return objects', () => {
    const obj = { toString: () => ({}), valueOf: () => ({}) };
    expect(() => toPrimitive(obj, 'string')).toThrow(TypeError);
    expect(() => toPrimitive(obj, 'number')).toThrow(TypeError);
  });
});
`,
    tags: ["polyfill", "symbol-to-primitive", "spec"],
  }),
];
