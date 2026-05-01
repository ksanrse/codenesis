export type {
  Category,
  ChallengeCollection,
  ChallengeDefinition,
  ChallengeFile,
  ChallengeMeta,
  Difficulty,
  KnowledgeAnswerOption,
  KnowledgeDatabase,
  KnowledgeQuestion,
  KnowledgeQuestionType,
  KnowledgeTopic,
  KnowledgeTopicMeta,
  Language,
} from "./types.ts";

export {
  filterChallenges,
  getAllChallenges,
  getChallengeById,
  getChallengeCollectionById,
  getChallengeCollections,
  getChallengeGroups,
} from "./registry.ts";
export { getKnowledgeTopicById, getKnowledgeTopics } from "./knowledge.ts";
export {
  getCompletedChallengeIds,
  getMmrScoreForChallengeIds,
  getMmrScoreForCompletions,
  type ChallengeCompletionRecord,
} from "./progress.ts";
export {
  MAX_RANK,
  MAX_CHALLENGE_LEVEL,
  MIN_RANK,
  CHALLENGE_LEVEL_MMR,
  MMR_GRADE_BANDS,
  RANK_BANDS,
  RANK_GRADE_MAPPINGS,
  clampRank,
  getChallengeLevel,
  getChallengeLevelLabel,
  getChallengePoints,
  getRankBand,
  getRankProgress,
  getRankTitle,
  getUserRank,
  type RankBand,
  type RankGrade,
  type RankGradeMapping,
  type RankProgress,
} from "./ranking.ts";

export type { FilterOptions } from "./registry.ts";
