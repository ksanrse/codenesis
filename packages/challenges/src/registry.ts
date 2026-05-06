import type {
  Category,
  ChallengeCollection,
  ChallengeDefinition,
  ChallengeMeta,
  Difficulty,
  Language,
} from "./types.ts";
import { autocompleteSearch } from "./challenges/autocomplete-search/index.ts";
import { functionExpressionChallenges } from "./challenges/function-expressions/index.ts";
import { jsTypeChallenges } from "./challenges/js-types/index.ts";
import {
  arrowFunctionChallenges,
  codeQualityChallenges,
  constructorNewChallenges,
  garbageCollectionChallenges,
  javascriptSpecialChallenges,
  objectCopyChallenges,
  objectMethodsChallenges,
  objectsBasicsChallenges,
  objectToPrimitiveChallenges,
  optionalChainingChallenges,
  polyfillChallenges,
} from "./challenges/learn-javascript-ru/index.ts";
import {
  arrayChallenges,
  arrayMethodsChallenges,
  dateChallenges,
  destructuringChallenges,
  iterableChallenges,
  jsonChallenges,
  keysValuesEntriesChallenges,
  mapSetChallenges,
  numberChallenges,
  primitiveMethodsChallenges,
  stringChallenges,
  weakMapSetChallenges,
} from "./challenges/data-types-ru/index.ts";
import { modalComponent } from "./challenges/modal-component/index.ts";
import { switchChallenges } from "./challenges/switch-statements/index.ts";
import { todoList } from "./challenges/todo-list/index.ts";

function tagWith(tag: string, list: ChallengeDefinition[]): ChallengeDefinition[] {
  return list.map((c) => ({ ...c, tags: [...c.tags, tag] }));
}

const dtPrimitiveMethods = tagWith("JS/dt-primitive-methods", primitiveMethodsChallenges);
const dtNumbers = tagWith("JS/dt-numbers", numberChallenges);
const dtStrings = tagWith("JS/dt-strings", stringChallenges);
const dtArrays = tagWith("JS/dt-arrays", arrayChallenges);
const dtArrayMethods = tagWith("JS/dt-array-methods", arrayMethodsChallenges);
const dtIterables = tagWith("JS/dt-iterables", iterableChallenges);
const dtMapSet = tagWith("JS/dt-map-set", mapSetChallenges);
const dtWeakMapSet = tagWith("JS/dt-weakmap-weakset", weakMapSetChallenges);
const dtKeysValues = tagWith("JS/dt-keys-values", keysValuesEntriesChallenges);
const dtDestructuring = tagWith("JS/dt-destructuring", destructuringChallenges);
const dtDate = tagWith("JS/dt-date", dateChallenges);
const dtJson = tagWith("JS/dt-json", jsonChallenges);

const challenges: ChallengeDefinition[] = [
  ...jsTypeChallenges,
  ...switchChallenges,
  ...functionExpressionChallenges,
  ...arrowFunctionChallenges,
  ...javascriptSpecialChallenges,
  ...codeQualityChallenges,
  ...polyfillChallenges,
  ...objectsBasicsChallenges,
  ...objectCopyChallenges,
  ...garbageCollectionChallenges,
  ...objectMethodsChallenges,
  ...constructorNewChallenges,
  ...optionalChainingChallenges,
  ...objectToPrimitiveChallenges,
  todoList,
  modalComponent,
  autocompleteSearch,
  ...dtPrimitiveMethods,
  ...dtNumbers,
  ...dtStrings,
  ...dtArrays,
  ...dtArrayMethods,
  ...dtIterables,
  ...dtMapSet,
  ...dtWeakMapSet,
  ...dtKeysValues,
  ...dtDestructuring,
  ...dtDate,
  ...dtJson,
];

const challengeMap = new Map(challenges.map((c) => [c.id, c]));

type CollectionDefinition = Omit<
  ChallengeCollection,
  "challengeIds" | "challengeCount" | "childCollectionIds" | "directChallengeIds"
> & {
  childCollectionIds?: string[];
};

