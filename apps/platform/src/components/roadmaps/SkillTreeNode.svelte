<script module lang="ts">
  import type { Node } from "@xyflow/svelte";

  export type SkillTreeNodeData = {
    title: string;
    shortLabel: string;
    progress: number;
    tone: string;
    kind: "role" | "skill";
    meta: string;
    hasTarget: boolean;
    hasSource: boolean;
    dimmed?: boolean;
    active?: boolean;
    onSelectTrack?: () => void;
  };

  export type SkillTreeFlowNode = Node<SkillTreeNodeData, "skillTree">;
</script>

<script lang="ts">
  import { Handle, Position, type NodeProps } from "@xyflow/svelte";

  let { data, selected, isConnectable }: NodeProps<SkillTreeFlowNode> = $props();
  let progress = $derived(Math.max(0, Math.min(1, data.progress)));
  let radius = $derived(data.kind === "role" ? 44 : 42);
  let circumference = $derived(2 * Math.PI * radius);
  let dashOffset = $derived(circumference * (1 - progress));
</script>

<article
  class={`skill-tree-node ${selected ? "selected" : ""} ${data.dimmed ? "dimmed" : ""} ${data.active ? "active" : ""} ${data.kind}-node tone-${data.tone}`}
  aria-label={`${data.title}: ${Math.round(progress * 100)}%`}
>
  {#if data.hasTarget}<Handle type="target" position={Position.Top} {isConnectable} aria-hidden="true" tabindex={-1} />{/if}
  <span class="ring-wrap">
    <svg class="progress-ring" viewBox="0 0 112 112" aria-hidden="true">
      <circle class="ring-track" cx="56" cy="56" r={radius} />
      <circle class="ring-progress" cx="56" cy="56" r={radius} stroke-dasharray={circumference} stroke-dashoffset={dashOffset} />
    </svg>
    <span class="skill-icon">{data.shortLabel}</span>
  </span>
  <span class="node-copy"><strong>{data.title}</strong><small>{data.meta}</small>
    {#if data.kind === "role"}
      <button
        class="track-button"
        class:active={data.active}
        type="button"
        aria-pressed={data.active}
        onclick={(event) => { event.stopPropagation(); data.onSelectTrack?.(); }}
      >{data.active ? "Трек выбран" : "Выбрать трек"}</button>
    {/if}
  </span>
  {#if data.hasSource}<Handle type="source" position={Position.Bottom} {isConnectable} aria-hidden="true" tabindex={-1} />{/if}
</article>

<style>
  .skill-tree-node {
    position: relative;
    display: flex;
    width: 124px;
    height: 124px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    padding: 10px;
    border: 1px solid #384555;
    border-radius: 50%;
    background: #11161e;
    color: #f7f9fc;
    box-shadow: 0 12px 32px rgba(0, 0, 0, .28);
    cursor: pointer;
    transition: border-color 140ms ease, background 140ms ease, box-shadow 140ms ease;
  }
  .skill-tree-node.dimmed { opacity: .28; filter: saturate(.35); }
  .skill-tree-node:hover,
  .skill-tree-node.selected { border-color: #d9e5f7; background: #1a2330; box-shadow: 0 0 0 2px rgba(217, 229, 247, .16), 0 16px 38px rgba(0, 0, 0, .36); }
  .role-node { width: 220px; height: 108px; flex-direction: row; justify-content: flex-start; gap: 14px; padding: 12px 16px; border-radius: 18px; }
  .ring-wrap { position: relative; display: grid; width: 88px; height: 88px; flex: 0 0 auto; place-items: center; }
  .role-node .ring-wrap { width: 64px; height: 64px; }
  .progress-ring { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; transform: rotate(-90deg); }
  .ring-track, .ring-progress { fill: none; stroke-width: 8; }
  .ring-track { stroke: #27303b; }
  .ring-progress { stroke: var(--skill-tone); stroke-linecap: round; }
  .skill-icon {
    position: relative;
    z-index: 1;
    display: grid;
    width: 56px;
    height: 56px;
    place-items: center;
    border: 0;
    border-radius: 50%;
    background: color-mix(in srgb, var(--skill-tone) 14%, #11161e);
    color: #f5f7fa;
    font: 800 15px/1 var(--font-mono);
    letter-spacing: -.06em;
  }
  .role-node .skill-icon { width: 32px; height: 32px; font-size: 10px; }
  .node-copy { position: relative; z-index: 1; display: grid; gap: 5px; text-align: center; }
  .role-node .node-copy { text-align: left; }
  .skill-tree-node strong { font-size: 12px; line-height: 1.1; }
  .role-node strong { font-size: 15px; }
  .track-button { width: fit-content; margin-top: 3px; padding: 4px 7px; border: 1px solid #4a586b; border-radius: 5px; background: #19222e; color: #dbe5f2; font: 600 9px/1 var(--font-mono); cursor: pointer; }
  .track-button:hover, .track-button.active { border-color: var(--skill-tone); background: color-mix(in srgb, var(--skill-tone) 18%, #19222e); color: #fff; }
  .skill-tree-node small { color: #b6c0cd; font: 10px/1.1 var(--font-mono); }
  .skill-tree-node[aria-label$="0%"] .skill-icon { color: #e4e9ef; }
  .skill-tree-node[aria-label*="100%"] .skill-icon { background: var(--skill-tone); color: #080b0f; border-color: var(--skill-tone); }
  .tone-frontend { --skill-tone: #9dbdff; }
  .tone-fullstack { --skill-tone: #c2a4ff; }
  .tone-backend { --skill-tone: #83d7bb; }
  .tone-ml { --skill-tone: #f39ac3; }
  .tone-html { --skill-tone: #f1845e; }
  .tone-css { --skill-tone: #74baf3; }
  .tone-javascript { --skill-tone: #f4d35e; }
  .tone-python { --skill-tone: #80b8ff; }
  .tone-database { --skill-tone: #b9a5ff; }
  :global(.svelte-flow__handle) { width: 1px; height: 1px; border: 0; background: transparent; opacity: 0; pointer-events: none; }
  @media (prefers-reduced-motion: reduce) { .skill-tree-node { transition: none; } }
</style>
