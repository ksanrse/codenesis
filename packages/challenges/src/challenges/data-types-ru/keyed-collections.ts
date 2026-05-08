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

export const mapSetChallenges: ChallengeDefinition[] = [
  createDataTypeChallenge({
    id: "data-types-tally-occurrences",
    title: "Подсчёт через Map",
    description: `Тебе пришёл массив имён. Хочется узнать, сколько раз встречается каждое. Первая мысль — обычный объект: \`counts[name] = (counts[name] || 0) + 1\`. Работает, пока ключи — строки.

**Ловушка.** В объекте все ключи становятся строками. Если завтра в массив попадут числа или, не дай бог, объекты — \`{}\` ты не отличишь от \`'[object Object]'\`. Map в этом плане честнее: ключом может быть что угодно, и он не превращает их насильно.

**Что написать.** Функцию \`tally(items)\`, которая принимает массив и возвращает \`Map\`, где каждому элементу соответствует количество его повторений в массиве.

## Требования

1. Верни объект класса \`Map\`.
2. Каждый уникальный элемент массива становится ключом.
3. Значение по ключу — сколько раз элемент встретился.
4. Для пустого массива верни пустой \`Map\`.
5. Экспортируй функцию \`tally\`.

## Примеры

\`tally(['a', 'b', 'a'])\` → \`Map { 'a' => 2, 'b' => 1 }\`

\`tally([1, 1, 1])\` → \`Map { 1 => 3 }\`

\`tally([])\` → \`Map {}\``,
    starter: `export function tally(items) {
  // Верни Map, где ключ — элемент, значение — количество
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { tally } from './index.js';

describe('tally', () => {
  it('counts repeated strings', () => {
    const result = tally(['a', 'b', 'a']);
    expect(result).toBeInstanceOf(Map);
    expect(result.size).toBe(2);
    expect(result.get('a')).toBe(2);
    expect(result.get('b')).toBe(1);
  });

  it('returns empty Map for empty array', () => {
    const result = tally([]);
    expect(result).toBeInstanceOf(Map);
    expect(result.size).toBe(0);
  });

  it('counts numbers without coercing to strings', () => {
    const result = tally([1, 1, 2]);
    expect(result.get(1)).toBe(2);
    expect(result.get(2)).toBe(1);
    expect(result.get('1')).toBeUndefined();
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { tally } from './index.js';

describe('tally', () => {
  it('counts repeated strings', () => {
    const result = tally(['a', 'b', 'a']);
    expect(result).toBeInstanceOf(Map);
    expect(result.size).toBe(2);
    expect(result.get('a')).toBe(2);
    expect(result.get('b')).toBe(1);
  });

  it('returns empty Map for empty array', () => {
    const result = tally([]);
    expect(result).toBeInstanceOf(Map);
    expect(result.size).toBe(0);
  });

  it('counts numbers without coercing to strings', () => {
    const result = tally([1, 1, 2]);
    expect(result.get(1)).toBe(2);
    expect(result.get(2)).toBe(1);
    expect(result.get('1')).toBeUndefined();
  });

  it('handles objects as distinct keys', () => {
    const a = { id: 1 };
    const b = { id: 2 };
    const result = tally([a, b, a, a]);
    expect(result.get(a)).toBe(3);
    expect(result.get(b)).toBe(1);
  });

  it('preserves first-seen insertion order', () => {
    const result = tally(['b', 'a', 'b', 'a', 'c']);
    expect([...result.keys()]).toEqual(['b', 'a', 'c']);
  });
});
`,
    rank: 1,
    tags: ["map", "set"],
  }),
  createDataTypeChallenge({
    id: "data-types-dedup-set",
    title: "Удаление дублей через Set",
    description: `Лента событий, список тегов, импорт пользователей — везде хочется убрать повторы. Можно через \`indexOf\`, можно через \`filter\`, но всё это \`O(n²)\`.

**Идея.** \`Set\` сам по себе хранит только уникальные значения. Закидываешь массив — повторы отваливаются. Главное не забыть, что \`Set\` это не массив, и ответ нужно собрать обратно — например через \`[...set]\` или \`Array.from\`.

**Что написать.** Функцию \`dedup(items)\`, которая возвращает НОВЫЙ массив без дублей. Порядок — как при первом появлении элемента.

## Требования

1. Верни новый массив, не трогай исходный.
2. Внутри используй \`Set\`.
3. Сохраняй порядок первого появления.
4. Для пустого массива верни \`[]\`.
5. Экспортируй функцию \`dedup\`.

## Примеры

\`dedup([1, 2, 1, 3, 2])\` → \`[1, 2, 3]\`

\`dedup(['a', 'b', 'a'])\` → \`['a', 'b']\`

\`dedup([])\` → \`[]\``,
    starter: `export function dedup(items) {
  // Верни новый массив без дублей через Set
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { dedup } from './index.js';

describe('dedup', () => {
  it('removes duplicates from numbers', () => {
    expect(dedup([1, 2, 1, 3, 2])).toEqual([1, 2, 3]);
  });

  it('preserves first-seen order for strings', () => {
    expect(dedup(['b', 'a', 'b', 'c', 'a'])).toEqual(['b', 'a', 'c']);
  });

  it('returns empty array for empty input', () => {
    expect(dedup([])).toEqual([]);
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { dedup } from './index.js';

describe('dedup', () => {
  it('removes duplicates from numbers', () => {
    expect(dedup([1, 2, 1, 3, 2])).toEqual([1, 2, 3]);
  });

  it('preserves first-seen order for strings', () => {
    expect(dedup(['b', 'a', 'b', 'c', 'a'])).toEqual(['b', 'a', 'c']);
  });

  it('returns empty array for empty input', () => {
    expect(dedup([])).toEqual([]);
  });

  it('does not mutate the input array', () => {
    const input = [1, 1, 2];
    dedup(input);
    expect(input).toEqual([1, 1, 2]);
  });

  it('returns a new array reference', () => {
    const input = [1, 2, 3];
    expect(dedup(input)).not.toBe(input);
  });

  it('treats objects by reference identity', () => {
    const a = { id: 1 };
    const b = { id: 1 };
    expect(dedup([a, b, a])).toEqual([a, b]);
  });
});
`,
    rank: 1,
    tags: ["set"],
  }),
  createDataTypeChallenge({
    id: "data-types-merge-maps",
    title: "Слияние нескольких Map",
    description: `Несколько источников настроек: дефолты, конфиг приложения, флаги юзера. Каждый — отдельный \`Map\`. Хочется один итоговый, где более поздние источники перекрывают ранние.

**Тонкость.** Важна не только последняя запись, но и место ключа. Если ключ \`'theme'\` появился впервые в дефолтах, а потом был переписан пользователем — он остаётся на своей "ранней" позиции, а значение берётся новое. Это поведение Map'а: вставка существующего ключа меняет значение, не двигает позицию.

**Что написать.** Функцию \`mergeMaps(...maps)\`, которая принимает любое количество \`Map\` и возвращает один итоговый. Поздние записи перекрывают ранние; позиция ключа — по первому появлению.

## Требования

1. Принимай любое количество \`Map\` через rest-параметр.
2. Верни новый \`Map\`, не мутируй входные.
3. При совпадении ключей побеждает значение из более позднего \`Map\`.
4. Позиция ключа — по первому его появлению среди всех \`Map\`.
5. Экспортируй функцию \`mergeMaps\`.

## Примеры

\`mergeMaps(new Map([['a', 1]]), new Map([['a', 2], ['b', 3]]))\` → \`Map { 'a' => 2, 'b' => 3 }\`

\`mergeMaps()\` → \`Map {}\``,
    starter: `export function mergeMaps(...maps) {
  // Объедини несколько Map, поздние записи побеждают
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { mergeMaps } from './index.js';

describe('mergeMaps', () => {
  it('merges two maps with later values winning', () => {
    const a = new Map([['x', 1], ['y', 2]]);
    const b = new Map([['y', 20], ['z', 30]]);
    const result = mergeMaps(a, b);
    expect(result.get('x')).toBe(1);
    expect(result.get('y')).toBe(20);
    expect(result.get('z')).toBe(30);
  });

  it('returns empty Map when called with no arguments', () => {
    const result = mergeMaps();
    expect(result).toBeInstanceOf(Map);
    expect(result.size).toBe(0);
  });

  it('does not mutate input maps', () => {
    const a = new Map([['x', 1]]);
    const b = new Map([['x', 2]]);
    mergeMaps(a, b);
    expect(a.get('x')).toBe(1);
    expect(b.get('x')).toBe(2);
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { mergeMaps } from './index.js';

describe('mergeMaps', () => {
  it('merges two maps with later values winning', () => {
    const a = new Map([['x', 1], ['y', 2]]);
    const b = new Map([['y', 20], ['z', 30]]);
    const result = mergeMaps(a, b);
    expect(result.get('x')).toBe(1);
    expect(result.get('y')).toBe(20);
    expect(result.get('z')).toBe(30);
  });

  it('returns empty Map when called with no arguments', () => {
    const result = mergeMaps();
    expect(result).toBeInstanceOf(Map);
    expect(result.size).toBe(0);
  });

  it('does not mutate input maps', () => {
    const a = new Map([['x', 1]]);
    const b = new Map([['x', 2]]);
    mergeMaps(a, b);
    expect(a.get('x')).toBe(1);
    expect(b.get('x')).toBe(2);
  });

  it('preserves first-seen position for repeated keys', () => {
    const a = new Map([['a', 1], ['b', 2]]);
    const b = new Map([['c', 3], ['a', 99]]);
    const result = mergeMaps(a, b);
    expect([...result.keys()]).toEqual(['a', 'b', 'c']);
    expect(result.get('a')).toBe(99);
  });

  it('handles three or more maps left-to-right', () => {
    const a = new Map([['k', 1]]);
    const b = new Map([['k', 2]]);
    const c = new Map([['k', 3]]);
    expect(mergeMaps(a, b, c).get('k')).toBe(3);
  });
});
`,
    rank: 2,
    tags: ["map"],
  }),
  createDataTypeChallenge({
    id: "data-types-intersect-sets",
    title: "Пересечение двух Set",
    description: `Два множества тегов: интересы пользователя и теги статьи. Нужно понять, что у них общего — это и будет "релевантность".

**Что не работает.** Если делать \`a.filter(x => b.includes(x))\`, то на каждом шаге \`includes\` пробегает массив целиком — \`O(n*m)\`. На \`Set\` есть \`has\`, и он \`O(1)\`. Перебираешь меньший \`Set\`, спрашиваешь у большего — \`есть такой?\`.

**Что написать.** Функцию \`intersect(a, b)\`, которая возвращает НОВЫЙ \`Set\` с элементами, присутствующими и в \`a\`, и в \`b\`.

## Требования

1. Аргументы — два \`Set\`.
2. Верни новый \`Set\`, не мутируй входные.
3. В результате — только элементы, присутствующие в обоих.
4. Если хотя бы один \`Set\` пуст — результат пустой.
5. Экспортируй функцию \`intersect\`.

## Примеры

\`intersect(new Set([1, 2, 3]), new Set([2, 3, 4]))\` → \`Set { 2, 3 }\`

\`intersect(new Set(['a']), new Set(['b']))\` → \`Set {}\``,
    starter: `export function intersect(a, b) {
  // Верни новый Set с общими элементами
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { intersect } from './index.js';

describe('intersect', () => {
  it('finds common numbers', () => {
    const result = intersect(new Set([1, 2, 3]), new Set([2, 3, 4]));
    expect(result).toBeInstanceOf(Set);
    expect([...result].sort()).toEqual([2, 3]);
  });

  it('returns empty Set when there is no overlap', () => {
    const result = intersect(new Set(['a']), new Set(['b']));
    expect(result.size).toBe(0);
  });

  it('returns empty Set when one input is empty', () => {
    expect(intersect(new Set(), new Set([1])).size).toBe(0);
    expect(intersect(new Set([1]), new Set()).size).toBe(0);
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { intersect } from './index.js';

describe('intersect', () => {
  it('finds common numbers', () => {
    const result = intersect(new Set([1, 2, 3]), new Set([2, 3, 4]));
    expect(result).toBeInstanceOf(Set);
    expect([...result].sort()).toEqual([2, 3]);
  });

  it('returns empty Set when there is no overlap', () => {
    const result = intersect(new Set(['a']), new Set(['b']));
    expect(result.size).toBe(0);
  });

  it('returns empty Set when one input is empty', () => {
    expect(intersect(new Set(), new Set([1])).size).toBe(0);
    expect(intersect(new Set([1]), new Set()).size).toBe(0);
  });

  it('does not mutate the input sets', () => {
    const a = new Set([1, 2]);
    const b = new Set([2, 3]);
    intersect(a, b);
    expect([...a]).toEqual([1, 2]);
    expect([...b]).toEqual([2, 3]);
  });

  it('returns a new Set reference', () => {
    const a = new Set([1, 2]);
    const result = intersect(a, new Set([1, 2]));
    expect(result).not.toBe(a);
  });

  it('uses identity for object members', () => {
    const shared = { id: 1 };
    const a = new Set([shared, { id: 2 }]);
    const b = new Set([shared, { id: 3 }]);
    const result = intersect(a, b);
    expect(result.size).toBe(1);
    expect(result.has(shared)).toBe(true);
  });
});
`,
    rank: 2,
    tags: ["set"],
  }),
  createDataTypeChallenge({
    id: "data-types-bidirectional-map",
    title: "Двунаправленный Map",
    description: `Map хранит пары \`key → value\`. А что если нужно искать в обе стороны: и по ключу, и по значению?

\`\`\`js
const bm = createBidirectionalMap();
bm.set('one', 1);
bm.getByKey('one')   // 1
bm.getByValue(1)     // 'one'
\`\`\`

Идея: держать **два** Map внутри — прямой и обратный. Каждый \`set\` обновляет обе стороны. \`delete\` чистит обе.

**Что написать.** Функцию \`createBidirectionalMap()\` — возвращает объект с методами \`set(key, value)\`, \`getByKey(key)\`, \`getByValue(value)\`, \`delete(key)\`, \`size\`.

## Требования

1. Используй два Map внутри замыкания.
2. \`set(key, value)\` — пишет в обе стороны.
3. Если ключ уже был — старое значение должно удалиться из обратного Map.
4. Если значение уже было привязано к другому ключу — старая связь должна разорваться.
5. \`delete(key)\` чистит обе стороны, возвращает \`true\` если что-то удалили, \`false\` иначе.
6. \`size\` — количество пар (геттер или метод — на твой вкус).
7. Экспортируй функцию \`createBidirectionalMap\`.

## Примеры

\`\`\`js
const bm = createBidirectionalMap();
bm.set('one', 1);
bm.set('two', 2);
bm.getByKey('one')   // 1
bm.getByValue(2)     // 'two'
bm.delete('one');
bm.getByKey('one')   // undefined
bm.getByValue(1)     // undefined
\`\`\``,
    starter: `export function createBidirectionalMap() {
  // Два Map внутри замыкания, оба обновляются на set/delete
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { createBidirectionalMap } from './index.js';

describe('createBidirectionalMap', () => {
  it('базовый set и getByKey', () => {
    const bm = createBidirectionalMap();
    bm.set('one', 1);
    expect(bm.getByKey('one')).toBe(1);
  });

  it('getByValue', () => {
    const bm = createBidirectionalMap();
    bm.set('one', 1);
    expect(bm.getByValue(1)).toBe('one');
  });

  it('delete по ключу чистит обе стороны', () => {
    const bm = createBidirectionalMap();
    bm.set('one', 1);
    bm.delete('one');
    expect(bm.getByKey('one')).toBeUndefined();
    expect(bm.getByValue(1)).toBeUndefined();
  });

  it('size показывает количество пар', () => {
    const bm = createBidirectionalMap();
    bm.set('a', 1);
    bm.set('b', 2);
    const size = typeof bm.size === 'function' ? bm.size() : bm.size;
    expect(size).toBe(2);
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { createBidirectionalMap } from './index.js';

describe('createBidirectionalMap', () => {
  it('базовый set и getByKey', () => {
    const bm = createBidirectionalMap();
    bm.set('one', 1);
    expect(bm.getByKey('one')).toBe(1);
  });

  it('getByValue', () => {
    const bm = createBidirectionalMap();
    bm.set('one', 1);
    expect(bm.getByValue(1)).toBe('one');
  });

  it('перезапись ключа разрывает старую связь', () => {
    const bm = createBidirectionalMap();
    bm.set('a', 1);
    bm.set('a', 2);
    expect(bm.getByKey('a')).toBe(2);
    expect(bm.getByValue(1)).toBeUndefined();
    expect(bm.getByValue(2)).toBe('a');
  });

  it('перезапись значения разрывает старую связь по ключу', () => {
    const bm = createBidirectionalMap();
    bm.set('a', 1);
    bm.set('b', 1);
    expect(bm.getByKey('a')).toBeUndefined();
    expect(bm.getByKey('b')).toBe(1);
    expect(bm.getByValue(1)).toBe('b');
  });

  it('delete возвращает true для существующего ключа', () => {
    const bm = createBidirectionalMap();
    bm.set('a', 1);
    expect(bm.delete('a')).toBe(true);
  });

  it('delete возвращает false для несуществующего', () => {
    const bm = createBidirectionalMap();
    expect(bm.delete('a')).toBe(false);
  });

  it('size после операций корректен', () => {
    const bm = createBidirectionalMap();
    bm.set('a', 1);
    bm.set('b', 2);
    bm.delete('a');
    const size = typeof bm.size === 'function' ? bm.size() : bm.size;
    expect(size).toBe(1);
  });

  it('пустой объект — size 0', () => {
    const bm = createBidirectionalMap();
    const size = typeof bm.size === 'function' ? bm.size() : bm.size;
    expect(size).toBe(0);
  });

  it('независимые экземпляры', () => {
    const a = createBidirectionalMap();
    const b = createBidirectionalMap();
    a.set('x', 1);
    expect(b.getByKey('x')).toBeUndefined();
  });
});
`,
    rank: 3,
    tags: ["map", "bidirectional"],
  }),
  createDataTypeChallenge({
    id: "data-types-lru-cache",
    title: "LRU-кеш через Map",
    description: `LRU = Least Recently Used. Кеш фиксированного размера: при переполнении выкидываем тот ключ, который дольше всего не использовали. Map спасает: он **гарантированно сохраняет порядок вставки** и итерации.

Алгоритм:
- \`get(key)\`: если есть — удалить и вставить заново (теперь он самый свежий), вернуть значение. Если нет — \`undefined\`.
- \`set(key, val)\`: если есть — удалить. Вставить. Если \`map.size > capacity\` — удалить первый ключ из итератора (\`map.keys().next().value\`).

\`\`\`js
const lru = createLRU(2);
lru.set('a', 1); lru.set('b', 2);
lru.get('a');    // 1, теперь 'a' свежее 'b'
lru.set('c', 3); // переполнение → удаляется 'b'
lru.get('b');    // undefined
\`\`\`

**Что написать.** Функцию \`createLRU(capacity)\` — возвращает объект с \`get(key)\`, \`set(key, val)\`, \`size\`. Размер не должен превышать \`capacity\`.

## Требования

1. Используй один \`Map\` внутри замыкания — он сохраняет порядок.
2. \`get\` обновляет «свежесть» ключа.
3. \`set\` тоже обновляет «свежесть»; при переполнении выкидывает самый старый.
4. \`size\` возвращает текущее число пар.
5. \`capacity\` — положительное целое.
6. Экспортируй функцию \`createLRU\`.

## Примеры

\`\`\`js
const lru = createLRU(2);
lru.set('a', 1);
lru.set('b', 2);
lru.set('c', 3);
lru.get('a') // undefined — выкинут
lru.get('b') // 2
lru.get('c') // 3
\`\`\``,
    starter: `export function createLRU(capacity) {
  // Один Map в замыкании, get/set обновляют порядок, лишние выкидываются
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { createLRU } from './index.js';

describe('createLRU', () => {
  it('базовый set и get', () => {
    const lru = createLRU(2);
    lru.set('a', 1);
    expect(lru.get('a')).toBe(1);
  });

  it('переполнение выкидывает самый старый', () => {
    const lru = createLRU(2);
    lru.set('a', 1);
    lru.set('b', 2);
    lru.set('c', 3);
    expect(lru.get('a')).toBeUndefined();
  });

  it('get обновляет свежесть', () => {
    const lru = createLRU(2);
    lru.set('a', 1);
    lru.set('b', 2);
    lru.get('a');
    lru.set('c', 3);
    expect(lru.get('a')).toBe(1);
    expect(lru.get('b')).toBeUndefined();
  });

  it('size не превышает capacity', () => {
    const lru = createLRU(2);
    lru.set('a', 1);
    lru.set('b', 2);
    lru.set('c', 3);
    const size = typeof lru.size === 'function' ? lru.size() : lru.size;
    expect(size).toBe(2);
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { createLRU } from './index.js';

describe('createLRU', () => {
  it('базовый set и get', () => {
    const lru = createLRU(2);
    lru.set('a', 1);
    expect(lru.get('a')).toBe(1);
  });

  it('get несуществующего — undefined', () => {
    const lru = createLRU(2);
    expect(lru.get('x')).toBeUndefined();
  });

  it('переполнение выкидывает самый старый', () => {
    const lru = createLRU(2);
    lru.set('a', 1);
    lru.set('b', 2);
    lru.set('c', 3);
    expect(lru.get('a')).toBeUndefined();
    expect(lru.get('b')).toBe(2);
    expect(lru.get('c')).toBe(3);
  });

  it('get обновляет свежесть', () => {
    const lru = createLRU(2);
    lru.set('a', 1);
    lru.set('b', 2);
    lru.get('a');
    lru.set('c', 3);
    expect(lru.get('a')).toBe(1);
    expect(lru.get('b')).toBeUndefined();
  });

  it('повторный set обновляет свежесть и значение', () => {
    const lru = createLRU(2);
    lru.set('a', 1);
    lru.set('b', 2);
    lru.set('a', 99);
    lru.set('c', 3);
    expect(lru.get('a')).toBe(99);
    expect(lru.get('b')).toBeUndefined();
  });

  it('size не превышает capacity', () => {
    const lru = createLRU(2);
    lru.set('a', 1);
    lru.set('b', 2);
    lru.set('c', 3);
    const size = typeof lru.size === 'function' ? lru.size() : lru.size;
    expect(size).toBe(2);
  });

  it('capacity 1', () => {
    const lru = createLRU(1);
    lru.set('a', 1);
    lru.set('b', 2);
    expect(lru.get('a')).toBeUndefined();
    expect(lru.get('b')).toBe(2);
  });

  it('независимые экземпляры', () => {
    const a = createLRU(2);
    const b = createLRU(2);
    a.set('x', 1);
    expect(b.get('x')).toBeUndefined();
  });
});
`,
    rank: 4,
    tags: ["map", "lru", "cache"],
  }),
];

