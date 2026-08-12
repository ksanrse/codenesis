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
      ? "var(--language-html)"
      : data.tone === "css"
        ? "var(--language-css)"
        : data.tone === "javascript"
          ? "var(--language-javascript)"
          : data.tone === "python"
            ? "var(--language-python)"
            : "var(--language-database)",
  );
</script>

<article
  class={`relative cursor-pointer text-foreground transition duration-150 ${data.dimmed ? "opacity-30 saturate-50" : "opacity-100"} ${data.kind === "role" ? "h-[170px] w-[220px]" : "grid size-[124px] place-items-center"}`}
  style={`--skill-tone:${toneColor};`}
  aria-label={`${data.title}: ${Math.round(progress * 100)}%`}
>
  {#if data.hasTarget}<Handle type="target" position={Position.Top} {isConnectable} aria-hidden="true" tabindex={-1} />{/if}
  <span
    class={`node-main ${data.kind === "role"
      ? `flex h-full w-full flex-col items-center justify-center rounded-md border bg-card px-4 py-4 text-center shadow-panel transition ${selected || data.active ? "border-border-strong bg-surface-muted shadow-float" : "border-border hover:border-border-strong hover:bg-surface"}`
      : "flex h-full w-full items-center justify-center"}`}
  >
    {#if data.kind === "role" && data.markUrl}
      <img class="mb-3 max-h-[88px] w-full object-contain" src={data.markUrl} alt="" aria-hidden="true" />
    {/if}
    {#if data.kind === "skill"}
      <span class={`relative grid size-[120px] place-items-center overflow-hidden rounded-full border bg-card shadow-panel transition ${selected ? "border-border-strong shadow-float" : "border-border hover:border-border-strong"}`}>
        <svg class="absolute inset-0 size-full rotate-90 overflow-visible" viewBox="0 0 112 112" aria-hidden="true">
          <circle class="fill-none stroke-foreground/10 stroke-[8]" cx="56" cy="56" r={radius} />
          <circle class="fill-none stroke-[var(--skill-tone)] stroke-[8] [stroke-linecap:round]" cx="56" cy="56" r={radius} stroke-dasharray={circumference} stroke-dashoffset={dashOffset} />
        </svg>
        <span class="absolute inset-x-0 bottom-0 z-2 bg-[var(--skill-tone)] opacity-70 transition-[height] duration-200" style={`height: ${Math.round(progress * 100)}%`} aria-hidden="true"></span>
        <span class="relative z-3 block size-12 [&_.skill-logo]:absolute [&_.skill-logo]:inset-0 [&_.skill-logo]:brightness-0 [&_.skill-logo]:invert">
          <LanguageIcon language={logoLanguage} size={46} className="skill-logo" />
        </span>
      </span>
    {:else}
      <span class="grid justify-items-center text-center">
        <span class="mb-1 font-mono text-[11px] font-bold tracking-[0.08em] text-foreground">{String(Math.round(progress * 100)).padStart(3, "0")}%</span>
        <strong class="text-lg leading-tight">{data.title}</strong>
      </span>
    {/if}
  </span>
  {#if data.hasSource}<Handle type="source" position={Position.Bottom} {isConnectable} aria-hidden="true" tabindex={-1} />{/if}
</article>
