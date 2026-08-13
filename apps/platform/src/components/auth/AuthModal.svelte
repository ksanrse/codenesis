<script lang="ts">
  import {
    downloadRecoveryFile,
    loginDeveloper,
    loginPasskey,
    readRecoveryFile,
    registerPasskey,
    restoreWithRecovery,
    updatePasskeyWithRecovery,
    type RecoveryFile,
  } from "../../lib/auth-client";

  export let onAuthenticated: () => void = () => {};

  let recoveryFile: RecoveryFile | null = null;
  let selectedFile = "";
  let busy = false;
  let error = "";
  let copied = false;
  let recoveryPhraseInput = "";

  async function run(action: () => Promise<void>) {
    busy = true;
    error = "";
    try {
      await action();
      onAuthenticated();
    } catch (cause) {
      error = cause instanceof Error ? cause.message : "Не удалось выполнить операцию.";
    } finally {
      busy = false;
    }
  }

  async function createPasskey() {
    const result = await registerPasskey();
    recoveryFile = result.recoveryFile;
    downloadRecoveryFile(result.recoveryFile);
  }

  async function copyRecovery() {
    if (!recoveryFile) return;
    try {
      await navigator.clipboard.writeText(recoveryFile.recoveryPhrase);
      copied = true;
      window.setTimeout(() => (copied = false), 1800);
    } catch {
      error = "Браузер не разрешил доступ к буферу обмена. Скопируйте слова вручную.";
    }
  }

  async function loadRecovery(event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    selectedFile = file?.name ?? "";
    if (!file) return;
    try {
      recoveryFile = await readRecoveryFile(file);
      recoveryPhraseInput = recoveryFile.recoveryPhrase;
      error = "";
    } catch (cause) {
      recoveryFile = null;
      error = cause instanceof Error ? cause.message : "Не удалось прочитать recovery-файл.";
    }
  }

  $: recoveryWords = recoveryPhraseInput.trim().toLowerCase().split(/\s+/).filter(Boolean);
  $: hasRecoveryPhrase = recoveryWords.length === 12;
  $: phraseRecoveryFile = hasRecoveryPhrase
    ? ({ type: "codenesis-recovery", version: 1, recoveryPhrase: recoveryWords.join(" ") } satisfies RecoveryFile)
    : null;
  $: activeRecoveryFile = phraseRecoveryFile ?? recoveryFile;
  $: canRecover = activeRecoveryFile !== null;
</script>

<div
  class="fixed inset-0 z-[1000] grid place-items-center bg-background/72 p-[var(--space-4)] backdrop-blur-xl sm:p-[var(--space-6)]"
  role="presentation"
