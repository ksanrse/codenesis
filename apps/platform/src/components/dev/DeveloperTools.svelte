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

<button
  class="fixed bottom-4 right-4 z-80 inline-flex h-9 items-center gap-2 rounded-xl border border-border-strong bg-card px-3 text-[10px] font-bold tracking-[0.08em] text-foreground shadow-float transition-colors hover:border-white/70 hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
  type="button"
  aria-expanded={open}
  on:click={() => (open = !open)}
>
  <span class="font-mono">DEV</span>
  <span class="text-muted">{solved.size}/{challenges.length}</span>
</button>

{#if open}
  <aside
    class="fixed bottom-[58px] right-4 top-[72px] z-[79] flex w-[min(390px,calc(100vw-32px))] flex-col overflow-hidden rounded-[var(--radius-panel)] border border-border-strong bg-card shadow-float"
    aria-label="Developer tools"
  >
    <header class="flex items-start justify-between gap-4 border-b border-border px-4 py-4">
      <div>
        <span class="block font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-muted">Локальный профиль</span>
        <h2 class="mt-1 text-[18px] font-semibold text-foreground">Developer</h2>
      </div>
      <button
        class="grid h-7 w-7 place-items-center rounded-md border border-border bg-surface text-[18px] leading-none text-content transition-colors hover:border-border-strong hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        type="button"
        aria-label="Закрыть"
        on:click={() => (open = false)}
      >
        ×
      </button>
    </header>

    <section class="flex items-baseline gap-2 px-4 pb-2 pt-3">
      <strong class="font-mono text-[24px] font-bold text-warning">{Math.round((solved.size / Math.max(1, challenges.length)) * 100)}%</strong>
      <span class="text-[11px] text-muted">{solved.size} решено · {challenges.length - solved.size} не решено</span>
    </section>

    <div class="grid grid-cols-5 gap-1.5 px-4 pb-3 pt-1" aria-label="Быстрый прогресс">
      {#each [0, 25, 50, 75, 100] as percent}
        <button
          class="min-h-8 rounded-md border border-border bg-surface px-2 text-[10px] font-semibold text-content transition-colors hover:border-border-strong hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          type="button"
          on:click={() => setPercent(percent)}
        >
          {percent}%
        </button>
      {/each}
    </div>

    <div class="grid gap-2 border-t border-border px-4 py-3" aria-label="Прогресс дерева">
      {#each skills as [skillId, title]}
        <label class="grid grid-cols-[100px_minmax(0,1fr)] items-center gap-2">
          <span class="flex items-center justify-between gap-1 text-[10px] text-muted">
            {title}
            <strong class="font-mono text-[9px] font-semibold text-warning">{skillProgress[skillId] ?? 0}%</strong>
          </span>
          <input
            class="w-full accent-warning"
            type="range"
            min="0"
            max="100"
            step="5"
            value={skillProgress[skillId] ?? 0}
            on:input={(event) => setSkillProgress(skillId, Number(event.currentTarget.value))}
          />
        </label>
      {/each}
    </div>

    <input
      class="mx-4 mb-3 min-h-9 rounded-md border border-border bg-background px-3 text-[12px] text-content outline-none transition-colors placeholder:text-dim focus:border-border-strong focus:ring-2 focus:ring-primary/25"
      type="search"
      bind:value={query}
      placeholder="Найти задачу"
    />

    <div class="min-h-0 flex-1 overflow-y-auto border-t border-border">
      {#each filtered as challenge}
        <label class="grid min-h-12 cursor-pointer grid-cols-[18px_minmax(0,1fr)] items-center gap-2.5 border-b border-border/70 px-4 py-2 transition-colors hover:bg-surface-muted">
          <input class="h-[15px] w-[15px] accent-warning" type="checkbox" checked={solved.has(challenge.id)} on:change={() => toggle(challenge.id)} />
          <span class="grid min-w-0 gap-1">
            <strong class="truncate text-[11px] text-content">{challenge.title}</strong>
            <small class="font-mono text-[9px] text-dim">{challenge.category} · F{challenge.rank + 1}</small>
          </span>
        </label>
      {/each}
    </div>

    <footer class="border-t border-border px-4 py-3">
      <button
        class="inline-flex min-h-10 w-full items-center justify-center rounded-md border border-warning bg-warning px-4 text-[12px] font-bold text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60"
        type="button"
        disabled={saving}
        on:click={save}
      >
        {saving ? "Сохраняем…" : saved ? "Сохранено" : "Применить прогресс"}
      </button>
    </footer>
  </aside>
{/if}
