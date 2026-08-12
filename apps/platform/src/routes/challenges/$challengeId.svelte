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
  <div class="container empty-state"><h1>Задача не найдена</h1><p>Проверь ссылку или вернись в каталог.</p><a class="btn btn-outline btn-sm" href="#/challenges">К каталогу</a></div>
{/if}
