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
  $: flowColor = roadmap?.tone === "javascript" ? "#d7b83f" : "#658bd2";
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
  <div class="container roadmap-page">
    <header class="roadmap-header">
      <a class="back-link" href="#/roadmaps">← Все roadmaps</a>
      <div class="title-row">
        <h1>{roadmap.title}</h1>
      </div>
    </header>

    <div class="roadmap-map" style:height={`${flowHeight}px`}>
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
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#28313d" />
        <MiniMap pannable zoomable nodeColor="#253653" maskColor="rgba(7, 8, 10, .76)" />
        <Controls showLock={false} />
      </SvelteFlow>
    </div>
  </div>

  {#if selectedChild}
    <aside class="stage-sheet" aria-label={`Подробнее: ${selectedChild.title}`}>
      <header class="sheet-header">
        <div><span>Mini-roadmap</span><h2>{selectedChild.title}</h2></div>
        <button type="button" aria-label="Закрыть описание" on:click={() => (selectedChild = null)}>×</button>
      </header>
      <div class="sheet-scroll">
        <section>
          <h3>Коротко</h3>
          <p>{selectedChild.description}</p>
        </section>
        {#if selectedChild.kind === "external"}
          <a class="sheet-action" href={selectedChild.href} target="_blank" rel="noreferrer">Открыть {selectedChild.title} на roadmap.sh ↗</a>
        {:else}
          <a class="sheet-action" href={`#/roadmaps/${selectedChild.roadmapId}`}>Открыть карту {selectedChild.title} →</a>
        {/if}
      </div>
    </aside>
  {:else if selectedStage}
    <aside class="stage-sheet" aria-label={`Подробнее: ${selectedStage.title}`}>
      <header class="sheet-header">
        <div><span>Курс</span><h2>{selectedStage.title}</h2></div>
        <button type="button" aria-label="Закрыть описание" on:click={() => (selectedStage = null)}>×</button>
      </header>

      <div class="sheet-scroll">
        <section>
          <h3>Коротко</h3>
          <p>{selectedStage.description}</p>
        </section>
        <section>
          <h3>Упражнения</h3>
          <div class="exercise-list">
            {#each exercises as exercise}
              <a class:completed={passedChallengeIds.has(exercise.id)} href={`#/challenges/${exercise.id}`}>
                <span class="exercise-status" class:completed={passedChallengeIds.has(exercise.id)} aria-label={passedChallengeIds.has(exercise.id) ? "Решено" : "Не решено"}></span>
                <strong>{exercise.title}</strong>
              </a>
            {/each}
          </div>
        </section>
        {#if exercises[0]}
          <a class="sheet-action" href={`#/challenges/${exercises[0].id}`}>Перейти к курсу →</a>
        {/if}
      </div>
    </aside>
  {/if}
{:else}
  <div class="container"><div class="page-header"><h1>Roadmap не найдена</h1><a class="inline-link" href="#/roadmaps">Вернуться к списку</a></div></div>
{/if}

<style>
  .roadmap-page { padding-top: 28px; padding-bottom: 70px; }
  .roadmap-header { display: grid; gap: 20px; margin-bottom: 20px; }
  .back-link { color: #8e98a7; font-size: 12px; }
  .back-link:hover { color: #e5e9ef; }
  .title-row { display: flex; align-items: baseline; justify-content: space-between; gap: 18px; }
  h1 { margin: 0; color: #f5f7fa; font-size: clamp(30px, 5vw, 48px); letter-spacing: -.04em; }
  .roadmap-map { min-height: 760px; overflow: hidden; border: 1px solid #2a323e; border-radius: 12px; background: #0a0d11; }
  :global(.roadmap-map .svelte-flow) { --xy-background-color: #0a0d11; --xy-controls-button-background-color: #151b24; --xy-controls-button-background-color-hover: #202938; --xy-controls-button-color: #b8c1ce; --xy-controls-button-border-color: #2d3744; --xy-minimap-background-color: #0d1117; }
  :global(.roadmap-map .svelte-flow__attribution) { display: none; }
  .stage-sheet { position: fixed; z-index: 45; top: 70px; right: max(16px, calc((100vw - 1200px) / 2 + 16px)); bottom: 16px; display: flex; width: min(390px, calc(100vw - 32px)); flex-direction: column; overflow: hidden; border: 1px solid #374253; border-radius: 14px; background: #11161e; box-shadow: 0 24px 70px rgba(0, 0, 0, .58); }
  .sheet-header { display: flex; align-items: start; justify-content: space-between; gap: 18px; padding: 20px 20px 16px; border-bottom: 1px solid #29313c; }
  .sheet-header span { color: #8fb4ff; font-size: 9px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
  .sheet-header h2 { margin: 5px 0 0; color: #f2f5f8; font-size: 21px; }
  .sheet-header button { display: grid; width: 30px; height: 30px; flex: 0 0 auto; place-items: center; border: 1px solid #303946; border-radius: 7px; background: #171d26; color: #a9b1bd; font-size: 20px; cursor: pointer; }
  .sheet-header button:hover { border-color: #566276; color: #fff; }
  .sheet-scroll { display: grid; gap: 26px; overflow-y: auto; padding: 20px; }
  .sheet-scroll section { display: grid; gap: 10px; }
  .sheet-scroll h3 { margin: 0; color: #e9edf2; font-size: 12px; }
  .sheet-scroll p { margin: 0; color: #949eac; font-size: 12px; line-height: 1.65; }
  .exercise-list { display: grid; gap: 8px; }
  .exercise-list a { display: grid; grid-template-columns: 12px minmax(0, 1fr); align-items: center; gap: 10px; padding: 11px 12px; border: 1px solid #2c3542; border-radius: 8px; background: #151b24; }
  .exercise-list a:hover,
  .exercise-list a.completed { border-color: #52627b; }
  .exercise-list strong { color: #e3e8ef; font-size: 12px; font-weight: 600; }
  .exercise-status { width: 9px; height: 9px; border: 1px solid #758194; border-radius: 50%; background: transparent; }
  .exercise-status.completed { border-color: #b8d46a; background: #b8d46a; box-shadow: 0 0 0 3px rgba(184, 212, 106, .12); }
  .sheet-action { display: block; padding: 12px 14px; border: 1px solid #59692b; border-radius: 8px; color: #f4d35e; background: #211d0c; font-size: 12px; }
  .sheet-action:hover { border-color: #d7b83f; background: #2b250d; }
  @media (max-width: 720px) {
    .title-row { align-items: start; flex-direction: column; }
    .roadmap-map { margin-right: -12px; margin-left: -12px; }
    .stage-sheet { top: 64px; right: 10px; bottom: 10px; width: calc(100vw - 20px); }
    :global(.roadmap-map .svelte-flow__minimap) { display: none; }
  }
</style>
