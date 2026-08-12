import { describe, expect, it } from "vite-plus/test";
import { getChallengeById } from "@codenesis/challenges";
import {
  getRoadmapById,
  getRoadmapTopicCount,
  roadmaps,
  skillTreeConnections,
  skillTreeRoles,
  skillTreeSkills,
} from "./roadmaps";

describe("roadmaps", () => {
  it("contains a substantial frontend curriculum", () => {
    const frontend = getRoadmapById("javascript");

    expect(frontend).toBeDefined();
    expect(frontend?.stages.length).toBeGreaterThanOrEqual(10);
    expect(frontend && getRoadmapTopicCount(frontend)).toBeGreaterThanOrEqual(70);
  });

  it("groups HTML, CSS and JavaScript under the frontend roadmap", () => {
    const frontend = getRoadmapById("frontend");

    expect(frontend?.children?.map((child) => child.title)).toEqual(["HTML", "CSS", "JavaScript"]);
    expect(frontend?.children?.find((child) => child.id === "javascript")?.roadmapId).toBe(
      "javascript",
    );
  });

  it("uses unique roadmap and stage ids", () => {
    expect(new Set(roadmaps.map(({ id }) => id)).size).toBe(roadmaps.length);
    for (const roadmap of roadmaps) {
      expect(new Set(roadmap.stages.map(({ id }) => id)).size).toBe(roadmap.stages.length);
    }
  });

  it("links every stage to existing exercises and an explanation", () => {
    for (const roadmap of roadmaps) {
      for (const stage of roadmap.stages) {
        expect(stage.why.length).toBeGreaterThan(40);
        expect(stage.exerciseIds.length).toBeGreaterThan(0);
        expect(stage.exerciseIds.every((id) => getChallengeById(id))).toBe(true);
      }
    }
  });

  it("keeps the shared skill tree connected across roles", () => {
    expect(skillTreeRoles.map((role) => role.title)).toEqual([
      "Frontend",
      "Full Stack",
      "Backend",
      "ML",
    ]);
    expect(skillTreeSkills.map((skill) => skill.title)).toEqual([
      "HTML",
      "CSS",
      "JavaScript",
      "Python",
      "Databases",
    ]);
    expect(skillTreeConnections).toEqual(
      expect.arrayContaining([
        { roleId: "frontend-role", skillId: "javascript-skill" },
        { roleId: "fullstack-role", skillId: "javascript-skill" },
        { roleId: "backend-role", skillId: "python-skill" },
        { roleId: "ml-role", skillId: "python-skill" },
      ]),
    );
  });
});