export const weakMapSetChallenges: ChallengeDefinition[] = [
  createDataTypeChallenge({
    id: "data-types-weak-ref-intro",
    title: "WeakMap не держит объект",
    description: `Обычный \`Map\` хранит ссылку на ключ-объект и не даёт ему уйти в garbage collection — даже если в твоей программе больше никто на этот объект не ссылается. \`WeakMap\` ведёт себя противоположно: ссылки на ключи у него **слабые**, не мешают сборке мусора.

Цена: ключи у \`WeakMap\` — только объекты (не строки/числа), и нельзя итерировать (\`size\` нет, \`for..of\` нет, \`keys()\` нет). У \`WeakMap\` есть только \`get/set/has/delete\`.

\`\`\`js
const m = new WeakMap();
let user = { name: 'Аня' };
m.set(user, 'admin');
m.get(user);    // 'admin'
m.has(user);    // true
m.delete(user); // true
m.has(user);    // false
\`\`\`

**Что написать.** Функцию \`weakStore()\` — возвращает объект с методами \`attach(obj, value)\`, \`read(obj)\`, \`detach(obj)\`. Внутри — один \`WeakMap\`.

## Требования

1. \`attach(obj, value)\` — связывает значение с объектом-ключом.
2. \`read(obj)\` — возвращает значение или \`undefined\`.
3. \`detach(obj)\` — удаляет, возвращает \`true\`/\`false\`.
4. Используй \`WeakMap\` внутри замыкания.
5. Экспортируй функцию \`weakStore\`.

## Примеры

\`\`\`js
const store = weakStore();
const obj = {};
store.attach(obj, 'data');
store.read(obj);   // 'data'
store.detach(obj);
store.read(obj);   // undefined
\`\`\``,
    starter: `export function weakStore() {
  // WeakMap внутри замыкания, attach/read/detach
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { weakStore } from './index.js';

describe('weakStore', () => {
  it('attach и read', () => {
    const store = weakStore();
    const obj = {};
    store.attach(obj, 'data');
    expect(store.read(obj)).toBe('data');
  });

  it('read несуществующего — undefined', () => {
    const store = weakStore();
    expect(store.read({})).toBeUndefined();
  });

  it('detach удаляет', () => {
    const store = weakStore();
    const obj = {};
    store.attach(obj, 'data');
    store.detach(obj);
    expect(store.read(obj)).toBeUndefined();
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { weakStore } from './index.js';

describe('weakStore', () => {
  it('attach и read', () => {
    const store = weakStore();
    const obj = {};
    store.attach(obj, 'data');
    expect(store.read(obj)).toBe('data');
  });

  it('read несуществующего — undefined', () => {
    const store = weakStore();
    expect(store.read({})).toBeUndefined();
  });

  it('detach возвращает true для существующего', () => {
    const store = weakStore();
    const obj = {};
    store.attach(obj, 'data');
    expect(store.detach(obj)).toBe(true);
  });

  it('detach возвращает false для несуществующего', () => {
    const store = weakStore();
    expect(store.detach({})).toBe(false);
  });

  it('detach очищает', () => {
    const store = weakStore();
    const obj = {};
    store.attach(obj, 'data');
    store.detach(obj);
    expect(store.read(obj)).toBeUndefined();
  });

  it('два разных объекта — разные значения', () => {
    const store = weakStore();
    const a = {}; const b = {};
    store.attach(a, 1);
    store.attach(b, 2);
    expect(store.read(a)).toBe(1);
    expect(store.read(b)).toBe(2);
  });

  it('перезапись значения', () => {
    const store = weakStore();
    const obj = {};
    store.attach(obj, 'old');
    store.attach(obj, 'new');
    expect(store.read(obj)).toBe('new');
  });

  it('независимые экземпляры', () => {
    const a = weakStore();
    const b = weakStore();
    const obj = {};
    a.attach(obj, 'A');
    expect(b.read(obj)).toBeUndefined();
  });
});
`,
    rank: 0,
    tags: ["weakmap", "intro"],
  }),
  createDataTypeChallenge({
    id: "data-types-weakmap-cache",
    title: "Кеш на WeakMap",
    description: `Хочется привязать дополнительные данные к объекту: статус загрузки к DOM-элементу, метаданные к запросу. Завести обычный \`Map\` — значит держать ключ-объект живым вечно, даже когда основная программа от него уже отказалась.

**Зачем WeakMap.** Ключи в \`WeakMap\` слабые: если на объект больше никто не ссылается, сборщик мусора его уберёт, и запись из \`WeakMap\` исчезнет сама. Идеально для кешей и приватных данных. Цена: ключом может быть только объект, и нельзя перебирать содержимое.

**Что написать.** Функцию \`createCache()\`, которая возвращает объект с методами \`get(key)\` и \`set(key, value)\`. Внутри — \`WeakMap\`.

## Требования

1. \`createCache()\` возвращает объект \`{ get, set }\`.
2. \`set(key, value)\` сохраняет значение по ключу-объекту.
3. \`get(key)\` возвращает сохранённое значение или \`undefined\`.
4. Каждый вызов \`createCache()\` создаёт независимое хранилище.
5. Экспортируй функцию \`createCache\`.

## Примеры

\`\`\`js
const cache = createCache();
const key = {};
cache.set(key, 'hi');
cache.get(key); // 'hi'
\`\`\``,
    starter: `export function createCache() {
  // Верни объект { get, set } на базе WeakMap
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { createCache } from './index.js';

describe('createCache', () => {
  it('stores and retrieves values by object key', () => {
    const cache = createCache();
    const key = { id: 1 };
    cache.set(key, 'hello');
    expect(cache.get(key)).toBe('hello');
  });

  it('returns undefined for unknown keys', () => {
    const cache = createCache();
    expect(cache.get({})).toBeUndefined();
  });

  it('keeps caches independent', () => {
    const a = createCache();
    const b = createCache();
    const key = {};
    a.set(key, 1);
    expect(b.get(key)).toBeUndefined();
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { createCache } from './index.js';

describe('createCache', () => {
  it('stores and retrieves values by object key', () => {
    const cache = createCache();
    const key = { id: 1 };
    cache.set(key, 'hello');
    expect(cache.get(key)).toBe('hello');
  });

  it('returns undefined for unknown keys', () => {
    const cache = createCache();
    expect(cache.get({})).toBeUndefined();
  });

  it('keeps caches independent', () => {
    const a = createCache();
    const b = createCache();
    const key = {};
    a.set(key, 1);
    expect(b.get(key)).toBeUndefined();
  });

  it('overwrites existing values', () => {
    const cache = createCache();
    const key = {};
    cache.set(key, 'first');
    cache.set(key, 'second');
    expect(cache.get(key)).toBe('second');
  });

  it('distinguishes different object keys with same shape', () => {
    const cache = createCache();
    const a = { id: 1 };
    const b = { id: 1 };
    cache.set(a, 'a-value');
    cache.set(b, 'b-value');
    expect(cache.get(a)).toBe('a-value');
    expect(cache.get(b)).toBe('b-value');
  });
});
`,
    rank: 2,
    tags: ["weakmap"],
  }),
  createDataTypeChallenge({
    id: "data-types-weakset-visited",
    title: "Трекер посещений на WeakSet",
    description: `Обходишь граф или дерево с возможными циклами. Чтобы не зациклиться, нужно помечать узлы как посещённые. Завести обычный \`Set\` — значит удерживать ссылки на все узлы, мешая сборщику мусора, даже когда от обхода ничего не осталось.

**Зачем WeakSet.** Хранит объекты слабо: как только узел становится недостижим из остальной программы, он автоматически исчезает и из \`WeakSet\`. У \`WeakSet\` есть только \`add\`, \`has\` и \`delete\` — ровно то, что нужно для маркера "был тут или нет".

**Что написать.** Функцию \`createVisitTracker()\`, возвращающую объект с методами \`visit(node)\` и \`wasVisited(node)\`.

## Требования

1. \`createVisitTracker()\` возвращает объект \`{ visit, wasVisited }\`.
2. \`visit(node)\` помечает объект как посещённый.
3. \`wasVisited(node)\` возвращает \`true\` или \`false\`.
4. Разные трекеры независимы.
5. Экспортируй функцию \`createVisitTracker\`.

## Примеры

\`\`\`js
const t = createVisitTracker();
const node = {};
t.wasVisited(node); // false
t.visit(node);
t.wasVisited(node); // true
\`\`\``,
    starter: `export function createVisitTracker() {
  // Верни объект { visit, wasVisited } на базе WeakSet
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { createVisitTracker } from './index.js';

describe('createVisitTracker', () => {
  it('reports unvisited nodes as false', () => {
    const tracker = createVisitTracker();
    expect(tracker.wasVisited({})).toBe(false);
  });

  it('marks a node as visited', () => {
    const tracker = createVisitTracker();
    const node = { id: 1 };
    tracker.visit(node);
    expect(tracker.wasVisited(node)).toBe(true);
  });

  it('keeps trackers independent', () => {
    const a = createVisitTracker();
    const b = createVisitTracker();
    const node = {};
    a.visit(node);
    expect(b.wasVisited(node)).toBe(false);
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { createVisitTracker } from './index.js';

describe('createVisitTracker', () => {
  it('reports unvisited nodes as false', () => {
    const tracker = createVisitTracker();
    expect(tracker.wasVisited({})).toBe(false);
  });

  it('marks a node as visited', () => {
    const tracker = createVisitTracker();
    const node = { id: 1 };
    tracker.visit(node);
    expect(tracker.wasVisited(node)).toBe(true);
  });

  it('keeps trackers independent', () => {
    const a = createVisitTracker();
    const b = createVisitTracker();
    const node = {};
    a.visit(node);
    expect(b.wasVisited(node)).toBe(false);
  });

  it('treats different objects with same shape as different', () => {
    const tracker = createVisitTracker();
    const a = { id: 1 };
    const b = { id: 1 };
    tracker.visit(a);
    expect(tracker.wasVisited(a)).toBe(true);
    expect(tracker.wasVisited(b)).toBe(false);
  });

  it('does not break when visiting same node twice', () => {
    const tracker = createVisitTracker();
    const node = {};
    tracker.visit(node);
    tracker.visit(node);
    expect(tracker.wasVisited(node)).toBe(true);
  });
});
`,
    rank: 2,
    tags: ["weakset"],
  }),
  createDataTypeChallenge({
    id: "data-types-weakmap-memoize",
    title: "Мемоизация по объекту",
    description: `Тяжёлая функция, которая принимает объект и считает по нему результат. Хочется не считать дважды для того же объекта. Обычный кеш на \`Map\` сработает, но будет держать объекты живыми, превращая утечку памяти в фичу.

**Тонкость с undefined.** Кеш проверяют через \`if (cache.get(key)) ...\` — и если функция законно вернула \`undefined\`, кеш на нём не сработает: \`undefined\` falsy, и мы посчитаем заново. Правильно — \`if (cache.has(key))\`. \`has\` отвечает на вопрос "есть запись?", а не "значение truthy?".

**Что написать.** Функцию \`memoizeByObject(fn)\`, которая возвращает новую функцию. Та принимает объект и возвращает кешированный результат вызова \`fn\` для этого объекта. \`undefined\` как результат тоже кешируется.

## Требования

1. \`memoizeByObject(fn)\` возвращает функцию \`memoized(obj)\`.
2. На повторный вызов с тем же объектом \`fn\` не вызывается.
3. \`undefined\` как результат тоже кешируется (используй \`has\`, не \`get\`).
4. Внутри — \`WeakMap\`.
5. Экспортируй функцию \`memoizeByObject\`.

## Примеры

\`\`\`js
let calls = 0;
const f = memoizeByObject(o => { calls++; return o.value; });
const o = { value: 7 };
f(o); // 7, calls = 1
f(o); // 7, calls = 1
\`\`\``,
    starter: `export function memoizeByObject(fn) {
  // Верни мемоизированную функцию на базе WeakMap
  // Учти: undefined тоже должен кешироваться
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { memoizeByObject } from './index.js';

describe('memoizeByObject', () => {
  it('caches result for the same object', () => {
    let calls = 0;
    const f = memoizeByObject((o) => {
      calls++;
      return o.value * 2;
    });
    const o = { value: 5 };
    expect(f(o)).toBe(10);
    expect(f(o)).toBe(10);
    expect(calls).toBe(1);
  });

  it('recomputes for different objects', () => {
    let calls = 0;
    const f = memoizeByObject((o) => {
      calls++;
      return o.value;
    });
    f({ value: 1 });
    f({ value: 2 });
    expect(calls).toBe(2);
  });

  it('caches undefined results too', () => {
    let calls = 0;
    const f = memoizeByObject(() => {
      calls++;
      return undefined;
    });
    const o = {};
    f(o);
    f(o);
    expect(calls).toBe(1);
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { memoizeByObject } from './index.js';

describe('memoizeByObject', () => {
  it('caches result for the same object', () => {
    let calls = 0;
    const f = memoizeByObject((o) => {
      calls++;
      return o.value * 2;
    });
    const o = { value: 5 };
    expect(f(o)).toBe(10);
    expect(f(o)).toBe(10);
    expect(calls).toBe(1);
  });

  it('recomputes for different objects', () => {
    let calls = 0;
    const f = memoizeByObject((o) => {
      calls++;
      return o.value;
    });
    f({ value: 1 });
    f({ value: 2 });
    expect(calls).toBe(2);
  });

  it('caches undefined results too', () => {
    let calls = 0;
    const f = memoizeByObject(() => {
      calls++;
      return undefined;
    });
    const o = {};
    f(o);
    f(o);
    expect(calls).toBe(1);
  });

  it('caches falsy values without recomputing', () => {
    let calls = 0;
    const f = memoizeByObject(() => {
      calls++;
      return 0;
    });
    const o = {};
    expect(f(o)).toBe(0);
    expect(f(o)).toBe(0);
    expect(calls).toBe(1);
  });

  it('returns the underlying value on first call', () => {
    const f = memoizeByObject((o) => o.label);
    expect(f({ label: 'hi' })).toBe('hi');
  });

  it('different memoized functions do not share cache', () => {
    let aCalls = 0;
    let bCalls = 0;
    const fa = memoizeByObject(() => {
      aCalls++;
      return 'a';
    });
    const fb = memoizeByObject(() => {
      bCalls++;
      return 'b';
    });
    const o = {};
    fa(o);
    fb(o);
    expect(aCalls).toBe(1);
    expect(bCalls).toBe(1);
  });
});
`,
    rank: 3,
    tags: ["weakmap", "memoize"],
  }),
];

