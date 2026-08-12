<script lang="ts">
  import { BaseEdge, getBezierPath, useInternalNode, type EdgeProps } from "@xyflow/svelte";
  import { untrack } from "svelte";
  import { getFloatingEdgeParams } from "./floating-edge";

  let { id, source, target, style, markerEnd }: EdgeProps = $props();
  const sourceNode = useInternalNode(untrack(() => source));
  const targetNode = useInternalNode(untrack(() => target));
  let path = $derived.by(() => {
    if (!sourceNode.current || !targetNode.current) return "";
    return getBezierPath(getFloatingEdgeParams(sourceNode.current, targetNode.current))[0];
  });
</script>

{#if path}
  <BaseEdge {id} {path} {style} {markerEnd} />
{/if}
