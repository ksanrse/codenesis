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
  import LanguageIcon from "../ui/LanguageIcon.svelte";

  let { data, selected, isConnectable }: NodeProps<SkillTreeFlowNode> = $props();
  let progress = $derived(Math.max(0, Math.min(1, data.progress)));
  let radius = $derived(data.kind === "role" ? 44 : 52);
  let circumference = $derived(2 * Math.PI * radius);
  let dashOffset = $derived(circumference * (1 - progress));
  let logoLanguage = $derived(data.tone === "database" ? "database" : data.tone);
  let logoProgress = $derived(data.tone === "html" && progress >= 0.8 ? 1 : progress);
</script>

<article
  class={`skill-tree-node ${selected ? "selected" : ""} ${data.dimmed ? "dimmed" : ""} ${data.active ? "active" : ""} ${data.kind}-node tone-${data.tone}`}
  aria-label={`${data.title}: ${Math.round(progress * 100)}%`}
>
  {#if data.hasTarget}<Handle type="target" position={Position.Top} {isConnectable} aria-hidden="true" tabindex={-1} />{/if}
  <span class="node-main">
    {#if data.kind === "skill"}
      <span class="ring-wrap">
        <svg class="progress-ring" viewBox="0 0 112 112" aria-hidden="true">
          <circle class="ring-track" cx="56" cy="56" r={radius} />
          <circle class="ring-progress" cx="56" cy="56" r={radius} stroke-dasharray={circumference} stroke-dashoffset={dashOffset} />
        </svg>
        <span class="liquid-fill" style={`height: ${Math.round(progress * 100)}%`} aria-hidden="true"></span>
        <span class="skill-logo-wrap">
          <LanguageIcon language={logoLanguage} size={46} className="skill-logo" />
          <span class="skill-logo-fill" style={`height: ${Math.round(logoProgress * 100)}%`} aria-hidden="true">
            <LanguageIcon language={logoLanguage} size={46} className="skill-logo skill-logo-accent" />
          </span>
        </span>
      </span>
    {:else}
      <span class="role-percent">{Math.round(progress * 100)}%</span>
    {/if}
    <span class="node-copy"><strong>{data.title}</strong></span>
  </span>
  {#if data.kind === "role"}
    <button
      class="track-button"
      class:active={data.active}
      type="button"
      aria-pressed={data.active}
      onclick={(event) => { event.stopPropagation(); data.onSelectTrack?.(); }}
    >{data.active ? "Трек выбран" : "Выбрать трек"}</button>
  {/if}
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
  .skill-tree-node.selected { border-color: #94a3b8; background: #1a2330; box-shadow: 0 0 0 2px rgb(148 163 184 / 16%), 0 16px 38px rgb(0 0 0 / 36%); }
  .role-node { width: 220px; height: 108px; box-sizing: border-box; flex-direction: column; justify-content: flex-start; gap: 0; padding: 0; overflow: visible; border-color: transparent; border-radius: 0; }
  .role-node:hover,
  .role-node.selected { border-color: transparent; background: transparent; box-shadow: none; }
  .role-percent { flex: 0 0 auto; color: #dbe5f2; font: 700 11px/1 var(--font-mono); }
  .node-main { display: flex; align-items: center; justify-content: center; gap: 14px; }
  .role-node .node-main { width: 100%; height: 72px; min-height: 72px; box-sizing: border-box; flex-direction: column; align-items: flex-start; justify-content: flex-start; gap: 6px; margin: 0; padding: 10px 8px; border: 1px solid #384555; border-bottom: 0; background: #11161e; }
  .ring-wrap { position: relative; display: grid; width: 88px; height: 88px; flex: 0 0 auto; place-items: center; }
  .role-node .ring-wrap { width: 64px; height: 64px; }
  .progress-ring { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; transform: rotate(90deg); }
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
  .node-copy { position: relative; z-index: 1; display: grid; gap: 5px; text-align: center; }
  .role-node .node-copy { text-align: left; }
  .skill-tree-node strong { font-size: 12px; line-height: 1.1; }
  .role-node strong { font-size: 18px; }
  .skill-node .node-copy { display: none; }
  .skill-node { padding: 0; border-color: transparent; background: #11161e; box-shadow: none; }
  .skill-node .ring-wrap { width: 120px; height: 120px; overflow: hidden; border: 1px solid #384555; border-radius: 50%; background: #11161e; box-shadow: 0 10px 24px rgb(0 0 0 / 20%); }
  .skill-node .progress-ring { display: none; }
  .liquid-fill { position: absolute; right: 0; bottom: 0; left: 0; z-index: 0; background: var(--skill-tone); opacity: .9; transition: height 180ms ease; }
  .skill-logo-wrap { position: relative; z-index: 2; display: block; width: 46px; height: 46px; }
  .skill-logo-wrap :global(.skill-logo) { position: absolute; inset: 0; filter: grayscale(1) saturate(0); }
  .skill-logo-fill { position: absolute; right: 0; bottom: 0; left: 0; overflow: hidden; }
  .skill-logo-fill :global(.skill-logo) { top: auto; width: 46px; height: 46px; filter: none; }
  .role-node .track-button { position: absolute; z-index: 3; top: 72px; right: 0; left: 0; width: 100%; box-sizing: border-box; margin: 0; min-height: 36px; border-radius: 0 0 10px 10px; box-shadow: 0 5px 12px rgb(0 0 0 / 18%); }
  .track-button { width: 100%; margin-top: 3px; padding: 8px 7px; border: 1px solid #384555; border-radius: 8px; background: #19222e; color: #dbe5f2; font: 600 10px/1 var(--font-mono); cursor: pointer; }
  .track-button:hover, .track-button.active { border-color: var(--skill-tone); background: color-mix(in srgb, var(--skill-tone) 18%, #19222e); color: #fff; }
  .tone-frontend, .tone-fullstack, .tone-backend, .tone-ml { --skill-tone: #94a3b8; }
  .skill-node.tone-html { --skill-tone: #e44d26; }
  .skill-node.tone-css { --skill-tone: #1572b6; }
  .skill-node.tone-javascript { --skill-tone: #f7df1e; }
  .skill-node.tone-python { --skill-tone: #3776ab; }
  .skill-node.tone-database { --skill-tone: #94a3b8; }
  :global(.svelte-flow__handle) { width: 1px; height: 1px; border: 0; background: transparent; opacity: 0; pointer-events: none; }
  @media (prefers-reduced-motion: reduce) { .skill-tree-node { transition: none; } }
</style>
