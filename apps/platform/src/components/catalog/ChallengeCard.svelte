<script lang="ts">
  import type { ChallengeMeta } from "@codenesis/challenges";
  import { getChallengeLevelLabel } from "@codenesis/challenges";

  export let challenge: ChallengeMeta = null!;
  export let onClick: () => void = () => undefined;

  $: tags = [...new Set([challenge.category, challenge.group, ...challenge.tags])].slice(0, 8);
</script>

<button class="challenge-card" type="button" on:click={onClick}>
  <div class="card-header">
    <span class="badge badge-rank">{getChallengeLevelLabel(challenge.rank)}</span>
  </div>
  <h3 class="card-title">{challenge.title}</h3>
  <div class="challenge-tags" aria-label="Теги задачи">
    {#each tags as tag (tag)}
      <span class="challenge-tag">{tag}</span>
    {/each}
  </div>
</button>
