import knowledgeData from "./knowledge/database.json" with { type: "json" };
import type { KnowledgeDatabase, KnowledgeTopic, KnowledgeTopicMeta } from "./types.ts";

const database = knowledgeData as KnowledgeDatabase;
const topics = database.topics;
const topicMap = new Map(topics.map((topic) => [topic.id, topic]));

function toTopicMeta(topic: KnowledgeTopic): KnowledgeTopicMeta {
  return {
    id: topic.id,
    title: topic.title,
    summary: topic.summary,
    category: topic.category,
    difficulty: topic.difficulty,
    tags: topic.tags,
    estimatedMinutes: topic.estimatedMinutes,
    questionCount: topic.questions.length,
  };
}

export function getKnowledgeTopics(): KnowledgeTopicMeta[] {
  return topics.map(toTopicMeta);
}

export function getKnowledgeTopicById(id: string): KnowledgeTopic | undefined {
  return topicMap.get(id);
}
