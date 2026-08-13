import { describe, expect, it } from "vite-plus/test";
import { getChallengeById } from "@codenesis/challenges";
import {
  getRoadmapById,
  getRoadmapTopicCount,
  roadmaps,
  skillTreeConnections,
  skillTreeDependencies,
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

    expect(frontend?.children?.map((child) => child.title)).toEqual([
      "HTML",
      "CSS",
      "Vanilla JavaScript",
    ]);
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

  it("links every released Vanilla JavaScript stage to existing exercises", () => {
    const vanilla = getRoadmapById("javascript");

    for (const stage of vanilla?.stages ?? []) {
      expect(stage.why.length).toBeGreaterThan(40);
      expect(stage.exerciseIds.length).toBeGreaterThan(0);
      expect(stage.exerciseIds.every((id) => getChallengeById(id))).toBe(true);
    }
  });

  it("keeps framework specializations independent from core JavaScript", () => {
    const vanilla = getRoadmapById("javascript");

    expect(vanilla?.title).toBe("JavaScript");
    expect(vanilla?.next?.map(({ roadmapId }) => roadmapId)).toEqual([
      "react",
      "vue",
      "svelte",
      "solid",
    ]);
    for (const id of ["react", "vue", "svelte", "solid"]) {
      const framework = getRoadmapById(id);
      expect(framework?.stages).toHaveLength(5);
      expect(framework?.stages.every((stage) => stage.exerciseIds.length === 0)).toBe(true);
    }
  });

  it("keeps the global base separate from second-level framework specializations", () => {
    const baseTones = new Set(["html", "css", "javascript", "python", "database"]);
    const specializationTones = new Set(["react", "vue", "svelte", "solid"]);

    expect(
      skillTreeSkills.filter(({ tone }) => baseTones.has(tone)).map(({ title }) => title),
    ).toEqual(["HTML", "CSS", "Vanilla JS", "Python", "Databases"]);
    expect(
      skillTreeSkills.filter(({ tone }) => specializationTones.has(tone)).map(({ title }) => title),
    ).toEqual(["React", "Vue", "Svelte", "Solid"]);
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
      "Vanilla JS",
      "React",
      "Vue",
      "Svelte",
      "Solid",
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
    expect(skillTreeDependencies).toEqual([
      { sourceSkillId: "javascript-skill", targetSkillId: "react-skill" },
      { sourceSkillId: "javascript-skill", targetSkillId: "vue-skill" },
      { sourceSkillId: "javascript-skill", targetSkillId: "svelte-skill" },
      { sourceSkillId: "javascript-skill", targetSkillId: "solid-skill" },
    ]);
  });
});
