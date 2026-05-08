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
    id: "data-types-symbol-unique",
    title: "Каждый Symbol уникален",
    description: `\`Symbol()\` — функция, которая создаёт уникальное значение. Любой вызов даёт новый Symbol, даже если описание совпадает.

\`\`\`js
const a = Symbol('id');
const b = Symbol('id');
a === b           // false — разные значения!
typeof a          // 'symbol'
a.description     // 'id' — для отладки
\`\`\`

**Зачем.** Когда нужен ключ или метка, которая гарантированно не пересечётся с любым другим значением в программе.

**Что написать.** Функцию \`makeUniquePair(label)\`, которая возвращает массив из двух Symbol с одинаковым описанием \`label\`. Они должны быть НЕ равны друг другу.

## Требования

1. Создай два Symbol через \`Symbol(label)\`.
2. Верни их в массиве \`[a, b]\`.
3. \`a !== b\` должно быть \`true\`.
4. \`a.description === label\` и \`b.description === label\`.
5. Экспортируй функцию \`makeUniquePair\`.

## Примеры

\`makeUniquePair('id')\` → \`[Symbol(id), Symbol(id)]\`, причём \`pair[0] !== pair[1]\`

\`makeUniquePair('x').map(s => typeof s)\` → \`['symbol', 'symbol']\``,
    starter: `export function makeUniquePair(label) {
  // Верни два разных Symbol с одинаковым описанием
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { makeUniquePair } from './index.js';

describe('makeUniquePair', () => {
  it('два значения с типом symbol', () => {
    const [a, b] = makeUniquePair('id');
    expect(typeof a).toBe('symbol');
    expect(typeof b).toBe('symbol');
  });

  it('значения не равны друг другу', () => {
    const [a, b] = makeUniquePair('id');
    expect(a).not.toBe(b);
  });

  it('описание совпадает с переданным', () => {
    const [a, b] = makeUniquePair('hello');
    expect(a.description).toBe('hello');
    expect(b.description).toBe('hello');
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { makeUniquePair } from './index.js';

describe('makeUniquePair', () => {
  it('два значения с типом symbol', () => {
    const [a, b] = makeUniquePair('id');
    expect(typeof a).toBe('symbol');
    expect(typeof b).toBe('symbol');
  });

  it('значения не равны друг другу', () => {
    const [a, b] = makeUniquePair('id');
    expect(a).not.toBe(b);
  });

  it('описание совпадает с переданным', () => {
    const [a, b] = makeUniquePair('hello');
    expect(a.description).toBe('hello');
    expect(b.description).toBe('hello');
  });

  it('возвращает массив из двух элементов', () => {
    const result = makeUniquePair('x');
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);
  });

  it('пустое описание тоже работает', () => {
    const [a, b] = makeUniquePair('');
    expect(a).not.toBe(b);
    expect(a.description).toBe('');
  });

  it('два вызова дают четыре разных значения', () => {
    const [a, b] = makeUniquePair('id');
    const [c, d] = makeUniquePair('id');
    const all = new Set([a, b, c, d]);
    expect(all.size).toBe(4);
  });
});
`,
    rank: 0,
    tags: ["symbol", "unique", "intro"],
  }),
  createDataTypeChallenge({
    id: "data-types-symbol-as-key",
    title: "Symbol как скрытый ключ",
    description: `Symbol можно использовать как ключ в объекте. Особенность: такие ключи **скрыты** от \`Object.keys\`, \`for..in\` и \`JSON.stringify\`. Доступ к ним есть только у того, у кого есть сам Symbol.

\`\`\`js
const tag = Symbol('tag');
const user = { name: 'Аня', [tag]: 'admin' };

Object.keys(user)                 // ['name'] — Symbol-ключа нет!
JSON.stringify(user)              // '{"name":"Аня"}' — Symbol-ключа нет!
user[tag]                         // 'admin' — но если знаешь Symbol — читай
Object.getOwnPropertySymbols(user) // [Symbol(tag)] — отдельный API
\`\`\`

**Зачем.** Метаданные, приватные пометки, расширения чужих объектов без коллизий.

**Что написать.** Функцию \`attachHiddenTag(obj, tag, value)\` — возвращает новый объект, в который скопированы все строковые свойства \`obj\`, плюс добавлен ключ \`tag\` (Symbol) со значением \`value\`. Исходный \`obj\` не мутируй.

## Требования

1. Скопируй все собственные **строковые** свойства \`obj\`.
2. Добавь свойство по ключу \`tag\` со значением \`value\`.
3. \`Object.keys\` результата должен содержать только строковые ключи исходника.
4. \`result[tag] === value\`.
5. Исходный объект не меняется.
6. Экспортируй функцию \`attachHiddenTag\`.

## Примеры

\`attachHiddenTag({ a: 1 }, Symbol('s'), 'X')\` — у результата \`Object.keys\` даёт \`['a']\`, но \`result[s]\` равно \`'X'\`.`,
    starter: `export function attachHiddenTag(obj, tag, value) {
  // Скопируй obj, добавь свойство по Symbol-ключу
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { attachHiddenTag } from './index.js';

describe('attachHiddenTag', () => {
  it('сохраняет строковые свойства', () => {
    const result = attachHiddenTag({ a: 1, b: 2 }, Symbol('s'), 'X');
    expect(result.a).toBe(1);
    expect(result.b).toBe(2);
  });

  it('Symbol-ключ доступен по самому Symbol', () => {
    const tag = Symbol('s');
    const result = attachHiddenTag({}, tag, 'X');
    expect(result[tag]).toBe('X');
  });

  it('Object.keys не показывает Symbol', () => {
    const result = attachHiddenTag({ a: 1 }, Symbol('s'), 'X');
    expect(Object.keys(result)).toEqual(['a']);
  });

  it('не мутирует оригинал', () => {
    const orig = { a: 1 };
    const tag = Symbol('s');
    attachHiddenTag(orig, tag, 'X');
    expect(orig[tag]).toBeUndefined();
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { attachHiddenTag } from './index.js';

describe('attachHiddenTag', () => {
  it('сохраняет строковые свойства', () => {
    const result = attachHiddenTag({ a: 1, b: 2 }, Symbol('s'), 'X');
    expect(result.a).toBe(1);
    expect(result.b).toBe(2);
  });

  it('Symbol-ключ доступен по самому Symbol', () => {
    const tag = Symbol('s');
    const result = attachHiddenTag({}, tag, 'X');
    expect(result[tag]).toBe('X');
  });

  it('Object.keys не показывает Symbol', () => {
    const result = attachHiddenTag({ a: 1 }, Symbol('s'), 'X');
    expect(Object.keys(result)).toEqual(['a']);
  });

  it('JSON.stringify не сериализует Symbol-ключ', () => {
    const result = attachHiddenTag({ a: 1 }, Symbol('s'), 'X');
    expect(JSON.stringify(result)).toBe('{"a":1}');
  });

  it('Object.getOwnPropertySymbols возвращает наш Symbol', () => {
    const tag = Symbol('s');
    const result = attachHiddenTag({}, tag, 'X');
    expect(Object.getOwnPropertySymbols(result)).toEqual([tag]);
  });

  it('for..in не перебирает Symbol-ключ', () => {
    const result = attachHiddenTag({ a: 1 }, Symbol('s'), 'X');
    const keys = [];
    for (const k in result) keys.push(k);
    expect(keys).toEqual(['a']);
  });

  it('не мутирует оригинал', () => {
    const orig = { a: 1 };
    const tag = Symbol('s');
    attachHiddenTag(orig, tag, 'X');
    expect(orig[tag]).toBeUndefined();
    expect(Object.keys(orig)).toEqual(['a']);
  });

  it('значение может быть любого типа', () => {
    const tag = Symbol('s');
    const result = attachHiddenTag({}, tag, { nested: true });
    expect(result[tag]).toEqual({ nested: true });
  });
});
`,
    rank: 1,
    tags: ["symbol", "key", "hidden"],
  }),
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
  createDataTypeChallenge({
    id: "data-types-symbol-to-string-tag",
    title: "Кастомный toStringTag",
    description: `\`Object.prototype.toString.call(x)\` — старый способ узнать «тип» значения. Для обычного объекта он всегда возвращает \`'[object Object]'\`. Но если повесить на объект свойство по ключу \`Symbol.toStringTag\`, JS возьмёт его в скобки.

\`\`\`js
const obj = { [Symbol.toStringTag]: 'MyThing' };
Object.prototype.toString.call(obj) // '[object MyThing]'

Object.prototype.toString.call([])      // '[object Array]'
Object.prototype.toString.call(new Map) // '[object Map]'
\`\`\`

Это «well-known symbol» — Symbol, который сам JS-движок использует для встроенных протоколов.

**Что написать.** Функцию \`tagAs(name, data)\` — возвращает объект, у которого все свойства из \`data\` плюс \`Symbol.toStringTag\` равен \`name\`. \`Object.prototype.toString.call(result)\` должен дать \`'[object name]'\`.

## Требования

1. Скопируй свойства из \`data\`.
2. Добавь свойство по ключу \`Symbol.toStringTag\` со значением \`name\`.
3. Исходный \`data\` не мутируй.
4. Экспортируй функцию \`tagAs\`.

## Примеры

\`Object.prototype.toString.call(tagAs('User', { name: 'Аня' }))\` → \`'[object User]'\`

\`tagAs('Box', { value: 42 }).value\` → \`42\``,
    starter: `export function tagAs(name, data) {
  // Скопируй data, добавь [Symbol.toStringTag]: name
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { tagAs } from './index.js';

describe('tagAs', () => {
  it('toString даёт нужный тег', () => {
    const result = tagAs('User', {});
    expect(Object.prototype.toString.call(result)).toBe('[object User]');
  });

  it('сохраняет свойства data', () => {
    const result = tagAs('Box', { value: 42 });
    expect(result.value).toBe(42);
  });

  it('пустое data', () => {
    const result = tagAs('Empty', {});
    expect(Object.prototype.toString.call(result)).toBe('[object Empty]');
  });

  it('не мутирует оригинал', () => {
    const data = { a: 1 };
    tagAs('X', data);
    expect(data[Symbol.toStringTag]).toBeUndefined();
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { tagAs } from './index.js';

describe('tagAs', () => {
  it('toString даёт нужный тег', () => {
    const result = tagAs('User', {});
    expect(Object.prototype.toString.call(result)).toBe('[object User]');
  });

  it('сохраняет свойства data', () => {
    const result = tagAs('Box', { value: 42 });
    expect(result.value).toBe(42);
  });

  it('сохраняет несколько свойств', () => {
    const result = tagAs('Point', { x: 1, y: 2, z: 3 });
    expect(result.x).toBe(1);
    expect(result.y).toBe(2);
    expect(result.z).toBe(3);
  });

  it('пустое data', () => {
    const result = tagAs('Empty', {});
    expect(Object.prototype.toString.call(result)).toBe('[object Empty]');
  });

  it('не мутирует оригинал', () => {
    const data = { a: 1 };
    tagAs('X', data);
    expect(data[Symbol.toStringTag]).toBeUndefined();
  });

  it('тег виден через Symbol.toStringTag', () => {
    const result = tagAs('Hello', {});
    expect(result[Symbol.toStringTag]).toBe('Hello');
  });

  it('Object.keys не содержит Symbol-ключа', () => {
    const result = tagAs('User', { name: 'A' });
    expect(Object.keys(result)).toEqual(['name']);
  });

  it('два разных тега', () => {
    const a = tagAs('A', {});
    const b = tagAs('B', {});
    expect(Object.prototype.toString.call(a)).toBe('[object A]');
    expect(Object.prototype.toString.call(b)).toBe('[object B]');
  });
});
`,
    rank: 3,
    tags: ["symbol", "well-known", "toStringTag"],
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
  createDataTypeChallenge({
    id: "data-types-bigint-mix-typeerror",
    title: "BigInt и Number не дружат",
    description: `BigInt — отдельный тип. JS запрещает напрямую смешивать его с Number в арифметике, чтобы не терять точность тихо.

\`\`\`js
1n + 1     // TypeError: Cannot mix BigInt and other types
1n + 1n    // 2n  — ОК
1n + BigInt(1) // 2n — конвертируем явно
\`\`\`

Сравнения через \`<\` / \`>\` разрешены, а \`===\` всегда даёт \`false\` между разными типами:

\`\`\`js
1n === 1   // false — разные типы
1n == 1    // true  — слабое равенство приводит
1n < 2     // true  — порядок работает
\`\`\`

**Что написать.** Функцию \`safeAdd(a, b)\` — складывает два значения. Если оба BigInt или оба Number — возвращает их сумму. Если типы разные — возвращает строку \`'TypeError'\`. Не используй \`try/catch\`.

## Требования

1. Если оба аргумента типа \`'bigint'\` — верни \`a + b\` (BigInt).
2. Если оба аргумента типа \`'number'\` — верни \`a + b\` (Number).
3. Иначе верни строку \`'TypeError'\`.
4. Не используй \`try/catch\`.
5. Экспортируй функцию \`safeAdd\`.

## Примеры

\`safeAdd(1n, 2n)\` → \`3n\`

\`safeAdd(1, 2)\` → \`3\`

\`safeAdd(1n, 2)\` → \`'TypeError'\`

\`safeAdd(1, 2n)\` → \`'TypeError'\``,
    starter: `export function safeAdd(a, b) {
  // Сравни typeof a и typeof b, реши что делать
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { safeAdd } from './index.js';

describe('safeAdd', () => {
  it('два BigInt складываются', () => {
    expect(safeAdd(1n, 2n)).toBe(3n);
  });

  it('два Number складываются', () => {
    expect(safeAdd(1, 2)).toBe(3);
  });

  it('BigInt + Number — TypeError', () => {
    expect(safeAdd(1n, 2)).toBe('TypeError');
  });

  it('Number + BigInt — TypeError', () => {
    expect(safeAdd(1, 2n)).toBe('TypeError');
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { safeAdd } from './index.js';

describe('safeAdd', () => {
  it('два BigInt складываются', () => {
    expect(safeAdd(1n, 2n)).toBe(3n);
  });

  it('два Number складываются', () => {
    expect(safeAdd(1, 2)).toBe(3);
  });

  it('BigInt + Number — TypeError', () => {
    expect(safeAdd(1n, 2)).toBe('TypeError');
  });

  it('Number + BigInt — TypeError', () => {
    expect(safeAdd(1, 2n)).toBe('TypeError');
  });

  it('большие BigInt тоже', () => {
    expect(safeAdd(10n ** 20n, 1n)).toBe(10n ** 20n + 1n);
  });

  it('отрицательные BigInt', () => {
    expect(safeAdd(-5n, 3n)).toBe(-2n);
  });

  it('Number + строка тоже не складываем', () => {
    expect(safeAdd(1, '2')).toBe('TypeError');
  });

  it('BigInt + строка — TypeError', () => {
    expect(safeAdd(1n, '2')).toBe('TypeError');
  });

  it('тип результата для BigInt — bigint', () => {
    expect(typeof safeAdd(1n, 1n)).toBe('bigint');
  });

  it('тип результата для Number — number', () => {
    expect(typeof safeAdd(1, 1)).toBe('number');
  });
});
`,
    rank: 2,
    tags: ["bigint", "type-check", "mixing"],
  }),
  createDataTypeChallenge({
    id: "data-types-bigint-divide",
    title: "Деление BigInt округляет вниз",
    description: `BigInt — целые числа без дробной части. Деление \`/\` отрезает остаток (truncation к нулю), как \`Math.trunc\`:

\`\`\`js
7n / 2n   // 3n  — НЕ 3.5n, дробной части нет
-7n / 2n  // -3n — отрезаем к нулю, не к -∞
1n / 3n   // 0n  — целая часть
\`\`\`

Если нужны и частное, и остаток — есть \`%\`:

\`\`\`js
7n % 2n   // 1n  — остаток
\`\`\`

**Что написать.** Функцию \`divmod(a, b)\` — принимает два BigInt, возвращает массив \`[quotient, remainder]\`. Оба элемента — BigInt. Если \`b === 0n\` — верни строку \`'ZeroDivision'\`.

## Требования

1. \`a\` и \`b\` — BigInt.
2. Верни \`[a / b, a % b]\` — оба BigInt.
3. Если \`b === 0n\` — верни строку \`'ZeroDivision'\` (без \`try/catch\`, проверяй до деления).
4. Экспортируй функцию \`divmod\`.

## Примеры

\`divmod(7n, 2n)\` → \`[3n, 1n]\`

\`divmod(10n, 5n)\` → \`[2n, 0n]\`

\`divmod(-7n, 2n)\` → \`[-3n, -1n]\`

\`divmod(5n, 0n)\` → \`'ZeroDivision'\``,
    starter: `export function divmod(a, b) {
  // Проверь b === 0n до деления, иначе [a/b, a%b]
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { divmod } from './index.js';

describe('divmod', () => {
  it('обычное деление с остатком', () => {
    expect(divmod(7n, 2n)).toEqual([3n, 1n]);
  });

  it('деление без остатка', () => {
    expect(divmod(10n, 5n)).toEqual([2n, 0n]);
  });

  it('отрицательное делимое', () => {
    expect(divmod(-7n, 2n)).toEqual([-3n, -1n]);
  });

  it('деление на ноль', () => {
    expect(divmod(5n, 0n)).toBe('ZeroDivision');
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { divmod } from './index.js';

describe('divmod', () => {
  it('обычное деление с остатком', () => {
    expect(divmod(7n, 2n)).toEqual([3n, 1n]);
  });

  it('деление без остатка', () => {
    expect(divmod(10n, 5n)).toEqual([2n, 0n]);
  });

  it('отрицательное делимое', () => {
    expect(divmod(-7n, 2n)).toEqual([-3n, -1n]);
  });

  it('деление на ноль', () => {
    expect(divmod(5n, 0n)).toBe('ZeroDivision');
  });

  it('ноль делим на что угодно', () => {
    expect(divmod(0n, 5n)).toEqual([0n, 0n]);
  });

  it('делимое меньше делителя', () => {
    expect(divmod(1n, 3n)).toEqual([1n, 1n]);
  });

  it('оба отрицательных', () => {
    expect(divmod(-7n, -2n)).toEqual([3n, -1n]);
  });

  it('очень большие BigInt', () => {
    expect(divmod(10n ** 20n, 3n)[0]).toBe((10n ** 20n) / 3n);
  });

  it('оба элемента — bigint', () => {
    const [q, r] = divmod(7n, 2n);
    expect(typeof q).toBe('bigint');
    expect(typeof r).toBe('bigint');
  });
});
`,
    rank: 2,
    tags: ["bigint", "division", "truncate"],
  }),
  createDataTypeChallenge({
    id: "data-types-bigint-stringify",
    title: "BigInt и JSON",
    description: `\`JSON.stringify\` падает на BigInt — бросает TypeError. JSON-формат не знает про целые произвольной длины.

\`\`\`js
JSON.stringify({ id: 1n })  // TypeError: Do not know how to serialize a BigInt
\`\`\`

Решение — replacer-функция: второй аргумент \`stringify\`. Она получает каждое значение и может его подменить.

\`\`\`js
JSON.stringify({ id: 1n }, (key, val) =>
  typeof val === 'bigint' ? String(val) : val
);
// '{"id":"1"}'
\`\`\`

**Что написать.** Функцию \`stringifyWithBigInt(obj)\` — возвращает строку JSON, в которой все BigInt-значения превращены в строку (без суффикса \`n\`). Объекты могут быть вложены.

## Требования

1. Используй \`JSON.stringify\` с replacer-функцией.
2. BigInt → строка с цифрами без суффикса \`n\`.
3. Остальные значения — без изменений.
4. Поддержи вложенные структуры.
5. Экспортируй функцию \`stringifyWithBigInt\`.

## Примеры

\`stringifyWithBigInt({ id: 1n })\` → \`'{"id":"1"}'\`

\`stringifyWithBigInt({ a: 1, b: 2n })\` → \`'{"a":1,"b":"2"}'\`

\`stringifyWithBigInt([1n, 2n])\` → \`'["1","2"]'\``,
    starter: `export function stringifyWithBigInt(obj) {
  // JSON.stringify с replacer, который заменит bigint на строку
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { stringifyWithBigInt } from './index.js';

describe('stringifyWithBigInt', () => {
  it('одно поле BigInt', () => {
    expect(stringifyWithBigInt({ id: 1n })).toBe('{"id":"1"}');
  });

  it('смешанные типы', () => {
    expect(stringifyWithBigInt({ a: 1, b: 2n })).toBe('{"a":1,"b":"2"}');
  });

  it('массив BigInt', () => {
    expect(stringifyWithBigInt([1n, 2n])).toBe('["1","2"]');
  });

  it('обычный объект без BigInt', () => {
    expect(stringifyWithBigInt({ a: 1, b: 'x' })).toBe('{"a":1,"b":"x"}');
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { stringifyWithBigInt } from './index.js';

describe('stringifyWithBigInt', () => {
  it('одно поле BigInt', () => {
    expect(stringifyWithBigInt({ id: 1n })).toBe('{"id":"1"}');
  });

  it('смешанные типы', () => {
    expect(stringifyWithBigInt({ a: 1, b: 2n })).toBe('{"a":1,"b":"2"}');
  });

  it('массив BigInt', () => {
    expect(stringifyWithBigInt([1n, 2n])).toBe('["1","2"]');
  });

  it('обычный объект без BigInt', () => {
    expect(stringifyWithBigInt({ a: 1, b: 'x' })).toBe('{"a":1,"b":"x"}');
  });

  it('вложенный BigInt', () => {
    expect(stringifyWithBigInt({ user: { id: 100n, name: 'A' } }))
      .toBe('{"user":{"id":"100","name":"A"}}');
  });

  it('очень большой BigInt сохраняет точность', () => {
    const big = 12345678901234567890n;
    expect(stringifyWithBigInt({ n: big })).toBe('{"n":"12345678901234567890"}');
  });

  it('отрицательный BigInt', () => {
    expect(stringifyWithBigInt({ n: -5n })).toBe('{"n":"-5"}');
  });

  it('null и undefined обрабатываются как обычно', () => {
    expect(stringifyWithBigInt({ a: null })).toBe('{"a":null}');
  });

  it('массив со смешанным содержимым', () => {
    expect(stringifyWithBigInt([1, 2n, 'x'])).toBe('[1,"2","x"]');
  });

  it('пустой объект', () => {
    expect(stringifyWithBigInt({})).toBe('{}');
  });
});
`,
    rank: 3,
    tags: ["bigint", "json", "replacer"],
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
    id: "data-types-to-number-rules",
    title: "Number(x) — таблица правил",
    description: `\`Number(x)\` приводит значение к числу по фиксированным правилам. Самые ловчие:

\`\`\`js
Number('')         // 0    — пустая строка → ноль (!)
Number('  ')       // 0    — пробелы тоже
Number('12')       // 12
Number('12abc')    // NaN  — мусор → NaN
Number(null)       // 0    — null → ноль (!)
Number(undefined)  // NaN  — undefined → NaN
Number(true)       // 1
Number(false)      // 0
Number([])         // 0    — пустой массив → ноль (!)
Number([42])       // 42   — массив с одним числом → это число
Number([1, 2])     // NaN  — массив с разной длиной → NaN
Number({})         // NaN
\`\`\`

**Главные ловушки.** \`Number('')\`, \`Number(null)\`, \`Number([])\` — все дают \`0\`. Кажется логичным «ничего → ноль», но в форме это значит, что пустое поле и поле \`'0'\` неотличимы.

**Что написать.** Функцию \`classifyToNumber(x)\` — возвращает строку:
- \`'zero'\` — если \`Number(x) === 0\`
- \`'nan'\` — если \`Number.isNaN(Number(x))\`
- \`'positive'\` — если \`Number(x) > 0\`
- \`'negative'\` — если \`Number(x) < 0\`

## Требования

1. Используй \`Number(x)\` и \`Number.isNaN\`.
2. Различай \`zero\` / \`nan\` / \`positive\` / \`negative\`.
3. Экспортируй функцию \`classifyToNumber\`.

## Примеры

\`classifyToNumber('')\` → \`'zero'\`

\`classifyToNumber(null)\` → \`'zero'\`

\`classifyToNumber(undefined)\` → \`'nan'\`

\`classifyToNumber('12')\` → \`'positive'\`

\`classifyToNumber('-3')\` → \`'negative'\`

\`classifyToNumber('abc')\` → \`'nan'\`

\`classifyToNumber([])\` → \`'zero'\``,
    starter: `export function classifyToNumber(x) {
  // Number(x), потом проверь NaN, ноль, знак
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { classifyToNumber } from './index.js';

describe('classifyToNumber', () => {
  it('пустая строка → zero', () => {
    expect(classifyToNumber('')).toBe('zero');
  });

  it('null → zero', () => {
    expect(classifyToNumber(null)).toBe('zero');
  });

  it('undefined → nan', () => {
    expect(classifyToNumber(undefined)).toBe('nan');
  });

  it('"12" → positive', () => {
    expect(classifyToNumber('12')).toBe('positive');
  });

  it('"-3" → negative', () => {
    expect(classifyToNumber('-3')).toBe('negative');
  });

  it('"abc" → nan', () => {
    expect(classifyToNumber('abc')).toBe('nan');
  });

  it('[] → zero', () => {
    expect(classifyToNumber([])).toBe('zero');
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { classifyToNumber } from './index.js';

describe('classifyToNumber', () => {
  it('пустая строка → zero', () => {
    expect(classifyToNumber('')).toBe('zero');
  });

  it('пробелы → zero', () => {
    expect(classifyToNumber('  ')).toBe('zero');
  });

  it('null → zero', () => {
    expect(classifyToNumber(null)).toBe('zero');
  });

  it('undefined → nan', () => {
    expect(classifyToNumber(undefined)).toBe('nan');
  });

  it('"12" → positive', () => {
    expect(classifyToNumber('12')).toBe('positive');
  });

  it('"-3" → negative', () => {
    expect(classifyToNumber('-3')).toBe('negative');
  });

  it('"abc" → nan', () => {
    expect(classifyToNumber('abc')).toBe('nan');
  });

  it('"12abc" → nan', () => {
    expect(classifyToNumber('12abc')).toBe('nan');
  });

  it('true → positive', () => {
    expect(classifyToNumber(true)).toBe('positive');
  });

  it('false → zero', () => {
    expect(classifyToNumber(false)).toBe('zero');
  });

  it('[] → zero', () => {
    expect(classifyToNumber([])).toBe('zero');
  });

  it('[42] → positive', () => {
    expect(classifyToNumber([42])).toBe('positive');
  });

  it('[1, 2] → nan', () => {
    expect(classifyToNumber([1, 2])).toBe('nan');
  });

  it('{} → nan', () => {
    expect(classifyToNumber({})).toBe('nan');
  });

  it('обычное число 0', () => {
    expect(classifyToNumber(0)).toBe('zero');
  });

  it('-0 тоже zero', () => {
    expect(classifyToNumber(-0)).toBe('zero');
  });

  it('Infinity → positive', () => {
    expect(classifyToNumber(Infinity)).toBe('positive');
  });
});
`,
    rank: 1,
    tags: ["coercion", "number", "rules"],
  }),
  createDataTypeChallenge({
    id: "data-types-plus-vs-minus",
    title: "Плюс vs минус со строкой",
    description: `Самая известная странность приведения. Бинарный \`+\` имеет особое правило: если хотя бы один операнд — строка, второй тоже становится строкой и идёт конкатенация.

\`\`\`js
'5' + 1   // '51'   — конкатенация!
'5' - 1   // 4      — минус не знает про строки, оба → число
'5' * '2' // 10     — звёздочка тоже всегда числовая
1 + '2' + 3 // '123' — слева направо: '1' + '2' = '12', потом '12' + 3 = '123'
+'5'      // 5      — унарный плюс — это ToNumber
\`\`\`

Идея проста: **только бинарный \`+\` особый**. Все остальные арифметические операции (\`-\`, \`*\`, \`/\`, \`%\`) всегда конвертируют в число.

**Что написать.** Функцию \`plusVsMinus(a, b)\` — возвращает массив \`[a + b, a - b]\`. Никаких ручных приведений — JS пусть делает сам.

## Требования

1. Просто верни \`[a + b, a - b]\`.
2. Не оборачивай в \`Number(...)\` или \`String(...)\`.
3. Экспортируй функцию \`plusVsMinus\`.

## Примеры

\`plusVsMinus('5', 1)\` → \`['51', 4]\`

\`plusVsMinus(2, 3)\` → \`[5, -1]\`

\`plusVsMinus('a', 'b')\` → \`['ab', NaN]\`

\`plusVsMinus(true, 1)\` → \`[2, 0]\``,
    starter: `export function plusVsMinus(a, b) {
  // [a + b, a - b]
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { plusVsMinus } from './index.js';

describe('plusVsMinus', () => {
  it('строка плюс число — конкатенация', () => {
    expect(plusVsMinus('5', 1)).toEqual(['51', 4]);
  });

  it('два числа', () => {
    expect(plusVsMinus(2, 3)).toEqual([5, -1]);
  });

  it('две строки — буквенный минус — NaN', () => {
    const [sum, diff] = plusVsMinus('a', 'b');
    expect(sum).toBe('ab');
    expect(Number.isNaN(diff)).toBe(true);
  });

  it('true ведёт себя как 1', () => {
    expect(plusVsMinus(true, 1)).toEqual([2, 0]);
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { plusVsMinus } from './index.js';

describe('plusVsMinus', () => {
  it('строка плюс число — конкатенация', () => {
    expect(plusVsMinus('5', 1)).toEqual(['51', 4]);
  });

  it('два числа', () => {
    expect(plusVsMinus(2, 3)).toEqual([5, -1]);
  });

  it('две строки — буквенный минус — NaN', () => {
    const [sum, diff] = plusVsMinus('a', 'b');
    expect(sum).toBe('ab');
    expect(Number.isNaN(diff)).toBe(true);
  });

  it('две числовые строки', () => {
    expect(plusVsMinus('5', '3')).toEqual(['53', 2]);
  });

  it('число плюс строка тоже конкатенирует', () => {
    expect(plusVsMinus(1, '2')).toEqual(['12', -1]);
  });

  it('true ведёт себя как 1', () => {
    expect(plusVsMinus(true, 1)).toEqual([2, 0]);
  });

  it('null + 5 → 5', () => {
    expect(plusVsMinus(null, 5)).toEqual([5, -5]);
  });

  it('пустая строка плюс число', () => {
    expect(plusVsMinus('', 5)).toEqual(['5', -5]);
  });

  it('массив + число даёт строку', () => {
    expect(plusVsMinus([1], 2)).toEqual(['12', -1]);
  });

  it('два массива', () => {
    const [sum, diff] = plusVsMinus([1], [2]);
    expect(sum).toBe('12');
    expect(diff).toBe(-1);
  });
});
`,
    rank: 2,
    tags: ["coercion", "operator", "plus-minus"],
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
    id: "data-types-loose-equality",
    title: "Когда == даёт true",
    description: `\`==\` (loose equality) проводит приведение типов перед сравнением. Правила фиксированные, но запутанные. Базовые кейсы:

\`\`\`js
1 == '1'        // true  — строка приводится к числу
0 == false      // true  — boolean → число
null == undefined // true  — единственная пара спец-значений
null == 0       // false — null НЕ приводится к 0 здесь (!)
'' == 0         // true  — пустая строка → 0
NaN == NaN      // false — NaN ни с чем не равно
[] == false     // true  — [] → '' → 0, false → 0
\`\`\`

**Хитрость с null/undefined.** В таблице \`==\` они равны только друг другу и самим себе. Сравнение с \`0\`, \`''\`, \`false\` — \`false\`.

**Что написать.** Функцию \`looseEqual(a, b)\` — повторяет поведение \`==\` для следующего набора типов: number, string, boolean, null, undefined. Не обязательно покрывать объекты/массивы. Не используй сам \`==\` — пиши через \`===\` и приведения.

## Требования

1. Если оба \`null\` — \`true\`. Если оба \`undefined\` — \`true\`. Если один \`null\` а другой \`undefined\` — \`true\`. Иначе если хоть один из них null/undefined — \`false\`.
2. Если \`typeof a === typeof b\` — верни \`a === b\`.
3. Если оба числа или строки или булевы (после приведения булевых к числу) — приведи обе к числу через \`Number()\` и сравни через \`===\`. Учти \`NaN\` (\`Number.isNaN\`) — \`NaN\` не равно ничему.
4. Не используй \`==\` или \`!=\`. Используй \`===\` и \`Number()\`.
5. Экспортируй функцию \`looseEqual\`.

## Примеры

\`looseEqual(1, '1')\` → \`true\`

\`looseEqual(0, false)\` → \`true\`

\`looseEqual(null, undefined)\` → \`true\`

\`looseEqual(null, 0)\` → \`false\`

\`looseEqual(NaN, NaN)\` → \`false\`

\`looseEqual('', 0)\` → \`true\``,
    starter: `export function looseEqual(a, b) {
  // Сначала null/undefined-кейсы, потом приведение к числу через Number()
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { looseEqual } from './index.js';

describe('looseEqual', () => {
  it('число и строка', () => {
    expect(looseEqual(1, '1')).toBe(true);
  });

  it('ноль и false', () => {
    expect(looseEqual(0, false)).toBe(true);
  });

  it('null и undefined', () => {
    expect(looseEqual(null, undefined)).toBe(true);
  });

  it('null и 0 — НЕ равны', () => {
    expect(looseEqual(null, 0)).toBe(false);
  });

  it('NaN не равен NaN', () => {
    expect(looseEqual(NaN, NaN)).toBe(false);
  });

  it('пустая строка и ноль', () => {
    expect(looseEqual('', 0)).toBe(true);
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { looseEqual } from './index.js';

describe('looseEqual', () => {
  it('число и строка', () => {
    expect(looseEqual(1, '1')).toBe(true);
  });

  it('ноль и false', () => {
    expect(looseEqual(0, false)).toBe(true);
  });

  it('null и undefined', () => {
    expect(looseEqual(null, undefined)).toBe(true);
  });

  it('undefined и null (обратный порядок)', () => {
    expect(looseEqual(undefined, null)).toBe(true);
  });

  it('null и 0 — НЕ равны', () => {
    expect(looseEqual(null, 0)).toBe(false);
  });

  it('null и пустая строка — НЕ равны', () => {
    expect(looseEqual(null, '')).toBe(false);
  });

  it('null и null', () => {
    expect(looseEqual(null, null)).toBe(true);
  });

  it('undefined и undefined', () => {
    expect(looseEqual(undefined, undefined)).toBe(true);
  });

  it('NaN не равен NaN', () => {
    expect(looseEqual(NaN, NaN)).toBe(false);
  });

  it('NaN не равен числу', () => {
    expect(looseEqual(NaN, 0)).toBe(false);
  });

  it('пустая строка и ноль', () => {
    expect(looseEqual('', 0)).toBe(true);
  });

  it('одна и та же строка', () => {
    expect(looseEqual('hello', 'hello')).toBe(true);
  });

  it('разные строки', () => {
    expect(looseEqual('a', 'b')).toBe(false);
  });

  it('true и 1', () => {
    expect(looseEqual(true, 1)).toBe(true);
  });

  it('true и "1"', () => {
    expect(looseEqual(true, '1')).toBe(true);
  });

  it('число и пробельная строка', () => {
    expect(looseEqual(0, '   ')).toBe(true);
  });
});
`,
    rank: 2,
    tags: ["coercion", "loose-equality", "comparison"],
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
  createDataTypeChallenge({
    id: "data-types-array-object-coercion",
    title: "Массивы и объекты в строки",
    description: `Когда массив или объект приводится к примитиву, JS сначала зовёт \`toString()\`. Для массива — это \`join(',')\`, для объекта — \`'[object Object]'\`.

\`\`\`js
String([])         // ''             — пустой join
String([1, 2])     // '1,2'          — join через запятую
String([[1,2],[3]]) // '1,2,3'       — рекурсивно
String({})         // '[object Object]'
String({a: 1})     // '[object Object]'  — содержимое не показывается!
\`\`\`

И самые ловкие комбинации с \`+\`:

\`\`\`js
[] + []      // ''             — '' + '' = ''
[] + {}      // '[object Object]'
{} + []      // 0 (!)          — { } трактуется как блок, потом +[] → 0
[1] + 1      // '11'           — '1' + 1 = '11'
[1] - 1      // 0              — '1' → 1, 1 - 1 = 0
\`\`\`

(Последний кейс с \`{} + []\` — особенность парсера в режиме выражения. Сложно. Не покрываем.)

**Что написать.** Функцию \`describeCoercion(x)\` — возвращает строку через \`String(x)\`. Используй встроенное приведение, не пиши руками \`'[object Object]'\`.

## Требования

1. \`String(x)\` — единственная допустимая операция приведения.
2. Поддержи примитивы, массивы, объекты, \`null\`, \`undefined\`.
3. Экспортируй функцию \`describeCoercion\`.

## Примеры

\`describeCoercion([])\` → \`''\`

\`describeCoercion([1, 2, 3])\` → \`'1,2,3'\`

\`describeCoercion({})\` → \`'[object Object]'\`

\`describeCoercion(null)\` → \`'null'\`

\`describeCoercion(undefined)\` → \`'undefined'\`

\`describeCoercion(42)\` → \`'42'\``,
    starter: `export function describeCoercion(x) {
  // Просто String(x)
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { describeCoercion } from './index.js';

describe('describeCoercion', () => {
  it('пустой массив', () => {
    expect(describeCoercion([])).toBe('');
  });

  it('массив чисел', () => {
    expect(describeCoercion([1, 2, 3])).toBe('1,2,3');
  });

  it('пустой объект', () => {
    expect(describeCoercion({})).toBe('[object Object]');
  });

  it('null', () => {
    expect(describeCoercion(null)).toBe('null');
  });

  it('undefined', () => {
    expect(describeCoercion(undefined)).toBe('undefined');
  });

  it('число', () => {
    expect(describeCoercion(42)).toBe('42');
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { describeCoercion } from './index.js';

describe('describeCoercion', () => {
  it('пустой массив', () => {
    expect(describeCoercion([])).toBe('');
  });

  it('массив чисел', () => {
    expect(describeCoercion([1, 2, 3])).toBe('1,2,3');
  });

  it('пустой объект', () => {
    expect(describeCoercion({})).toBe('[object Object]');
  });

  it('объект с полями всё равно даёт [object Object]', () => {
    expect(describeCoercion({ a: 1, b: 2 })).toBe('[object Object]');
  });

  it('null', () => {
    expect(describeCoercion(null)).toBe('null');
  });

  it('undefined', () => {
    expect(describeCoercion(undefined)).toBe('undefined');
  });

  it('число', () => {
    expect(describeCoercion(42)).toBe('42');
  });

  it('boolean', () => {
    expect(describeCoercion(true)).toBe('true');
    expect(describeCoercion(false)).toBe('false');
  });

  it('массив с одним элементом', () => {
    expect(describeCoercion([42])).toBe('42');
  });

  it('вложенный массив', () => {
    expect(describeCoercion([[1, 2], [3]])).toBe('1,2,3');
  });

  it('NaN превращается в "NaN"', () => {
    expect(describeCoercion(NaN)).toBe('NaN');
  });

  it('строка остаётся строкой', () => {
    expect(describeCoercion('hello')).toBe('hello');
  });
});
`,
    rank: 3,
    tags: ["coercion", "string", "object"],
  }),
];