export const keysValuesEntriesChallenges: ChallengeDefinition[] = [
  createDataTypeChallenge({
    id: "data-types-invert-object",
    title: "Инверсия объекта",
    description: `Есть словарь \`{ ru: 'Russian', en: 'English' }\`. Нужно ровно наоборот — по имени языка получить код. Руками переписывать — скучно и легко ошибиться.

**Идея.** Объект — это набор пар \`[ключ, значение]\`. \`Object.entries(obj)\` достаёт эти пары массивом. Меняешь местами — получаешь пары \`[значение, ключ]\`. Собираешь обратно через \`Object.fromEntries\`.

**Что написать.** Функцию \`invertObject(obj)\`, которая возвращает новый объект, где ключи и значения поменяны местами.

## Требования

1. Используй \`Object.entries\` и \`Object.fromEntries\`.
2. Верни новый объект, исходный не трогай.
3. Для пустого объекта верни \`{}\`.
4. Значения исходного объекта станут ключами — поэтому они приведутся к строкам, это нормально.
5. Экспортируй функцию \`invertObject\`.

## Примеры

\`invertObject({ a: 1, b: 2 })\` → \`{ '1': 'a', '2': 'b' }\`

\`invertObject({ ru: 'Russian' })\` → \`{ Russian: 'ru' }\`

\`invertObject({})\` → \`{}\``,
    starter: `export function invertObject(obj) {
  // Верни объект, где ключи и значения поменяны местами
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { invertObject } from './index.js';

describe('invertObject', () => {
  it('swaps keys and values', () => {
    expect(invertObject({ a: 1, b: 2 })).toEqual({ '1': 'a', '2': 'b' });
  });

  it('handles string values', () => {
    expect(invertObject({ ru: 'Russian', en: 'English' })).toEqual({
      Russian: 'ru',
      English: 'en',
    });
  });

  it('returns empty object for empty input', () => {
    expect(invertObject({})).toEqual({});
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { invertObject } from './index.js';

describe('invertObject', () => {
  it('swaps keys and values', () => {
    expect(invertObject({ a: 1, b: 2 })).toEqual({ '1': 'a', '2': 'b' });
  });

  it('handles string values', () => {
    expect(invertObject({ ru: 'Russian', en: 'English' })).toEqual({
      Russian: 'ru',
      English: 'en',
    });
  });

  it('returns empty object for empty input', () => {
    expect(invertObject({})).toEqual({});
  });

  it('does not mutate the input', () => {
    const input = { a: 1 };
    invertObject(input);
    expect(input).toEqual({ a: 1 });
  });

  it('returns a new object reference', () => {
    const input = { a: 1 };
    expect(invertObject(input)).not.toBe(input);
  });
});
`,
    rank: 1,
    tags: ["entries", "object"],
  }),
  createDataTypeChallenge({
    id: "data-types-pick-fields",
    title: "Выборка полей",
    description: `Объект пользователя со всеми потрохами. Наружу нужно отдать только \`id\`, \`name\` и \`email\`. Вручную перечислять каждый раз — ошибка ждёт.

**Тонкость.** Если запрашиваемого поля в объекте нет — не клади его в результат вообще. \`{ x: undefined }\` и \`{}\` — не одно и то же при сериализации, проверках через \`in\` и сравнении ключей.

**Что написать.** Функцию \`pickFields(obj, keys)\`, которая возвращает новый объект только с теми ключами из \`keys\`, которые реально есть в \`obj\`.

## Требования

1. Используй \`Object.entries\` или \`for..in\` — на твой вкус.
2. Верни новый объект, исходный не трогай.
3. Если ключа нет в исходном объекте — пропусти его (не записывай \`undefined\`).
4. Порядок ключей в результате — как в массиве \`keys\`.
5. Экспортируй функцию \`pickFields\`.

## Примеры

\`pickFields({ a: 1, b: 2, c: 3 }, ['a', 'c'])\` → \`{ a: 1, c: 3 }\`

\`pickFields({ a: 1 }, ['b'])\` → \`{}\`

\`pickFields({ a: 1, b: 2 }, [])\` → \`{}\``,
    starter: `export function pickFields(obj, keys) {
  // Верни новый объект только с указанными ключами
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { pickFields } from './index.js';

describe('pickFields', () => {
  it('keeps only listed keys', () => {
    expect(pickFields({ a: 1, b: 2, c: 3 }, ['a', 'c'])).toEqual({ a: 1, c: 3 });
  });

  it('skips missing keys', () => {
    const result = pickFields({ a: 1 }, ['b']);
    expect(result).toEqual({});
    expect('b' in result).toBe(false);
  });

  it('returns empty object for empty key list', () => {
    expect(pickFields({ a: 1, b: 2 }, [])).toEqual({});
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { pickFields } from './index.js';

describe('pickFields', () => {
  it('keeps only listed keys', () => {
    expect(pickFields({ a: 1, b: 2, c: 3 }, ['a', 'c'])).toEqual({ a: 1, c: 3 });
  });

  it('skips missing keys', () => {
    const result = pickFields({ a: 1 }, ['b']);
    expect(result).toEqual({});
    expect('b' in result).toBe(false);
  });

  it('returns empty object for empty key list', () => {
    expect(pickFields({ a: 1, b: 2 }, [])).toEqual({});
  });

  it('does not mutate the input object', () => {
    const input = { a: 1, b: 2 };
    pickFields(input, ['a']);
    expect(input).toEqual({ a: 1, b: 2 });
  });

  it('preserves falsy values that exist on the object', () => {
    expect(pickFields({ a: 0, b: '', c: false }, ['a', 'b', 'c'])).toEqual({
      a: 0,
      b: '',
      c: false,
    });
  });

  it('does not include keys that are explicitly undefined when missing', () => {
    const result = pickFields({}, ['x']);
    expect(Object.keys(result)).toEqual([]);
  });
});
`,
    rank: 2,
    tags: ["entries", "object"],
  }),
  createDataTypeChallenge({
    id: "data-types-map-values",
    title: "Преобразование значений",
    description: `Объект цен \`{ apple: 50, bread: 80 }\`. Нужно прибавить НДС к каждому. Идти по ключам через \`for..in\`, копить результат — рабочее, но шумное.

**Идея.** \`Object.entries\` даёт пары, \`map\` преобразует значения, \`Object.fromEntries\` собирает обратно. Получается одна выразительная цепочка вместо цикла с \`{}\` и присваиваниями. Заодно функцию-преобразователь зовём с двумя аргументами — \`(value, key)\` — это часто пригождается.

**Что написать.** Функцию \`mapValues(obj, fn)\`, которая возвращает новый объект с теми же ключами, но значениями, пропущенными через \`fn(value, key)\`.

## Требования

1. Верни новый объект, исходный не мутируй.
2. Ключи — те же и в том же порядке.
3. Каждое значение — результат \`fn(value, key)\`.
4. Для пустого объекта верни \`{}\`.
5. Экспортируй функцию \`mapValues\`.

## Примеры

\`mapValues({ a: 1, b: 2 }, v => v * 10)\` → \`{ a: 10, b: 20 }\`

\`mapValues({ x: 'a' }, (v, k) => k + v)\` → \`{ x: 'xa' }\`

\`mapValues({}, v => v)\` → \`{}\``,
    starter: `export function mapValues(obj, fn) {
  // Верни новый объект с теми же ключами и преобразованными значениями
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { mapValues } from './index.js';

describe('mapValues', () => {
  it('transforms each value', () => {
    expect(mapValues({ a: 1, b: 2 }, (v) => v * 10)).toEqual({ a: 10, b: 20 });
  });

  it('passes value and key to the callback', () => {
    expect(mapValues({ x: 'a', y: 'b' }, (v, k) => k + v)).toEqual({
      x: 'xa',
      y: 'yb',
    });
  });

  it('returns empty object for empty input', () => {
    expect(mapValues({}, (v) => v)).toEqual({});
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { mapValues } from './index.js';

describe('mapValues', () => {
  it('transforms each value', () => {
    expect(mapValues({ a: 1, b: 2 }, (v) => v * 10)).toEqual({ a: 10, b: 20 });
  });

  it('passes value and key to the callback', () => {
    expect(mapValues({ x: 'a', y: 'b' }, (v, k) => k + v)).toEqual({
      x: 'xa',
      y: 'yb',
    });
  });

  it('returns empty object for empty input', () => {
    expect(mapValues({}, (v) => v)).toEqual({});
  });

  it('preserves key order', () => {
    const result = mapValues({ first: 1, second: 2, third: 3 }, (v) => v);
    expect(Object.keys(result)).toEqual(['first', 'second', 'third']);
  });

  it('does not mutate the input', () => {
    const input = { a: 1, b: 2 };
    mapValues(input, (v) => v + 1);
    expect(input).toEqual({ a: 1, b: 2 });
  });

  it('returns a new object reference', () => {
    const input = { a: 1 };
    expect(mapValues(input, (v) => v)).not.toBe(input);
  });
});
`,
    rank: 2,
    tags: ["entries", "object"],
  }),
  createDataTypeChallenge({
    id: "data-types-group-entries",
    title: "Группировка по ключу",
    description: `Лог событий вида \`[['login', 1], ['login', 2], ['logout', 3]]\`. Хочется получить \`{ login: [1, 2], logout: [3] }\` — все значения, собранные в массивы по ключу. Это типовая операция: партиции, индексы, сводные таблицы.

**Где спотыкаются.** Берут \`Object.fromEntries\` и удивляются: остаётся только последнее значение для ключа. Потому что \`fromEntries\` пишет, не накапливает. Надо самому: создал ключ — поставил пустой массив; уже есть — \`push\`.

**Что написать.** Функцию \`groupEntries(pairs)\`, которая принимает массив \`[ключ, значение]\` и возвращает объект с массивом значений на каждый уникальный ключ.

## Требования

1. Аргумент — массив пар \`[key, value]\`.
2. Верни объект, где каждому ключу соответствует массив всех его значений.
3. Порядок значений — как в исходном массиве.
4. Для пустого массива верни \`{}\`.
5. Экспортируй функцию \`groupEntries\`.

## Примеры

\`groupEntries([['a', 1], ['a', 2], ['b', 3]])\` → \`{ a: [1, 2], b: [3] }\`

\`groupEntries([])\` → \`{}\`

\`groupEntries([['x', 1]])\` → \`{ x: [1] }\``,
    starter: `export function groupEntries(pairs) {
  // Собери значения в массивы по ключу
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { groupEntries } from './index.js';

describe('groupEntries', () => {
  it('groups multiple values under same key', () => {
    expect(groupEntries([['a', 1], ['a', 2], ['b', 3]])).toEqual({
      a: [1, 2],
      b: [3],
    });
  });

  it('returns empty object for empty input', () => {
    expect(groupEntries([])).toEqual({});
  });

  it('wraps single value in an array', () => {
    expect(groupEntries([['x', 1]])).toEqual({ x: [1] });
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { groupEntries } from './index.js';

describe('groupEntries', () => {
  it('groups multiple values under same key', () => {
    expect(groupEntries([['a', 1], ['a', 2], ['b', 3]])).toEqual({
      a: [1, 2],
      b: [3],
    });
  });

  it('returns empty object for empty input', () => {
    expect(groupEntries([])).toEqual({});
  });

  it('wraps single value in an array', () => {
    expect(groupEntries([['x', 1]])).toEqual({ x: [1] });
  });

  it('preserves value order within a key', () => {
    const result = groupEntries([
      ['k', 'first'],
      ['k', 'second'],
      ['k', 'third'],
    ]);
    expect(result.k).toEqual(['first', 'second', 'third']);
  });

  it('does not mutate the input', () => {
    const input = [['a', 1], ['b', 2]];
    groupEntries(input);
    expect(input).toEqual([['a', 1], ['b', 2]]);
  });

  it('keeps falsy values', () => {
    expect(groupEntries([['a', 0], ['a', false], ['a', '']])).toEqual({
      a: [0, false, ''],
    });
  });
});
`,
    rank: 3,
    tags: ["entries", "object"],
  }),
  createDataTypeChallenge({
    id: "data-types-symbol-keys-skipped",
    title: "Object.keys пропускает Symbol",
    description: `\`Object.keys\`, \`Object.values\`, \`Object.entries\`, \`for..in\`, \`JSON.stringify\` — все они возвращают **только строковые** ключи. Свойства, у которых ключ — Symbol, остаются за бортом. Чтобы достать Symbol-ключи, используют \`Object.getOwnPropertySymbols\`. Чтобы достать вообще все собственные ключи (строки + Symbols) — \`Reflect.ownKeys\`.

\`\`\`js
const tag = Symbol('tag');
const obj = { name: 'A', [tag]: 'hidden', other: 'B' };

Object.keys(obj)                   // ['name', 'other']
Object.values(obj)                 // ['A', 'B']
Object.getOwnPropertySymbols(obj)  // [Symbol(tag)]
Reflect.ownKeys(obj)               // ['name', 'other', Symbol(tag)]
\`\`\`

**Что написать.** Функцию \`countKeys(obj)\` — возвращает объект \`{ string, symbol, total }\`, где:
- \`string\` — число строковых ключей,
- \`symbol\` — число Symbol-ключей,
- \`total\` — сумма (через \`Reflect.ownKeys\`).

## Требования

1. Используй \`Object.keys\` или \`Object.getOwnPropertyNames\` для строковых.
2. Используй \`Object.getOwnPropertySymbols\` для Symbol-ключей.
3. Используй \`Reflect.ownKeys\` для общего счётчика.
4. Возвращай объект \`{ string, symbol, total }\`.
5. Экспортируй функцию \`countKeys\`.

## Примеры

\`\`\`js
countKeys({ a: 1, b: 2 })         // { string: 2, symbol: 0, total: 2 }
countKeys({ [Symbol()]: 1 })      // { string: 0, symbol: 1, total: 1 }
countKeys({ a: 1, [Symbol()]: 2 })// { string: 1, symbol: 1, total: 2 }
\`\`\``,
    starter: `export function countKeys(obj) {
  // Object.keys + getOwnPropertySymbols + Reflect.ownKeys
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { countKeys } from './index.js';

describe('countKeys', () => {
  it('только строковые', () => {
    expect(countKeys({ a: 1, b: 2 })).toEqual({ string: 2, symbol: 0, total: 2 });
  });

  it('только Symbol', () => {
    expect(countKeys({ [Symbol()]: 1 })).toEqual({ string: 0, symbol: 1, total: 1 });
  });

  it('смешанные', () => {
    expect(countKeys({ a: 1, [Symbol()]: 2 })).toEqual({ string: 1, symbol: 1, total: 2 });
  });

  it('пустой объект', () => {
    expect(countKeys({})).toEqual({ string: 0, symbol: 0, total: 0 });
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { countKeys } from './index.js';

describe('countKeys', () => {
  it('только строковые', () => {
    expect(countKeys({ a: 1, b: 2 })).toEqual({ string: 2, symbol: 0, total: 2 });
  });

  it('только Symbol', () => {
    expect(countKeys({ [Symbol()]: 1 })).toEqual({ string: 0, symbol: 1, total: 1 });
  });

  it('смешанные', () => {
    expect(countKeys({ a: 1, [Symbol()]: 2 })).toEqual({ string: 1, symbol: 1, total: 2 });
  });

  it('пустой объект', () => {
    expect(countKeys({})).toEqual({ string: 0, symbol: 0, total: 0 });
  });

  it('несколько Symbol', () => {
    const a = Symbol('a');
    const b = Symbol('b');
    expect(countKeys({ [a]: 1, [b]: 2 })).toEqual({ string: 0, symbol: 2, total: 2 });
  });

  it('много строковых ключей', () => {
    const obj = {};
    for (let i = 0; i < 5; i++) obj['k' + i] = i;
    expect(countKeys(obj)).toEqual({ string: 5, symbol: 0, total: 5 });
  });

  it('Symbol.toStringTag тоже считается', () => {
    const obj = { name: 'A', [Symbol.toStringTag]: 'X' };
    expect(countKeys(obj)).toEqual({ string: 1, symbol: 1, total: 2 });
  });
});
`,
    rank: 3,
    tags: ["object", "keys", "symbol"],
  }),
];