>
  <div
    class="flex max-h-[calc(100dvh-var(--space-8))] w-full max-w-[480px] flex-col overflow-y-auto rounded-[var(--radius-panel)] border border-border bg-card p-[calc(var(--panel-padding)+var(--space-2))] text-center shadow-float sm:max-h-[calc(100dvh-var(--space-12))]"
    role="dialog"
    aria-modal="true"
    aria-labelledby="auth-title"
  >
    <div class="mb-[var(--space-6)] text-[15px] font-semibold tracking-[0.04em] text-foreground">Codenesis</div>
    <h1 id="auth-title" class="m-0 text-[22px] font-semibold tracking-[-0.02em] text-foreground">Войдите, чтобы продолжить</h1>
    <p class="mt-[var(--space-3)] text-[13px] leading-6 text-dim">
      {hasRecoveryPhrase
        ? "Слова распознаны. Выберите, что сделать с этим ключом."
        : "Используйте passkey — Face ID, Touch ID, Windows Hello или ключ безопасности."}
    </p>

    {#if !hasRecoveryPhrase}
      <button
        class="mt-[var(--space-8)] inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-border bg-foreground px-4 text-[13px] font-semibold text-background transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60"
        type="button"
        disabled={busy}
        on:click={() => run(loginPasskey)}
      >
        {busy ? "Проверяем…" : "Войти с passkey"}
      </button>

      <div class="my-[var(--space-6)] flex items-center gap-[var(--space-3)] text-[12px] text-dim before:h-px before:flex-1 before:bg-border before:content-[''] after:h-px after:flex-1 after:bg-border after:content-['']">
        <span class="shrink-0">или</span>
      </div>

      <button
        class="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-border bg-surface px-4 text-[13px] font-medium text-content transition-colors hover:border-border-strong hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60"
        type="button"
        disabled={busy}
        on:click={() => run(createPasskey)}
      >
        Создать passkey
      </button>
      <p class="mt-[var(--space-3)] text-left text-[11px] leading-5 text-muted">При создании recovery-файл с 12 словами скачается автоматически.</p>
    {/if}

    {#if import.meta.env.DEV && !hasRecoveryPhrase}
      <div class="mt-[var(--space-6)] grid gap-[var(--space-2)] border-t border-border pt-[var(--space-6)] text-left">
        <span class="font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">Локальный developer</span>
        <button
          class="inline-flex min-h-10 items-center justify-center rounded-md border border-border bg-surface px-3 text-[12px] font-medium text-content transition-colors hover:border-border-strong hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60"
          type="button"
          disabled={busy}
          on:click={() => run(() => loginDeveloper().then(() => undefined))}
        >
          Войти в dev-режим
        </button>
      </div>
    {/if}

    {#if !recoveryFile || hasRecoveryPhrase}
      <label class="mt-[var(--space-8)] grid gap-[var(--space-2)] text-left text-[11px] text-muted">
        <span>Вставьте 12 слов recovery-ключа</span>
        <textarea
          bind:value={recoveryPhraseInput}
          rows="3"
          placeholder="слово1 слово2 слово3 … слово12"
          spellcheck="false"
          class="min-h-[92px] w-full resize-y rounded-lg border border-border bg-background px-3 py-2 font-mono text-[12px] leading-6 text-content outline-none transition-colors placeholder:text-dim focus:border-border-strong focus:ring-2 focus:ring-primary/25"
        ></textarea>
      </label>
      {#if recoveryPhraseInput.trim() && !hasRecoveryPhrase}
        <p class="mt-2 text-left text-[12px] leading-5 text-danger">Нужно вставить ровно 12 слов.</p>
      {/if}
    {/if}

    {#if activeRecoveryFile}
      <div class="mt-[var(--space-6)] rounded-xl border border-border-strong bg-background p-[var(--space-4)] text-left">
        <p class="mb-2 text-[12px] font-semibold text-content">{hasRecoveryPhrase ? "Recovery-ключ" : "Сохраните эти 12 слов"}</p>
        <div class="grid grid-cols-3 gap-1.5" aria-label="Recovery-фраза">
          {#each activeRecoveryFile.recoveryPhrase.split(" ") as word, index}
            <span class="rounded-md border border-border bg-surface px-2 py-1.5 font-mono text-[11px] text-content">
              <small class="mr-1 inline-block min-w-[15px] text-dim">{index + 1}</small>{word}
            </span>
          {/each}
        </div>
        {#if !hasRecoveryPhrase}
          <div class="mt-2 grid gap-2">
            <button
              class="inline-flex min-h-10 w-full items-center justify-center rounded-lg border border-border bg-surface px-4 text-[12px] font-medium text-content transition-colors hover:border-border-strong hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              type="button"
              on:click={copyRecovery}
            >
              {copied ? "Скопировано" : "Скопировать слова"}
            </button>
            <button
              class="inline-flex min-h-10 w-full items-center justify-center rounded-lg border-0 bg-transparent px-0 text-[12px] font-medium text-info transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              type="button"
              on:click={() => downloadRecoveryFile(activeRecoveryFile!)}
            >
              Скачать файл ещё раз
            </button>
          </div>
        {/if}
      </div>
    {/if}

    {#if !hasRecoveryPhrase}
      <label class="mt-[var(--space-6)] inline-flex min-h-11 w-full cursor-pointer items-center justify-center rounded-lg border border-border bg-surface px-4 text-[13px] font-medium text-content transition-colors hover:border-border-strong hover:bg-surface-muted focus-within:border-border-strong focus-within:bg-surface-muted">
        <span>{selectedFile || "Войти через recovery-файл"}</span>
        <input class="hidden" type="file" accept="application/json,.json" on:change={loadRecovery} />
      </label>
    {/if}
    {#if hasRecoveryPhrase}
      <div class="mt-4 grid gap-2">
        <button
          class="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-border bg-foreground px-4 text-[13px] font-semibold text-background transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60"
          type="button"
          disabled={busy}
          on:click={() => run(() => restoreWithRecovery(activeRecoveryFile!))}
        >
          {busy ? "Проверяем…" : "Войти"}
        </button>
        <button
          class="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-border bg-surface px-4 text-[13px] font-medium text-content transition-colors hover:border-border-strong hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60"
          type="button"
          disabled={busy}
          on:click={() => run(() => updatePasskeyWithRecovery(activeRecoveryFile!))}
        >
          Восстановить
        </button>
      </div>
    {:else if canRecover}
      <button
        class="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-border bg-surface px-4 text-[13px] font-medium text-content transition-colors hover:border-border-strong hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60"
        type="button"
        disabled={busy}
        on:click={() => run(() => restoreWithRecovery(activeRecoveryFile!))}
      >
        Восстановить доступ
      </button>
      <button
        class="mt-2 inline-flex min-h-10 w-full items-center justify-center rounded-lg border-0 bg-transparent px-0 text-[12px] font-medium text-info transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60"
        type="button"
        disabled={busy}
        on:click={() => run(() => updatePasskeyWithRecovery(activeRecoveryFile!))}
      >
        Обновить passkey этим файлом
      </button>
    {/if}

    {#if error}
      <p class="mt-4 text-[12px] leading-5 text-danger" role="alert">{error}</p>
    {/if}
    <p class="mt-[var(--space-6)] border-t border-border pt-[var(--space-5)] text-[11px] leading-5 text-muted">
      Recovery-файл хранится только у вас. Если потеряны и passkey, и файл, восстановление невозможно.
    </p>
  </div>
</div>
