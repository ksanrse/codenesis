<script lang="ts">
  import { getAllChallenges } from "@codenesis/challenges";
  import { onMount } from "svelte";
  import { attempts } from "../../lib/database-store";
  import { addAttempt } from "../../lib/local-db";
  import { getDeveloperProgress, setDeveloperProgress } from "../../lib/auth-client";
  import { developerSkillProgress } from "../../lib/developer-progress";
  import { getPassedChallengeIds } from "../../lib/progress";

  const challenges = getAllChallenges();
  let open = false;
  let saving = false;
  let saved = false;
  let query = "";
  let solved = new Set<string>();
  let initialized = false;
  let skillProgress: Record<string, number> = {
    "html-skill": 0,
    "css-skill": 0,
    "javascript-skill": 0,
    "python-skill": 0,
    "databases-skill": 0,
  };
  const skills = [
    ["html-skill", "HTML"],
    ["css-skill", "CSS"],
    ["javascript-skill", "JavaScript"],
    ["python-skill", "Python"],
    ["databases-skill", "Databases"],
  ] as const;

  onMount(async () => {
    try {
      const result = await getDeveloperProgress();
      skillProgress = { ...skillProgress, ...result.skillProgress };
      developerSkillProgress.set(result.skillProgress);

      const stored = JSON.parse(localStorage.getItem("codenesis:local-dev-progress") ?? "null") as
        | { seededJavaScript50?: boolean }
        | null;
      if (import.meta.env.DEV && !stored?.seededJavaScript50) {
        const javascriptChallenges = challenges.filter((challenge) =>
          challenge.languages.some((language) => language.toLowerCase() === "javascript"),
        );
        const seeded = javascriptChallenges.slice(0, Math.ceil(javascriptChallenges.length / 2));
        initialized = true;
        solved = new Set(seeded.map((challenge) => challenge.id));
        skillProgress = { ...skillProgress, "javascript-skill": 50 };
        const passedIds = getPassedChallengeIds($attempts);

        for (const challenge of seeded) {
          if (passedIds.has(challenge.id)) continue;
          addAttempt({
            challengeId: challenge.id,
            challengeTitle: challenge.title,
            language: challenge.languages[0] ?? "javascript",
            status: "passed",
            passed: 1,
            failed: 0,
            total: 1,
            files: {},
            output: "Developer seed: JavaScript 50%",
          });
        }

        const savedResult = await setDeveloperProgress(
          challenges.map((challenge) => ({
            id: challenge.id,
            title: challenge.title,
            language: challenge.languages[0] ?? "javascript",
            solved: solved.has(challenge.id),
          })),
          skillProgress,
        );
        developerSkillProgress.set(savedResult.skillProgress);
        localStorage.setItem(
          "codenesis:local-dev-progress",
          JSON.stringify({
            challenges: seeded.map((challenge) => challenge.id),
            skillProgress,
            seededJavaScript50: true,
          }),
        );
      }
    } catch {
      // The panel remains usable against a freshly started development API.
    }
  });

  $: if (!initialized && $attempts) {
    solved = new Set(getPassedChallengeIds($attempts));
    initialized = true;
  }
  $: filtered = challenges.filter((challenge) =>
    `${challenge.title} ${challenge.id}`.toLowerCase().includes(query.trim().toLowerCase()),
  );

  function toggle(id: string) {
    const next = new Set(solved);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    solved = next;
    saved = false;
  }

  function setPercent(percent: number) {
    const count = Math.round((challenges.length * percent) / 100);
    solved = new Set(challenges.slice(0, count).map((challenge) => challenge.id));
    skillProgress = { ...skillProgress, "javascript-skill": percent };
    saved = false;
  }

  function setSkillProgress(skillId: string, value: number) {
    skillProgress = { ...skillProgress, [skillId]: value };
    saved = false;
  }

  async function save() {
    saving = true;
    saved = false;
    try {
      const result = await setDeveloperProgress(
        challenges.map((challenge) => ({
          id: challenge.id,
          title: challenge.title,
          language: challenge.languages[0] ?? "javascript",
          solved: solved.has(challenge.id),
        })),
        skillProgress,
      );
      developerSkillProgress.set(result.skillProgress);
      saved = true;
    } finally {
      saving = false;
    }
  }
</script>

<button class="dev-trigger" type="button" aria-expanded={open} on:click={() => (open = !open)}>
  DEV <span>{solved.size}/{challenges.length}</span>
</button>

