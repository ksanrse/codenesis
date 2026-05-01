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
  javascriptSpecialChallenges,
  polyfillChallenges,
} from "./challenges/learn-javascript-ru/index.ts";
import { modalComponent } from "./challenges/modal-component/index.ts";
import { switchChallenges } from "./challenges/switch-statements/index.ts";
import { todoList } from "./challenges/todo-list/index.ts";

const challenges: ChallengeDefinition[] = [
  ...jsTypeChallenges,
  ...switchChallenges,
  ...functionExpressionChallenges,
  ...arrowFunctionChallenges,
  ...javascriptSpecialChallenges,
  ...codeQualityChallenges,
  ...polyfillChallenges,
  todoList,
  modalComponent,
  autocompleteSearch,
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

export interface FilterOptions {
  difficulty?: Difficulty;
  minRank?: number;
  maxRank?: number;
  category?: Category;
  group?: string;
  language?: Language;
  tag?: string;
  search?: string;
}

export function filterChallenges(options: FilterOptions): ChallengeMeta[] {
  return getAllChallenges().filter((c) => {
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
