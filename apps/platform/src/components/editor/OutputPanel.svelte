<script lang="ts">
  import type { TestResult } from '../../lib/browser-test-runner';
  export let expectedTests: string[] = [];
  export let output = '';
  export let testResults: TestResult[] = [];
  export let isRunning = false;
  export let collapsed = false;
  export let hideHeader = false;
  export let onToggleCollapse: (() => void) | undefined;
  export let onHeaderPointerDown: ((event: PointerEvent) => void) | undefined;

  let expanded = new Set<number>();

  $: passed = testResults.filter((test) => test.status === 'pass').length;
  $: failed = testResults.filter((test) => test.status === 'fail').length;
  $: visibleTests = testResults.length ? testResults : isRunning ? expectedTests.map((name) => ({ name, status: 'running' as const })) : [];
  $: if (testResults) expanded = new Set(testResults.flatMap((test, index) => test.status === 'fail' && test.error ? [index] : []));

  function toggle(index: number) {
    const next = new Set(expanded);
    if (next.has(index)) next.delete(index);
    else next.add(index);
    expanded = next;
  }
</script>

<div class={`flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-panel ${isRunning || testResults.length > 0 ? 'border-border-strong' : ''} ${collapsed ? 'h-auto' : ''}`}>
  {#if !hideHeader}
    <div role="presentation" class="flex items-center gap-3 border-b border-border bg-surface px-4 py-3 text-sm" on:pointerdown={onHeaderPointerDown}>
      <span class="font-medium text-foreground">〉_ Вывод</span>
      {#if testResults.length}
        <span class="flex flex-wrap items-center gap-2 text-xs text-muted">
          <span class="font-medium text-success">{passed} пройдено</span>
          {#if failed}<span class="font-medium text-danger">{failed} ошибок</span>{/if}
          <span>{testResults.length} всего</span>
        </span>
      {/if}
      {#if isRunning}<span class="ml-auto text-xs text-muted shimmer-text">Запуск тестов...</span>{/if}
      {#if onToggleCollapse}
        <button
          type="button"
          class="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-muted transition hover:border-border-strong hover:text-foreground"
          aria-label={collapsed ? 'Развернуть вывод' : 'Свернуть вывод'}
          on:click={onToggleCollapse}
        >
          {collapsed ? '⌃' : '⌄'}
        </button>
      {/if}
    </div>
  {:else if testResults.length}
    <div class="flex items-center gap-3 border-b border-border bg-surface px-4 py-3 text-sm">
      <span class="flex flex-wrap items-center gap-2 text-xs text-muted">
        <span class="font-medium text-success">{passed} пройдено</span>
        {#if failed}<span class="font-medium text-danger">{failed} ошибок</span>{/if}
        <span>{testResults.length} всего</span>
      </span>
      {#if isRunning}<span class="ml-auto text-xs text-muted shimmer-text">Запуск тестов...</span>{/if}
    </div>
  {/if}

  {#if visibleTests.length}
    <div class="flex min-h-0 flex-1 flex-col gap-2 overflow-auto p-4">
      {#each visibleTests as test, index}
        {@const hasDetails = test.status === 'fail' && Boolean(test.error)}
        <div class={`rounded-xl border border-border bg-surface px-3 py-2 ${test.status === 'pass' ? 'text-success' : test.status === 'fail' ? 'text-danger' : 'text-muted'} ${hasDetails ? 'cursor-pointer' : ''} ${hasDetails && expanded.has(index) ? 'border-border-strong' : ''}`}>
          <button
            type="button"
            class="flex w-full items-center gap-3 text-left text-sm"
            disabled={!hasDetails}
            aria-expanded={hasDetails ? expanded.has(index) : undefined}
            on:click={() => hasDetails && toggle(index)}
          >
            <span class="inline-flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-xs font-semibold">
              {test.status === 'pass' ? '✓' : test.status === 'fail' ? '×' : '◌'}
            </span>
            <span class="min-w-0 flex-1 truncate text-foreground">{test.name}</span>
            {#if test.status === 'running'}<span class="text-xs text-muted shimmer-text">running</span>{/if}
            {#if hasDetails}<span class="text-xs text-muted">⌄</span>{/if}
          </button>
          {#if hasDetails && expanded.has(index)}
            <pre class="mt-3 overflow-auto rounded-lg border border-border bg-background p-3 text-xs leading-relaxed text-content">{test.error}</pre>
          {/if}
        </div>
      {/each}
    </div>
  {:else}
    <pre class={`min-h-0 flex-1 overflow-auto rounded-b-xl bg-background p-4 font-mono text-sm leading-6 text-content ${isRunning ? 'text-muted' : ''}`}>{output || 'Запусти тесты, чтобы проверить решение.'}</pre>
  {/if}
</div>
