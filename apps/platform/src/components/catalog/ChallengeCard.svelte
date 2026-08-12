<script lang="ts">
  import type { ChallengeMeta } from "@codenesis/challenges";
  import { getChallengeLevelLabel } from "@codenesis/challenges";

  export let challenge: ChallengeMeta = null!;
  export let onClick: () => void = () => undefined;

  $: tags = [...new Set([challenge.category, challenge.group, ...challenge.tags])].slice(0, 8);
</script>

<button
  type="button"
  on:click={onClick}
  class="group flex h-[148px] w-full flex-col items-start gap-3 overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card px-4 py-4 text-left text-content shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-colors duration-150 ease-[var(--ease-standard)] hover:border-border-strong hover:bg-surface-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--focus-ring)] focus-visible:outline-offset-2"
>
  <div class="flex w-full items-center justify-between gap-3">
    <span class="badge badge-rank">{getChallengeLevelLabel(challenge.rank)}</span>
  </div>
  <h3 class="text-[15px] font-medium leading-[1.35] tracking-[0.01em] text-foreground">
    {challenge.title}
  </h3>
  <div class="line-clamp-2 flex flex-wrap gap-2 overflow-hidden" aria-label="Теги задачи">
    {#each tags as tag (tag)}
      <span class="inline-flex h-5 items-center rounded-md border border-border bg-surface px-2 text-[11px] font-medium leading-none text-muted">
        {tag}
      </span>
    {/each}
  </div>
</button>
