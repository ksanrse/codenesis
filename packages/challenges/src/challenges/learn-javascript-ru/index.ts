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
    description: `Стрелочная функция здесь нужна не ради сокращения записи, а чтобы привыкнуть к простым функциям-значениям.

Напиши \`square(value)\`: функция получает число и возвращает его квадрат. Например, \`square(4)\` должен вернуть \`16\`, а \`square(-3)\` - \`9\`.

## Требования

1. Экспортируй константу \`square\`, в которой лежит стрелочная функция.
2. Верни число, умноженное само на себя.
3. Не меняй имя функции: тесты импортируют именно \`square\`.

## Интерфейс

Экспортируй \`square(value)\`.`,
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
    description: `В реальном коде стрелочные функции часто используют для короткой обработки объектов.

Напиши \`getFullName(user)\`: функция получает объект с \`firstName\` и \`lastName\`, убирает лишние пробелы по краям и возвращает полное имя через пробел.

## Требования

1. Экспортируй \`getFullName(user)\` как стрелочную функцию.
2. Используй поля \`firstName\` и \`lastName\`.
3. Убери лишние пробелы вокруг имени и фамилии.
4. Для \`{ firstName: 'Ada', lastName: 'Lovelace' }\` верни \`'Ada Lovelace'\`.

## Интерфейс

Экспортируй \`getFullName(user)\`.`,
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
    description: `Стрелочные функции удобно передавать в методы массивов.

Напиши \`getPositiveNumbers(numbers)\`: функция получает массив чисел и возвращает новый массив только с числами больше нуля. Ноль положительным числом не считается.

## Требования

1. Экспортируй \`getPositiveNumbers(numbers)\`.
2. Верни новый массив, не меняя исходный.
3. Оставь только значения строго больше \`0\`.
4. Используй понятную короткую callback-функцию.

## Интерфейс

Экспортируй \`getPositiveNumbers(numbers)\`.`,
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
    description: `Когда данные приходят списком объектов, часто нужно получить из них один конкретный столбец.

Напиши \`getUserNames(users)\`: функция получает массив объектов и возвращает массив имен. Если у объекта нет поля \`name\`, его нужно пропустить.

## Требования

1. Экспортируй \`getUserNames(users)\`.
2. Верни массив строк с именами.
3. Не добавляй \`undefined\` для пользователей без имени.
4. Порядок имен должен остаться таким же, как во входном массиве.

## Интерфейс

Экспортируй \`getUserNames(users)\`.`,
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
    description: `Параметры по умолчанию помогают описать обычный сценарий прямо в сигнатуре функции.

Напиши \`addVat(price, rate = 0.2)\`: функция получает цену и ставку НДС, добавляет налог к цене и возвращает сумму с двумя знаками после запятой.

## Требования

1. Экспортируй \`addVat(price, rate = 0.2)\`.
2. Если \`rate\` не передан, используй \`0.2\`.
3. Верни \`price + price * rate\`.
4. Округли результат до двух знаков после запятой и верни число.

## Интерфейс

Экспортируй \`addVat(price, rate)\`.`,
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
    description: `Функция может вернуть другую функцию. Внутренняя функция запоминает значение из внешней - это замыкание.

Напиши \`makeMultiplier(factor)\`: она возвращает функцию, которая принимает число и умножает его на сохраненный \`factor\`.

## Требования

1. Экспортируй \`makeMultiplier(factor)\`.
2. Верни функцию, а не результат вычисления сразу.
3. Внутренняя функция должна использовать \`factor\` из внешней функции.
4. Решение должно работать для разных множителей независимо друг от друга.

## Интерфейс

Экспортируй \`makeMultiplier(factor)\`.`,
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
    description: `Метод \`sort\` меняет массив на месте, поэтому с ним легко случайно испортить входные данные.

Напиши \`sortByScoreDesc(players)\`: функция получает массив игроков с полем \`score\` и возвращает новый массив от большего score к меньшему.

## Требования

1. Экспортируй \`sortByScoreDesc(players)\`.
2. Сортируй по \`score\` по убыванию.
3. Не мутируй массив \`players\`.
4. Верни новый массив объектов игроков.

## Интерфейс

Экспортируй \`sortByScoreDesc(players)\`.`,
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
    description: `\`null\` и \`undefined\` обычно означают, что значения нет. При этом пустая строка - это значение.

Напиши \`getDisplayTitle(title)\`: если \`title\` равен \`null\` или \`undefined\`, верни \`'Untitled'\`. Во всех остальных случаях верни переданное значение как есть.

## Требования

1. Экспортируй \`getDisplayTitle(title)\`.
2. Замени только \`null\` и \`undefined\`.
3. Пустая строка \`''\` должна остаться пустой строкой.
4. Строка вроде \`'Docs'\` должна вернуться без изменений.

## Интерфейс

Экспортируй \`getDisplayTitle(title)\`.`,
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
    description: `JavaScript умеет неявно приводить типы, но в проверках это часто создает баги.

Напиши \`isSameValueAndType(a, b)\`: функция возвращает \`true\`, только если аргументы равны без приведения типов.

## Требования

1. Экспортируй \`isSameValueAndType(a, b)\`.
2. Используй строгое сравнение.
3. Не превращай значения в строки или числа перед сравнением.
4. \`false\` и \`0\` должны считаться разными значениями.

## Интерфейс

Экспортируй \`isSameValueAndType(a, b)\`.`,
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
    description: `У вложенных объектов не всегда есть все поля. Если читать глубокое поле напрямую, код может упасть.

Напиши \`getUserCity(user)\`: верни \`user.address.city\`, если такой путь существует. Если пользователя, адреса или города нет, верни строку \`'unknown'\`.

## Требования

1. Экспортируй \`getUserCity(user)\`.
2. Безопасно обработай \`null\` и отсутствующие поля.
3. Если город есть, верни его строкой без изменений.
4. Если города нет, верни \`'unknown'\`.

## Интерфейс

Экспортируй \`getUserCity(user)\`.`,
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
    description: `Иногда нужно найти первый подходящий элемент, а не собирать все варианты.

Напиши \`findFirstDivisible(values, divisor)\`: верни первое число, которое делится на \`divisor\` без остатка. Если такого числа нет, верни \`null\`.

## Требования

1. Экспортируй \`findFirstDivisible(values, divisor)\`.
2. Проверяй деление через остаток от деления.
3. Верни именно первое подходящее число.
4. Если совпадений нет, верни \`null\`.

## Интерфейс

Экспортируй \`findFirstDivisible(values, divisor)\`.`,
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
    description: `Условия в бизнес-логике лучше читать сверху вниз: сначала причины отказа, потом успешные варианты.

Напиши \`getAccessLabel(user)\`: неактивный пользователь получает \`'blocked'\`, пользователь младше 18 лет - \`'minor'\`, взрослый оплативший пользователь - \`'full'\`, остальные активные взрослые - \`'trial'\`.

## Требования

1. Экспортируй \`getAccessLabel(user)\`.
2. Сначала проверь \`active: false\` и верни \`'blocked'\`.
3. Если \`age\` меньше 18, верни \`'minor'\`.
4. Если пользователь активен, взрослый и \`paid: true\`, верни \`'full'\`.
5. В остальных случаях верни \`'trial'\`.

## Интерфейс

Экспортируй \`getAccessLabel(user)\`.`,
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
    description: `Данные из формы часто приходят строками. Перед вычислениями их нужно явно превратить в число и отсеять невозможные значения.

Напиши \`normalizeNumber(value)\`: верни конечное число, если значение можно безопасно превратить в число. Если значение пустое, не число или бесконечность, верни \`null\`.

## Требования

1. Экспортируй \`normalizeNumber(value)\`.
2. Строка \`'42'\` должна стать числом \`42\`.
3. Обычное число должно вернуться без изменений.
4. Пустая строка, \`'abc'\` и \`Infinity\` должны вернуть \`null\`.
5. Верни именно \`null\`, а не \`0\`, \`false\` или \`undefined\`.

## Интерфейс

Экспортируй \`normalizeNumber(value)\`.`,
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
    description: `Эта задача про отладку: код уже есть, но он считает неправильно.

Почини \`getAverage(values)\`: функция получает массив чисел и возвращает среднее арифметическое. Для пустого массива нужно вернуть \`0\`.

## Требования

1. Экспортируй \`getAverage(values)\`.
2. Посчитай сумму всех чисел.
3. Раздели сумму на количество элементов.
4. Если массив пустой, верни \`0\`.
5. Не добавляй специальных округлений.

## Интерфейс

Экспортируй \`getAverage(values)\`.`,
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
    description: `Ранний возврат помогает не строить глубокие \`if\` внутри \`if\`.

Напиши \`getDiscount(user, cart)\`: неактивный пользователь или корзина меньше 1000 получают \`0\`. Активный VIP получает \`0.2\`, активный обычный пользователь с большой корзиной - \`0.1\`.

## Требования

1. Экспортируй \`getDiscount(user, cart)\`.
2. Если \`user.active\` не \`true\`, верни \`0\`.
3. Если \`cart.total\` меньше \`1000\`, верни \`0\`.
4. Если пользователь VIP, верни \`0.2\`.
5. Иначе верни \`0.1\`.

## Интерфейс

Экспортируй \`getDiscount(user, cart)\`.`,
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
    description: `Булевы условия быстро становятся нечитаемыми, если писать их одной длинной строкой.

Напиши \`canPublish(post, user)\`: публиковать можно только пост с непустыми \`title\` и \`body\`, и только пользователю с ролью \`editor\` или \`admin\`. Заблокированный пользователь публиковать не может.

## Требования

1. Экспортируй \`canPublish(post, user)\`.
2. Проверь, что у поста есть заголовок и текст.
3. Разреши роли \`editor\` и \`admin\`.
4. Если \`user.blocked\` равен \`true\`, верни \`false\`.
5. Сделай условие читаемым: можно вводить промежуточные переменные.

## Интерфейс

Экспортируй \`canPublish(post, user)\`.`,
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
    description: `При отладке полезно видеть не только финальный результат, но и промежуточные значения.

Напиши \`runWithTrace(initial, steps)\`: применяй функции-шаги по очереди, сохраняй результат после каждого шага и верни объект с финальным результатом и массивом trace.

## Требования

1. Экспортируй \`runWithTrace(initial, steps)\`.
2. Начни вычисление со значения \`initial\`.
3. Каждую функцию из \`steps\` применяй к текущему значению.
4. В \`trace\` добавляй результат после каждого шага, не включая начальное значение.
5. Верни объект вида \`{ result, trace }\`.

## Интерфейс

Экспортируй \`runWithTrace(initial, steps)\`.`,
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
    description: `Комментарии нужны не для очевидного кода, а для объяснения правила, которое иначе приходится держать в голове.

Напиши \`isRetryableStatus(status)\`: верни \`true\` для HTTP-статусов, при которых запрос обычно можно повторить: \`408\`, \`429\` и любые \`5xx\` от \`500\` до \`599\`.

## Требования

1. Экспортируй \`isRetryableStatus(status)\`.
2. Верни \`true\` для \`408\` и \`429\`.
3. Верни \`true\` для статусов от \`500\` до \`599\` включительно.
4. Верни \`false\` для \`400\`, \`404\`, \`600\` и других неподходящих значений.
5. Если добавляешь комментарий, пусть он объясняет правило повторной попытки.

## Интерфейс

Экспортируй \`isRetryableStatus(status)\`.`,
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
    description: `Полифил - это своя версия встроенного метода. Здесь нужно повторить основную логику \`Array.prototype.includes\`, но назвать функцию \`myIncludes\`.

Напиши \`myIncludes(array, searchElement, fromIndex = 0)\`: функция ищет значение в массиве и возвращает \`true\`, если оно найдено.

## Требования

1. Экспортируй \`myIncludes(array, searchElement, fromIndex = 0)\`.
2. Не используй встроенный \`array.includes\`.
3. Начинай поиск с \`fromIndex\`; отрицательный индекс считай от конца массива.
4. Верни \`true\`, если элемент найден, иначе \`false\`.
5. \`NaN\` должен находиться как равный \`NaN\`.

## Интерфейс

Экспортируй \`myIncludes(array, searchElement, fromIndex)\`.`,
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
    description: `\`find\` нужен, когда важен первый подходящий элемент.

Напиши \`myFind(array, predicate)\`: пройди по массиву слева направо и верни первый элемент, для которого \`predicate\` вернет truthy-значение. Если такого элемента нет, верни \`undefined\`.

## Требования

1. Экспортируй \`myFind(array, predicate)\`.
2. Не используй встроенный \`array.find\`.
3. Вызывай \`predicate(value, index, array)\`.
4. Верни первый подходящий элемент.
5. Если ничего не найдено, верни \`undefined\`.

## Интерфейс

Экспортируй \`myFind(array, predicate)\`.`,
    starter: `export function myFind(array, predicate) {
  // Реализуй find без вызова array.find
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { myFind } from './index.js';

describe('myFind', () => {
  it('returns first matching value', () => {
    expect(myFind([3, 8, 10], (value) => value > 5)).toBe(8);
    expect(myFind([3, 4], (value) => value > 5)).toBeUndefined();
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
    description: `\`some\` отвечает на вопрос: есть ли в массиве хотя бы один подходящий элемент.

Напиши \`mySome(array, predicate)\`: верни \`true\`, если хотя бы один элемент проходит проверку. Если ни один элемент не подходит, верни \`false\`.

## Требования

1. Экспортируй \`mySome(array, predicate)\`.
2. Не используй встроенный \`array.some\`.
3. Вызывай \`predicate(value, index, array)\`.
4. Останови цикл, как только найден подходящий элемент.
5. Для массива без совпадений верни \`false\`.

## Интерфейс

Экспортируй \`mySome(array, predicate)\`.`,
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
    description: `\`every\` отвечает на вопрос: подходят ли все элементы массива.

Напиши \`myEvery(array, predicate)\`: верни \`true\`, если каждый элемент проходит проверку. Если хотя бы один элемент не подходит, верни \`false\`. Для пустого массива результат должен быть \`true\`.

## Требования

1. Экспортируй \`myEvery(array, predicate)\`.
2. Не используй встроенный \`array.every\`.
3. Вызывай \`predicate(value, index, array)\`.
4. Останови цикл на первом провале.
5. Для пустого массива верни \`true\`.

## Интерфейс

Экспортируй \`myEvery(array, predicate)\`.`,
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
    description: `\`map\` создает новый массив той же длины, преобразуя каждый элемент.

Напиши \`myMap(array, callback)\`: для каждого элемента вызови \`callback\` и положи результат в новый массив на ту же позицию.

## Требования

1. Экспортируй \`myMap(array, callback)\`.
2. Не используй встроенный \`array.map\`.
3. Вызывай \`callback(value, index, array)\`.
4. Верни новый массив той же длины.
5. Исходный массив не должен измениться.

## Интерфейс

Экспортируй \`myMap(array, callback)\`.`,
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
    description: `\`filter\` создает новый массив только из элементов, которые прошли проверку.

Напиши \`myFilter(array, predicate)\`: пройди по массиву и верни новый массив из тех элементов, для которых \`predicate\` вернул truthy-значение.

## Требования

1. Экспортируй \`myFilter(array, predicate)\`.
2. Не используй встроенный \`array.filter\`.
3. Вызывай \`predicate(value, index, array)\`.
4. Добавляй в результат только прошедшие элементы.
5. Не меняй исходный массив.

## Интерфейс

Экспортируй \`myFilter(array, predicate)\`.`,
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
    description: `\`reduce\` сворачивает массив в одно значение. Это самый сложный полифил в разделе, потому что у него есть два режима: с начальным значением и без него.

Напиши \`myReduce(array, reducer, initialValue)\`: пройди по массиву и на каждом шаге обновляй аккумулятор через \`reducer\`.

## Требования

1. Экспортируй \`myReduce(array, reducer, initialValue)\`.
2. Не используй встроенный \`array.reduce\`.
3. Вызывай \`reducer(accumulator, value, index, array)\`.
4. Поддержи вариант с \`initialValue\` и без него.
5. Если массив пустой и \`initialValue\` не передан, выброси \`TypeError\`.

## Интерфейс

Экспортируй \`myReduce(array, reducer, initialValue)\`.`,
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
