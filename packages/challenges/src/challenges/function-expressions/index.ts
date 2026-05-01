import { getChallengePoints } from "../../ranking.ts";
import type { ChallengeDefinition, ChallengeFile } from "../../types.ts";

interface FunctionExpressionChallengeConfig {
  id: string;
  title: string;
  description: string;
  starter: string;
  tests: string;
  solution?: string;
  rank: number;
  difficulty?: ChallengeDefinition["difficulty"];
  tags: string[];
}

const emptyLangs: ChallengeFile[] = [];

function createFunctionExpressionChallenge(
  config: FunctionExpressionChallengeConfig,
): ChallengeDefinition {
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
  const solutionFiles: ChallengeFile[] = config.solution
    ? [
        {
          path: "src/index.js",
          content: config.solution,
        },
      ]
    : emptyLangs;

  return {
    id: config.id,
    title: config.title,
    description: config.description,
    difficulty: config.difficulty ?? "Starter",
    category: "JavaScript",
    group: "Function Expressions",
    languages: ["javascript"],
    rank: config.rank,
    reputation: getChallengePoints(config.rank),
    tags: ["JS/function-expressions", "function-expression", "functions", ...config.tags],
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
      javascript: solutionFiles,
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

export const functionExpressionChallenges: ChallengeDefinition[] = [
  createFunctionExpressionChallenge({
    id: "function-expression-greeter",
    title: "Фабрика приветствий",
    rank: 2,
    description: `Function expression можно сохранить в переменную и вернуть из другой функции. Так удобно создавать функции, которые помнят данные из внешнего вызова.

Напиши \`makeGreeter(name)\`: функция принимает имя и возвращает новую функцию. Когда эту новую функцию вызывают, она должна вернуть строку \`"Hello, <name>!"\`.

## Требования

1. Экспортируй \`makeGreeter(name)\` как function expression.
2. \`makeGreeter(name)\` должен вернуть функцию.
3. Возвращенная функция должна вернуть \`"Hello, <name>!"\`.
4. Имя должно запоминаться через замыкание.

## Интерфейс

Экспортируй \`makeGreeter(name)\`.`,
    starter: `export const makeGreeter = function (name) {
  // Верни функцию, которая использует name
};
`,
    solution: `export const makeGreeter = function (name) {
  return function () {
    return \`Hello, \${name}!\`;
  };
};
`,
    tests: `import { describe, expect, it } from 'vitest';
import { makeGreeter } from './index.js';

describe('makeGreeter', () => {
  it('returns a function', () => {
    expect(typeof makeGreeter('Ada')).toBe('function');
  });

  it('keeps the name in a closure', () => {
    const greetAda = makeGreeter('Ada');
    const greetGrace = makeGreeter('Grace');
    expect(greetAda()).toBe('Hello, Ada!');
    expect(greetGrace()).toBe('Hello, Grace!');
  });
});
`,
    tags: ["closures", "factory"],
  }),
  createFunctionExpressionChallenge({
    id: "function-expression-operation",
    title: "Выбор операции",
    rank: 2,
    description: `Функции в JavaScript можно выбирать как обычные значения. Это полезно, когда по строковому коду нужно вернуть нужное поведение.

Напиши \`chooseOperation(operator)\`: функция получает строку с операцией и возвращает функцию для двух чисел. Например, \`chooseOperation("add")(2, 3)\` должен вернуть \`5\`.

## Требования

1. Экспортируй \`chooseOperation(operator)\`.
2. Для \`"add"\` верни сложение.
3. Для \`"subtract"\` верни вычитание.
4. Для \`"multiply"\` верни умножение.
5. Для \`"divide"\` верни деление.
6. Для неизвестной операции верни функцию, которая возвращает \`NaN\`.

## Интерфейс

Экспортируй \`chooseOperation(operator)\`.`,
    starter: `export const chooseOperation = function (operator) {
  // Верни function expression для operator
};
`,
    tests: `import { describe, expect, it } from 'vitest';
import { chooseOperation } from './index.js';

describe('chooseOperation', () => {
  it('returns math operations', () => {
    expect(chooseOperation('add')(2, 3)).toBe(5);
    expect(chooseOperation('subtract')(8, 3)).toBe(5);
    expect(chooseOperation('multiply')(4, 3)).toBe(12);
    expect(chooseOperation('divide')(12, 3)).toBe(4);
  });

  it('returns NaN operation for unknown operators', () => {
    expect(Number.isNaN(chooseOperation('power')(2, 3))).toBe(true);
  });
});
`,
    tags: ["callbacks", "operators"],
  }),
  createFunctionExpressionChallenge({
    id: "function-expression-counter",
    title: "Счетчик с замыканием",
    rank: 3,
    description: `Замыкание можно использовать для хранения внутреннего состояния. Внешний код не видит это состояние напрямую, но возвращенная функция может его менять.

Напиши \`createCounter(start)\`: функция возвращает счетчик. Каждый вызов счетчика увеличивает сохраненное число на \`1\` и возвращает новое значение.

## Требования

1. Экспортируй \`createCounter(start)\`.
2. Если \`start\` не передан, начинай с \`0\`.
3. Верни функцию без параметров.
4. Каждый вызов возвращенной функции увеличивает счетчик на \`1\`.
5. Разные счетчики не должны влиять друг на друга.

## Интерфейс

Экспортируй \`createCounter(start)\`.`,
    starter: `export const createCounter = function (start = 0) {
  // Верни функцию-инкрементер
};
`,
    tests: `import { describe, expect, it } from 'vitest';
import { createCounter } from './index.js';

describe('createCounter', () => {
  it('increments from default zero', () => {
    const next = createCounter();
    expect(next()).toBe(1);
    expect(next()).toBe(2);
    expect(next()).toBe(3);
  });

  it('increments from a custom start', () => {
    const next = createCounter(10);
    expect(next()).toBe(11);
    expect(next()).toBe(12);
  });
});
`,
    tags: ["closures", "state"],
  }),
  createFunctionExpressionChallenge({
    id: "function-expression-once",
    title: "Выполнить один раз",
    rank: 4,
    description: `Wrapper-функция принимает другую функцию и меняет правило ее вызова. Здесь нужно разрешить исходной функции выполниться только один раз.

Напиши \`once(fn)\`: она возвращает новую функцию. Первый вызов запускает \`fn\`, сохраняет результат и возвращает его. Следующие вызовы уже не вызывают \`fn\`, а возвращают сохраненный результат.

## Требования

1. Экспортируй \`once(fn)\`.
2. Верни функцию-обертку.
3. Первый вызов должен вызвать \`fn\` с переданными аргументами.
4. Повторные вызовы должны возвращать результат первого вызова.
5. Исходная \`fn\` не должна выполняться больше одного раза.

## Интерфейс

Экспортируй \`once(fn)\`.`,
    starter: `export const once = function (fn) {
  // Верни функцию-обертку
};
`,
    tests: `import { describe, expect, it } from 'vitest';
import { once } from './index.js';

describe('once', () => {
  it('calls the original function only once', () => {
    let calls = 0;
    const wrapped = once(function (value) {
      calls += 1;
      return value * 2;
    });

    expect(wrapped(4)).toBe(8);
    expect(wrapped(10)).toBe(8);
    expect(calls).toBe(1);
  });
});
`,
    tags: ["wrappers", "state"],
  }),
  createFunctionExpressionChallenge({
    id: "function-expression-map-with",
    title: "Свой mapWith",
    rank: 4,
    description: `Callback - это функция, которую мы передаем другой функции. Метод \`map\` работает именно так: вызывает callback для каждого элемента и собирает новый массив.

Напиши \`mapWith(items, mapper)\`: функция возвращает новый массив, где каждый элемент получен вызовом \`mapper(item, index)\`.

## Требования

1. Экспортируй \`mapWith(items, mapper)\`.
2. Верни новый массив той же длины.
3. Для каждого элемента вызови \`mapper(item, index)\`.
4. Не меняй исходный массив.
5. Не используй встроенный \`Array.prototype.map\`.

## Интерфейс

Экспортируй \`mapWith(items, mapper)\`.`,
    starter: `export const mapWith = function (values, transform) {
  // Верни новый массив после применения transform
};
`,
    tests: `import { describe, expect, it } from 'vitest';
import { mapWith } from './index.js';

describe('mapWith', () => {
  it('maps values with index', () => {
    expect(mapWith([2, 4, 6], function (value, index) {
      return value + index;
    })).toEqual([2, 5, 8]);
  });

  it('does not mutate the original array', () => {
    const values = [1, 2, 3];
    const result = mapWith(values, function (value) {
      return value * 10;
    });
    expect(values).toEqual([1, 2, 3]);
    expect(result).toEqual([10, 20, 30]);
  });
});
`,
    tags: ["arrays", "callbacks"],
  }),
  createFunctionExpressionChallenge({
    id: "function-expression-filter-by",
    title: "Фильтр предикатом",
    rank: 4,
    description: `Predicate - это функция, которая отвечает да или нет. Если predicate возвращает truthy-значение, элемент остается; если falsy - отбрасывается.

Напиши \`filterBy(items, predicate)\`: функция возвращает новый массив только с теми элементами, для которых \`predicate(item, index)\` вернул truthy-значение.

## Требования

1. Экспортируй \`filterBy(items, predicate)\`.
2. Вызывай \`predicate(item, index)\` для каждого элемента.
3. Верни новый массив прошедших элементов.
4. Не меняй исходный массив.
5. Не используй встроенный \`Array.prototype.filter\`.

## Интерфейс

Экспортируй \`filterBy(items, predicate)\`.`,
    starter: `export const filterBy = function (values, predicate) {
  // Верни новый отфильтрованный массив
};
`,
    tests: `import { describe, expect, it } from 'vitest';
import { filterBy } from './index.js';

describe('filterBy', () => {
  it('filters by value and index', () => {
    const result = filterBy([3, 4, 5, 6, 7], function (value, index) {
      return value % 2 === 1 && index > 0;
    });
    expect(result).toEqual([5, 7]);
  });

  it('returns an empty array when nothing matches', () => {
    expect(filterBy(['a', 'b'], function (value) {
      return value === 'z';
    })).toEqual([]);
  });
});
`,
    difficulty: "Mid",
    tags: ["arrays", "predicate"],
  }),
  createFunctionExpressionChallenge({
    id: "function-expression-pipe",
    title: "Композиция pipe",
    rank: 4,
    description: `Pipe соединяет несколько маленьких функций в одну цепочку. Результат первой функции становится входом второй, результат второй - входом третьей.

Напиши \`pipe(...functions)\`: она возвращает функцию, которая применяет все переданные функции слева направо.

## Требования

1. Экспортируй \`pipe(...functions)\`.
2. Верни функцию, которая принимает начальное значение.
3. Применяй функции слева направо.
4. Если функций нет, верни исходное значение без изменений.
5. Не меняй массив функций.

## Интерфейс

Экспортируй \`pipe(...functions)\`.`,
    starter: `export const pipe = function (...fns) {
  // Верни функцию, которая применяет fns слева направо
};
`,
    tests: `import { describe, expect, it } from 'vitest';
import { pipe } from './index.js';

describe('pipe', () => {
  it('composes functions left to right', () => {
    const transform = pipe(
      function (value) { return value + 2; },
      function (value) { return value * 3; },
      function (value) { return String(value); },
    );
    expect(transform(4)).toBe('18');
  });

  it('returns the original value when empty', () => {
    expect(pipe()(42)).toBe(42);
  });
});
`,
    difficulty: "Mid",
    tags: ["composition", "higher-order-functions"],
  }),
  createFunctionExpressionChallenge({
    id: "function-expression-memoize",
    title: "Memoize для одного аргумента",
    rank: 5,
    description: `Memoization сохраняет результат вычисления. Если функцию снова вызывают с тем же аргументом, можно вернуть сохраненный результат и не делать работу повторно.

Напиши \`memoizeOne(fn)\`: функция возвращает обертку для функции с одним аргументом. Для уже встречавшегося аргумента обертка должна вернуть результат из кеша.

## Требования

1. Экспортируй \`memoizeOne(fn)\`.
2. Верни функцию-обертку для одного аргумента.
3. При первом значении вызывай \`fn\` и сохраняй результат.
4. При повторном таком же значении возвращай результат из кеша.
5. Для нового аргумента вызывай \`fn\` заново.

## Интерфейс

Экспортируй \`memoizeOne(fn)\`.`,
    starter: `export const memoizeOne = function (fn) {
  // Верни функцию с кешем по одному аргументу
};
`,
    tests: `import { describe, expect, it } from 'vitest';
import { memoizeOne } from './index.js';

describe('memoizeOne', () => {
  it('caches by argument', () => {
    let calls = 0;
    const double = memoizeOne(function (value) {
      calls += 1;
      return value * 2;
    });

    expect(double(3)).toBe(6);
    expect(double(3)).toBe(6);
    expect(double(4)).toBe(8);
    expect(calls).toBe(2);
  });
});
`,
    difficulty: "Mid",
    tags: ["memoization", "cache"],
  }),
  createFunctionExpressionChallenge({
    id: "function-expression-validator",
    title: "Композитор валидаторов",
    rank: 4,
    description: `Валидацию удобно собирать из маленьких функций. Каждое правило отвечает за одну проверку, а общий валидатор запускает все правила и сообщает, какие из них не прошли.

Напиши \`createValidator(rules)\`: функция принимает объект, где ключ - имя правила, а значение - функция-проверка. Верни валидатор, который получает \`value\`, запускает все правила и возвращает массив имен правил, которые вернули \`false\`.

## Требования

1. Экспортируй \`createValidator(rules)\`.
2. Верни функцию, которая принимает \`value\`.
3. Передай \`value\` каждой функции из \`rules\`.
4. Если правило вернуло falsy-значение, добавь имя этого правила в результат.
5. Если все правила прошли, верни пустой массив.

## Интерфейс

Экспортируй \`createValidator(rules)\`.`,
    starter: `export const createValidator = function (rules) {
  // Верни функцию, которая проверяет value всеми rules
};
`,
    tests: `import { describe, expect, it } from 'vitest';
import { createValidator } from './index.js';

describe('createValidator', () => {
  it('returns failed rule names', () => {
    const validatePassword = createValidator({
      minLength: function (value) { return value.length >= 8; },
      hasNumber: function (value) { return /\\d/.test(value); },
      hasUppercase: function (value) { return /[A-Z]/.test(value); },
    });

    expect(validatePassword('secret')).toEqual(['minLength', 'hasNumber', 'hasUppercase']);
    expect(validatePassword('Secret123')).toEqual([]);
  });
});
`,
    difficulty: "Mid",
    tags: ["objects", "validation"],
  }),
  createFunctionExpressionChallenge({
    id: "function-expression-curry2",
    title: "Каррирование двух аргументов",
    rank: 4,
    description: `Каррирование позволяет передать аргументы не сразу. Вместо \`add(2, 3)\` можно получить \`addTwo = curriedAdd(2)\`, а потом вызвать \`addTwo(3)\`.

Напиши \`curry2(fn)\`: функция должна каррировать функцию с двумя аргументами. Ее можно вызвать сразу с двумя аргументами или сначала с одним, а второй передать позже.

## Требования

1. Экспортируй \`curry2(fn)\`.
2. Если переданы два аргумента сразу, вызови \`fn(left, right)\`.
3. Если передан только первый аргумент, верни функцию для второго.
4. Возвращенная функция должна вызвать \`fn(first, second)\`.
5. Не теряй порядок аргументов.

## Интерфейс

Экспортируй \`curry2(fn)\`.`,
    starter: `export const curry2 = function (fn) {
  // Поддержи вызовы curried(a)(b) и curried(a, b)
};
`,
    tests: `import { describe, expect, it } from 'vitest';
import { curry2 } from './index.js';

describe('curry2', () => {
  it('supports curried calls', () => {
    const join = curry2(function (left, right) {
      return left + ':' + right;
    });

    expect(join('user')('42')).toBe('user:42');
  });

  it('supports direct two-argument calls', () => {
    const add = curry2(function (a, b) {
      return a + b;
    });

    expect(add(4, 8)).toBe(12);
  });
});
`,
    difficulty: "Mid",
    tags: ["currying", "higher-order-functions"],
  }),
];
