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

<div class="output-panel" class:has-results={isRunning || testResults.length > 0} class:is-collapsed={collapsed}>
  {#if !hideHeader}
    <div role="presentation" class="output-header is-draggable is-draggable-y" on:pointerdown={onHeaderPointerDown}>
      <span class="output-title">〉_ Вывод</span>
      {#if testResults.length}<span class="test-summary"><span class="test-passed">{passed} пройдено</span>{#if failed}<span class="test-failed">{failed} ошибок</span>{/if}<span class="test-total">{testResults.length} всего</span></span>{/if}
      {#if isRunning}<span class="output-running shimmer-text">Запуск тестов...</span>{/if}
      {#if onToggleCollapse}<button type="button" class="panel-tab-icon panel-tab-collapse output-collapse" aria-label={collapsed ? 'Развернуть вывод' : 'Свернуть вывод'} on:click={onToggleCollapse}>{collapsed ? '⌃' : '⌄'}</button>{/if}
    </div>
  {:else if testResults.length}
    <div class="output-header output-header-compact"><span class="test-summary"><span class="test-passed">{passed} пройдено</span>{#if failed}<span class="test-failed">{failed} ошибок</span>{/if}<span class="test-total">{testResults.length} всего</span></span>{#if isRunning}<span class="output-running shimmer-text">Запуск тестов...</span>{/if}</div>
  {/if}
  {#if visibleTests.length}
    <div class="test-results">
      {#each visibleTests as test, index}
        {@const hasDetails = test.status === 'fail' && Boolean(test.error)}
        <div class="test-result test-{test.status}" class:test-result-clickable={hasDetails} class:is-open={hasDetails && expanded.has(index)}>
          <button type="button" class="test-result-row" disabled={!hasDetails} aria-expanded={hasDetails ? expanded.has(index) : undefined} on:click={() => hasDetails && toggle(index)}>
            <span class="test-icon">{test.status === 'pass' ? '✓' : test.status === 'fail' ? '×' : '◌'}</span><span class="test-name">{test.name}</span>{#if test.status === 'running'}<span class="test-state shimmer-text">running</span>{/if}{#if hasDetails}<span class="test-result-chevron">⌄</span>{/if}
          </button>
          {#if hasDetails && expanded.has(index)}<pre class="test-result-error">{test.error}</pre>{/if}
        </div>
      {/each}
    </div>
  {:else}
    <pre class:output-terminal-running={isRunning} class="output-terminal">{output || 'Запусти тесты, чтобы проверить решение.'}</pre>
  {/if}
</div>
