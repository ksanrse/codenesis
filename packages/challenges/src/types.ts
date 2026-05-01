export type Difficulty = "Starter" | "Mid" | "Senior" | "Expert";

export type Category =
  | "JavaScript"
  | "TypeScript"
  | "UI Components"
  | "Performance"
  | "Architecture"
  | "React"
  | "Svelte"
  | "Vue"
  | "CSS"
  | "Accessibility";

export type Language = "javascript" | "typescript" | "react" | "svelte" | "vue";

export interface ChallengeFile {
  path: string;
  content: string;
}

export interface ChallengeMeta {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  category: Category;
  group: string;
  languages: Language[];
  rank: number;
  reputation: number;
  tags: string[];
}

export interface ChallengeDefinition extends ChallengeMeta {
  starterFiles: Record<Language, ChallengeFile[]>;
  testFiles: Record<Language, ChallengeFile[]>;
  fullTestFiles?: Record<Language, ChallengeFile[]>;
  solutionFiles: Record<Language, ChallengeFile[]>;
  dependencies: Record<Language, Record<string, string>>;
}

export interface ChallengeCollection {
  id: string;
  title: string;
  description: string;
  tag: string;
  skillLabel: string;
  kind: "course" | "set";
  parentCollectionId?: string;
  sectionTitle?: string;
  sectionDescription?: string;
  childCollectionIds: string[];
  directChallengeIds: string[];
  challengeIds: string[];
  challengeCount: number;
}

export type KnowledgeQuestionType = "single-choice" | "multiple-choice";

export interface KnowledgeAnswerOption {
  id: string;
  text: string;
}

export interface KnowledgeQuestion {
  id: string;
  type: KnowledgeQuestionType;
  prompt: string;
  code?: string;
  options: KnowledgeAnswerOption[];
  answer: string[];
  explanation: string;
}

export interface KnowledgeTopic {
  id: string;
  title: string;
  summary: string;
  category: Category;
  difficulty: Difficulty;
  tags: string[];
  estimatedMinutes: number;
  questions: KnowledgeQuestion[];
}

export interface KnowledgeTopicMeta {
  id: string;
  title: string;
  summary: string;
  category: Category;
  difficulty: Difficulty;
  tags: string[];
  estimatedMinutes: number;
  questionCount: number;
}

export interface KnowledgeDatabase {
  version: number;
  topics: KnowledgeTopic[];
}
