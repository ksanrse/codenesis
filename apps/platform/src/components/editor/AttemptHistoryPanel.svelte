<script lang="ts">
  import type { ChallengeAttempt } from '../../lib/local-db';
  export let attempts: ChallengeAttempt[] = [];
  let selectedAttemptId: string | undefined = undefined;
  $: selectedAttempt = attempts.find((attempt) => attempt.id === selectedAttemptId);
  const dateFormatter = new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  function total(attempt: ChallengeAttempt) { return attempt.total || attempt.passed + attempt.failed; }
  function code(files: Record<string, string>) { return Object.entries(files).sort(([a], [b]) => a.localeCompare(b)).map(([path, content]) => `// ${path}\n${content.trimEnd()}`).join('\n\n'); }
</script>

{#if !attempts.length}
  <div class="challenge-helper-card"><h2>Попыток пока нет</h2><p>Попытка появится после завершения решения, если код отличается от starter-кода.</p></div>
{:else if selectedAttempt}
  {@const index = attempts.findIndex((attempt) => attempt.id === selectedAttempt.id)}
  <div class="challenge-attempt-detail-page">
    <button type="button" class="attempt-back-button" on:click={() => selectedAttemptId = undefined}>← К попыткам</button>
    <div class="attempt-detail-header"><div><h2>Попытка {attempts.length - index}</h2><p>{dateFormatter.format(new Date(selectedAttempt.createdAt))}</p></div><span class:selected={selectedAttempt.status === 'passed'} class="{selectedAttempt.status === 'passed' ? 'test-passed' : 'test-failed'}">{selectedAttempt.status === 'passed' ? 'пройдено' : 'ошибка'}</span></div>
    <div class="attempt-detail-stat"><span>Тесты</span><strong>{selectedAttempt.passed}/{total(selectedAttempt)}</strong></div>
    <section class="attempt-detail-section"><h3>Код</h3><pre class="attempt-code-block"><code>{code(selectedAttempt.files)}</code></pre></section>
  </div>
{:else}
  <div class="challenge-attempts-panel">
    {#each attempts as attempt, index}
      <article class="challenge-attempt-row"><button type="button" class="challenge-attempt-summary" on:click={() => selectedAttemptId = attempt.id}><span><span class="challenge-attempt-title">Попытка {attempts.length - index}</span><span class="challenge-attempt-meta">{dateFormatter.format(new Date(attempt.createdAt))}</span></span><span class="challenge-attempt-result"><span class={attempt.status === 'passed' ? 'test-passed' : 'test-failed'}>{attempt.status === 'passed' ? 'пройдено' : 'ошибка'}</span><span>{attempt.passed}/{total(attempt)} тестов</span></span></button></article>
    {/each}
  </div>
{/if}
