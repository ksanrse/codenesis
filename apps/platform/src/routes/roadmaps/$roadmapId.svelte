<script lang="ts">
  import {
    Background,
    BackgroundVariant,
    Controls,
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
  import FloatingEdge from "../../components/roadmaps/FloatingEdge.svelte";
  import { getRoadmapById, type RoadmapChild, type RoadmapStage } from "../../lib/roadmaps";

  let routeHash = typeof window === "undefined" ? "" : window.location.hash;
  let roadmapId = "";
  let roadmap = getRoadmapById(roadmapId);
  const nodeTypes = { roadmap: RoadmapNode };
  const edgeTypes = { floating: FloatingEdge };
  let nodes: RoadmapFlowNode[] = [];
  let edges: Edge[] = [];

  $: roadmapId = routeHash.split("/")[2]?.split("?")[0] ?? "";
  $: roadmap = getRoadmapById(roadmapId);
  $: childRoadmaps = roadmap?.children ?? [];
  $: nextRoadmaps = roadmap?.next ?? [];
  $: primaryFlowItems = childRoadmaps.length ? childRoadmaps : roadmap?.stages ?? [];
  $: flowItems = roadmapId === "javascript" ? [...primaryFlowItems, ...nextRoadmaps] : primaryFlowItems;
  $: columnCount = 4;
  $: primaryRows = Math.ceil(primaryFlowItems.length / columnCount);
  $: flowHeight = roadmapId === "javascript" ? 680 : Math.max(620, primaryFlowItems.length * 142 + 120);
  $: nodes = flowItems.map((item, index) => {
    const child = "kind" in item ? (item as RoadmapChild) : null;
    const stage = child ? null : (item as RoadmapStage);
    const isSpecialization = roadmapId === "javascript" && index >= primaryFlowItems.length;
    const primaryIndex = Math.min(index, primaryFlowItems.length - 1);
    const row = Math.floor(primaryIndex / columnCount);
    const columnInRow = primaryIndex % columnCount;
    const column = row % 2 === 0 ? columnInRow : columnCount - 1 - columnInRow;
    const specializationIndex = index - primaryFlowItems.length;
    const position = roadmapId === "javascript"
      ? isSpecialization
        ? { x: specializationIndex * 250, y: primaryRows * 150 + 80 }
        : { x: column * 250, y: row * 150 }
      : { x: 0, y: index * 142 };
    return {
      id: item.id,
      type: "roadmap",
      position,
      data: {
        title: item.title,
        meta: child && !isSpecialization ? (child.kind === "external" ? "roadmap.sh" : "курс") : undefined,
        tone: child?.tone ?? roadmap?.tone,
        hasTarget: index > 0,
        hasSource: index < primaryFlowItems.length - 1 || (roadmapId === "javascript" && index === primaryFlowItems.length - 1),
        specialization: isSpecialization,
        kind: isSpecialization ? "skill" : "stage",
      },
      draggable: true,
      connectable: false,
      deletable: false,
      ariaLabel: child ? `Мини-roadmap: ${child.title}` : `Курс: ${stage?.title ?? item.title}`,
    } satisfies RoadmapFlowNode;
  });
  $: edges = [
    ...primaryFlowItems.slice(0, -1).map((item, index) => ({
      id: `${item.id}-${primaryFlowItems[index + 1].id}`,
      source: item.id,
      target: primaryFlowItems[index + 1].id,
      type: "smoothstep",
      animated: true,
      style: "stroke:var(--text-muted);stroke-width:2;opacity:.72;stroke-dasharray:5 6",
      selectable: false,
    })),
    ...(roadmapId === "javascript" && primaryFlowItems.length
      ? nextRoadmaps.map((item) => ({
          id: `${primaryFlowItems.at(-1)?.id}-${item.id}`,
          source: primaryFlowItems.at(-1)?.id ?? "",
          target: item.id,
          type: "floating",
          animated: true,
          style: "stroke:var(--text-muted);stroke-width:2;opacity:.72",
          className: "animated-connection",
          selectable: false,
        }))
      : []),
  ];

  let selectedStage: RoadmapStage | null = null;
  let selectedChild: RoadmapChild | null = null;
  $: passedChallengeIds = getPassedChallengeIds($attempts);
  $: exercises = selectedStage
    ? selectedStage.exerciseIds
        .map((id) => getChallengeById(id))
        .filter((challenge): challenge is ChallengeDefinition => Boolean(challenge))
    : [];

  const selectStage: NodeEventWithPointer<MouseEvent | TouchEvent, RoadmapFlowNode> = ({ node }) => {
    const child = [...(roadmap?.children ?? []), ...(roadmap?.next ?? [])].find((item) => item.id === node.id);
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
    <header>
      <h1 class="text-[clamp(2rem,5vw,3rem)] font-semibold tracking-[-0.04em] text-foreground">{roadmapId === "javascript" ? "JavaScript" : roadmap.title}</h1>
    </header>

    <div class="min-h-[620px] overflow-hidden rounded-xl border border-border bg-background shadow-panel max-md:mx-[-12px]" style:height={`${flowHeight}px`}>
      <SvelteFlow
        bind:nodes
        bind:edges
        {nodeTypes}
        {edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.1, maxZoom: 1 }}
        minZoom={0.55}
        maxZoom={1.5}
        preventScrolling={false}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
        onnodeclick={selectStage}
        colorMode="dark"
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="var(--border-hover)" />
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
        {#if exercises.length}
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
        {:else}
          <p class="rounded-md border border-border bg-card px-3 py-3 text-xs leading-5 text-muted">Профильные упражнения этого этапа ещё готовятся. Они будут считать прогресс отдельно от Vanilla JavaScript.</p>
        {/if}
        {#if exercises[0]}
          <a class="mt-auto rounded-md border border-warning/50 bg-warning/10 px-4 py-3 text-xs text-warning hover:bg-warning/15" href={`#/challenges/${exercises[0].id}`}>Перейти к курсу →</a>
        {/if}
      </div>
    </aside>
  {/if}
{:else}
  <div class="mx-auto w-full max-w-[var(--container-width)] px-4 py-6 sm:px-6 lg:px-8 lg:py-10"><div class="grid gap-3"><h1 class="text-3xl font-semibold text-foreground">Roadmap не найдена</h1><a class="text-sm text-info hover:underline" href="#/roadmaps">Вернуться к списку</a></div></div>
{/if}
