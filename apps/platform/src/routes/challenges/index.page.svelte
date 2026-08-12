<script lang="ts">
  import type { Category, ChallengeSort, Language } from "@codenesis/challenges";
  import ChallengeCard from "../../components/catalog/ChallengeCard.svelte";
  import FilterBar from "../../components/catalog/FilterBar.svelte";
  import { onMount } from "svelte";
  import { filterCatalogChallenges, getCatalogGroups, loadChallengeCatalog } from "../../lib/challenge-catalog";

  export let navigate: (path: string) => void = (path) => { window.location.hash = path; };
  let search = "";
  let rankRange = "";
  let category: Category | "" = "";
  let group = "";
  let language: Language | "" = "";
  let sort: ChallengeSort = "default";
  let groups = getCatalogGroups();
  let catalogReady = false;
  let viewport: HTMLDivElement | null = null;
  let scrollTop = 0;
  let viewportHeight = 640;
  let columnCount = 3;
  const overscanRows = 2;

  $: [minRank, maxRank] = rankRange ? rankRange.split("-").map(Number) : [undefined, undefined];
  $: challenges = filterCatalogChallenges({ search: search || undefined, minRank, maxRank, category: category || undefined, group: group || undefined, language: language || undefined, sort });
  $: rowHeight = columnCount === 1 ? 128 : 132;
  $: rowCount = Math.ceil(challenges.length / columnCount);
  $: startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - overscanRows);
  $: endRow = Math.min(rowCount, Math.ceil((scrollTop + viewportHeight) / rowHeight) + overscanRows);
  $: visibleRows = Array.from({ length: Math.max(0, endRow - startRow) }, (_, offset) => {
    const rowIndex = startRow + offset;
    return { rowIndex, items: challenges.slice(rowIndex * columnCount, (rowIndex + 1) * columnCount) };
  });

  function updateViewport() {
    if (!viewport) return;
    viewportHeight = viewport.clientHeight;
    columnCount = window.innerWidth <= 640 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
    if (scrollTop > rowCount * rowHeight) {
      scrollTop = 0;
      viewport.scrollTop = 0;
    }
  }

  onMount(() => {
    void loadChallengeCatalog().then(() => { groups = getCatalogGroups(); catalogReady = true; }).catch(() => undefined);
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  });
</script>

<div class="container mx-auto max-w-[var(--container-width)] px-[var(--page-x)] pb-[var(--space-12)] pt-[var(--page-y)]">
  <header class="mb-6 border-b border-border pb-5">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div class="min-w-0 space-y-1.5">
        <div class="text-xs font-semibold uppercase tracking-[0.18em] text-dim">Каталог</div>
        <h1 class="text-[clamp(28px,4vw,38px)] font-semibold tracking-[-0.03em] text-foreground">Все задачи</h1>
        <p class="max-w-[70ch] text-sm leading-6 text-muted">Название, уровень и теги — всё необходимое, чтобы быстро выбрать следующую практику.</p>
      </div>
      {#if catalogReady}
        <span class="inline-flex h-7 items-center rounded-md border border-border bg-surface px-3 text-[11px] font-medium tracking-[0.06em] text-muted shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">Каталог синхронизирован с PocketBase</span>
      {/if}
    </div>
  </header>

  <FilterBar bind:search bind:rankRange bind:category bind:group bind:language bind:sort {groups} />

  {#if challenges.length}
    <div
      bind:this={viewport}
      on:scroll={() => (scrollTop = viewport?.scrollTop ?? 0)}
      class="relative z-[1] mb-12 h-[min(72vh,760px)] overflow-auto rounded-[var(--radius-lg)] border border-border bg-transparent [contain:strict]"
    >
      <div class="relative w-full" style:height={`${rowCount * rowHeight}px`}>
        {#each visibleRows as row (row.rowIndex)}
          <div
            class="absolute inset-x-0 grid gap-2.5"
            class:grid-cols-1={columnCount === 1}
            class:grid-cols-2={columnCount === 2}
            class:grid-cols-3={columnCount === 3}
            style:top={`${row.rowIndex * rowHeight}px`}
          >
            {#each row.items as challenge (challenge.id)}
              <ChallengeCard {challenge} onClick={() => navigate(`/challenges/${challenge.id}`)} />
            {/each}
          </div>
        {/each}
      </div>
    </div>
  {:else}
    <div class="mb-12 grid place-items-center rounded-[var(--radius-lg)] border border-border bg-surface px-6 py-12 text-center text-sm text-muted">По этим фильтрам задач нет.</div>
  {/if}
</div>