const collectionDefinitions: CollectionDefinition[] = [
  {
    id: "javascript-textbook",
    title: "Учебник JavaScript",
    description: "Типы, условия, функции и первые практические паттерны.",
    tag: "JS/textbook",
    skillLabel: "Учебник JavaScript",
    kind: "course",
    childCollectionIds: [
      "js-types",
      "js-switch",
      "js-function-expressions",
      "js-arrow-functions",
      "js-specials",
      "js-code-quality",
      "js-polyfills",
      "js-objects-basics",
      "js-object-copy",
      "js-garbage-collection",
      "js-object-methods",
      "js-constructor-new",
      "js-optional-chaining",
      "js-object-toprimitive",
      "js-dt-primitive-methods",
      "js-dt-numbers",
      "js-dt-strings",
      "js-dt-arrays",
      "js-dt-array-methods",
      "js-dt-iterables",
      "js-dt-map-set",
      "js-dt-weakmap-weakset",
      "js-dt-keys-values",
      "js-dt-destructuring",
      "js-dt-date",
      "js-dt-json",
    ],
  },
  {
    id: "js-types",
    title: "JS / types",
    description:
      "Практика по типам JavaScript: typeof, null, NaN, truthy/falsy, массивы, примитивы, bigint и JSON-совместимость.",
    tag: "JS/types",
    skillLabel: "База JavaScript: types",
    kind: "set",
    parentCollectionId: "javascript-textbook",
    sectionTitle: "Раздел 1 · Типы и управление потоком",
    sectionDescription: "Базовые типы, приведение значений и первые управляющие конструкции.",
  },
  {
    id: "js-switch",
    title: "JS / switch",
    description: "Проверка базового владения switch: default, группировка case, строки и числа.",
    tag: "JS/switch",
    skillLabel: "База JavaScript: switch",
    kind: "set",
    parentCollectionId: "javascript-textbook",
    sectionTitle: "Раздел 1 · Типы и управление потоком",
    sectionDescription: "Базовые типы, приведение значений и первые управляющие конструкции.",
  },
  {
    id: "js-function-expressions",
    title: "JS / Function Expressions",
    description:
      "10 задач по function expressions: замыкания, callbacks, wrappers, composition, memoization и currying.",
    tag: "JS/function-expressions",
    skillLabel: "База JavaScript: function expressions",
    kind: "set",
    parentCollectionId: "javascript-textbook",
    sectionTitle: "Раздел 2 · Функции",
    sectionDescription: "Function expressions, callbacks, closures и композиция поведения.",
  },
  {
    id: "js-arrow-functions",
    title: "JS / Arrow Functions",
    description:
      "7 задач по базовому синтаксису стрелочных функций, callback-стрелкам, замыканиям и сортировке.",
    tag: "JS/arrow-functions",
    skillLabel: "База JavaScript: arrow functions",
    kind: "set",
    parentCollectionId: "javascript-textbook",
    sectionTitle: "Раздел 2 · Функции",
    sectionDescription: "Function expressions, callbacks, closures и композиция поведения.",
  },
  {
    id: "js-specials",
    title: "JS / specials",
    description:
      "Практика по особенностям JavaScript: строгие сравнения, nullish-значения, optional chaining и циклы.",
    tag: "JS/specials",
    skillLabel: "Особенности JavaScript",
    kind: "set",
    parentCollectionId: "javascript-textbook",
    sectionTitle: "Раздел 3 · Особенности языка",
    sectionDescription:
      "Закрепление базовых особенностей JavaScript из обзора learn.javascript.ru.",
  },
  {
    id: "js-code-quality",
    title: "JS / code quality",
    description:
      "5 задач по отладке, стилю кода, комментариям и распутыванию нечитабельной логики.",
    tag: "JS/code-quality",
    skillLabel: "Качество JavaScript-кода",
    kind: "set",
    parentCollectionId: "javascript-textbook",
    sectionTitle: "Раздел 4 · Качество кода",
    sectionDescription:
      "Debugging, coding style, comments и anti-ninja-code на практических функциях.",
  },
  {
    id: "js-polyfills",
    title: "JS / polyfills",
    description:
      "7 задач на самостоятельную реализацию методов массивов: includes, find, some, every, map, filter и reduce.",
    tag: "JS/polyfills",
    skillLabel: "Полифилы JavaScript",
    kind: "set",
    parentCollectionId: "javascript-textbook",
    sectionTitle: "Раздел 5 · Полифилы",
    sectionDescription:
      "Финальное закрепление: пишем my*-версии встроенных методов без изменения прототипов.",
  },
  {
    id: "js-objects-basics",
    title: "JS / objects",
    description:
      "6 задач по объектам: литералы, доступ через точку и скобки, вычисляемые ключи, оператор in, цикл for..in и полифил Object.keys.",
    tag: "JS/objects-basics",
    skillLabel: "База JavaScript: объекты",
    kind: "set",
    parentCollectionId: "javascript-textbook",
    sectionTitle: "Раздел 6 · Объекты",
    sectionDescription:
      "Объекты, ссылки, копирование, методы, конструкторы, опциональная цепочка и преобразование в примитив.",
  },
  {
    id: "js-object-copy",
    title: "JS / object copy",
    description:
      "5 задач по копированию: ссылки vs значения, Object.assign, поверхностный и глубокий клон, полифил Object.assign.",
    tag: "JS/object-copy",
    skillLabel: "Копирование объектов",
    kind: "set",
    parentCollectionId: "javascript-textbook",
    sectionTitle: "Раздел 6 · Объекты",
    sectionDescription:
      "Объекты, ссылки, копирование, методы, конструкторы, опциональная цепочка и преобразование в примитив.",
  },
  {
    id: "js-garbage-collection",
    title: "JS / garbage collection",
    description:
      "2 задачи на достижимость и алгоритм mark-and-sweep: обход графа ссылок и собственная реализация сборщика.",
    tag: "JS/garbage-collection",
    skillLabel: "Сборка мусора",
    kind: "set",
    parentCollectionId: "javascript-textbook",
    sectionTitle: "Раздел 6 · Объекты",
    sectionDescription:
      "Объекты, ссылки, копирование, методы, конструкторы, опциональная цепочка и преобразование в примитив.",
  },
  {
    id: "js-object-methods",
    title: "JS / object methods",
    description:
      "5 задач по методам объектов и this: краткий синтаксис, потеря this, вызов по имени и полифил bind.",
    tag: "JS/object-methods",
    skillLabel: "Методы объекта и this",
    kind: "set",
    parentCollectionId: "javascript-textbook",
    sectionTitle: "Раздел 6 · Объекты",
    sectionDescription:
      "Объекты, ссылки, копирование, методы, конструкторы, опциональная цепочка и преобразование в примитив.",
  },
  {
    id: "js-constructor-new",
    title: "JS / constructor, new",
    description:
      "5 задач по функциям-конструкторам: this в конструкторе, методы экземпляра, new.target и полифил оператора new.",
    tag: "JS/constructor-new",
    skillLabel: "Конструкторы и new",
    kind: "set",
    parentCollectionId: "javascript-textbook",
    sectionTitle: "Раздел 6 · Объекты",
    sectionDescription:
      "Объекты, ссылки, копирование, методы, конструкторы, опциональная цепочка и преобразование в примитив.",
  },
  {
    id: "js-optional-chaining",
    title: "JS / optional chaining",
    description:
      "5 задач по ?.: безопасный доступ к свойствам, опциональный вызов метода, скобочная форма и полифил getPath.",
    tag: "JS/optional-chaining",
    skillLabel: "Опциональная цепочка",
    kind: "set",
    parentCollectionId: "javascript-textbook",
    sectionTitle: "Раздел 6 · Объекты",
    sectionDescription:
      "Объекты, ссылки, копирование, методы, конструкторы, опциональная цепочка и преобразование в примитив.",
  },
  {
    id: "js-object-toprimitive",
    title: "JS / toPrimitive",
    description:
      "4 задачи по преобразованию объектов в примитив: Symbol.toPrimitive, hint string/number/default, fallback на toString/valueOf и полный полифил ToPrimitive.",
    tag: "JS/object-toprimitive",
    skillLabel: "Преобразование в примитив",
    kind: "set",
    parentCollectionId: "javascript-textbook",
    sectionTitle: "Раздел 6 · Объекты",
    sectionDescription:
      "Объекты, ссылки, копирование, методы, конструкторы, опциональная цепочка и преобразование в примитив.",
  },
  {
    id: "js-dt-primitive-methods",
    title: "JS / методы примитивов",
    description:
      "4 задачи: length строки, toFixed, padStart и toString с основанием — примитивы как объекты.",
    tag: "JS/dt-primitive-methods",
    skillLabel: "Методы примитивов",
    kind: "set",
    parentCollectionId: "javascript-textbook",
    sectionTitle: "Раздел 7 · Типы данных",
    sectionDescription:
      "Примитивы, числа, строки, массивы, Map/Set, деструктуризация, Date и JSON.",
  },
  {
    id: "js-dt-numbers",
    title: "JS / числа",
    description:
      "4 задачи: parseInt строгий, float-сравнение через epsilon, clamp и округление центов.",
    tag: "JS/dt-numbers",
    skillLabel: "Числа в JavaScript",
    kind: "set",
    parentCollectionId: "javascript-textbook",
    sectionTitle: "Раздел 7 · Типы данных",
    sectionDescription:
      "Примитивы, числа, строки, массивы, Map/Set, деструктуризация, Date и JSON.",
  },
  {
    id: "js-dt-strings",
    title: "JS / строки",
    description:
      "4 задачи: truncate через slice, slugify через regex, подсчёт слов и первый codepoint.",
    tag: "JS/dt-strings",
    skillLabel: "Строки в JavaScript",
    kind: "set",
    parentCollectionId: "javascript-textbook",
    sectionTitle: "Раздел 7 · Типы данных",
    sectionDescription:
      "Примитивы, числа, строки, массивы, Map/Set, деструктуризация, Date и JSON.",
  },
  {
    id: "js-dt-arrays",
    title: "JS / массивы",
    description:
      "4 задачи: removeAt, lastN, chunk и uniquePush — базовые операции с массивами.",
    tag: "JS/dt-arrays",
    skillLabel: "Массивы в JavaScript",
    kind: "set",
    parentCollectionId: "javascript-textbook",
    sectionTitle: "Раздел 7 · Типы данных",
    sectionDescription:
      "Примитивы, числа, строки, массивы, Map/Set, деструктуризация, Date и JSON.",
  },
  {
    id: "js-dt-array-methods",
    title: "JS / методы массивов",
    description:
      "4 задачи: sumBy, groupBy, sortByKey и flatten — реализация через reduce/forEach.",
    tag: "JS/dt-array-methods",
    skillLabel: "Методы массивов",
    kind: "set",
    parentCollectionId: "javascript-textbook",
    sectionTitle: "Раздел 7 · Типы данных",
    sectionDescription:
      "Примитивы, числа, строки, массивы, Map/Set, деструктуризация, Date и JSON.",
  },
  {
    id: "js-dt-iterables",
    title: "JS / итерируемые объекты",
    description:
      "4 задачи: range, take, zipWith и takeWhile через протокол итерации и генераторы.",
    tag: "JS/dt-iterables",
    skillLabel: "Итерируемые объекты",
    kind: "set",
    parentCollectionId: "javascript-textbook",
    sectionTitle: "Раздел 7 · Типы данных",
    sectionDescription:
      "Примитивы, числа, строки, массивы, Map/Set, деструктуризация, Date и JSON.",
  },
  {
    id: "js-dt-map-set",
    title: "JS / Map и Set",
    description:
      "4 задачи: tallyOccurrences, dedupSet, mergeMaps и intersectSets через Map и Set.",
    tag: "JS/dt-map-set",
    skillLabel: "Map и Set",
    kind: "set",
    parentCollectionId: "javascript-textbook",
    sectionTitle: "Раздел 7 · Типы данных",
    sectionDescription:
      "Примитивы, числа, строки, массивы, Map/Set, деструктуризация, Date и JSON.",
  },
  {
    id: "js-dt-weakmap-weakset",
    title: "JS / WeakMap и WeakSet",
    description:
      "3 задачи: кэш через WeakMap, посещённые через WeakSet и мемоизация с обходом falsy.",
    tag: "JS/dt-weakmap-weakset",
    skillLabel: "WeakMap и WeakSet",
    kind: "set",
    parentCollectionId: "javascript-textbook",
    sectionTitle: "Раздел 7 · Типы данных",
    sectionDescription:
      "Примитивы, числа, строки, массивы, Map/Set, деструктуризация, Date и JSON.",
  },
  {
    id: "js-dt-keys-values",
    title: "JS / Object.keys/values/entries",
    description:
      "4 задачи: invertObject, pickFields, mapValues и groupEntries через entries/fromEntries.",
    tag: "JS/dt-keys-values",
    skillLabel: "Object.keys/values/entries",
    kind: "set",
    parentCollectionId: "javascript-textbook",
    sectionTitle: "Раздел 7 · Типы данных",
    sectionDescription:
      "Примитивы, числа, строки, массивы, Map/Set, деструктуризация, Date и JSON.",
  },
  {
    id: "js-dt-destructuring",
    title: "JS / деструктуризация",
    description:
      "4 задачи: swap без temp, headTail, defaults и rename через деструктуризацию массивов и объектов.",
    tag: "JS/dt-destructuring",
    skillLabel: "Деструктуризация",
    kind: "set",
    parentCollectionId: "javascript-textbook",
    sectionTitle: "Раздел 7 · Типы данных",
    sectionDescription:
      "Примитивы, числа, строки, массивы, Map/Set, деструктуризация, Date и JSON.",
  },
  {
    id: "js-dt-date",
    title: "JS / Date",
    description:
      "4 задачи: formatISO, addDays, daysBetween и isWeekend через объект Date.",
    tag: "JS/dt-date",
    skillLabel: "Дата и время",
    kind: "set",
    parentCollectionId: "javascript-textbook",
    sectionTitle: "Раздел 7 · Типы данных",
    sectionDescription:
      "Примитивы, числа, строки, массивы, Map/Set, деструктуризация, Date и JSON.",
  },
  {
    id: "js-dt-json",
    title: "JS / JSON",
    description:
      "4 задачи: safeParse, deepClone, prettyPrint и omitFields через JSON.parse/stringify.",
    tag: "JS/dt-json",
    skillLabel: "JSON методы",
    kind: "set",
    parentCollectionId: "javascript-textbook",
    sectionTitle: "Раздел 7 · Типы данных",
    sectionDescription:
      "Примитивы, числа, строки, массивы, Map/Set, деструктуризация, Date и JSON.",
  },
  {
    id: "js-dom-state",
    title: "JS / DOM и состояние",
    description: "Практика DOM, локального состояния и пользовательских событий.",
    tag: "dom",
    skillLabel: "DOM и состояние",
    kind: "set",
  },
  {
    id: "ui-accessibility",
    title: "UI / accessibility",
    description: "Компоненты, клавиатурная навигация и ARIA-паттерны.",
    tag: "accessibility",
    skillLabel: "Доступные UI-компоненты",
    kind: "set",
  },
];

