<script module lang="ts">
  import type { Node } from "@xyflow/svelte";

  export type RoadmapNodeData = {
    title: string;
    meta?: string;
    tone?: string;
    hasTarget: boolean;
    hasSource: boolean;
    specialization?: boolean;
    kind?: "stage" | "skill";
  };

  export type RoadmapFlowNode = Node<RoadmapNodeData, "roadmap">;
</script>

<script lang="ts">
  import { Handle, Position, type NodeProps } from "@xyflow/svelte";
  import LanguageIcon from "../ui/LanguageIcon.svelte";

  let { data, selected, isConnectable }: NodeProps<RoadmapFlowNode> = $props();
</script>

<article
  class={`relative cursor-pointer text-foreground transition ${data.specialization ? "grid size-[124px] min-w-0 place-items-center rounded-full border bg-card shadow-panel" : "grid min-w-[190px] gap-1 rounded-md border bg-card px-5 py-4 shadow-panel"} ${selected ? "border-border-strong bg-surface-muted shadow-float" : "border-border hover:border-border-strong hover:bg-surface"}`}
  aria-label={data.specialization ? data.title : undefined}
>
  {#if data.hasTarget}<Handle type="target" position={Position.Top} {isConnectable} aria-hidden="true" tabindex={-1} />{/if}
  {#if data.specialization}
    <LanguageIcon language={data.tone ?? "javascript"} size={46} />
  {:else}
    <strong class="text-sm font-semibold">{data.title}</strong>
    {#if data.meta}<small class="font-mono text-[10px] uppercase tracking-wider text-muted">{data.meta}</small>{/if}
  {/if}
  {#if data.hasSource}<Handle type="source" position={Position.Bottom} {isConnectable} aria-hidden="true" tabindex={-1} />{/if}
</article>
