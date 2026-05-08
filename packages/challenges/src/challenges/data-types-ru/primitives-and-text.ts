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

export const primitiveMethodsChallenges: ChallengeDefinition[] = [
  createDataTypeChallenge({
    id: "data-types-primitive-length",
    title: "Длина строки",
    description: `Представь: строка — это вроде бы простой примитив, без свойств и методов. Но ты пишешь \`'hello'.length\` — и оно работает. Как? Когда ты обращаешься к свойству у примитива, JS на лету создаёт временную обёртку-объект (\`String\`), достаёт нужное свойство, а потом обёртку выбрасывает. Этот фокус называется autoboxing.

\`\`\`js
'hello'.length // 5 — autoboxing в действии
\`\`\`

**Что написать.** Функцию \`getStringLength(s)\`, которая возвращает длину строки через свойство \`length\`.

## Требования

1. Принимай строку \`s\`.
2. Верни значение \`s.length\`.
3. Экспортируй функцию \`getStringLength\`.

## Примеры

\`getStringLength('hello')\` → \`5\`

\`getStringLength('')\` → \`0\`

\`getStringLength('я')\` → \`1\``,
    starter: `export function getStringLength(s) {
  // Верни длину строки через свойство length
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { getStringLength } from './index.js';

describe('getStringLength', () => {
  it('возвращает длину обычной строки', () => {
    expect(getStringLength('hello')).toBe(5);
  });

  it('обрабатывает пустую строку', () => {
    expect(getStringLength('')).toBe(0);
  });

  it('считает кириллический символ', () => {
    expect(getStringLength('я')).toBe(1);
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { getStringLength } from './index.js';

describe('getStringLength', () => {
  it('возвращает длину обычной строки', () => {
    expect(getStringLength('hello')).toBe(5);
  });

  it('обрабатывает пустую строку', () => {
    expect(getStringLength('')).toBe(0);
  });

  it('считает кириллический символ', () => {
    expect(getStringLength('я')).toBe(1);
  });

  it('считает пробелы', () => {
    expect(getStringLength('a b c')).toBe(5);
  });

  it('считает длинную строку', () => {
    expect(getStringLength('абвгдеёжзий')).toBe(11);
  });
});
`,
    rank: 0,
    tags: ["primitives", "string", "length"],
  }),
  createDataTypeChallenge({
    id: "data-types-round-to",
    title: "Округление до знаков",
    description: `Представь: цена 19.9876 рублей. Нужно показать пользователю две цифры после запятой. У числа есть метод \`toFixed(digits)\` — он вернёт строку с нужным количеством знаков. Две ловушки:

1. **Результат — строка**, не число. Хочешь число — оборачивай в \`Number(...)\`.
2. **\`toFixed\` не всегда округляет «по-школьному»**: \`(1.005).toFixed(2)\` вернёт \`'1.00'\`, а не \`'1.01'\`. Причина — число \`1.005\` в двоичной памяти хранится как \`1.00499999…\`, и \`toFixed\` честно округляет вниз. Это нормальное поведение — не баг.

\`\`\`js
(19.9876).toFixed(2)           // '19.99' — строка!
Number((19.9876).toFixed(2))   // 19.99  — теперь число
(1.005).toFixed(2)             // '1.00'  — подвох двоичной арифметики
\`\`\`

**Что написать.** Функцию \`roundTo(n, digits)\`, которая округляет число до указанного количества знаков через \`toFixed\` и возвращает именно число.

## Требования

1. Используй \`n.toFixed(digits)\` для округления.
2. Преобразуй результат в число через \`Number(...)\`.
3. Экспортируй функцию \`roundTo\`.

## Примеры

\`roundTo(19.9876, 2)\` → \`19.99\`

\`roundTo(1.005, 2)\` → \`1\` _(квирк \`toFixed\` — это ожидаемо)_

\`roundTo(3.14159, 3)\` → \`3.142\``,
    starter: `export function roundTo(n, digits) {
  // Используй toFixed и преобразуй в число
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { roundTo } from './index.js';

describe('roundTo', () => {
  it('округляет до двух знаков', () => {
    expect(roundTo(19.9876, 2)).toBe(19.99);
  });

  it('округляет до трёх знаков', () => {
    expect(roundTo(3.14159, 3)).toBe(3.142);
  });

  it('возвращает число, а не строку', () => {
    expect(typeof roundTo(1.5, 2)).toBe('number');
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { roundTo } from './index.js';

describe('roundTo', () => {
  it('округляет до двух знаков', () => {
    expect(roundTo(19.9876, 2)).toBe(19.99);
  });

  it('округляет до трёх знаков', () => {
    expect(roundTo(3.14159, 3)).toBe(3.142);
  });

  it('возвращает число, а не строку', () => {
    expect(typeof roundTo(1.5, 2)).toBe('number');
  });

  it('обрабатывает отрицательные числа', () => {
    expect(roundTo(-2.876, 2)).toBe(-2.88);
  });

  it('округляет до нуля знаков', () => {
    expect(roundTo(2.7, 0)).toBe(3);
  });

  it('обрабатывает целое число', () => {
    expect(roundTo(5, 2)).toBe(5);
  });
});
`,
    rank: 1,
    tags: ["primitives", "number", "toFixed"],
  }),
  createDataTypeChallenge({
    id: "data-types-pad-number",
    title: "Дополнение нулями",
    description: `Представь: ты выводишь номер дня — \`5\`. А хочется \`'05'\`, чтобы выглядело как в часах. Метод строки \`padStart(width, '0')\` дополняет строку слева до нужной ширины. Только сначала число надо превратить в строку через \`String(n)\`.

\`\`\`js
String(5).padStart(2, '0') // '05'
String(42).padStart(4, '0') // '0042'
\`\`\`

**Что написать.** Функцию \`padNumber(n, width)\`, которая возвращает строковое представление числа, дополненное слева нулями до ширины \`width\`.

## Требования

1. Преобразуй число в строку через \`String(n)\`.
2. Используй \`padStart(width, '0')\` для дополнения.
3. Экспортируй функцию \`padNumber\`.

## Примеры

\`padNumber(5, 2)\` → \`'05'\`

\`padNumber(42, 4)\` → \`'0042'\`

\`padNumber(1234, 2)\` → \`'1234'\``,
    starter: `export function padNumber(n, width) {
  // Преобразуй n в строку и дополни слева нулями
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { padNumber } from './index.js';

describe('padNumber', () => {
  it('добавляет ведущий ноль', () => {
    expect(padNumber(5, 2)).toBe('05');
  });

  it('дополняет до четырёх знаков', () => {
    expect(padNumber(42, 4)).toBe('0042');
  });

  it('не режет, если число длиннее ширины', () => {
    expect(padNumber(1234, 2)).toBe('1234');
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { padNumber } from './index.js';

describe('padNumber', () => {
  it('добавляет ведущий ноль', () => {
    expect(padNumber(5, 2)).toBe('05');
  });

  it('дополняет до четырёх знаков', () => {
    expect(padNumber(42, 4)).toBe('0042');
  });

  it('не режет, если число длиннее ширины', () => {
    expect(padNumber(1234, 2)).toBe('1234');
  });

  it('обрабатывает ноль', () => {
    expect(padNumber(0, 3)).toBe('000');
  });

  it('возвращает строку', () => {
    expect(typeof padNumber(7, 2)).toBe('string');
  });
});
`,
    rank: 1,
    tags: ["primitives", "number", "padStart"],
  }),
  createDataTypeChallenge({
    id: "data-types-to-binary",
    title: "В двоичную систему",
    description: `Представь: тебе нужно посмотреть, как число выглядит в двоичной системе. У числа есть метод \`toString(radix)\` — он умеет выводить число в любой системе счисления от 2 до 36. Передаёшь \`2\` — получаешь биты.

\`\`\`js
(5).toString(2) // '101'
(255).toString(2) // '11111111'
\`\`\`

**Что написать.** Функцию \`toBinary(n)\`, которая возвращает строковое представление числа в двоичной системе.

## Требования

1. Используй \`n.toString(2)\`.
2. Экспортируй функцию \`toBinary\`.

## Примеры

\`toBinary(5)\` → \`'101'\`

\`toBinary(0)\` → \`'0'\`

\`toBinary(255)\` → \`'11111111'\``,
    starter: `export function toBinary(n) {
  // Используй toString с основанием 2
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { toBinary } from './index.js';

describe('toBinary', () => {
  it('преобразует пятёрку', () => {
    expect(toBinary(5)).toBe('101');
  });

  it('обрабатывает ноль', () => {
    expect(toBinary(0)).toBe('0');
  });

  it('преобразует 255', () => {
    expect(toBinary(255)).toBe('11111111');
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { toBinary } from './index.js';

describe('toBinary', () => {
  it('преобразует пятёрку', () => {
    expect(toBinary(5)).toBe('101');
  });

  it('обрабатывает ноль', () => {
    expect(toBinary(0)).toBe('0');
  });

  it('преобразует 255', () => {
    expect(toBinary(255)).toBe('11111111');
  });

  it('преобразует единицу', () => {
    expect(toBinary(1)).toBe('1');
  });

  it('преобразует степень двойки', () => {
    expect(toBinary(16)).toBe('10000');
  });
});
`,
    rank: 1,
    tags: ["primitives", "number", "toString"],
  }),
  createDataTypeChallenge({
    id: "data-types-autobox-strict-fail",
    title: "Autobox молчит, strict кричит",
    description: `Autobox: при чтении свойства у примитива JS создаёт временный объект-обёртку. А при **записи** в свойство примитива — обёртка тоже создаётся, в неё записывается, но обёртка тут же выбрасывается. В нестрогом режиме запись просто исчезает. В \`'use strict'\` — выбрасывается \`TypeError\`.

\`\`\`js
'hello'.length     // 5      — чтение работает (autobox)
const s = 'hello';
s.foo = 'bar';     // в нестрогом — тихо игнорируется
s.foo;             // undefined

'use strict';
const t = 'hello';
t.foo = 'bar';     // TypeError: Cannot create property 'foo' on string 'hello'
\`\`\`

Та же история с числами: \`(5).foo = 1\` в strict — TypeError.

**Что написать.** Функцию \`tryWriteToPrimitive(value, key, val)\` — попытаться записать \`value[key] = val\` под \`'use strict'\`. Если ловится TypeError — верни строку \`'TypeError'\`. Если запись прошла без исключения (значит, value был объектом) — верни сам \`value\`. После записи на примитив исключение должно быть.

## Требования

1. Внутри функции включи \`'use strict'\`.
2. Используй \`try/catch\`, лови ошибку записи.
3. Если поймал \`TypeError\` — верни строку \`'TypeError'\`.
4. Иначе верни \`value\` (для объектов запись работает).
5. Экспортируй функцию \`tryWriteToPrimitive\`.

## Примеры

\`tryWriteToPrimitive('hello', 'foo', 1)\` → \`'TypeError'\`

\`tryWriteToPrimitive(5, 'foo', 1)\` → \`'TypeError'\`

\`tryWriteToPrimitive({}, 'foo', 1)\` → \`{ foo: 1 }\``,
    starter: `'use strict';
export function tryWriteToPrimitive(value, key, val) {
  // Попробуй value[key] = val в try, поймай TypeError
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { tryWriteToPrimitive } from './index.js';

describe('tryWriteToPrimitive', () => {
  it('запись на строку — TypeError', () => {
    expect(tryWriteToPrimitive('hello', 'foo', 1)).toBe('TypeError');
  });

  it('запись на число — TypeError', () => {
    expect(tryWriteToPrimitive(5, 'foo', 1)).toBe('TypeError');
  });

  it('запись на объект работает', () => {
    const result = tryWriteToPrimitive({}, 'foo', 1);
    expect(result).toEqual({ foo: 1 });
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { tryWriteToPrimitive } from './index.js';

describe('tryWriteToPrimitive', () => {
  it('запись на строку — TypeError', () => {
    expect(tryWriteToPrimitive('hello', 'foo', 1)).toBe('TypeError');
  });

  it('запись на число — TypeError', () => {
    expect(tryWriteToPrimitive(5, 'foo', 1)).toBe('TypeError');
  });

  it('запись на boolean — TypeError', () => {
    expect(tryWriteToPrimitive(true, 'foo', 1)).toBe('TypeError');
  });

  it('запись на объект работает', () => {
    const result = tryWriteToPrimitive({}, 'foo', 1);
    expect(result).toEqual({ foo: 1 });
  });

  it('запись на массив работает', () => {
    const result = tryWriteToPrimitive([], 'foo', 1);
    expect(result.foo).toBe(1);
  });

  it('перезапись существующего ключа объекта', () => {
    const obj = { x: 1 };
    const result = tryWriteToPrimitive(obj, 'x', 99);
    expect(result.x).toBe(99);
  });
});
`,
    rank: 2,
    tags: ["primitives", "autobox", "strict"],
  }),
];

