<script lang="ts">
  import type { ChallengeAttempt } from '../../lib/local-db';

  export let attempts: ChallengeAttempt[] = [];

  let selectedAttemptId: string | undefined = undefined;

  $: selectedAttempt = attempts.find((attempt) => attempt.id === selectedAttemptId);

  const dateFormatter = new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

  function total(attempt: ChallengeAttempt) {
    return attempt.total || attempt.passed + attempt.failed;
  }

  function code(files: Record<string, string>) {
    return Object.entries(files)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([path, content]) => `// ${path}\n${content.trimEnd()}`)
      .join('\n\n');
  }
</script>

{#if !attempts.length}
  <div class="rounded-xl border border-border bg-surface p-4 text-sm text-muted">
    <h2 class="text-base font-semibold text-foreground">Попыток пока нет</h2>
    <p class="mt-2 leading-6">Попытка появится после завершения решения, если код отличается от starter-кода.</p>
  </div>
{:else if selectedAttempt}
  {@const index = attempts.findIndex((attempt) => attempt.id === selectedAttempt.id)}
  <div class="space-y-4">
    <button
      type="button"
      class="inline-flex min-h-9 items-center rounded-full border border-border bg-surface px-4 text-sm font-medium text-content transition hover:border-border-strong hover:bg-surface-muted"
      on:click={() => (selectedAttemptId = undefined)}
    >
      ← К попыткам
    </button>

    <div class="rounded-xl border border-border bg-surface p-4">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 class="text-lg font-semibold text-foreground">Попытка {attempts.length - index}</h2>
          <p class="mt-1 text-sm text-muted">{dateFormatter.format(new Date(selectedAttempt.createdAt))}</p>
        </div>
        <span class={`inline-flex h-8 items-center rounded-full border px-3 text-xs font-semibold uppercase tracking-[0.14em] ${selectedAttempt.status === 'passed' ? 'border-success bg-success-light text-success' : 'border-danger bg-danger-light text-danger'}`}>
          {selectedAttempt.status === 'passed' ? 'пройдено' : 'ошибка'}
        </span>
      </div>

      <div class="mt-4 grid gap-3 sm:grid-cols-2">
        <div class="rounded-xl border border-border bg-card p-4">
          <span class="text-xs uppercase tracking-[0.14em] text-muted">Тесты</span>
          <strong class="mt-2 block text-lg text-foreground">{selectedAttempt.passed}/{total(selectedAttempt)}</strong>
        </div>
        <div class="rounded-xl border border-border bg-card p-4">
          <span class="text-xs uppercase tracking-[0.14em] text-muted">Статус</span>
          <strong class="mt-2 block text-lg text-foreground">{selectedAttempt.status === 'passed' ? 'Успешно' : 'Нужно исправить'}</strong>
        </div>
      </div>

      <section class="mt-4">
        <h3 class="text-sm font-semibold uppercase tracking-[0.14em] text-muted">Код</h3>
        <pre class="mt-3 overflow-auto rounded-xl border border-border bg-background p-4 text-xs leading-6 text-content"><code>{code(selectedAttempt.files)}</code></pre>
      </section>
    </div>
  </div>
{:else}
  <div class="flex max-h-[520px] flex-col gap-2 overflow-auto rounded-xl border border-border bg-surface p-3">
    {#each attempts as attempt, index}
      <article class="rounded-xl border border-border bg-card">
        <button
          type="button"
          class="flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition hover:bg-surface-muted"
          on:click={() => (selectedAttemptId = attempt.id)}
        >
          <span class="min-w-0">
            <span class="block text-sm font-semibold text-foreground">Попытка {attempts.length - index}</span>
            <span class="mt-1 block text-xs text-muted">{dateFormatter.format(new Date(attempt.createdAt))}</span>
          </span>
          <span class="flex shrink-0 items-center gap-3 text-sm">
            <span class={`inline-flex h-8 items-center rounded-full border px-3 text-xs font-semibold uppercase tracking-[0.14em] ${attempt.status === 'passed' ? 'border-success bg-success-light text-success' : 'border-danger bg-danger-light text-danger'}`}>
              {attempt.status === 'passed' ? 'пройдено' : 'ошибка'}
            </span>
            <span class="text-muted">{attempt.passed}/{total(attempt)} тестов</span>
          </span>
        </button>
      </article>
    {/each}
  </div>
{/if}
