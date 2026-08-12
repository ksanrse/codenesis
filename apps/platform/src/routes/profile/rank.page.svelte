<script lang="ts">
  import {
    CHALLENGE_LEVEL_MMR,
    MMR_GRADE_BANDS,
    RANK_BANDS,
    getRankProgress,
  } from "@codenesis/challenges";
  import { attempts } from "../../lib/database-store.ts";
  import { getMmrScore } from "../../lib/progress.ts";

  $: score = getMmrScore($attempts);
  $: rank = getRankProgress(score);
</script>

<div class="container mx-auto max-w-[var(--container-width)] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
  <div class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
    <div class="space-y-3">
      <a href="#/profile" class="inline-flex items-center text-sm font-medium text-muted transition-colors hover:text-foreground">← Профиль</a>
      <h1 class="text-[clamp(28px,4vw,38px)] font-semibold tracking-[-0.03em] text-foreground">MMR и уровень</h1>
      <p class="max-w-[65ch] text-sm leading-6 text-muted">MMR растет за первую успешную сдачу уникальной задачи.</p>
    </div>
    <aside class="rounded-[var(--radius-panel)] border border-border bg-surface p-5 shadow-panel">
      <div class="flex items-center justify-between gap-3 text-sm text-muted">
        <span>Текущий уровень</span>
        <strong class="text-foreground">{score}</strong>
      </div>
      <div class="mt-2 text-2xl font-semibold tracking-[-0.03em] text-foreground">{rank.title}</div>
      <small class="mt-1 block text-xs text-dim">{rank.title} · {rank.progressPercent}%</small>
      <div class="mt-4 h-2 overflow-hidden rounded-full bg-surface-muted">
        <span class="block h-full rounded-full bg-primary" style={`width:${rank.progressPercent}%`}></span>
      </div>
      <p class="mt-3 text-sm leading-6 text-muted">{rank.remainingScore > 0 ? `${rank.remainingScore} MMR до следующего уровня` : "Максимальный уровень текущей шкалы"}</p>
    </aside>
  </div>

  <section class="mt-8 space-y-4">
    <div>
      <h2 class="text-lg font-semibold tracking-[-0.03em] text-foreground">Уровень профиля</h2>
      <p class="mt-1 text-sm text-muted">Шкала показывает накопленную практику по уникально решенным задачам.</p>
    </div>
    <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {#each MMR_GRADE_BANDS as grade, index}
        <article class:opacity-100={rank.rank === index} class:opacity-70={rank.rank !== index} class="rounded-[var(--radius-xl)] border border-border bg-card p-4 shadow-panel transition-opacity">
          <div class="flex items-start justify-between gap-4">
            <div>
              <div class="text-xs uppercase tracking-[0.16em] text-dim">{String(index + 1).padStart(2, "0")}</div>
              <strong class="mt-1 block text-sm font-semibold text-foreground">{grade.label}</strong>
              <p class="mt-1 text-sm leading-6 text-muted">{grade.description}</p>
            </div>
            <span class="text-xs font-medium text-dim">{Number.isFinite(grade.to) ? `${grade.from}-${grade.to}` : `${grade.from}+`} MMR</span>
          </div>
        </article>
      {/each}
    </div>
  </section>

  <section class="mt-8 space-y-4">
    <div>
      <h2 class="text-lg font-semibold tracking-[-0.03em] text-foreground">Уровни задач</h2>
      <p class="mt-1 text-sm text-muted">Чем выше F-уровень, тем больше MMR задача дает после полного прохождения.</p>
    </div>
    <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {#each RANK_BANDS as band, index}
        <article class="rounded-[var(--radius-xl)] border border-border bg-surface p-4 shadow-panel">
          <div class="flex items-center justify-between gap-4">
            <span class={`badge badge-rank rank-tone-${index}`}>{band.label}</span>
            <span class="text-sm font-medium text-muted">{CHALLENGE_LEVEL_MMR[index]} MMR</span>
          </div>
          <p class="mt-3 text-sm leading-6 text-muted">{band.description}</p>
        </article>
      {/each}
    </div>
  </section>
</div>
