<script lang="ts">
  import { onMount } from "svelte";
  import { getCatalogChallengeById, getCatalogChallenges, loadChallengeCatalog } from '../../lib/challenge-catalog';
  import ChallengeLayout from '../../components/editor/ChallengeLayout.svelte';

  function challengeIdFromHash() {
    const path = window.location.hash.replace(/^#\/?/, '').split('?')[0];
    return path.split('/')[1] ?? '';
  }

  let challengeId = challengeIdFromHash();
  let challenge = getCatalogChallengeById(challengeId);
  let challengeList = getCatalogChallenges();

  function sync() {
    challengeId = challengeIdFromHash();
    challenge = getCatalogChallengeById(challengeId);
  }

  function navigate(path: string) {
    window.location.hash = path.startsWith('/') ? `#${path}` : `#/${path}`;
  }

  function navigateAfterChallenge(id: string) {
    navigate(id ? `/challenges/${id}` : '/challenges');
  }

  onMount(() => {
    void loadChallengeCatalog().then(() => { challengeList = getCatalogChallenges(); sync(); }).catch(() => undefined);
  });
</script>

<svelte:window onhashchange={sync} />

{#if challenge}
  {#key challenge.id}
    <ChallengeLayout {challenge} {challengeList} onNavigate={navigateAfterChallenge} />
  {/key}
{:else}
  <div class="mx-auto flex min-h-[calc(100vh-var(--header-height))] w-full max-w-[var(--container-width)] items-center px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
    <div class="w-full rounded-[var(--radius-xl)] border border-border bg-surface px-6 py-8 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
      <h1 class="text-xl font-semibold tracking-[-0.02em] text-foreground">Задача не найдена</h1>
      <p class="mt-2 text-sm leading-6 text-muted">Проверь ссылку или вернись в каталог.</p>
      <a
        class="mt-5 inline-flex h-9 items-center justify-center rounded-md border border-border bg-surface-muted px-4 text-sm font-medium text-foreground transition-colors duration-150 ease-[var(--ease-standard)] hover:border-border-strong hover:bg-surface"
        href="#/challenges"
      >
        К каталогу
      </a>
    </div>
  </div>
{/if}
