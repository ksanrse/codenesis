<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import * as monaco from 'monaco-editor';
  import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
  import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
  import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
  import TypeScriptWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
  import type { ChallengeFile } from '@codenesis/challenges';

  declare global {
    interface Window {
      __codenesisSetEditorValue?: (value: string) => void;
      MonacoEnvironment?: {
        getWorker: (_moduleId: string, label: string) => Worker;
      };
    }
  }

  window.MonacoEnvironment = {
    getWorker: (_moduleId, label) => {
      if (label === 'json') return new JsonWorker();
      if (label === 'css' || label === 'scss' || label === 'less') return new CssWorker();
      if (label === 'typescript' || label === 'javascript') return new TypeScriptWorker();
      return new EditorWorker();
    },
  };

  export let files: ChallengeFile[] = [];
  export let fullTestFiles: ChallengeFile[] = [];
  export let view: 'code' | 'tests' | 'full-tests' = 'code';
  export let theme = 'vs-dark';
  export let fontSize = 14;
  export let onFileChange: (path: string, content: string) => void = () => {};
  export let onRunTests: () => void = () => {};
  export let onSave: (files: Record<string, string>) => Promise<void> | void = () => {};

  let container: HTMLDivElement | null = null;
  let editor: monaco.editor.IStandaloneCodeEditor | undefined;
  let activeFile = '';
  let contents: Record<string, string> = {};
  let saveTimer: ReturnType<typeof setTimeout> | undefined;
  let dirty = false;

  $: allFiles = [...files, ...fullTestFiles.filter((f) => !files.some((x) => x.path === f.path))];
  $: editableFiles = files.filter((f) => !f.path.includes('.test.') && f.path !== 'package.json');
  $: testFiles = files.filter((f) => f.path.includes('.test.'));
  $: visibleFiles = view === 'full-tests' ? fullTestFiles : view === 'tests' ? testFiles : editableFiles;
  $: readOnly = view !== 'code';
  $: if (!visibleFiles.some((f) => f.path === activeFile)) activeFile = visibleFiles[0]?.path ?? '';
  $: if (allFiles) syncFiles(allFiles);
  $: if (editor) {
    editor.updateOptions({ readOnly, fontSize });
    monaco.editor.setModelMarkers(editor.getModel()!, 'owner', []);
  }

  function languageFromPath(path: string) {
    if (path.endsWith('.tsx')) return 'typescriptreact';
    if (path.endsWith('.ts')) return 'typescript';
    if (path.endsWith('.jsx')) return 'javascriptreact';
    if (path.endsWith('.js')) return 'javascript';
    if (path.endsWith('.css')) return 'css';
    if (path.endsWith('.html')) return 'html';
    if (path.endsWith('.json')) return 'json';
    return 'plaintext';
  }

  function syncFiles(next: ChallengeFile[]) {
    const nextContents = Object.fromEntries(next.map((f) => [f.path, f.content]));
    if (!dirty) contents = nextContents;
    if (!activeFile) activeFile = visibleFiles[0]?.path ?? '';
    if (editor && editor.getModel()?.uri.path.endsWith(activeFile) === false) mountEditor();
  }

  function mountEditor() {
    if (!container) return;
    const previousModel = editor?.getModel();
    editor?.dispose();
    previousModel?.dispose();
    const path = activeFile || `${view}.js`;
    const model = monaco.editor.createModel(contents[path] ?? '', languageFromPath(path), monaco.Uri.parse(`file:///${path}`));
    editor = monaco.editor.create(container, {
      model,
      theme,
      minimap: { enabled: false },
      fontSize,
      fontFamily: "'Geist Mono', ui-monospace, monospace",
      lineNumbers: 'on',
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      wordWrap: 'on',
      padding: { top: 12 },
      readOnly,
      readOnlyMessage: { value: 'Тесты доступны для чтения.' },
    });
    window.__codenesisSetEditorValue = (value: string) => {
      if (!readOnly) editor?.setValue(value);
    };
    editor.onDidChangeModelContent(() => {
      if (readOnly || !activeFile) return;
      const value = editor?.getValue() ?? '';
      contents = { ...contents, [activeFile]: value };
      dirty = true;
      onFileChange(activeFile, value);
      if (saveTimer) clearTimeout(saveTimer);
      saveTimer = setTimeout(() => { void onSave(contents); dirty = false; }, 5000);
    });
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, onRunTests);
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => void saveCurrent());
  }

  async function saveCurrent() {
    if (editor && !readOnly && activeFile) {
      const value = editor.getValue().replace(/\n{3,}/g, '\n\n').replace(/^\n+/, '').replace(/\n+$/, '\n');
      if (value !== editor.getValue()) editor.setValue(value);
      contents = { ...contents, [activeFile]: value };
      onFileChange(activeFile, value);
    }
    dirty = false;
    await onSave(contents);
  }

  function selectFile(path: string) { activeFile = path; mountEditor(); }

  onMount(() => {
    syncFiles(allFiles);
    mountEditor();
    const keydown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && ['s', 'ы'].includes(event.key.toLowerCase())) {
        event.preventDefault(); void saveCurrent();
      }
    };
    window.addEventListener('keydown', keydown);
    window.addEventListener('beforeunload', () => { if (dirty) void onSave(contents); });
    return () => window.removeEventListener('keydown', keydown);
  });

  onDestroy(() => {
    if (saveTimer) clearTimeout(saveTimer);
    delete window.__codenesisSetEditorValue;
    const model = editor?.getModel();
    editor?.dispose();
    model?.dispose();
  });
</script>

<div class="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-panel">
  <div class="flex items-center gap-2 overflow-x-auto border-b border-border bg-surface px-3 py-2">
    {#each visibleFiles as file}
      <button
        type="button"
        class={`inline-flex min-h-9 shrink-0 items-center rounded-full px-3 text-sm font-medium transition ${
          file.path === activeFile
            ? 'bg-card text-foreground shadow-[inset_0_0_0_1px_var(--border)]'
            : 'text-muted hover:bg-surface-muted hover:text-foreground'
        }`}
        on:click={() => selectFile(file.path)}
      >
        {file.path.split('/').pop()}
      </button>
    {/each}
  </div>
  <div class="min-h-0 flex-1" bind:this={container}></div>
</div>
