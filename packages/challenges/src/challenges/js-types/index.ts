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
    description: `Оператор \`typeof\` возвращает строку с базовым типом значения. Это первый инструмент, которым удобно проверить, что именно пришло в функцию.

Напиши \`getTypeLabel(value)\`: функция получает любое значение и возвращает результат обычного \`typeof value\` без дополнительных правил.

## Требования

1. Экспортируй функцию \`getTypeLabel(value)\`.
2. Верни строку, которую возвращает оператор \`typeof\`.
3. Не добавляй специальную обработку для \`null\`, массивов или дат.

## Интерфейс

Экспортируй функцию \`getTypeLabel(value)\`.`,
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
    description: `В JavaScript \`null\` и \`undefined\` обычно означают, что значения нет. При этом \`0\`, \`false\` и пустая строка - это значения, и их нельзя считать отсутствующими.

Напиши \`isNullish(value)\`: функция должна вернуть \`true\` только для \`null\` и \`undefined\`. Для любых других значений верни \`false\`.

## Требования

1. Экспортируй функцию \`isNullish(value)\`.
2. Для \`null\` верни \`true\`.
3. Для \`undefined\` верни \`true\`.
4. Для \`0\`, \`false\`, \`''\` и остальных значений верни \`false\`.

## Интерфейс

Экспортируй функцию \`isNullish(value)\`.`,
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
    description: `В условиях JavaScript сам приводит значение к boolean. Falsy-значения ведут себя как \`false\`: например, \`false\`, \`0\`, пустая строка, \`null\` и \`undefined\`. Большинство остальных значений truthy: непустые строки, массивы, объекты и функции.

Напиши \`toTruthiness(value)\`: функция должна вернуть boolean-результат такого приведения. Представь, что значение поставили в \`if (value)\`: если условие выполнилось бы, верни \`true\`, иначе верни \`false\`. Например, \`toTruthiness(0)\` возвращает \`false\`, а \`toTruthiness("0")\` и \`toTruthiness([])\` возвращают \`true\`.

## Требования

1. Экспортируй функцию \`toTruthiness(value)\`.
2. Верни \`true\`, если значение truthy.
3. Верни \`false\`, если значение falsy.
4. Не перечисляй все falsy-значения вручную: используй стандартное приведение JavaScript к boolean.

## Интерфейс

Экспортируй функцию \`toTruthiness(value)\`.`,
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
    description: `В JavaScript тип \`number\` включает обычные числа, \`NaN\`, \`Infinity\` и \`-Infinity\`. Для вычислений часто нужно разделять эти случаи явно.

Напиши \`getNumberKind(value)\`: функция классифицирует значение и возвращает строку с видом числа. Например, \`10\` - это \`"integer"\`, \`2.5\` - \`"float"\`, а строка \`"10"\` - \`"not-number"\`.

## Требования

1. Экспортируй функцию \`getNumberKind(value)\`.
2. Если \`value\` не имеет тип \`number\`, верни \`"not-number"\`.
3. Для \`NaN\` верни \`"nan"\`.
4. Для \`Infinity\` и \`-Infinity\` верни \`"infinity"\`.
5. Для целого числа верни \`"integer"\`.
6. Для дробного конечного числа верни \`"float"\`.

## Интерфейс

Экспортируй функцию \`getNumberKind(value)\`.`,
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
    description: `Из API и форм числа часто приходят строками. Нужно отличать строку, которую можно безопасно считать числом, от строки вроде \`"42px"\` или пустого значения.

Напиши \`isNumericString(value)\`: функция получает значение и возвращает \`true\`, только если это строка, которая после \`trim()\` превращается в конечное число.

## Требования

1. Экспортируй функцию \`isNumericString(value)\`.
2. Если \`value\` не строка, верни \`false\`.
3. Для пустой строки и строки из пробелов верни \`false\`.
4. Для строки, которую можно превратить в конечное число, верни \`true\`.
5. Для \`NaN\`, \`Infinity\` и текста с лишними символами верни \`false\`.

## Интерфейс

Экспортируй функцию \`isNumericString(value)\`.`,
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
    description: `Массивы, даты, \`null\` и обычные объекты через \`typeof\` выглядят одинаково: все они дают \`"object"\`. В реальном коде эти случаи нужно различать.

Напиши \`getContainerKind(value)\`: функция должна вернуть точный вид контейнера. Массив - \`"array"\`, дата - \`"date"\`, \`null\` - \`"null"\`, обычный объект - \`"object"\`. Для значений, которые не являются контейнерами, верни \`"other"\`.

## Требования

1. Экспортируй функцию \`getContainerKind(value)\`.
2. Для массива верни \`"array"\`.
3. Для \`Date\` верни \`"date"\`.
4. Для \`null\` верни \`"null"\`.
5. Для обычного объекта верни \`"object"\`.
6. Для остальных значений верни \`"other"\`.

## Интерфейс

Экспортируй функцию \`getContainerKind(value)\`.`,
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
    description: `Примитивы в JavaScript хранят само значение, а объекты, массивы и функции - ссылку. Это важно, потому что сравнение и передача таких значений работают по-разному.

Напиши \`isPrimitive(value)\`: функция должна вернуть \`true\` для примитивов и \`false\` для объектов, массивов и функций. Не забудь, что \`null\` считается примитивным значением, хотя \`typeof null\` возвращает \`"object"\`.

## Требования

1. Экспортируй функцию \`isPrimitive(value)\`.
2. Для \`string\`, \`number\`, \`boolean\`, \`bigint\`, \`symbol\`, \`undefined\` и \`null\` верни \`true\`.
3. Для объектов, массивов и функций верни \`false\`.
4. Обработай \`null\` отдельно.

## Интерфейс

Экспортируй функцию \`isPrimitive(value)\`.`,
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
    description: `Количество элементов часто приходит из формы строкой, а иногда вообще мусором. Перед использованием его нужно привести к безопасному целому числу.

Напиши \`normalizeCount(value)\`: функция получает значение, превращает его в число, округляет вниз и возвращает неотрицательное целое. Если значение невозможно нормально использовать как число, верни \`0\`.

## Требования

1. Экспортируй функцию \`normalizeCount(value)\`.
2. Числа и числовые строки приведи к \`number\`.
3. Дробную часть отбрось через \`Math.floor\`.
4. Для отрицательных значений, \`NaN\`, \`Infinity\` и пустых строк верни \`0\`.
5. Результат всегда должен быть неотрицательным числом.

## Интерфейс

Экспортируй функцию \`normalizeCount(value)\`.`,
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
    description: `Иногда нужно сравнить значения без неявного приведения типов и без сюрпризов вокруг специальных чисел. В JavaScript для этого удобно использовать \`Object.is\`: он считает \`NaN\` равным самому себе и различает \`0\` и \`-0\`.

Напиши \`isSameTypedValue(left, right)\`: функция должна вернуть \`true\` только тогда, когда два значения совпадают по правилам \`Object.is\`.

## Требования

1. Экспортируй функцию \`isSameTypedValue(left, right)\`.
2. Используй сравнение без приведения типов.
3. \`1\` и \`"1"\` должны считаться разными.
4. \`false\` и \`0\` должны считаться разными.
5. \`NaN\` и \`NaN\` должны считаться одинаковыми.
6. \`0\` и \`-0\` должны считаться разными.

## Интерфейс

Экспортируй функцию \`isSameTypedValue(left, right)\`.`,
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
    description: `В UI и логах часто нужно превратить значение в текст, не уронив код на специальных типах. Обычная конкатенация со строкой может сломаться на \`Symbol\`, поэтому лучше явно использовать безопасное строковое преобразование.

Напиши \`toDisplayText(value)\`: функция получает любое значение и возвращает его строковое представление. Например, \`null\` должен стать строкой \`"null"\`, \`undefined\` - \`"undefined"\`, а \`Symbol("id")\` - \`"Symbol(id)"\`.

## Требования

1. Экспортируй функцию \`toDisplayText(value)\`.
2. Для \`null\` верни строку \`"null"\`.
3. Для \`undefined\` верни строку \`"undefined"\`.
4. Для строки верни саму строку.
5. Для числа, boolean, bigint и symbol верни безопасное строковое представление.

## Интерфейс

Экспортируй функцию \`toDisplayText(value)\`.`,
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
    description: `JavaScript не разрешает напрямую складывать \`number\` и \`bigint\`: будет ошибка. Поэтому перед сложением нужно проверить, что оба значения одного числового типа.

Напиши \`safeAdd(left, right)\`: функция складывает два значения только если они оба \`number\` или оба \`bigint\`. Если входные значения нельзя безопасно сложить, выброси ошибку с понятным текстом.

## Требования

1. Экспортируй функцию \`safeAdd(left, right)\`.
2. Если оба значения имеют тип \`number\`, верни их сумму.
3. Если оба значения имеют тип \`bigint\`, верни их сумму.
4. Если типы разные или значения не числа/bigint, выброси ошибку \`"Incompatible numeric types"\`.
5. Не допускай runtime-ошибку при смешивании \`number\` и \`bigint\`.
6. Для \`number\` принимай только конечные числа.

## Интерфейс

Экспортируй функцию \`safeAdd(left, right)\`.`,
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
    description: `JSON поддерживает не все значения JavaScript. В нем есть строки, числа, boolean, \`null\`, массивы и обычные объекты. Функции, \`undefined\`, symbol и bigint не являются нормальными JSON-значениями.

Напиши \`getJsonKind(value)\`: функция классифицирует значение с точки зрения JSON и возвращает строку с типом.

## Требования

1. Экспортируй функцию \`getJsonKind(value)\`.
2. Для \`null\` верни \`"null"\`.
3. Для массива верни \`"array"\`.
4. Для обычного объекта верни \`"object"\`.
5. Для \`string\`, \`number\` и \`boolean\` верни их тип.
6. Для значений, которые не являются JSON-значениями, верни \`"unsupported"\`.

## Интерфейс

Экспортируй функцию \`getJsonKind(value)\`.`,
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