const collectionDefinitionMap = new Map(
  collectionDefinitions.map((collection) => [collection.id, collection]),
);

export function getAllChallenges(): ChallengeMeta[] {
  return challenges.map((c) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    difficulty: c.difficulty,
    category: c.category,
    group: c.group,
    languages: c.languages,
    rank: c.rank,
    reputation: c.reputation,
    tags: c.tags,
  }));
}

export function getChallengeById(id: string): ChallengeDefinition | undefined {
  return challengeMap.get(id);
}

export type ChallengeSort = "default" | "rank-asc" | "rank-desc";

export interface FilterOptions {
  difficulty?: Difficulty;
  minRank?: number;
  maxRank?: number;
  category?: Category;
  group?: string;
  language?: Language;
  tag?: string;
  search?: string;
  sort?: ChallengeSort;
}

export function sortChallenges<T extends { rank: number }>(
  list: T[],
  sort: ChallengeSort = "default",
): T[] {
  if (sort === "default") return list;
  const copy = [...list];
  if (sort === "rank-asc") copy.sort((a, b) => a.rank - b.rank);
  else copy.sort((a, b) => b.rank - a.rank);
  return copy;
}

export function filterChallenges(options: FilterOptions): ChallengeMeta[] {
  const filtered = getAllChallenges().filter((c) => {
    if (options.difficulty && c.difficulty !== options.difficulty) return false;
    if (options.minRank !== undefined && c.rank < options.minRank) return false;
    if (options.maxRank !== undefined && c.rank > options.maxRank) return false;
    if (options.category && c.category !== options.category) return false;
    if (options.group && c.group !== options.group) return false;
    if (options.language && !c.languages.includes(options.language)) return false;
    if (options.tag && !c.tags.includes(options.tag)) return false;
    if (options.search) {
      const q = options.search.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.group.toLowerCase().includes(q) ||
        c.tags.some((t) => t.includes(q))
      );
    }
    return true;
  });

  return sortChallenges(filtered, options.sort);
}

