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
    markUrl?: string;
  };

  export type SkillTreeFlowNode = Node<SkillTreeNodeData, "skillTree">;
</script>

<script lang="ts">
  import { Handle, Position, type NodeProps } from "@xyflow/svelte";
  import LanguageIcon from "../ui/LanguageIcon.svelte";

  let { data, selected, isConnectable }: NodeProps<SkillTreeFlowNode> = $props();
  let progress = $derived(Math.max(0, Math.min(1, data.progress)));
  let radius = $derived(data.kind === "role" ? 44 : 52);
  let circumference = $derived(2 * Math.PI * radius);
  let dashOffset = $derived(circumference * (1 - progress));
  let logoLanguage = $derived(data.tone === "database" ? "database" : data.tone);
  let toneColor = $derived(
    data.tone === "html"
      ? "#e44d26"
      : data.tone === "css"
        ? "#1572b6"
        : data.tone === "javascript"
          ? "#f7df1e"
          : data.tone === "python"
            ? "#3776ab"
            : "#94a3b8",
  );
</script>

<article
  class={`skill-tree-node ${selected ? "selected" : ""} ${data.dimmed ? "dimmed" : ""} ${data.active ? "active" : ""} ${data.kind === "role" ? "skill-tree-role" : "skill-tree-skill"} tone-${data.tone}`}
  style={`--skill-tone:${toneColor};`}
  aria-label={`${data.title}: ${Math.round(progress * 100)}%`}
>
  {#if data.hasTarget}<Handle type="target" position={Position.Top} {isConnectable} aria-hidden="true" tabindex={-1} />{/if}
  <span
    class={`node-main ${data.kind === "role"
      ? "flex h-full w-full flex-col items-center justify-center rounded-[var(--radius-md)] border border-border bg-card px-4 py-4 text-center shadow-panel"
      : "flex h-full w-full items-center justify-center"}`}
  >
    {#if data.kind === "role" && data.markUrl}
      <img class="role-mark" src={data.markUrl} alt="" aria-hidden="true" />
    {/if}
    {#if data.kind === "skill"}
      <span class="ring-wrap">
        <svg class="progress-ring" viewBox="0 0 112 112" aria-hidden="true">
          <circle class="ring-track" cx="56" cy="56" r={radius} />
          <circle class="ring-progress" cx="56" cy="56" r={radius} stroke-dasharray={circumference} stroke-dashoffset={dashOffset} />
        </svg>
        <span class="liquid-fill" style={`height: ${Math.round(progress * 100)}%`} aria-hidden="true"></span>
        <span class="skill-logo-wrap">
          <LanguageIcon language={logoLanguage} size={46} className="skill-logo" />
        </span>
      </span>
    {:else}
      <span class="node-copy">
        <span class="role-percent">{String(Math.round(progress * 100)).padStart(3, "0")}%</span>
        <strong>{data.title}</strong>
      </span>
    {/if}
  </span>
  {#if data.hasSource}<Handle type="source" position={Position.Bottom} {isConnectable} aria-hidden="true" tabindex={-1} />{/if}
</article>

<style>
  .skill-tree-node {
    position: relative;
    color: var(--text-heading);
    cursor: pointer;
    transition:
      border-color var(--duration-fast) var(--ease-standard),
      background var(--duration-fast) var(--ease-standard),
      box-shadow var(--duration-fast) var(--ease-standard),
      opacity var(--duration-fast) var(--ease-standard),
      transform var(--duration-fast) var(--ease-standard);
  }
  .skill-tree-node.dimmed { opacity: .28; filter: saturate(.4); }
  .skill-tree-node:hover,
  .skill-tree-node.selected {
    border-color: color-mix(in srgb, var(--skill-tone) 40%, var(--border-hover));
    background: color-mix(in srgb, var(--skill-tone) 8%, var(--bg-card));
    box-shadow: var(--shadow-float);
  }
  .skill-tree-role,
  .skill-tree-skill {
    display: flex;
    width: 124px;
    height: 124px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    padding: 10px;
    border: 1px solid var(--border);
    border-radius: 50%;
    background: var(--bg-card);
  }
  .skill-tree-role {
    width: 220px;
    height: 170px;
    justify-content: flex-start;
    gap: 0;
    padding: 0;
    overflow: visible;
    border: 0;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
  }
  .skill-tree-role:hover,
  .skill-tree-role.selected {
    border: 0;
    background: transparent;
    box-shadow: none;
    transform: none;
  }
  .node-main { display: flex; align-items: center; justify-content: center; gap: 14px; }
  .role-mark {
    display: block;
    width: 100%;
    height: auto;
    max-height: 88px;
    flex: 0 1 auto;
    margin-bottom: 14px;
    border-radius: var(--radius-sm);
    object-fit: contain;
    object-position: center;
  }
  .role-percent {
    display: block;
    margin-bottom: 4px;
    color: var(--text-heading);
    font: 700 11px/1 var(--font-mono);
    text-align: center;
    letter-spacing: 0.08em;
  }
  .node-copy { display: grid; gap: 0; justify-items: center; text-align: center; }
  .skill-tree-role .node-copy { margin-top: 0; }
  .skill-tree-role strong { font-size: 18px; line-height: 1.1; }
  .ring-wrap { position: relative; display: grid; width: 88px; height: 88px; flex: 0 0 auto; place-items: center; }
  .progress-ring { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; transform: rotate(90deg); }
  .ring-track,
  .ring-progress { fill: none; stroke-width: 8; }
  .ring-track { stroke: color-mix(in srgb, var(--text-heading) 12%, transparent); }
  .ring-progress { stroke: var(--skill-tone); stroke-linecap: round; }
  .skill-node {
    padding: 0;
    border-color: transparent;
    background: transparent;
    box-shadow: none;
  }
  .skill-node .ring-wrap {
    width: 120px;
    height: 120px;
    overflow: hidden;
    border: 1px solid var(--border);
    border-radius: 50%;
    background: var(--bg-card);
    box-shadow: var(--shadow-panel);
  }
  .skill-node .progress-ring { display: none; }
  .liquid-fill { position: absolute; right: 0; bottom: 0; left: 0; z-index: 2; background: var(--skill-tone); opacity: .72; transition: height 180ms ease; }
  .skill-logo-wrap { position: relative; z-index: 1; display: block; width: 46px; height: 46px; }
  .skill-logo-wrap :global(.skill-logo) { position: absolute; inset: 0; filter: brightness(0) invert(1); opacity: .98; }
  :global(.svelte-flow__handle) { width: 1px; height: 1px; border: 0; background: transparent; opacity: 0; pointer-events: none; }
  @media (prefers-reduced-motion: reduce) { .skill-tree-node { transition: none; } }
</style>
