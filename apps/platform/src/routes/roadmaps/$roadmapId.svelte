<script lang="ts">
  import {
    Background,
    BackgroundVariant,
    Controls,
    MarkerType,
    MiniMap,
    SvelteFlow,
    type Edge,
    type NodeEventWithPointer,
  } from "@xyflow/svelte";
  import "@xyflow/svelte/dist/style.css";
  import { getChallengeById, type ChallengeDefinition } from "@codenesis/challenges";
  import { onMount } from "svelte";
  import { attempts } from "../../lib/database-store";
  import { getPassedChallengeIds } from "../../lib/progress";
  import RoadmapNode, {
    type RoadmapFlowNode,
  } from "../../components/roadmaps/RoadmapNode.svelte";
  import { getRoadmapById, type RoadmapChild, type RoadmapStage } from "../../lib/roadmaps";

  let routeHash = typeof window === "undefined" ? "" : window.location.hash;
  let roadmapId = "";
  let roadmap = getRoadmapById(roadmapId);
  const nodeTypes = { roadmap: RoadmapNode };
  let nodes: RoadmapFlowNode[] = [];
  let edges: Edge[] = [];

  $: roadmapId = routeHash.split("/")[2]?.split("?")[0] ?? "";
  $: roadmap = getRoadmapById(roadmapId);
  $: childRoadmaps = roadmap?.children ?? [];
  $: flowItems = childRoadmaps.length ? childRoadmaps : roadmap?.stages ?? [];
  $: flowHeight = Math.max(760, flowItems.length * 142 + 120);
  $: flowColor = roadmap?.tone === "javascript" ? "var(--accent-warning)" : "var(--accent-info)";
  $: nodes = flowItems.map((item, index, items) => {
    const child = "kind" in item ? (item as RoadmapChild) : null;
    const stage = child ? null : (item as RoadmapStage);
    const childRoadmap = child?.roadmapId ? getRoadmapById(child.roadmapId) : undefined;
    return {
      id: item.id,
      type: "roadmap",
      position: { x: 0, y: index * 142 },
      data: {
        title: item.title,
        meta: child ? (child.kind === "external" ? "roadmap.sh" : "курс") : undefined,
        tone: child?.tone ?? roadmap?.tone,
        hasTarget: index > 0,
        hasSource: index < items.length - 1,
      },
      draggable: false,
      connectable: false,
      deletable: false,
      ariaLabel: child ? `Мини-roadmap: ${child.title}` : `Курс: ${stage?.title ?? item.title}`,
    } satisfies RoadmapFlowNode;
  });
  $: edges = flowItems.slice(0, -1).map((item, index) => ({
    id: `${item.id}-${flowItems[index + 1].id}`,
    source: item.id,
    target: flowItems[index + 1].id,
    type: "straight",
    markerEnd: { type: MarkerType.ArrowClosed, color: flowColor },
    style: `stroke:${flowColor};stroke-width:1.8`,
    selectable: false,
  }));

  let selectedStage: RoadmapStage | null = null;
  let selectedChild: RoadmapChild | null = null;
  $: passedChallengeIds = getPassedChallengeIds($attempts);
  $: exercises = selectedStage
    ? selectedStage.exerciseIds
        .map((id) => getChallengeById(id))
        .filter((challenge): challenge is ChallengeDefinition => Boolean(challenge))
    : [];

  const selectStage: NodeEventWithPointer<MouseEvent | TouchEvent, RoadmapFlowNode> = ({ node }) => {
    const child = roadmap?.children?.find((item) => item.id === node.id);
    selectedChild = child ?? null;
    selectedStage = child ? null : roadmap?.stages.find((stage) => stage.id === node.id) ?? null;
  };

  onMount(() => {
    routeHash = window.location.hash;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        selectedStage = null;
        selectedChild = null;
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  });
</script>

<svelte:window onhashchange={() => (routeHash = window.location.hash)} />

