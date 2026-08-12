<script lang="ts">
  import { getChallengeCollections, getRankProgress } from "@codenesis/challenges";
  import { attempts } from "../lib/database-store.ts";
  import { getMmrScore, getPassedChallengeIds } from "../lib/progress.ts";

  const collections = getChallengeCollections();
  const formatDate = (value: string) =>
    new Intl.DateTimeFormat("ru", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
  $: passed = $attempts.filter((attempt) => attempt.status === "passed").length;
  $: passedIds = getPassedChallengeIds($attempts);
  $: rank = getRankProgress(getMmrScore($attempts));
</script>

<div class="container mx-auto max-w-[var(--container-width)] px-[var(--page-x)] py-[var(--page-y)]">
  <header class="mb-6 border-b border-border pb-5">
    <div class="space-y-1.5">
      <h1 class="text-[clamp(28px,4vw,38px)] font-semibold tracking-[-0.03em] text-foreground">Профиль</h1>
      <p class="text-sm leading-6 text-muted">Все сохраненные попытки решения и результаты тестов.</p>
    </div>
  </header>

  <section class="grid gap-4 rounded-[var(--radius-panel)] border border-border bg-surface p-5 shadow-panel lg:grid-cols-[1fr_1.2fr] lg:p-6">
    <div class="space-y-3">
      <span class="text-xs font-semibold uppercase tracking-[0.18em] text-dim">Текущий уровень</span>
      <div class="text-[clamp(30px,5vw,52px)] font-semibold tracking-[-0.05em] text-foreground">{rank.title}</div>
      <div class="text-sm font-medium text-muted">{rank.score} MMR</div>
      <a href="#/profile/rank" class="inline-flex h-9 items-center rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:border-border-strong hover:bg-surface-muted">Подробнее</a>
    </div>
    <div class="rounded-[var(--radius-xl)] border border-border bg-background/60 p-4">
      <div class="flex items-center justify-between gap-3 text-sm text-muted">
        <span>{rank.score} MMR</span>
        <span>{rank.nextTitle ? `до уровня ${rank.nextTitle}: ${rank.remainingScore} MMR` : "верхний уровень текущей шкалы"}</span>
      </div>
      <div class="mt-3 h-2 overflow-hidden rounded-full bg-surface-muted" aria-label={`${rank.progressPercent}%`}>
        <span class="block h-full rounded-full bg-primary" style={`width:${rank.progressPercent}%`}></span>
      </div>
      <p class="mt-3 text-sm leading-6 text-muted">MMR начисляется один раз за первую успешную сдачу задачи.</p>
    </div>
  </section>

  <div class="mt-4 grid gap-3 sm:grid-cols-3">
    <div class="rounded-[var(--radius-card)] border border-border bg-surface p-4">
      <span class="block text-3xl font-semibold tracking-[-0.04em] text-foreground">{$attempts.length}</span>
      <span class="mt-1 block text-sm text-muted">попыток</span>
    </div>
    <div class="rounded-[var(--radius-card)] border border-border bg-surface p-4">
      <span class="block text-3xl font-semibold tracking-[-0.04em] text-foreground">{passed}</span>
      <span class="mt-1 block text-sm text-muted">успешных</span>
    </div>
    <div class="rounded-[var(--radius-card)] border border-border bg-surface p-4">
      <span class="block text-3xl font-semibold tracking-[-0.04em] text-foreground">{$attempts.length ? Math.round((passed / $attempts.length) * 100) : 0}%</span>
      <span class="mt-1 block text-sm text-muted">проходов</span>
    </div>
  </div>

  <section class="mt-8 space-y-4">
    <div class="flex items-end justify-between gap-4">
      <div>
        <h2 class="text-lg font-semibold tracking-[-0.03em] text-foreground">Навыки</h2>
        <p class="mt-1 text-sm text-muted">Прогресс растет, когда задача успешно проходит все тесты.</p>
      </div>
    </div>
    <div class="grid gap-3">
      {#each collections as collection}
        <article class="rounded-[var(--radius-xl)] border border-border bg-card p-4">
          <div class="flex items-start justify-between gap-4">
            <div>
              <div class="text-sm font-medium text-foreground">{collection.skillLabel}</div>
              <div class="text-xs text-dim">{collection.tag}</div>
            </div>
            <span class="text-sm font-semibold text-muted">{collection.challengeIds.filter((id) => passedIds.has(id)).length}/{collection.challengeCount}</span>
          </div>
          <div class="mt-3 h-2 overflow-hidden rounded-full bg-surface-muted">
            <span
              class="block h-full rounded-full bg-primary"
              style={`width:${collection.challengeCount ? Math.round(collection.challengeIds.filter((id) => passedIds.has(id)).length / collection.challengeCount * 100) : 0}%`}
            ></span>
          </div>
        </article>
      {/each}
    </div>
  </section>

  <section class="mt-8 grid gap-3">
    {#each $attempts as attempt}
      <article class="flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-xl)] border border-border bg-surface px-4 py-3">
        <div class="min-w-0">
          <div class="truncate text-sm font-medium text-foreground">{attempt.challengeTitle}</div>
          <div class="text-xs text-dim">{formatDate(attempt.createdAt)} · {attempt.language}</div>
        </div>
        <div class="flex flex-wrap items-center gap-3 text-sm">
          <span class={`rounded-md border px-2 py-1 text-xs font-semibold ${attempt.status === "passed" ? "border-success/30 bg-success/10 text-success" : "border-danger/30 bg-danger/10 text-danger"}`}>
            {attempt.status === "passed" ? "пройдено" : "ошибка"}
          </span>
          <span class="text-muted">{attempt.passed}/{attempt.total || attempt.passed + attempt.failed} тестов</span>
        </div>
      </article>
    {:else}
      <p class="rounded-[var(--radius-xl)] border border-border bg-surface px-4 py-6 text-sm text-muted">Пока нет попыток.</p>
    {/each}
  </section>
</div>
