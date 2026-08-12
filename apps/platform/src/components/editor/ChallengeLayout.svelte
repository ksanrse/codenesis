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
  function selectLanguage(next: Language) { language = next; changes = {}; output = ''; testResults = []; completed = false; draftVersion += 1; }
  function onFileChange(path: string, content: string) { changes = { ...changes, [path]: content }; }
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

<div class="challenge-layout challenge-layout-mosaic">
  <div class="challenge-mosaic-shell">
    <section class="challenge-info"><div class="challenge-info-header"><h1 class="challenge-title">{challenge.title}</h1><span class="badge badge-rank">{getChallengeLevelLabel(challenge.rank)}</span>{#if completed || passedIds.has(challenge.id)}<span class="badge badge-completed">Сделано</span>{/if}</div><div class="challenge-meta"><span>{challenge.category}</span><span>{challenge.group}</span><span>{rankBand.label}</span><span>+{challenge.reputation} MMR</span></div><div class="challenge-panel-tabs"><button class:active={sidebarView === 'description'} class="panel-tab" on:click={() => sidebarView = 'description'}>Описание</button><button class:active={sidebarView === 'solution'} class="panel-tab" on:click={() => sidebarView = 'solution'}>Решение</button><button class:active={sidebarView === 'attempts'} class="panel-tab" on:click={() => sidebarView = 'attempts'}>Попытки</button></div>{#if sidebarView === 'description'}<ChallengeDescription markdown={challenge.description} />{:else if sidebarView === 'attempts'}<AttemptHistoryPanel {attempts} />{:else}<div class="challenge-helper-card"><h2>Решение</h2><p>Подсказка и готовое решение доступны после открытия соответствующей вкладки.</p></div>{/if}</section>
    <div class="challenge-workspace">
      <section class="editor-code-block"><div class="challenge-panel-tabs editor-panel-tabs"><button class:active={editorView === 'code'} class="panel-tab" on:click={() => editorView = 'code'}>Код</button><button class:active={editorView === 'tests'} class="panel-tab" on:click={() => editorView = 'tests'}>Тесткейсы</button>{#if testResults.length}<button class:active={editorView === 'full-tests'} class="panel-tab" on:click={() => editorView = 'full-tests'}>Все тесты</button>{/if}<div class="language-selector">{#each challenge.languages as lang}<button class:active={lang === language} class="lang-btn" on:click={() => selectLanguage(lang)}>{lang}</button>{/each}</div></div><EditorPanel {files} {fullTests} view={editorView} onFileChange={onFileChange} onRunTests={() => void run()} onSave={save} /></section>
      <div class="challenge-action-bar"><span class="save-status">{running ? 'Запуск...' : 'Черновик сохраняется автоматически'}</span><div class="challenge-action-right"><button class="btn btn-outline btn-sm" on:click={reset}>Сбросить</button><button class="btn btn-primary btn-sm" disabled={running} on:click={() => void run()}>Проверить</button><button class="btn btn-accent btn-sm" disabled={running} on:click={() => completed ? onNavigate(nextChallengeId ?? '') : void run('submit')}>{completed ? (nextChallengeId ? 'Следующее задание' : 'К списку задач') : 'Завершить'}</button></div></div>
      <section class="challenge-output"><OutputPanel expectedTests={expectedTests} {output} testResults={testResults} isRunning={running} hideHeader /></section>
    </div>
  </div>
</div>