{#if roadmap}
  <div class="container mx-auto flex w-full max-w-[var(--container-width)] flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
    <header class="grid gap-3">
      <a class="text-xs text-muted hover:text-foreground" href="#/roadmaps">← Все roadmaps</a>
      <div>
        <h1 class="text-[clamp(2rem,5vw,3rem)] font-semibold tracking-[-0.04em] text-foreground">{roadmap.title}</h1>
      </div>
    </header>

    <div class="min-h-[760px] overflow-hidden rounded-xl border border-border bg-background shadow-panel max-md:mx-[-12px] max-md:min-h-[620px]" style:height={`${flowHeight}px`}>
      <SvelteFlow
        bind:nodes
        bind:edges
        {nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.05, maxZoom: 1 }}
        minZoom={0.55}
        maxZoom={1.5}
        preventScrolling={false}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
        onnodeclick={selectStage}
        colorMode="dark"
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="var(--border-hover)" />
        <MiniMap pannable zoomable nodeColor="var(--bg-muted)" maskColor="var(--bg)" />
        <Controls showLock={false} />
      </SvelteFlow>
    </div>
  </div>

  {#if selectedChild}
    <aside class="fixed bottom-4 right-[max(16px,calc((100vw-var(--container-width))/2+16px))] top-[70px] z-45 flex w-[min(390px,calc(100vw-32px))] flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-float max-md:inset-x-[10px] max-md:top-16 max-md:w-auto" aria-label={`Подробнее: ${selectedChild.title}`}>
      <header class="flex items-start justify-between gap-5 border-b border-border p-5">
        <div><span class="font-mono text-[10px] font-bold uppercase tracking-widest text-info">Mini-roadmap</span><h2 class="mt-1 text-xl font-semibold text-foreground">{selectedChild.title}</h2></div>
        <button class="grid size-8 place-items-center rounded-md border border-border bg-surface-muted text-xl text-muted hover:text-foreground" type="button" aria-label="Закрыть описание" on:click={() => (selectedChild = null)}>×</button>
      </header>
      <div class="flex flex-1 flex-col gap-5 overflow-y-auto p-5">
        <section class="grid gap-2">
          <h3 class="text-xs font-semibold text-foreground">Коротко</h3>
          <p class="text-xs leading-6 text-muted">{selectedChild.description}</p>
        </section>
        {#if selectedChild.kind === "external"}
          <a class="mt-auto rounded-md border border-border px-4 py-3 text-xs text-foreground hover:bg-surface-muted" href={selectedChild.href} target="_blank" rel="noreferrer">Открыть {selectedChild.title} на roadmap.sh ↗</a>
        {:else}
          <a class="mt-auto rounded-md border border-border px-4 py-3 text-xs text-foreground hover:bg-surface-muted" href={`#/roadmaps/${selectedChild.roadmapId}`}>Открыть карту {selectedChild.title} →</a>
        {/if}
      </div>
    </aside>
  {:else if selectedStage}
    <aside class="fixed bottom-4 right-[max(16px,calc((100vw-var(--container-width))/2+16px))] top-[70px] z-45 flex w-[min(390px,calc(100vw-32px))] flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-float max-md:inset-x-[10px] max-md:top-16 max-md:w-auto" aria-label={`Подробнее: ${selectedStage.title}`}>
      <header class="flex items-start justify-between gap-5 border-b border-border p-5">
        <div><span class="font-mono text-[10px] font-bold uppercase tracking-widest text-info">Курс</span><h2 class="mt-1 text-xl font-semibold text-foreground">{selectedStage.title}</h2></div>
        <button class="grid size-8 place-items-center rounded-md border border-border bg-surface-muted text-xl text-muted hover:text-foreground" type="button" aria-label="Закрыть описание" on:click={() => (selectedStage = null)}>×</button>
      </header>

      <div class="flex flex-1 flex-col gap-5 overflow-y-auto p-5">
        <section class="grid gap-2">
          <h3 class="text-xs font-semibold text-foreground">Коротко</h3>
          <p class="text-xs leading-6 text-muted">{selectedStage.description}</p>
        </section>
        <section class="grid gap-2">
          <h3 class="text-xs font-semibold text-foreground">Упражнения</h3>
          <div class="grid gap-2">
            {#each exercises as exercise}
              <a class={`grid grid-cols-[12px_1fr] items-center gap-2 rounded-md border bg-card px-3 py-3 ${passedChallengeIds.has(exercise.id) ? "border-success/50" : "border-border hover:border-border-strong"}`} href={`#/challenges/${exercise.id}`}>
                <span class={`size-2 rounded-full border ${passedChallengeIds.has(exercise.id) ? "border-success bg-success shadow-[0_0_0_3px_var(--success-light)]" : "border-muted"}`} aria-label={passedChallengeIds.has(exercise.id) ? "Решено" : "Не решено"}></span>
                <strong class="text-xs font-semibold text-foreground">{exercise.title}</strong>
              </a>
            {/each}
          </div>
        </section>
        {#if exercises[0]}
          <a class="mt-auto rounded-md border border-warning/50 bg-warning/10 px-4 py-3 text-xs text-warning hover:bg-warning/15" href={`#/challenges/${exercises[0].id}`}>Перейти к курсу →</a>
        {/if}
      </div>
    </aside>
  {/if}
{:else}
  <div class="mx-auto w-full max-w-[var(--container-width)] px-4 py-6 sm:px-6 lg:px-8 lg:py-10"><div class="grid gap-3"><h1 class="text-3xl font-semibold text-foreground">Roadmap не найдена</h1><a class="text-sm text-info hover:underline" href="#/roadmaps">Вернуться к списку</a></div></div>
{/if}
