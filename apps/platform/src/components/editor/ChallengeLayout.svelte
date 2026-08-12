<script lang="ts">
  import { getAllChallenges, getChallengeLevelLabel, getRankBand, type ChallengeDefinition, type ChallengeMeta, type Language } from '@codenesis/challenges';
  import { onMount } from 'svelte';
  import EditorPanel from './EditorPanel.svelte';
  import OutputPanel from './OutputPanel.svelte';
  import ChallengeDescription from './ChallengeDescription.svelte';
  import AttemptHistoryPanel from './AttemptHistoryPanel.svelte';
  import { canRunInBrowser, runBrowserTests, type TestResult } from '../../lib/browser-test-runner';
  import { getCurrentSourceFiles, getSourceFiles, shouldRecordAttempt } from '../../lib/challenge-files';
  import { addAttempt, clearDraft, getAttempts, getDraft, saveDraft } from '../../lib/local-db';
  import { getPassedChallengeIds } from '../../lib/progress';

  export let challenge: ChallengeDefinition = null!;
  export let onNavigate: (challengeId: string) => void = () => {};
  export let challengeList: ChallengeMeta[] = getAllChallenges();

  let language: Language = challenge.languages[0];
  let editorView: 'code' | 'tests' | 'full-tests' = 'code';
  let sidebarView: 'description' | 'solution' | 'attempts' = 'description';
  let files = challenge.starterFiles[language] ?? [];
  let fullTests = challenge.fullTestFiles?.[language] ?? challenge.testFiles[language] ?? [];
  let output = '';
  let testResults: TestResult[] = [];
  let running = false;
  let draftVersion = 0;
  let changes: Record<string, string> = {};
  let attemptsVersion = 0;
  let completed = false;

  $: rankBand = getRankBand(challenge.rank);
  $: files = [
    ...(challenge.starterFiles[language] ?? []).map((file) => ({
      ...file,
      content: getDraft(challenge.id, language)?.files[file.path] ?? file.content,
    })),
    ...(challenge.testFiles[language] ?? []),
  ];
  $: fullTests = challenge.fullTestFiles?.[language] ?? challenge.testFiles[language] ?? [];
  $: expectedTests = (challenge.testFiles[language] ?? []).flatMap((file) => Array.from(file.content.matchAll(/\b(?:it|test)\(\s*["'`](.+?)["'`]/g), (m) => m[1]));
  $: attempts = (attemptsVersion, getAttempts().filter((attempt) => attempt.challengeId === challenge.id && attempt.language === language));
  $: passedIds = getPassedChallengeIds(getAttempts());
  $: challengeIndex = challengeList.findIndex((item) => item.id === challenge.id);
  $: nextChallengeId = challengeList[challengeIndex + 1]?.id;

  function selectLanguage(next: Language) {
    language = next;
    changes = {};
    output = '';
    testResults = [];
    completed = false;
    draftVersion += 1;
  }

  function onFileChange(path: string, content: string) {
    changes = { ...changes, [path]: content };
  }

  async function run(mode: 'check' | 'submit' = 'check') {
    if (running) return;
    const runtimeFiles = files.map((file) => ({ ...file, content: changes[file.path] ?? file.content }));
    const filesForRun = mode === 'submit' ? [...runtimeFiles.filter((file) => !file.path.includes('.test.') && file.path !== 'package.json'), ...fullTests] : runtimeFiles;
    if (!canRunInBrowser(filesForRun)) { output = 'Этот тип задания пока нельзя запустить в браузере.'; return; }
    running = true; output = mode === 'submit' ? 'Запуск полной проверки...' : 'Запуск тестов...'; testResults = [];
    try {
      const result = runBrowserTests(filesForRun);
      output = result.raw; testResults = result.results as TestResult[]; completed = mode === 'submit' && result.exitCode === 0;
      if (mode === 'submit') {
        const submitted = getCurrentSourceFiles(files, changes); const passed = testResults.filter((t) => t.status === 'pass').length; const failed = testResults.filter((t) => t.status === 'fail').length;
        const previous = getAttempts().filter((attempt) => attempt.challengeId === challenge.id && attempt.language === language);
        if (shouldRecordAttempt(submitted, getSourceFiles(challenge.starterFiles[language] ?? []), previous, result.exitCode === 0 ? 'passed' : 'failed', testResults.length)) { addAttempt({ challengeId: challenge.id, challengeTitle: challenge.title, language, status: result.exitCode === 0 ? 'passed' : 'failed', passed, failed, total: testResults.length, files: submitted, output: result.raw }); attemptsVersion += 1; }
      }
    } catch (error) { output = error instanceof Error ? error.message : 'Неизвестная ошибка'; } finally { running = false; }
  }

  function save(filesMap: Record<string, string>) { saveDraft(challenge.id, language, filesMap); }
  function reset() { changes = {}; clearDraft(challenge.id, language); draftVersion += 1; output = ''; testResults = []; completed = false; }

  onMount(() => { const handler = (event: KeyboardEvent) => { if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') { event.preventDefault(); void run(); } }; window.addEventListener('keydown', handler); return () => window.removeEventListener('keydown', handler); });
</script>

<div class="mx-auto flex w-full max-w-[var(--container-width)] flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
  <div class="grid min-h-[calc(100vh-7rem)] gap-4 xl:grid-cols-[minmax(300px,0.86fr)_minmax(0,1.14fr)]">
    <section class="rounded-2xl border border-border bg-card p-[var(--panel-padding)] shadow-panel">
      <div class="space-y-4">
        <div class="space-y-2">
          <div class="flex flex-wrap items-start gap-3">
            <h1 class="text-[clamp(28px,4vw,38px)] font-semibold tracking-[-0.03em] text-foreground">{challenge.title}</h1>
            <span class="inline-flex h-7 items-center rounded-full border border-border bg-surface px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{getChallengeLevelLabel(challenge.rank)}</span>
            {#if completed || passedIds.has(challenge.id)}<span class="inline-flex h-7 items-center rounded-full border border-success-border bg-success-light px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-success">Сделано</span>{/if}
          </div>
          <div class="flex flex-wrap gap-2 text-xs text-muted"><span>{challenge.category}</span><span>•</span><span>{challenge.group}</span><span>•</span><span>{rankBand.label}</span><span>•</span><span>+{challenge.reputation} MMR</span></div>
        </div>

        <div class="flex flex-wrap gap-2">
          <button type="button" class={`inline-flex min-h-9 items-center rounded-full px-4 text-xs font-medium transition ${sidebarView === 'description' ? 'bg-surface text-foreground shadow-[inset_0_0_0_1px_var(--border)]' : 'text-muted hover:bg-surface hover:text-foreground'}`} on:click={() => (sidebarView = 'description')}>Описание</button>
          <button type="button" class={`inline-flex min-h-9 items-center rounded-full px-4 text-xs font-medium transition ${sidebarView === 'solution' ? 'bg-surface text-foreground shadow-[inset_0_0_0_1px_var(--border)]' : 'text-muted hover:bg-surface hover:text-foreground'}`} on:click={() => (sidebarView = 'solution')}>Решение</button>
          <button type="button" class={`inline-flex min-h-9 items-center rounded-full px-4 text-xs font-medium transition ${sidebarView === 'attempts' ? 'bg-surface text-foreground shadow-[inset_0_0_0_1px_var(--border)]' : 'text-muted hover:bg-surface hover:text-foreground'}`} on:click={() => (sidebarView = 'attempts')}>Попытки</button>
        </div>

        <div class="rounded-xl border border-border bg-surface p-4">
          {#if sidebarView === 'description'}
            <ChallengeDescription markdown={challenge.description} />
          {:else if sidebarView === 'attempts'}
            <AttemptHistoryPanel {attempts} />
          {:else}
            <div class="space-y-2 text-sm text-muted">
              <h2 class="text-base font-semibold text-foreground">Решение</h2>
              <p>Подсказка и готовое решение доступны после открытия соответствующей вкладки.</p>
            </div>
          {/if}
        </div>
      </div>
    </section>

    <div class="grid min-h-0 gap-4">
      <section class="min-h-0 rounded-2xl border border-border bg-card p-3 shadow-panel">
        <div class="mb-3 flex flex-wrap items-center gap-2">
          <div class="flex flex-wrap gap-2">
            <button type="button" class={`inline-flex min-h-9 items-center rounded-full px-4 text-xs font-medium transition ${editorView === 'code' ? 'bg-surface text-foreground shadow-[inset_0_0_0_1px_var(--border)]' : 'text-muted hover:bg-surface hover:text-foreground'}`} on:click={() => (editorView = 'code')}>Код</button>
            <button type="button" class={`inline-flex min-h-9 items-center rounded-full px-4 text-xs font-medium transition ${editorView === 'tests' ? 'bg-surface text-foreground shadow-[inset_0_0_0_1px_var(--border)]' : 'text-muted hover:bg-surface hover:text-foreground'}`} on:click={() => (editorView = 'tests')}>Тесткейсы</button>
            {#if testResults.length}<button type="button" class={`inline-flex min-h-9 items-center rounded-full px-4 text-xs font-medium transition ${editorView === 'full-tests' ? 'bg-surface text-foreground shadow-[inset_0_0_0_1px_var(--border)]' : 'text-muted hover:bg-surface hover:text-foreground'}`} on:click={() => (editorView = 'full-tests')}>Все тесты</button>{/if}
          </div>
          <div class="ml-auto flex flex-wrap gap-2">
            {#each challenge.languages as lang}
              <button type="button" class={`inline-flex min-h-9 items-center rounded-full px-4 text-xs font-medium transition ${lang === language ? 'bg-surface text-foreground shadow-[inset_0_0_0_1px_var(--border)]' : 'text-muted hover:bg-surface hover:text-foreground'}`} on:click={() => selectLanguage(lang)}>{lang}</button>
            {/each}
          </div>
        </div>
        <EditorPanel {files} {fullTests} view={editorView} onFileChange={onFileChange} onRunTests={() => void run()} onSave={save} />
      </section>

      <div class="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-muted shadow-panel">
        <span>{running ? 'Запуск...' : 'Черновик сохраняется автоматически'}</span>
        <div class="flex flex-wrap gap-2">
          <button class="inline-flex min-h-9 items-center rounded-full border border-border px-4 text-xs font-medium text-content transition hover:border-border-strong hover:bg-surface-muted" on:click={reset}>Сбросить</button>
          <button class="inline-flex min-h-9 items-center rounded-full border border-border bg-primary px-4 text-xs font-medium text-background transition hover:bg-primary-hover" disabled={running} on:click={() => void run()}>Проверить</button>
          <button class="inline-flex min-h-9 items-center rounded-full border border-border bg-info px-4 text-xs font-medium text-background transition hover:bg-[color:color-mix(in_srgb,_var(--color-info)_85%,_white)]" disabled={running} on:click={() => completed ? onNavigate(nextChallengeId ?? '') : void run('submit')}>{completed ? (nextChallengeId ? 'Следующее задание' : 'К списку задач') : 'Завершить'}</button>
        </div>
      </div>

      <section class="rounded-2xl border border-border bg-card p-3 shadow-panel">
        <OutputPanel expectedTests={expectedTests} {output} testResults={testResults} isRunning={running} hideHeader />
      </section>
    </div>
  </div>
</div>
