<script lang="ts">
  import { BaseEdge, getBezierPath, useInternalNode, type EdgeProps } from "@xyflow/svelte";
  import { untrack } from "svelte";
  import { getFloatingEdgeParams } from "./floating-edge";

  let { id, source, target, style, markerEnd, className }: EdgeProps = $props();
  const sourceNode = useInternalNode(untrack(() => source));
  const targetNode = useInternalNode(untrack(() => target));
  let params = $derived.by(() => {
    if (!sourceNode.current || !targetNode.current) return null;
    return getFloatingEdgeParams(sourceNode.current, targetNode.current);
  });
  let path = $derived.by(() => {
    return params ? getBezierPath(params)[0] : "";
  });
</script>

{#if path}
  <path class="roadmap-edge-underlay" d={path} style={`${style};stroke-dasharray:none;opacity:.28`} />
  <BaseEdge {id} {path} {style} {markerEnd} {className} />
  {#if params}
    <circle class="roadmap-edge-port" cx={params.sourceX} cy={params.sourceY} r="5" />
    <circle class="roadmap-edge-port" cx={params.targetX} cy={params.targetY} r="5" />
  {/if}
{/if}

<style>
  .roadmap-edge-underlay { fill: none; stroke-linecap: round; pointer-events: none; vector-effect: non-scaling-stroke; }
  .roadmap-edge-port { fill: #0f141c; stroke: #94a3b8; stroke-width: 2; vector-effect: non-scaling-stroke; }
</style>
