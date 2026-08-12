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

<div class="container challenges-page">
  <div class="page-header"><h1>Все задачи</h1><p class="page-subtitle">Название, уровень и теги — всё необходимое, чтобы быстро выбрать следующую практику.</p>{#if catalogReady}<span class="catalog-source">Каталог синхронизирован с PocketBase</span>{/if}</div>
  <FilterBar bind:search bind:rankRange bind:category bind:group bind:language bind:sort {groups} />
  {#if challenges.length}
    <div class="challenges-virtual-scroll" bind:this={viewport} on:scroll={() => scrollTop = viewport?.scrollTop ?? 0}>
      <div class="challenges-virtual-canvas" style:height={`${rowCount * rowHeight}px`}>
        {#each visibleRows as row (row.rowIndex)}
          <div class="challenges-virtual-row" style:top={`${row.rowIndex * rowHeight}px`}>
            {#each row.items as challenge (challenge.id)}
              <ChallengeCard {challenge} onClick={() => navigate(`/challenges/${challenge.id}`)} />
            {/each}
          </div>
        {/each}
      </div>
    </div>
  {:else}
    <div class="empty-state">По этим фильтрам задач нет.</div>
  {/if}
</div>