export function getChallengeGroups(): string[] {
  return [...new Set(challenges.map((challenge) => challenge.group))];
}

function getDirectCollectionChallengeIds(collection: CollectionDefinition): string[] {
  return challenges
    .filter((challenge) => challenge.tags.includes(collection.tag))
    .map((challenge) => challenge.id);
}

function buildCollection(
  collection: CollectionDefinition,
  visited = new Set<string>(),
): ChallengeCollection {
  if (visited.has(collection.id)) {
    throw new Error(`Circular collection reference: ${collection.id}`);
  }

  const nextVisited = new Set(visited).add(collection.id);
  const childCollectionIds = collection.childCollectionIds ?? [];
  const directChallengeIds = getDirectCollectionChallengeIds(collection);
  const childChallengeIds = childCollectionIds.flatMap((childCollectionId) => {
    const childCollection = collectionDefinitionMap.get(childCollectionId);
    if (!childCollection) return [];
    return buildCollection(childCollection, nextVisited).challengeIds;
  });
  const challengeIds = [...new Set([...directChallengeIds, ...childChallengeIds])];

  return {
    ...collection,
    childCollectionIds,
    directChallengeIds,
    challengeIds,
    challengeCount: challengeIds.length,
  };
}

export function getChallengeCollections(): ChallengeCollection[] {
  return collectionDefinitions.map((collection) => buildCollection(collection));
}

export function getChallengeCollectionById(id: string): ChallengeCollection | undefined {
  return getChallengeCollections().find((collection) => collection.id === id);
}