export const numberChallenges: ChallengeDefinition[] = [
  createDataTypeChallenge({
    id: "data-types-clamp-number",
    title: "Зажим в диапазон",
    description: `Представь: пользователь крутит ползунок громкости. Значение должно остаться в диапазоне от 0 до 100. Если меньше 0 — берём 0, если больше 100 — берём 100. Эта операция называется clamp, и собирается она из двух \`Math\`-функций:

\`\`\`js
Math.min(Math.max(n, lo), hi)
// сначала задираем до lo, потом ограничиваем сверху hi
\`\`\`

**Что написать.** Функцию \`clampNumber(n, lo, hi)\`, которая возвращает \`n\`, зажатое в диапазон \`[lo, hi]\`.

## Требования

1. Используй \`Math.min\` и \`Math.max\`.
2. Не предполагай, что \`n\` уже в диапазоне.
3. Экспортируй функцию \`clampNumber\`.

## Примеры

\`clampNumber(50, 0, 100)\` → \`50\`

\`clampNumber(-5, 0, 100)\` → \`0\`

\`clampNumber(150, 0, 100)\` → \`100\``,
    starter: `export function clampNumber(n, lo, hi) {
  // Math.min(Math.max(...))
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { clampNumber } from './index.js';

describe('clampNumber', () => {
  it('пропускает значение в диапазоне', () => {
    expect(clampNumber(50, 0, 100)).toBe(50);
  });

  it('подтягивает до нижней границы', () => {
    expect(clampNumber(-5, 0, 100)).toBe(0);
  });

  it('обрезает по верхней границе', () => {
    expect(clampNumber(150, 0, 100)).toBe(100);
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { clampNumber } from './index.js';

describe('clampNumber', () => {
  it('пропускает значение в диапазоне', () => {
    expect(clampNumber(50, 0, 100)).toBe(50);
  });

  it('подтягивает до нижней границы', () => {
    expect(clampNumber(-5, 0, 100)).toBe(0);
  });

  it('обрезает по верхней границе', () => {
    expect(clampNumber(150, 0, 100)).toBe(100);
  });

  it('работает на самой границе', () => {
    expect(clampNumber(0, 0, 100)).toBe(0);
    expect(clampNumber(100, 0, 100)).toBe(100);
  });

  it('работает с отрицательным диапазоном', () => {
    expect(clampNumber(-50, -100, -10)).toBe(-50);
    expect(clampNumber(0, -100, -10)).toBe(-10);
  });
});
`,
    rank: 1,
    tags: ["number", "math", "clamp"],
  }),
  createDataTypeChallenge({
    id: "data-types-parse-int-strict",
    title: "Строгий parseInt",
    description: `Представь: ты разбираешь пользовательский ввод и хочешь получить число. Кажется, \`parseInt\` спасёт. Но у него есть подлая особенность.

\`\`\`js
parseInt('12abc', 10) // 12 — он съел цифры и забил на остальное
\`\`\`

Если строка содержит мусор — \`parseInt\` молча его проглатывает. А ты потом удивляешься, почему \`'12abc'\` стало валидным числом. **Хитрость.** Сначала проверь, что строка целиком состоит из цифр (плюс возможный минус впереди), и только потом парси. Если не подходит — верни \`NaN\`.

**Что написать.** Функцию \`parseIntStrict(s)\`, которая возвращает целое число только если строка полностью числовая, иначе — \`NaN\`.

## Требования

1. Используй регулярку или другую проверку, что строка соответствует целому числу.
2. Если подходит — верни \`parseInt(s, 10)\`.
3. Иначе — верни \`NaN\`.
4. Экспортируй функцию \`parseIntStrict\`.

## Примеры

\`parseIntStrict('42')\` → \`42\`

\`parseIntStrict('-7')\` → \`-7\`

\`parseIntStrict('12abc')\` → \`NaN\`

\`parseIntStrict('')\` → \`NaN\``,
    starter: `export function parseIntStrict(s) {
  // Сначала проверь, что строка целиком является целым числом
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { parseIntStrict } from './index.js';

describe('parseIntStrict', () => {
  it('парсит обычное число', () => {
    expect(parseIntStrict('42')).toBe(42);
  });

  it('парсит отрицательное число', () => {
    expect(parseIntStrict('-7')).toBe(-7);
  });

  it('возвращает NaN для мусорной строки', () => {
    expect(Number.isNaN(parseIntStrict('12abc'))).toBe(true);
  });

  it('возвращает NaN для пустой строки', () => {
    expect(Number.isNaN(parseIntStrict(''))).toBe(true);
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { parseIntStrict } from './index.js';

describe('parseIntStrict', () => {
  it('парсит обычное число', () => {
    expect(parseIntStrict('42')).toBe(42);
  });

  it('парсит отрицательное число', () => {
    expect(parseIntStrict('-7')).toBe(-7);
  });

  it('парсит ноль', () => {
    expect(parseIntStrict('0')).toBe(0);
  });

  it('возвращает NaN для мусорной строки', () => {
    expect(Number.isNaN(parseIntStrict('12abc'))).toBe(true);
  });

  it('возвращает NaN для пустой строки', () => {
    expect(Number.isNaN(parseIntStrict(''))).toBe(true);
  });

  it('возвращает NaN для строки с пробелами', () => {
    expect(Number.isNaN(parseIntStrict(' 42 '))).toBe(true);
  });

  it('возвращает NaN для дробного числа', () => {
    expect(Number.isNaN(parseIntStrict('3.14'))).toBe(true);
  });
});
`,
    rank: 2,
    tags: ["number", "parseInt", "validation"],
  }),
  createDataTypeChallenge({
    id: "data-types-float-equals",
    title: "Сравнение дробных",
    description: `Представь классическую боль JavaScript:

\`\`\`js
0.1 + 0.2 === 0.3 // false (!)
0.1 + 0.2 // 0.30000000000000004
\`\`\`

Виноват не JS, виновата сама двоичная плавающая точка — некоторые десятичные дроби в ней не выражаются точно. **Хитрость.** Дробные числа сравнивают не на равенство, а на близость: разница меньше epsilon — считаем равными.

**Что написать.** Функцию \`floatEquals(a, b, eps = 1e-9)\`, которая возвращает \`true\`, если \`|a - b| < eps\`.

## Требования

1. Параметр \`eps\` имеет значение по умолчанию \`1e-9\`.
2. Используй \`Math.abs(a - b) < eps\`.
3. Экспортируй функцию \`floatEquals\`.

## Примеры

\`floatEquals(0.1 + 0.2, 0.3)\` → \`true\`

\`floatEquals(1, 1.0001)\` → \`false\`

\`floatEquals(1, 1.0000000001, 1e-6)\` → \`true\``,
    starter: `export function floatEquals(a, b, eps = 1e-9) {
  // Сравни через разность и Math.abs
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { floatEquals } from './index.js';

describe('floatEquals', () => {
  it('ловит классическую дробь', () => {
    expect(floatEquals(0.1 + 0.2, 0.3)).toBe(true);
  });

  it('различает заметно разные числа', () => {
    expect(floatEquals(1, 1.0001)).toBe(false);
  });

  it('уважает кастомный eps', () => {
    expect(floatEquals(1, 1.0000000001, 1e-6)).toBe(true);
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { floatEquals } from './index.js';

describe('floatEquals', () => {
  it('ловит классическую дробь', () => {
    expect(floatEquals(0.1 + 0.2, 0.3)).toBe(true);
  });

  it('различает заметно разные числа', () => {
    expect(floatEquals(1, 1.0001)).toBe(false);
  });

  it('уважает кастомный eps', () => {
    expect(floatEquals(1, 1.0000000001, 1e-6)).toBe(true);
  });

  it('равные числа всегда равны', () => {
    expect(floatEquals(2.5, 2.5)).toBe(true);
  });

  it('работает с отрицательной разностью', () => {
    expect(floatEquals(0.3, 0.1 + 0.2)).toBe(true);
  });

  it('по умолчанию использует eps=1e-9', () => {
    expect(floatEquals(0, 1e-10)).toBe(true);
    expect(floatEquals(0, 1e-8)).toBe(false);
  });
});
`,
    rank: 2,
    tags: ["number", "float", "epsilon"],
  }),
  createDataTypeChallenge({
    id: "data-types-round-cents",
    title: "Округление до копеек",
    description: `Представь: у тебя цена в рублях, например \`1.005\`. Хочется получить целое число копеек — \`101\`. Наивный путь — \`Math.round(rubles * 100)\`. Но тут вылезает та самая ловушка двоичной арифметики:

\`\`\`js
0.1 + 0.2 // 0.30000000000000004
1.005 * 100 // 100.49999999999999 (!)
\`\`\`

Из-за этого \`Math.round(1.005 * 100)\` иногда даст \`100\`, а не \`101\`. **Хитрость.** Для финансов используют целочисленную арифметику в копейках. Простое решение здесь — \`Math.round(rubles * 100)\`, и да, для большинства входных данных оно работает. Главное — помнить, что точные финансовые расчёты делают через целые числа, а не через float.

**Что написать.** Функцию \`roundCents(rubles)\`, которая возвращает целое число копеек.

## Требования

1. Используй \`Math.round(rubles * 100)\`.
2. Возвращай целое число.
3. Экспортируй функцию \`roundCents\`.

## Примеры

\`roundCents(1)\` → \`100\`

\`roundCents(1.5)\` → \`150\`

\`roundCents(0.01)\` → \`1\``,
    starter: `export function roundCents(rubles) {
  // Math.round(rubles * 100)
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { roundCents } from './index.js';

describe('roundCents', () => {
  it('округляет целые рубли', () => {
    expect(roundCents(1)).toBe(100);
  });

  it('округляет половину', () => {
    expect(roundCents(1.5)).toBe(150);
  });

  it('округляет одну копейку', () => {
    expect(roundCents(0.01)).toBe(1);
  });

  it('возвращает целое', () => {
    expect(Number.isInteger(roundCents(2.34))).toBe(true);
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { roundCents } from './index.js';

describe('roundCents', () => {
  it('округляет целые рубли', () => {
    expect(roundCents(1)).toBe(100);
  });

  it('округляет половину', () => {
    expect(roundCents(1.5)).toBe(150);
  });

  it('округляет одну копейку', () => {
    expect(roundCents(0.01)).toBe(1);
  });

  it('обрабатывает ноль', () => {
    expect(roundCents(0)).toBe(0);
  });

  it('округляет 0.1 + 0.2', () => {
    expect(roundCents(0.1 + 0.2)).toBe(30);
  });

  it('всегда возвращает целое', () => {
    expect(Number.isInteger(roundCents(2.34))).toBe(true);
    expect(Number.isInteger(roundCents(99.999))).toBe(true);
  });
});
`,
    rank: 2,
    tags: ["number", "math", "rounding"],
  }),
  createDataTypeChallenge({
    id: "data-types-number-is-finite",
    title: "isFinite vs Number.isFinite",
    description: `В JS две функции с почти одинаковым именем — и они ведут себя по-разному. Глобальная \`isFinite(x)\` сначала **приводит** \`x\` к числу через \`Number(x)\`, и только потом проверяет. Статическая \`Number.isFinite(x)\` приводит **только** если уже число.

\`\`\`js
isFinite('5')           // true  — '5' → 5, 5 конечно
Number.isFinite('5')    // false — '5' не число, не конечно

isFinite('')            // true  — '' → 0
Number.isFinite('')     // false

isFinite(null)          // true  — null → 0
Number.isFinite(null)   // false

isFinite(Infinity)      // false
Number.isFinite(Infinity) // false  — оба согласны

isFinite(NaN)           // false
Number.isFinite(NaN)    // false  — оба согласны
\`\`\`

**Главная мысль.** \`Number.isFinite\` — строгий, без сюрпризов. Глобальный \`isFinite\` — с приведением, может зацепить нечисловые входы.

**Что написать.** Функцию \`strictIsFinite(x)\` — повторяет поведение \`Number.isFinite\`, но без использования самого \`Number.isFinite\`.

## Требования

1. Если \`typeof x !== 'number'\` — \`false\`.
2. Если \`Number.isNaN(x)\` — \`false\`.
3. Если \`x === Infinity\` или \`x === -Infinity\` — \`false\`.
4. Иначе — \`true\`.
5. Не используй \`Number.isFinite\` или глобальный \`isFinite\`.
6. Экспортируй функцию \`strictIsFinite\`.

## Примеры

\`strictIsFinite(5)\` → \`true\`

\`strictIsFinite('5')\` → \`false\`

\`strictIsFinite(Infinity)\` → \`false\`

\`strictIsFinite(NaN)\` → \`false\`

\`strictIsFinite(null)\` → \`false\``,
    starter: `export function strictIsFinite(x) {
  // typeof + isNaN-проверка + проверка на Infinity
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { strictIsFinite } from './index.js';

describe('strictIsFinite', () => {
  it('обычное число — true', () => {
    expect(strictIsFinite(5)).toBe(true);
  });

  it('строка с числом — false', () => {
    expect(strictIsFinite('5')).toBe(false);
  });

  it('Infinity — false', () => {
    expect(strictIsFinite(Infinity)).toBe(false);
  });

  it('NaN — false', () => {
    expect(strictIsFinite(NaN)).toBe(false);
  });

  it('null — false', () => {
    expect(strictIsFinite(null)).toBe(false);
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { strictIsFinite } from './index.js';

describe('strictIsFinite', () => {
  it('обычное число — true', () => {
    expect(strictIsFinite(5)).toBe(true);
  });

  it('ноль — true', () => {
    expect(strictIsFinite(0)).toBe(true);
  });

  it('отрицательное — true', () => {
    expect(strictIsFinite(-3.14)).toBe(true);
  });

  it('строка с числом — false', () => {
    expect(strictIsFinite('5')).toBe(false);
  });

  it('пустая строка — false', () => {
    expect(strictIsFinite('')).toBe(false);
  });

  it('Infinity — false', () => {
    expect(strictIsFinite(Infinity)).toBe(false);
  });

  it('-Infinity — false', () => {
    expect(strictIsFinite(-Infinity)).toBe(false);
  });

  it('NaN — false', () => {
    expect(strictIsFinite(NaN)).toBe(false);
  });

  it('null — false', () => {
    expect(strictIsFinite(null)).toBe(false);
  });

  it('undefined — false', () => {
    expect(strictIsFinite(undefined)).toBe(false);
  });

  it('boolean — false', () => {
    expect(strictIsFinite(true)).toBe(false);
    expect(strictIsFinite(false)).toBe(false);
  });
});
`,
    rank: 2,
    tags: ["number", "is-finite", "type-check"],
  }),
  createDataTypeChallenge({
    id: "data-types-number-trunc-vs-round",
    title: "trunc, floor, round для отрицательных",
    description: `У всех трёх — \`Math.trunc\`, \`Math.floor\`, \`Math.round\` — нет отличий для положительных чисел. Различия видны на отрицательных:

\`\`\`js
Math.trunc(1.9)   // 1   — отрезаем дробную часть
Math.floor(1.9)   // 1
Math.round(1.9)   // 2   — округляем

Math.trunc(-1.5)  // -1  — отрезаем к НУЛЮ
Math.floor(-1.5)  // -2  — округляем вниз (к -∞)
Math.round(-1.5)  // -1  — round в JS округляет к +∞ для серединных значений (!)

Math.trunc(-1.9)  // -1
Math.floor(-1.9)  // -2
Math.round(-1.9)  // -2
\`\`\`

**Ловушка \`round\`.** \`Math.round(0.5) === 1\`, \`Math.round(-0.5) === 0\` (а не \`-1\`). JS округляет половину **в сторону +∞**, а не «от нуля». Для финансов или статистики это может удивить.

**Что написать.** Функцию \`classifyRounding(x)\` — возвращает объект \`{ trunc, floor, round }\` с тремя версиями округления для одного \`x\`. Используй \`Math.trunc\`, \`Math.floor\`, \`Math.round\`.

## Требования

1. Возвращай объект с тремя ключами.
2. Используй встроенные \`Math\`-методы.
3. Экспортируй функцию \`classifyRounding\`.

## Примеры

\`classifyRounding(1.5)\` → \`{ trunc: 1, floor: 1, round: 2 }\`

\`classifyRounding(-1.5)\` → \`{ trunc: -1, floor: -2, round: -1 }\`

\`classifyRounding(-0.5)\` → \`{ trunc: 0, floor: -1, round: 0 }\`

\`classifyRounding(2.0)\` → \`{ trunc: 2, floor: 2, round: 2 }\``,
    starter: `export function classifyRounding(x) {
  // Math.trunc, Math.floor, Math.round
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { classifyRounding } from './index.js';

describe('classifyRounding', () => {
  it('положительная дробь', () => {
    expect(classifyRounding(1.5)).toEqual({ trunc: 1, floor: 1, round: 2 });
  });

  it('отрицательная половина', () => {
    expect(classifyRounding(-1.5)).toEqual({ trunc: -1, floor: -2, round: -1 });
  });

  it('минус половина', () => {
    expect(classifyRounding(-0.5)).toEqual({ trunc: 0, floor: -1, round: 0 });
  });

  it('целое число', () => {
    expect(classifyRounding(2)).toEqual({ trunc: 2, floor: 2, round: 2 });
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { classifyRounding } from './index.js';

describe('classifyRounding', () => {
  it('положительная дробь', () => {
    expect(classifyRounding(1.5)).toEqual({ trunc: 1, floor: 1, round: 2 });
  });

  it('отрицательная половина', () => {
    expect(classifyRounding(-1.5)).toEqual({ trunc: -1, floor: -2, round: -1 });
  });

  it('минус половина', () => {
    expect(classifyRounding(-0.5)).toEqual({ trunc: 0, floor: -1, round: 0 });
  });

  it('целое число', () => {
    expect(classifyRounding(2)).toEqual({ trunc: 2, floor: 2, round: 2 });
  });

  it('1.9 — trunc и floor совпадают для положительных', () => {
    expect(classifyRounding(1.9)).toEqual({ trunc: 1, floor: 1, round: 2 });
  });

  it('-1.9 — все три разные', () => {
    expect(classifyRounding(-1.9)).toEqual({ trunc: -1, floor: -2, round: -2 });
  });

  it('ноль', () => {
    expect(classifyRounding(0)).toEqual({ trunc: 0, floor: 0, round: 0 });
  });

  it('очень малая дробь', () => {
    expect(classifyRounding(0.1)).toEqual({ trunc: 0, floor: 0, round: 0 });
  });
});
`,
    rank: 2,
    tags: ["number", "math", "rounding"],
  }),
  createDataTypeChallenge({
    id: "data-types-number-safe-integer",
    title: "Финал: контроль безопасных целых",
    description: `Финал набора. \`Number.MAX_SAFE_INTEGER\` = 9007199254740991. До этого числа целочисленная арифметика точная. Выше — некоторые соседние целые перестают быть представимыми, и сложение/умножение начинает врать.

\`\`\`js
Number.MAX_SAFE_INTEGER === 9007199254740991      // true
Number.MAX_SAFE_INTEGER + 1 === 9007199254740992  // true (последнее точное)
Number.MAX_SAFE_INTEGER + 2 === 9007199254740993  // false (!) — равно ...992

Number.isSafeInteger(9007199254740991)  // true
Number.isSafeInteger(9007199254740993)  // false
\`\`\`

Если складываешь идентификаторы из БД, размеры файлов, время в наносекундах — точность важна. При выходе за границу нужно либо переключаться на \`BigInt\`, либо явно сообщать об ошибке.

**Что написать.** Функцию \`safeAddOrNull(a, b)\` — складывает два целых числа. Если оба входа \`Number.isSafeInteger\` И результат тоже safe-integer — возвращает сумму. Иначе возвращает \`null\`.

## Требования

1. Проверь \`Number.isSafeInteger(a)\` и \`Number.isSafeInteger(b)\`.
2. Сложи и проверь, что результат тоже \`Number.isSafeInteger\`.
3. Иначе — \`null\`.
4. Экспортируй функцию \`safeAddOrNull\`.

## Примеры

\`safeAddOrNull(1, 2)\` → \`3\`

\`safeAddOrNull(Number.MAX_SAFE_INTEGER, 1)\` → \`9007199254740992\` ← это всё ещё safe? Нет, \`+1\` уже за пределами. Должен вернуть \`null\`.

\`safeAddOrNull(1.5, 2)\` → \`null\` (не safe-integer)

\`safeAddOrNull('1', 2)\` → \`null\``,
    starter: `export function safeAddOrNull(a, b) {
  // isSafeInteger обоих + результата, иначе null
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { safeAddOrNull } from './index.js';

describe('safeAddOrNull', () => {
  it('обычное сложение', () => {
    expect(safeAddOrNull(1, 2)).toBe(3);
  });

  it('переполнение MAX_SAFE_INTEGER', () => {
    expect(safeAddOrNull(Number.MAX_SAFE_INTEGER, 1)).toBeNull();
  });

  it('дробное число — null', () => {
    expect(safeAddOrNull(1.5, 2)).toBeNull();
  });

  it('строка — null', () => {
    expect(safeAddOrNull('1', 2)).toBeNull();
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { safeAddOrNull } from './index.js';

describe('safeAddOrNull', () => {
  it('обычное сложение', () => {
    expect(safeAddOrNull(1, 2)).toBe(3);
  });

  it('ноль плюс ноль', () => {
    expect(safeAddOrNull(0, 0)).toBe(0);
  });

  it('отрицательные числа', () => {
    expect(safeAddOrNull(-5, -3)).toBe(-8);
  });

  it('переполнение MAX_SAFE_INTEGER', () => {
    expect(safeAddOrNull(Number.MAX_SAFE_INTEGER, 1)).toBeNull();
  });

  it('переполнение в минус', () => {
    expect(safeAddOrNull(Number.MIN_SAFE_INTEGER, -1)).toBeNull();
  });

  it('граничный safe', () => {
    expect(safeAddOrNull(Number.MAX_SAFE_INTEGER - 1, 1)).toBe(Number.MAX_SAFE_INTEGER);
  });

  it('дробное число — null', () => {
    expect(safeAddOrNull(1.5, 2)).toBeNull();
  });

  it('строка — null', () => {
    expect(safeAddOrNull('1', 2)).toBeNull();
  });

  it('NaN — null', () => {
    expect(safeAddOrNull(NaN, 1)).toBeNull();
  });

  it('Infinity — null', () => {
    expect(safeAddOrNull(Infinity, 1)).toBeNull();
  });

  it('null/undefined — null', () => {
    expect(safeAddOrNull(null, 1)).toBeNull();
    expect(safeAddOrNull(undefined, 1)).toBeNull();
  });
});
`,
    rank: 3,
    tags: ["number", "safe-integer", "finale"],
  }),
];

