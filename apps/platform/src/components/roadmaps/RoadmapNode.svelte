<script module lang="ts">
  import type { Node } from "@xyflow/svelte";

  export type RoadmapNodeData = {
    title: string;
    meta?: string;
    tone?: string;
    hasTarget: boolean;
    hasSource: boolean;
    specialization?: boolean;
  };

  export type RoadmapFlowNode = Node<RoadmapNodeData, "roadmap">;
</script>

<script lang="ts">
  import { Handle, Position, type NodeProps } from "@xyflow/svelte";
  import LanguageIcon from "../ui/LanguageIcon.svelte";

  let { data, selected, isConnectable }: NodeProps<RoadmapFlowNode> = $props();
</script>

<article class={`relative grid min-w-[190px] cursor-pointer gap-1 rounded-md border bg-card px-5 py-4 text-foreground shadow-panel transition ${data.specialization ? "min-h-24 place-content-center justify-items-center" : ""} ${selected ? "border-border-strong bg-surface-muted shadow-float" : "border-border hover:border-border-strong hover:bg-surface"}`}>
  {#if data.hasTarget}<Handle type="target" position={Position.Top} {isConnectable} aria-hidden="true" tabindex={-1} />{/if}
  {#if data.specialization}<LanguageIcon language={data.tone ?? "javascript"} size={22} />{/if}
  <strong class="text-sm font-semibold">{data.title}</strong>
  {#if data.meta}<small class="font-mono text-[10px] uppercase tracking-wider text-muted">{data.meta}</small>{/if}
  {#if data.hasSource}<Handle type="source" position={Position.Bottom} {isConnectable} aria-hidden="true" tabindex={-1} />{/if}
</article>
