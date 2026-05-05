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
    description: `Представь: ты заранее заготовил приветствие для Ани, отдал его другу, а он спустя час просто говорит "поздоровайся" — и из коробочки вылетает \`"Hello, Аня!"\`. Откуда коробочка знает имя? Она его запомнила.

В JavaScript функция — это значение. Её можно вернуть из другой функции, и внутренняя функция будет помнить переменные внешней. Это и есть замыкание.

\`\`\`js
const greetAda = makeGreeter('Ada');
greetAda(); // 'Hello, Ada!'
\`\`\`

**Что написать.** Функцию-выражение \`makeGreeter(name)\`: принимает имя, возвращает функцию без аргументов, которая выдаёт \`"Hello, <name>!"\`.

## Требования

1. Экспортируй \`makeGreeter(name)\` как function expression.
2. \`makeGreeter(name)\` возвращает функцию.
3. Возвращённая функция возвращает \`"Hello, <name>!"\`.
4. Имя живёт в замыкании — два разных гритера не путаются.

## Примеры

\`makeGreeter('Ada')()\` → \`'Hello, Ada!'\`
\`makeGreeter('Grace')()\` → \`'Hello, Grace!'\`
\`makeGreeter('Аня')()\` → \`'Hello, Аня!'\``,
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
    description: `Калькулятор спрашивает: "что делать — складывать, вычитать, умножать?" Ты говоришь \`"add"\` — он отдаёт тебе сложение. Не результат, а саму операцию. Дальше ты сам решаешь, к каким числам её применить.

Функция в JS — это обычное значение. Её можно положить в переменную, вернуть из другой функции, выбрать из словаря по ключу.

\`\`\`js
const add = chooseOperation('add');
add(2, 3); // 5
\`\`\`

**Что написать.** Функцию \`chooseOperation(operator)\`: по строке возвращает функцию двух чисел. На неизвестную операцию — функцию, которая всегда даёт \`NaN\`.

## Требования

1. Экспортируй \`chooseOperation(operator)\`.
2. \`"add"\` → сложение, \`"subtract"\` → вычитание, \`"multiply"\` → умножение, \`"divide"\` → деление.
3. На любую другую строку верни функцию, возвращающую \`NaN\`.

## Примеры

\`chooseOperation('add')(2, 3)\` → \`5\`
\`chooseOperation('multiply')(4, 3)\` → \`12\`
\`chooseOperation('power')(2, 3)\` → \`NaN\``,
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
    title: "Счётчик с замыканием",
    rank: 3,
    description: `Тебе нужен счётчик, и важно одно: число внутри никто снаружи не должен трогать руками. Только звать функцию — и каждый раз получать +1.

Где спрятать число? В замыкании. Объяви переменную внутри \`createCounter\`, верни функцию, которая её увеличивает. Снаружи переменной не существует — она живёт только в "коробке" возвращённой функции.

\`\`\`js
const next = createCounter();
next(); // 1
next(); // 2
\`\`\`

**Одна хитрость.** Каждый вызов \`createCounter\` создаёт **новую** переменную. Два счётчика — две независимых переменных, они не влияют друг на друга.

**Что написать.** \`createCounter(start = 0)\`: возвращает функцию без аргументов. Каждый её вызов даёт следующее число.

## Требования

1. Экспортируй \`createCounter(start)\`.
2. Без аргумента начинай с \`0\`.
3. Возвращённая функция при первом вызове даёт \`start + 1\`.
4. Разные счётчики не пересекаются.

## Примеры

\`createCounter()()\` → \`1\` (первый вызов)
\`createCounter(10)()\` → \`11\`
Дважды подряд: \`next(); next()\` → \`1\`, \`2\``,
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
    description: `Кнопка "Оплатить". Пользователь нервничает, тыкает её десять раз подряд. Заказ должен уйти один раз. Как сделать так, чтобы функция отработала только при первом клике, а дальше отдавала тот же результат?

Заверни её. Снаружи будет новая функция, внутри — флажок "уже звали" и сохранённый результат. Флажок и результат живут в замыкании.

\`\`\`js
const wrapped = once(fn);
wrapped(4);  // вызвал fn, вернул результат
wrapped(10); // fn НЕ вызвался, вернулся прошлый результат
\`\`\`

**Что написать.** \`once(fn)\` возвращает обёртку. Первый вызов прокидывает все аргументы в \`fn\` и запоминает ответ. Все следующие вызовы — отдают тот же ответ, не трогая \`fn\`.

## Требования

1. Экспортируй \`once(fn)\`.
2. Первый вызов обёртки запускает \`fn(...args)\` и кеширует результат.
3. Любой следующий вызов возвращает кешированный результат.
4. \`fn\` не вызывается больше одного раза, какие бы аргументы ни передавали.

## Примеры

При \`fn = v => v * 2\`: \`wrapped(4)\` → \`8\`
Тот же \`wrapped\`: \`wrapped(10)\` → \`8\` (не \`20\`!)
Счётчик вызовов \`fn\` после двух обращений → \`1\``,
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
    description: `Конвейер. По ленте едут детали, рядом стоит рабочий — берёт каждую, что-то с ней делает, кладёт на новую ленту. Рабочий — это функция, которую ты передаёшь снаружи. Сам конвейер не знает, что именно она делает.

Это вся идея \`map\`: пройти по массиву, для каждого элемента позвать "рабочего" \`mapper(item, index)\`, собрать результаты в новый массив.

\`\`\`js
mapWith([2, 4, 6], (v, i) => v + i); // [2, 5, 8]
\`\`\`

**Что написать.** \`mapWith(items, mapper)\` своими руками — без \`Array.prototype.map\`. Просто \`for\` и \`push\` в новый массив.

## Требования

1. Экспортируй \`mapWith(items, mapper)\`.
2. Длина результата совпадает с длиной входа.
3. Для каждого элемента зови \`mapper(item, index)\`.
4. Исходный массив не трогай.
5. \`Array.prototype.map\` нельзя.

## Примеры

\`mapWith([1, 2, 3], v => v * 10)\` → \`[10, 20, 30]\`
\`mapWith([2, 4, 6], (v, i) => v + i)\` → \`[2, 5, 8]\`
\`mapWith([], v => v)\` → \`[]\``,
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
    description: `Охранник на входе в клуб. Каждому задаёт один вопрос и пропускает или нет. Вопрос — это твоя функция-предикат: вернула \`true\` — заходи, вернула \`false\` — мимо.

\`\`\`js
filterBy([3, 4, 5, 6, 7], v => v % 2 === 1); // [3, 5, 7]
\`\`\`

**Одна хитрость.** Предикат не обязан возвращать именно булево. JS считает "годным" любое truthy: \`1\`, \`"yes"\`, объект. Любое falsy — \`0\`, \`""\`, \`null\` — отбраковывает.

**Что написать.** \`filterBy(items, predicate)\` своими руками — без \`Array.prototype.filter\`. Предикату передавай \`(item, index)\`.

## Требования

1. Экспортируй \`filterBy(items, predicate)\`.
2. Зови \`predicate(item, index)\` для каждого элемента.
3. Возвращай новый массив с теми, у кого результат truthy.
4. Исходный массив не меняй.
5. \`Array.prototype.filter\` нельзя.

## Примеры

\`filterBy([3, 4, 5, 6, 7], (v, i) => v % 2 === 1 && i > 0)\` → \`[5, 7]\`
\`filterBy(['a', 'b'], v => v === 'z')\` → \`[]\`
\`filterBy([0, 1, 2], v => v)\` → \`[1, 2]\``,
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
    description: `Стиральная машина: бельё проходит замачивание → стирку → отжим. Каждый этап получает то, что вышло из предыдущего. Никто не делает всё сразу — каждый делает своё.

\`pipe\` — это сборка такого конвейера из готовых маленьких функций. Левая функция работает первой, её результат передаётся следующей, и так далее.

\`\`\`js
const transform = pipe(
  v => v + 2,
  v => v * 3,
  v => String(v),
);
transform(4); // (4+2)=6 → 6*3=18 → '18'
\`\`\`

**Одна хитрость.** Если функций ноль — вернуть исходное значение как есть. Не \`undefined\`, не падать.

**Что написать.** \`pipe(...fns)\`: возвращает функцию одного аргумента. Функция прогоняет аргумент через все \`fns\` слева направо.

## Требования

1. Экспортируй \`pipe(...fns)\`.
2. Возвращённая функция принимает начальное значение.
3. Функции применяются слева направо.
4. Без функций — возвращается исходное значение.

## Примеры

\`pipe(v => v + 1, v => v * 2)(3)\` → \`8\`
\`pipe(v => v + 2, v => v * 3, v => String(v))(4)\` → \`'18'\`
\`pipe()(42)\` → \`42\``,
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
    description: `Тебя спрашивают: "сколько будет два по два?" Ты считаешь, говоришь "четыре". Через минуту тот же человек спрашивает то же самое. Считать заново? Нет — ты помнишь ответ.

Так работает мемоизация. Заворачиваем функцию в обёртку с записной книжкой: для каждого встреченного аргумента храним результат. Пришёл тот же аргумент — отдаём из книжки, не считаем заново.

\`\`\`js
const double = memoizeOne(v => v * 2);
double(3); // посчитал: 6
double(3); // взял из кеша: 6 (fn НЕ звали)
double(4); // новый аргумент — посчитал: 8
\`\`\`

**Что написать.** \`memoizeOne(fn)\` — обёртка для функции с одним аргументом. Удобно использовать \`Map\` для кеша.

## Требования

1. Экспортируй \`memoizeOne(fn)\`.
2. На новый аргумент — вызвать \`fn\` и сохранить результат.
3. На уже виденный аргумент — отдать сохранённое, не вызывая \`fn\`.
4. Сравнение строгое (\`===\` / \`Map.has\`).

## Примеры

\`double(3)\` → \`6\`, повторно \`double(3)\` → \`6\` (один вызов \`fn\`)
После \`double(3); double(3); double(4)\` — \`fn\` вызван \`2\` раза
\`double(4)\` → \`8\``,
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
    description: `Форма регистрации. Пароль должен быть длиннее 8 символов, содержать цифру и заглавную букву. Три проверки. Можно слепить одну толстую \`if\`-функцию, но красивее — три маленькие, каждая отвечает за одно.

Передаём их в \`createValidator\` объектом: ключ — имя правила, значение — функция-проверка. Получаем валидатор, который для входного \`value\` возвращает имена правил, **которые не прошли**.

\`\`\`js
const validate = createValidator({
  minLength:    v => v.length >= 8,
  hasNumber:    v => /\\d/.test(v),
  hasUppercase: v => /[A-Z]/.test(v),
});
validate('secret');    // ['minLength', 'hasNumber', 'hasUppercase']
validate('Secret123'); // []
\`\`\`

**Одна хитрость.** Возвращаем имена **провалившихся** правил — то есть тех, чья функция вернула falsy. Если всё хорошо — пустой массив.

**Что написать.** \`createValidator(rules)\` возвращает функцию \`(value) => string[]\`.

## Требования

1. Экспортируй \`createValidator(rules)\`.
2. Возвращённая функция принимает \`value\`.
3. Каждое правило получает \`value\`.
4. В результат попадают имена правил, вернувших falsy.
5. Все прошли — \`[]\`.

## Примеры

\`validate('secret')\` → \`['minLength', 'hasNumber', 'hasUppercase']\`
\`validate('Secret123')\` → \`[]\`
\`createValidator({ nonEmpty: v => v.length > 0 })('')\` → \`['nonEmpty']\``,
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
    description: `У тебя функция \`add(a, b)\`. Иногда оба числа есть прямо сейчас — вызвал и забыл. А иногда первое число известно сразу, а второе придёт через час, из другого места. Хочется отложить вызов: запомнить \`a\`, дождаться \`b\`, потом сложить.

Каррирование как раз про это. Обёртка работает в двух режимах:

\`\`\`js
const add = curry2((a, b) => a + b);
add(4, 8);    // обычный вызов: 12
add(4)(8);    // частичный: сначала запомнили 4, потом получили 8 → 12
\`\`\`

**Что написать.** \`curry2(fn)\`: возвращает обёртку, которая смотрит на число аргументов. Два — зови \`fn\` сразу. Один — верни функцию, которая ждёт второй и тогда уже зовёт \`fn\`.

## Требования

1. Экспортируй \`curry2(fn)\`.
2. Два аргумента сразу → \`fn(a, b)\`.
3. Один аргумент → функция, которая принимает второй и зовёт \`fn(a, b)\`.
4. Порядок аргументов сохраняется.

## Примеры

\`curry2((a, b) => a + b)(4, 8)\` → \`12\`
\`curry2((a, b) => a + b)(4)(8)\` → \`12\`
\`curry2((l, r) => l + ':' + r)('user')('42')\` → \`'user:42'\``,
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