{#if open}
  <aside class="dev-panel" aria-label="Developer tools">
    <header>
      <div><span>Локальный профиль</span><h2>Developer</h2></div>
      <button type="button" aria-label="Закрыть" on:click={() => (open = false)}>×</button>
    </header>

    <section class="dev-summary">
      <strong>{Math.round((solved.size / Math.max(1, challenges.length)) * 100)}%</strong>
      <span>{solved.size} решено · {challenges.length - solved.size} не решено</span>
    </section>

    <div class="dev-presets" aria-label="Быстрый прогресс">
      {#each [0, 25, 50, 75, 100] as percent}
        <button type="button" on:click={() => setPercent(percent)}>{percent}%</button>
      {/each}
    </div>

    <div class="skill-controls" aria-label="Прогресс дерева">
      {#each skills as [skillId, title]}
        <label>
          <span>{title}<strong>{skillProgress[skillId] ?? 0}%</strong></span>
          <input type="range" min="0" max="100" step="5" value={skillProgress[skillId] ?? 0} on:input={(event) => setSkillProgress(skillId, Number(event.currentTarget.value))} />
        </label>
      {/each}
    </div>

    <input class="dev-search" type="search" bind:value={query} placeholder="Найти задачу" />

    <div class="dev-list">
      {#each filtered as challenge}
        <label>
          <input type="checkbox" checked={solved.has(challenge.id)} on:change={() => toggle(challenge.id)} />
          <span><strong>{challenge.title}</strong><small>{challenge.category} · F{challenge.rank + 1}</small></span>
        </label>
      {/each}
    </div>

    <footer>
      <button class="save" type="button" disabled={saving} on:click={save}>
        {saving ? "Сохраняем…" : saved ? "Сохранено" : "Применить прогресс"}
      </button>
    </footer>
  </aside>
{/if}

<style>
  .dev-trigger { position: fixed; z-index: 80; right: 16px; bottom: 16px; display: inline-flex; align-items: center; gap: 8px; height: 34px; padding: 0 11px; border: 1px solid #4b596b; border-radius: 6px; background: #161c24; color: #f4f7fb; box-shadow: 0 10px 28px rgb(0 0 0 / 34%); font: 700 10px/1 var(--font-mono); cursor: pointer; }
  .dev-trigger:hover { border-color: #d8e5f7; background: #263244; }
  .dev-trigger span { color: #9fb0c7; font-weight: 500; }
  .dev-panel { position: fixed; z-index: 79; top: 72px; right: 16px; bottom: 58px; display: flex; width: min(390px, calc(100vw - 32px)); flex-direction: column; overflow: hidden; border: 1px solid #394555; border-radius: 12px; background: #10151c; box-shadow: 0 24px 70px rgb(0 0 0 / 58%); }
  header { display: flex; align-items: start; justify-content: space-between; padding: 16px; border-bottom: 1px solid #29313c; }
  header span { color: #90a0b5; font: 700 9px/1 var(--font-mono); letter-spacing: .1em; text-transform: uppercase; }
  h2 { margin: 4px 0 0; color: #f4f7fb; font-size: 18px; }
  header button { width: 28px; height: 28px; border: 1px solid #35404e; border-radius: 6px; background: #171e27; color: #c0cad7; font-size: 18px; cursor: pointer; }
  .dev-summary { display: flex; align-items: baseline; gap: 10px; padding: 14px 16px 8px; }
  .dev-summary strong { color: #f4d35e; font: 700 24px/1 var(--font-mono); }
  .dev-summary span { color: #9ba7b7; font-size: 11px; }
  .dev-presets { display: grid; grid-template-columns: repeat(5, 1fr); gap: 5px; padding: 6px 16px 12px; }
  .dev-presets button { min-height: 30px; border: 1px solid #303b49; border-radius: 6px; background: #171e27; color: #cbd4df; font: 600 10px/1 var(--font-mono); cursor: pointer; }
  .dev-presets button:hover { border-color: #d8e5f7; background: #263244; color: #fff; }
  .skill-controls { display: grid; gap: 7px; padding: 10px 16px 12px; border-top: 1px solid #242c36; }
  .skill-controls label { display: grid; grid-template-columns: 100px 1fr; align-items: center; gap: 10px; }
  .skill-controls span { display: flex; justify-content: space-between; gap: 6px; color: #aeb8c5; font-size: 10px; }
  .skill-controls strong { color: #f4d35e; font: 600 9px/1 var(--font-mono); }
  .skill-controls input { width: 100%; accent-color: #f4d35e; }
  .dev-search { min-height: 36px; margin: 0 16px 10px; padding: 0 10px; border: 1px solid #303b49; border-radius: 7px; background: #0c1117; color: #edf1f6; font: inherit; font-size: 12px; }
  .dev-list { min-height: 0; flex: 1; overflow-y: auto; border-top: 1px solid #242c36; }
  .dev-list label { display: grid; grid-template-columns: 18px 1fr; align-items: center; gap: 9px; min-height: 48px; padding: 7px 16px; border-bottom: 1px solid #202832; cursor: pointer; }
  .dev-list label:hover { background: #1c2531; }
  .dev-list input { width: 15px; height: 15px; accent-color: #f4d35e; }
  .dev-list span { display: grid; gap: 3px; min-width: 0; }
  .dev-list strong { overflow: hidden; color: #e8edf3; font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }
  .dev-list small { color: #8491a2; font: 9px/1 var(--font-mono); }
  footer { padding: 12px 16px; border-top: 1px solid #29313c; }
  .save { width: 100%; min-height: 38px; border: 1px solid #f4d35e; border-radius: 7px; background: #f4d35e; color: #111318; font-weight: 700; cursor: pointer; }
  .save:disabled { cursor: wait; opacity: .6; }
</style>