export const stringChallenges: ChallengeDefinition[] = [
  createDataTypeChallenge({
    id: "data-types-truncate",
    title: "Обрезка с многоточием",
    description: `Представь: в карточке поста — заголовок. Если он длиннее, скажем, 20 символов, лучше оборвать его и поставить многоточие, чтобы вёрстка не разъехалась. Хитрость: многоточие тоже занимает символ. Если максимум 20 — отрезай до 19 и добавляй \`…\`, чтобы итог был ровно 20.

\`\`\`js
'Длинный заголовок'.slice(0, 19) + '…'
\`\`\`

**Что написать.** Функцию \`truncate(s, max)\`. Если строка не длиннее \`max\` — верни как есть. Иначе — отрежь первые \`max - 1\` символов и добавь \`…\`.

## Требования

1. Если \`s.length <= max\` — верни \`s\`.
2. Иначе верни \`s.slice(0, max - 1) + '…'\`.
3. Экспортируй функцию \`truncate\`.

## Примеры

\`truncate('hello', 10)\` → \`'hello'\`

\`truncate('hello world', 8)\` → \`'hello w…'\`

\`truncate('abc', 3)\` → \`'abc'\``,
    starter: `export function truncate(s, max) {
  // Если короче max — верни как есть, иначе обрезай и добавляй …
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { truncate } from './index.js';

describe('truncate', () => {
  it('не трогает короткую строку', () => {
    expect(truncate('hello', 10)).toBe('hello');
  });

  it('обрезает длинную строку с многоточием', () => {
    expect(truncate('hello world', 8)).toBe('hello w…');
  });

  it('строка ровно в максимум', () => {
    expect(truncate('abc', 3)).toBe('abc');
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { truncate } from './index.js';

describe('truncate', () => {
  it('не трогает короткую строку', () => {
    expect(truncate('hello', 10)).toBe('hello');
  });

  it('обрезает длинную строку с многоточием', () => {
    expect(truncate('hello world', 8)).toBe('hello w…');
  });

  it('строка ровно в максимум', () => {
    expect(truncate('abc', 3)).toBe('abc');
  });

  it('итоговая длина не превышает max', () => {
    const out = truncate('abcdefghij', 5);
    expect(out.length).toBe(5);
  });

  it('пустая строка остаётся пустой', () => {
    expect(truncate('', 5)).toBe('');
  });
});
`,
    rank: 1,
    tags: ["string", "slice"],
  }),
  createDataTypeChallenge({
    id: "data-types-slugify",
    title: "Сделать slug",
    description: `Представь: у тебя заголовок поста — \`'Привет, мир!'\` — а в URL хочется получить что-то приличное вроде \`'привет-мир'\`. Это называется slug. План простой: всё в нижний регистр, все небуквенно-небуквенноцифровые куски заменяем на дефис, лишние дефисы по краям отрезаем.

\`\`\`js
s.toLowerCase().replace(/[^a-zа-яё0-9]+/gi, '-').replace(/^-+|-+$/g, '')
\`\`\`

**Хитрость.** Регулярка должна понимать кириллицу — иначе все русские буквы тоже превратятся в дефисы. Класс \`[а-яё]\` плюс флаг \`i\` справляются.

**Что написать.** Функцию \`slugify(s)\`, которая возвращает slug.

## Требования

1. Сначала \`toLowerCase()\`.
2. Любые подряд идущие не-буквы и не-цифры заменяй на один дефис.
3. Кириллические буквы должны сохраняться (в нижнем регистре).
4. Срежь дефисы в начале и конце.
5. Экспортируй функцию \`slugify\`.

## Примеры

\`slugify('Hello World')\` → \`'hello-world'\`

\`slugify('Привет, мир!')\` → \`'привет-мир'\`

\`slugify('  --abc--  ')\` → \`'abc'\``,
    starter: `export function slugify(s) {
  // toLowerCase, replace на дефис, trim по краям
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { slugify } from './index.js';

describe('slugify', () => {
  it('латиница с пробелом', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('кириллица с пунктуацией', () => {
    expect(slugify('Привет, мир!')).toBe('привет-мир');
  });

  it('обрезает дефисы по краям', () => {
    expect(slugify('  --abc--  ')).toBe('abc');
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { slugify } from './index.js';

describe('slugify', () => {
  it('латиница с пробелом', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('кириллица с пунктуацией', () => {
    expect(slugify('Привет, мир!')).toBe('привет-мир');
  });

  it('обрезает дефисы по краям', () => {
    expect(slugify('  --abc--  ')).toBe('abc');
  });

  it('сжимает несколько разделителей в один дефис', () => {
    expect(slugify('a   b___c')).toBe('a-b-c');
  });

  it('пустая строка', () => {
    expect(slugify('')).toBe('');
  });

  it('сохраняет цифры', () => {
    expect(slugify('версия 2.0 beta')).toBe('версия-2-0-beta');
  });
});
`,
    rank: 1,
    tags: ["string", "regex", "slug"],
  }),
  createDataTypeChallenge({
    id: "data-types-word-count",
    title: "Счётчик слов",
    description: `Представь: пользователь пишет твит, а ты считаешь слова. Кажется, можно \`s.split(' ').length\`. Но что, если между словами два пробела? Что, если строка пустая? Что, если в начале табуляция?

\`\`\`js
'  hello   world  '.split(' ').length // 7 — лишние пустые токены
\`\`\`

**Хитрость.** Сначала \`trim()\`, потом \`split(/\\s+/)\` — регулярка \`\\s+\` ловит любую серию пробельных. И отдельный кейс: если после \`trim()\` строка пустая — слов \`0\`, иначе \`split\` всё равно вернёт массив с одной пустой строкой.

**Что написать.** Функцию \`wordCount(s)\`, которая возвращает количество слов.

## Требования

1. \`trim()\` строку.
2. Если после трима пусто — верни \`0\`.
3. Иначе \`split(/\\s+/)\` и верни длину.
4. Экспортируй функцию \`wordCount\`.

## Примеры

\`wordCount('hello world')\` → \`2\`

\`wordCount('   ')\` → \`0\`

\`wordCount('')\` → \`0\``,
    starter: `export function wordCount(s) {
  // trim, проверь на пустоту, потом split(/\\s+/)
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { wordCount } from './index.js';

describe('wordCount', () => {
  it('считает два слова', () => {
    expect(wordCount('hello world')).toBe(2);
  });

  it('пробельная строка — ноль', () => {
    expect(wordCount('   ')).toBe(0);
  });

  it('пустая строка — ноль', () => {
    expect(wordCount('')).toBe(0);
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { wordCount } from './index.js';

describe('wordCount', () => {
  it('считает два слова', () => {
    expect(wordCount('hello world')).toBe(2);
  });

  it('пробельная строка — ноль', () => {
    expect(wordCount('   ')).toBe(0);
  });

  it('пустая строка — ноль', () => {
    expect(wordCount('')).toBe(0);
  });

  it('игнорирует множественные пробелы', () => {
    expect(wordCount('  hello   world  ')).toBe(2);
  });

  it('обрабатывает табуляции и переводы строк', () => {
    expect(wordCount('one\\ttwo\\nthree')).toBe(3);
  });

  it('одно слово', () => {
    expect(wordCount('hello')).toBe(1);
  });
});
`,
    rank: 2,
    tags: ["string", "split", "regex"],
  }),
  createDataTypeChallenge({
    id: "data-types-surrogate-length",
    title: "Длина строки с эмодзи",
    description: `\`s.length\` — это число **UTF-16 кодовых юнитов**, а не символов. ASCII и кириллица занимают по одному юниту. А вот эмодзи и редкие иероглифы — по два (суррогатная пара).

\`\`\`js
'abc'.length    // 3 — каждый по 1
'я'.length      // 1
'😀'.length      // 2 (!) — один эмодзи, но length=2
'a😀'.length     // 3 — буква (1) + эмодзи (2)
\`\`\`

**Хитрость.** Чтобы получить «настоящее» количество символов, нужно перебирать по код-поинтам. Самый простой способ — \`Array.from(s)\` или \`[...s]\`: и тот, и другой используют итератор строки, который правильно склеивает суррогаты.

\`\`\`js
[...'😀'].length   // 1 — корректно
[...'a😀b'].length  // 3
\`\`\`

**Что написать.** Функцию \`codePointLength(s)\` — возвращает количество код-поинтов в строке.

## Требования

1. Используй \`[...s].length\` или \`Array.from(s).length\`.
2. Не используй \`s.length\` напрямую.
3. Экспортируй функцию \`codePointLength\`.

## Примеры

\`codePointLength('abc')\` → \`3\`

\`codePointLength('😀')\` → \`1\`

\`codePointLength('a😀b')\` → \`3\`

\`codePointLength('')\` → \`0\``,
    starter: `export function codePointLength(s) {
  // [...s].length
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { codePointLength } from './index.js';

describe('codePointLength', () => {
  it('обычная ASCII', () => {
    expect(codePointLength('abc')).toBe(3);
  });

  it('одинокий эмодзи', () => {
    expect(codePointLength('😀')).toBe(1);
  });

  it('смесь буквы и эмодзи', () => {
    expect(codePointLength('a😀b')).toBe(3);
  });

  it('пустая строка', () => {
    expect(codePointLength('')).toBe(0);
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { codePointLength } from './index.js';

describe('codePointLength', () => {
  it('обычная ASCII', () => {
    expect(codePointLength('abc')).toBe(3);
  });

  it('одинокий эмодзи', () => {
    expect(codePointLength('😀')).toBe(1);
  });

  it('смесь буквы и эмодзи', () => {
    expect(codePointLength('a😀b')).toBe(3);
  });

  it('пустая строка', () => {
    expect(codePointLength('')).toBe(0);
  });

  it('кириллица', () => {
    expect(codePointLength('привет')).toBe(6);
  });

  it('несколько эмодзи подряд', () => {
    expect(codePointLength('😀😀😀')).toBe(3);
  });

  it('редкий иероглиф (тоже суррогатная пара)', () => {
    expect(codePointLength('𝕏')).toBe(1);
  });

  it('s.length для эмодзи — НЕ совпадает', () => {
    const s = '😀';
    expect(codePointLength(s)).toBe(1);
    expect(s.length).toBe(2);
  });
});
`,
    rank: 2,
    tags: ["string", "unicode", "surrogate"],
  }),
  createDataTypeChallenge({
    id: "data-types-first-codepoint",
    title: "Первый код-поинт",
    description: `Представь: тебе надо узнать, какой первый символ строки в Юникоде. Кажется, \`s.charCodeAt(0)\` — но это UTF-16 код-юнит, а у эмодзи и редких символов код-поинт занимает два таких юнита (суррогатная пара).

\`\`\`js
'😀'.length // 2 (!) — это два UTF-16 юнита
'😀'.charCodeAt(0) // 55357 — половина пары, неполноценно
'😀'.codePointAt(0) // 128512 — настоящий код-поинт
\`\`\`

**Хитрость.** \`codePointAt(0)\` склеивает суррогатную пару и возвращает полноценный код. А ещё его надо защитить от пустой строки — там вернётся \`undefined\`, мы хотим \`null\`.

**Что написать.** Функцию \`firstCodePoint(s)\`, которая возвращает первый код-поинт или \`null\` для пустой строки.

## Требования

1. Если \`s\` пустая — верни \`null\`.
2. Иначе верни \`s.codePointAt(0)\`.
3. Экспортируй функцию \`firstCodePoint\`.

## Примеры

\`firstCodePoint('A')\` → \`65\`

\`firstCodePoint('я')\` → \`1103\`

\`firstCodePoint('😀')\` → \`128512\`

\`firstCodePoint('')\` → \`null\``,
    starter: `export function firstCodePoint(s) {
  // Сначала проверь пустую строку, потом codePointAt(0)
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { firstCodePoint } from './index.js';

describe('firstCodePoint', () => {
  it('код латинской A', () => {
    expect(firstCodePoint('A')).toBe(65);
  });

  it('код кириллической я', () => {
    expect(firstCodePoint('я')).toBe(1103);
  });

  it('код эмодзи (суррогатная пара)', () => {
    expect(firstCodePoint('😀')).toBe(128512);
  });

  it('пустая строка возвращает null', () => {
    expect(firstCodePoint('')).toBe(null);
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { firstCodePoint } from './index.js';

describe('firstCodePoint', () => {
  it('код латинской A', () => {
    expect(firstCodePoint('A')).toBe(65);
  });

  it('код кириллической я', () => {
    expect(firstCodePoint('я')).toBe(1103);
  });

  it('код эмодзи (суррогатная пара)', () => {
    expect(firstCodePoint('😀')).toBe(128512);
  });

  it('пустая строка возвращает null', () => {
    expect(firstCodePoint('')).toBe(null);
  });

  it('берёт только первый символ из многосимвольной строки', () => {
    expect(firstCodePoint('hello')).toBe(104);
  });

  it('правильно склеивает суррогаты для редкого символа', () => {
    expect(firstCodePoint('𝕏')).toBe(120143);
  });
});
`,
    rank: 3,
    tags: ["string", "unicode", "codePointAt"],
  }),
  createDataTypeChallenge({
    id: "data-types-string-locale-compare",
    title: "Сортировка по алфавиту локали",
    description: `Обычное сравнение строк через \`<\`/\`>\` идёт по код-поинтам Unicode. Для русского это работает плохо: \`'Ё' > 'Я'\` (потому что \`'Ё'\` имеет более высокий код, чем \`'Я'\` в Unicode), хотя в алфавите \`Ё\` идёт после \`Е\`.

\`\`\`js
['Я', 'Ё', 'А'].sort()
// ['А', 'Я', 'Ё']  — Ё уехало в конец, как и должно по код-поинтам

['Я', 'Ё', 'А'].sort((a, b) => a.localeCompare(b, 'ru'))
// ['А', 'Ё', 'Я']  — алфавитный порядок
\`\`\`

\`localeCompare\` возвращает отрицательное / ноль / положительное, как \`compareFn\` для \`sort\`. Принимает локаль вторым аргументом.

**Что написать.** Функцию \`sortRussian(arr)\` — возвращает **новый** массив строк, отсортированный по русскому алфавиту через \`localeCompare\`.

## Требования

1. Не мутируй входной массив (\`[...arr].sort\` или \`arr.toSorted\`).
2. \`compareFn\` использует \`a.localeCompare(b, 'ru')\`.
3. Регистронезависимо НЕ требуется — поведение по умолчанию.
4. Экспортируй функцию \`sortRussian\`.

## Примеры

\`sortRussian(['Я', 'Ё', 'А'])\` → \`['А', 'Ё', 'Я']\`

\`sortRussian(['банан', 'яблоко', 'абрикос'])\` → \`['абрикос', 'банан', 'яблоко']\`

\`sortRussian([])\` → \`[]\``,
    starter: `export function sortRussian(arr) {
  // [...arr].sort((a, b) => a.localeCompare(b, 'ru'))
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { sortRussian } from './index.js';

describe('sortRussian', () => {
  it('Ё попадает после Е', () => {
    expect(sortRussian(['Я', 'Ё', 'А'])).toEqual(['А', 'Ё', 'Я']);
  });

  it('обычные слова', () => {
    expect(sortRussian(['банан', 'яблоко', 'абрикос']))
      .toEqual(['абрикос', 'банан', 'яблоко']);
  });

  it('пустой массив', () => {
    expect(sortRussian([])).toEqual([]);
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { sortRussian } from './index.js';

describe('sortRussian', () => {
  it('Ё попадает после Е', () => {
    expect(sortRussian(['Я', 'Ё', 'А'])).toEqual(['А', 'Ё', 'Я']);
  });

  it('обычные слова', () => {
    expect(sortRussian(['банан', 'яблоко', 'абрикос']))
      .toEqual(['абрикос', 'банан', 'яблоко']);
  });

  it('пустой массив', () => {
    expect(sortRussian([])).toEqual([]);
  });

  it('один элемент', () => {
    expect(sortRussian(['слово'])).toEqual(['слово']);
  });

  it('латиница и кириллица не смешиваются непредсказуемо', () => {
    const result = sortRussian(['яблоко', 'apple']);
    expect(result.length).toBe(2);
    expect(result).toContain('яблоко');
    expect(result).toContain('apple');
  });

  it('не мутирует оригинал', () => {
    const orig = ['Я', 'Ё', 'А'];
    sortRussian(orig);
    expect(orig).toEqual(['Я', 'Ё', 'А']);
  });

  it('одинаковые слова сохраняют дубликаты', () => {
    expect(sortRussian(['а', 'а', 'б'])).toEqual(['а', 'а', 'б']);
  });
});
`,
    rank: 3,
    tags: ["string", "locale", "sort"],
  }),
];
