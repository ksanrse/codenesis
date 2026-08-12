<script lang="ts">
  import { getAllChallenges } from "@codenesis/challenges";
  import { roadmaps } from "../lib/roadmaps";

  const challenges = getAllChallenges();
  const go = (path: string) => {
    window.location.hash = path;
  };
</script>

<div class="mx-auto flex w-full max-w-[var(--container-width)] flex-col gap-7 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
  <section class="overflow-hidden rounded-[var(--radius-panel)] border border-border bg-card shadow-panel">
    <div class="grid gap-8 p-8 md:grid-cols-[1.2fr_0.8fr] md:p-10 lg:p-12">
      <div class="flex max-w-2xl flex-col gap-6">
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-info">Codenesis</p>
        <div class="space-y-4">
          <h1 class="text-balance text-[clamp(2.25rem,4.4vw,3.8rem)] font-semibold leading-[1.02] tracking-[-0.055em] text-foreground">Практика, которая остаётся с вами</h1>
          <p class="max-w-xl text-base leading-7 text-muted">Решайте задачи, запускайте тесты прямо в браузере и собирайте свой прогресс по рангам.</p>
        </div>
        <div class="flex flex-wrap gap-3">
          <button
            class="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-md border border-primary bg-primary px-[14px] py-[7px] text-[13px] font-semibold leading-none text-primary-foreground transition-colors duration-150 ease-[var(--ease-standard)] hover:border-primary-hover hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--primary)] focus-visible:outline-offset-2"
            type="button"
            on:click={() => go("/challenges")}
          >
            Открыть задачи
          </button>
          <button
            class="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-md border border-border bg-transparent px-[14px] py-[7px] text-[13px] font-medium leading-none text-foreground transition-colors duration-150 ease-[var(--ease-standard)] hover:border-border-strong hover:bg-surface-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--primary)] focus-visible:outline-offset-2"
            type="button"
            on:click={() => go("/roadmaps")}
          >
            Открыть roadmap
          </button>
        </div>
      </div>
      <div class="grid gap-3 rounded-[calc(var(--radius-panel)-2px)] border border-border bg-background/60 p-4">
        <div class="rounded-2xl border border-border bg-surface-muted p-4">
          <div class="text-xs uppercase tracking-[0.14em] text-muted">Ваша практика</div>
          <div class="mt-2 text-3xl font-semibold tracking-[-0.04em] text-foreground">{challenges.length}</div>
          <div class="mt-1 text-sm text-muted">задач в каталоге</div>
        </div>
        <div class="rounded-2xl border border-border bg-surface-muted p-4">
          <div class="text-xs uppercase tracking-[0.14em] text-muted">Маршруты</div>
          <div class="mt-2 text-3xl font-semibold tracking-[-0.04em] text-foreground">{roadmaps.length}</div>
          <div class="mt-1 text-sm text-muted">учебных направлений</div>
        </div>
      </div>
    </div>
  </section>

  <section class="space-y-4">
    <div class="flex items-end justify-between gap-4">
      <div>
        <h2 class="text-lg font-semibold tracking-[-0.03em] text-foreground">Ваш учебный центр</h2>
        <p class="mt-1 text-sm text-muted">Короткие входы в ключевые разделы без лишнего шума.</p>
      </div>
      <span class="text-xs text-dim">{challenges.length} задач</span>
    </div>

    <div class="grid gap-3 md:grid-cols-3">
      <button class="group rounded-[var(--radius-card)] border border-border bg-surface p-5 text-left shadow-panel transition-colors hover:border-border-strong hover:bg-surface-muted" type="button" on:click={() => go("/challenges")}>
        <strong class="block text-sm font-semibold text-foreground">Все задачи</strong>
        <span class="mt-2 block text-sm leading-6 text-muted">Фильтры по уровню, языку и теме</span>
      </button>
      <button class="group rounded-[var(--radius-card)] border border-border bg-surface p-5 text-left shadow-panel transition-colors hover:border-border-strong hover:bg-surface-muted" type="button" on:click={() => go("/roadmaps")}>
        <strong class="block text-sm font-semibold text-foreground">Roadmaps</strong>
        <span class="mt-2 block text-sm leading-6 text-muted">{roadmaps.length} последовательный путь от основ до проекта</span>
      </button>
      <button class="group rounded-[var(--radius-card)] border border-border bg-surface p-5 text-left shadow-panel transition-colors hover:border-border-strong hover:bg-surface-muted" type="button" on:click={() => go("/profile")}>
        <strong class="block text-sm font-semibold text-foreground">Профиль</strong>
        <span class="mt-2 block text-sm leading-6 text-muted">Прогресс, ранг и история попыток</span>
      </button>
    </div>
  </section>
</div>
