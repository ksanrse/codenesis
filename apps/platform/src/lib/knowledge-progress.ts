export interface KnowledgeQuestionProgress {
  selected: string[];
  isCorrect: boolean;
  answeredAt: string;
}

export interface KnowledgeTopicProgress {
  answers: Record<string, KnowledgeQuestionProgress>;
}

const STORAGE_KEY = "foruntendo:knowledge-progress:v1";

type KnowledgeProgressStore = Record<string, KnowledgeTopicProgress>;

function emptyTopicProgress(): KnowledgeTopicProgress {
  return { answers: {} };
}

function readStore(): KnowledgeProgressStore {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as KnowledgeProgressStore;
  } catch {
    return {};
  }
}

function writeStore(store: KnowledgeProgressStore): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function getKnowledgeProgress(topicId: string): KnowledgeTopicProgress {
  return readStore()[topicId] ?? emptyTopicProgress();
}

export function saveKnowledgeAnswer(
  topicId: string,
  questionId: string,
  selected: string[],
  isCorrect: boolean,
): KnowledgeTopicProgress {
  const store = readStore();
  const topicProgress = store[topicId] ?? emptyTopicProgress();
  const nextProgress: KnowledgeTopicProgress = {
    answers: {
      ...topicProgress.answers,
      [questionId]: {
        selected,
        isCorrect,
        answeredAt: new Date().toISOString(),
      },
    },
  };

  writeStore({ ...store, [topicId]: nextProgress });
  return nextProgress;
}

export function resetKnowledgeTopic(topicId: string): KnowledgeTopicProgress {
  const store = readStore();
  const nextStore = { ...store };
  delete nextStore[topicId];
  writeStore(nextStore);
  return emptyTopicProgress();
}
