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

<div class="auth-backdrop" role="presentation">
  <div class="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title">
    <div class="auth-brand">Codenesis</div>
    <h1 id="auth-title">Войдите, чтобы продолжить</h1>
    <p class="auth-description">
      {hasRecoveryPhrase
        ? "Слова распознаны. Выберите, что сделать с этим ключом."
        : "Используйте passkey — Face ID, Touch ID, Windows Hello или ключ безопасности."}
    </p>

    {#if !hasRecoveryPhrase}
      <button class="auth-primary" type="button" disabled={busy} on:click={() => run(loginPasskey)}>
        {busy ? "Проверяем…" : "Войти с passkey"}
      </button>

      <div class="auth-divider"><span>или</span></div>

      <button class="auth-secondary" type="button" disabled={busy} on:click={() => run(createPasskey)}>
        Создать passkey
      </button>
      <p class="auth-hint">При создании recovery-файл с 12 словами скачается автоматически.</p>
    {/if}

    {#if import.meta.env.DEV && !hasRecoveryPhrase}
      <div class="developer-login">
        <span>Локальный developer</span>
        <button type="button" disabled={busy} on:click={() => run(() => loginDeveloper().then(() => undefined))}>Войти в dev-режим</button>
      </div>
    {/if}

    {#if !recoveryFile || hasRecoveryPhrase}
      <label class="recovery-input">
        <span>Вставьте 12 слов recovery-ключа</span>
        <textarea bind:value={recoveryPhraseInput} rows="3" placeholder="слово1 слово2 слово3 … слово12" spellcheck="false"></textarea>
      </label>
      {#if recoveryPhraseInput.trim() && !hasRecoveryPhrase}
        <p class="auth-error recovery-validation">Нужно вставить ровно 12 слов.</p>
      {/if}
    {/if}

    {#if activeRecoveryFile}
      <div class="recovery-box">
        <p class="recovery-title">{hasRecoveryPhrase ? "Recovery-ключ" : "Сохраните эти 12 слов"}</p>
        <div class="word-grid" aria-label="Recovery-фраза">
          {#each activeRecoveryFile.recoveryPhrase.split(" ") as word, index}
            <span><small>{index + 1}</small>{word}</span>
          {/each}
        </div>
        {#if !hasRecoveryPhrase}
          <div class="recovery-actions">
            <button class="auth-secondary" type="button" on:click={copyRecovery}>{copied ? "Скопировано" : "Скопировать слова"}</button>
            <button class="auth-link" type="button" on:click={() => downloadRecoveryFile(activeRecoveryFile!)}>Скачать файл ещё раз</button>
          </div>
        {/if}
      </div>
    {/if}

    {#if !hasRecoveryPhrase}
      <label class="auth-file">
        <span>{selectedFile || "Войти через recovery-файл"}</span>
        <input type="file" accept="application/json,.json" on:change={loadRecovery} />
      </label>
    {/if}
    {#if hasRecoveryPhrase}
      <div class="phrase-actions">
        <button class="auth-primary" type="button" disabled={busy} on:click={() => run(() => restoreWithRecovery(activeRecoveryFile!))}>
          {busy ? "Проверяем…" : "Войти"}
        </button>
        <button class="auth-secondary" type="button" disabled={busy} on:click={() => run(() => updatePasskeyWithRecovery(activeRecoveryFile!))}>
          Восстановить
        </button>
      </div>
    {:else if canRecover}
      <button class="auth-secondary auth-recovery" type="button" disabled={busy} on:click={() => run(() => restoreWithRecovery(activeRecoveryFile!))}>
        Восстановить доступ
      </button>
      <button class="auth-link" type="button" disabled={busy} on:click={() => run(() => updatePasskeyWithRecovery(activeRecoveryFile!))}>
        Обновить passkey этим файлом
      </button>
    {/if}

    {#if error}<p class="auth-error" role="alert">{error}</p>{/if}
    <p class="auth-footnote">Recovery-файл хранится только у вас. Если потеряны и passkey, и файл, восстановление невозможно.</p>
  </div>
</div>

<style>
  .auth-backdrop { position: fixed; inset: 0; z-index: 1000; display: grid; place-items: center; padding: 24px; background: rgb(4 6 10 / 72%); backdrop-filter: blur(12px); }
  .auth-modal { width: min(100%, 420px); padding: 32px; border: 1px solid rgb(255 255 255 / 12%); border-radius: 16px; background: #101318; box-shadow: 0 24px 80px rgb(0 0 0 / 45%); text-align: center; }
  .auth-brand { margin-bottom: 28px; color: #f5f7fa; font-size: 15px; font-weight: 700; letter-spacing: .04em; }
  h1 { margin: 0; color: #f5f7fa; font-size: 22px; letter-spacing: -.02em; }
  .auth-description { margin: 12px 0 24px; color: #969eac; font-size: 13px; line-height: 1.55; }
  .auth-primary, .auth-secondary, .auth-file, .auth-link { width: 100%; min-height: 42px; border-radius: 8px; font: inherit; font-size: 13px; cursor: pointer; transition: opacity .15s ease, border-color .15s ease; }
  .auth-primary { border: 1px solid #f5f7fa; background: #f5f7fa; color: #0b0d10; font-weight: 650; }
  .auth-secondary, .auth-file { display: grid; place-items: center; border: 1px solid #303640; background: #171b22; color: #e1e6ee; }
  .auth-file { margin-top: 10px; }
  .auth-file input { display: none; }
  .auth-primary:disabled, .auth-secondary:disabled, .auth-file:has(input:disabled), .auth-link:disabled { cursor: wait; opacity: .55; }
  .auth-divider { display: flex; align-items: center; gap: 12px; margin: 20px 0; color: #69717e; font-size: 12px; }
  .auth-divider::before, .auth-divider::after { flex: 1; height: 1px; background: #29303a; content: ""; }
  .auth-hint, .auth-footnote { margin: 10px 0 0; color: #737c8b; font-size: 11px; line-height: 1.45; }
  .recovery-input { display: grid; gap: 8px; margin-top: 18px; color: #aeb7c5; font-size: 11px; text-align: left; }
  .recovery-input textarea { width: 100%; box-sizing: border-box; resize: vertical; padding: 10px; border: 1px solid #303640; border-radius: 8px; outline: none; background: #0b0e13; color: #e7ebf1; font: 12px/1.5 var(--font-mono, monospace); }
  .recovery-input textarea:focus { border-color: #9ebdff; }
  .recovery-validation { margin-top: 8px; text-align: left; }
  .developer-login { display: grid; gap: 8px; margin-top: 18px; padding-top: 18px; border-top: 1px solid #29303a; text-align: left; }
  .developer-login span { color: #aeb7c5; font: 600 11px/1 var(--font-mono, monospace); }
  .developer-login button { min-height: 38px; border: 1px solid #303640; border-radius: 7px; background: #171b22; color: #e7ebf1; font: inherit; font-size: 12px; cursor: pointer; }
  .recovery-box { margin-top: 18px; padding: 14px; border: 1px solid #374355; border-radius: 10px; background: #0b0e13; text-align: left; }
  .recovery-title { margin: 0 0 10px; color: #e1e6ee; font-size: 12px; font-weight: 650; }
  .word-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; }
  .word-grid span { padding: 7px 6px; border: 1px solid #272e39; border-radius: 6px; color: #d6dce5; font-family: var(--font-mono, monospace); font-size: 11px; }
  .word-grid small { display: inline-block; min-width: 15px; color: #737c8b; }
  .recovery-actions { display: grid; gap: 6px; margin-top: 10px; }
  .auth-recovery { margin-top: 10px; }
  .phrase-actions { display: grid; gap: 10px; margin-top: 14px; }
  .auth-link { min-height: auto; margin-top: 12px; border: 0; background: transparent; color: #9ebdff; font-size: 12px; }
  .auth-error { margin: 16px 0 0; color: #ff8c8c; font-size: 12px; line-height: 1.45; }
  @media (max-width: 480px) { .auth-modal { padding: 26px 20px; } }
</style>
