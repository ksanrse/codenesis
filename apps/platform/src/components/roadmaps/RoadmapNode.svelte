<script module lang="ts">
  import type { Node } from "@xyflow/svelte";

  export type RoadmapNodeData = {
    title: string;
    meta?: string;
    tone?: "html" | "css" | "javascript";
    hasTarget: boolean;
    hasSource: boolean;
  };

  export type RoadmapFlowNode = Node<RoadmapNodeData, "roadmap">;
</script>

<script lang="ts">
  import { Handle, Position, type NodeProps } from "@xyflow/svelte";

  let { data, selected, isConnectable }: NodeProps<RoadmapFlowNode> = $props();
</script>

<article class:selected class:tone-html={data.tone === "html"} class:tone-css={data.tone === "css"} class:tone-javascript={data.tone === "javascript"} class="roadmap-node">
  {#if data.hasTarget}<Handle type="target" position={Position.Top} {isConnectable} aria-hidden="true" tabindex={-1} />{/if}
  <strong>{data.title}</strong>
  {#if data.meta}<small>{data.meta}</small>{/if}
  {#if data.hasSource}<Handle type="source" position={Position.Bottom} {isConnectable} aria-hidden="true" tabindex={-1} />{/if}
</article>

<style>
  .roadmap-node {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    width: 280px;
    min-height: 58px;
    gap: 10px;
    padding: 11px 14px;
    border: 1px solid #445267;
    border-radius: 7px;
    background: #18202b;
    box-shadow: 0 8px 22px rgba(0, 0, 0, 0.22);
    color: #f4f6f8;
    transition:
      border-color 160ms ease,
      box-shadow 160ms ease,
      transform 160ms ease;
  }

  .roadmap-node:hover,
  .roadmap-node.selected {
    border-color: #7aa2f3;
    box-shadow: 0 0 0 1px rgba(122, 162, 243, 0.16), 0 16px 36px rgba(0, 0, 0, 0.32);
    background: #1c2a3e;
    transform: translateY(-1px);
  }

  .roadmap-node.tone-javascript { border-color: #806d23; background: #1c190e; }
  .roadmap-node.tone-javascript:hover,
  .roadmap-node.tone-javascript.selected { border-color: #e0c34c; background: #2a240e; }
  .roadmap-node.tone-html { border-color: #80442e; background: #21140f; }
  .roadmap-node.tone-html:hover,
  .roadmap-node.tone-html.selected { border-color: #e17a51; background: #2b1710; }
  .roadmap-node.tone-css { border-color: #37648b; background: #111d2a; }
  .roadmap-node.tone-css:hover,
  .roadmap-node.tone-css.selected { border-color: #72b8ef; background: #14283b; }

  small {
    color: #697588;
    font-size: 10px;
    letter-spacing: 0.04em;
    text-align: right;
  }

  strong {
    font-size: 13px;
  }

  .tone-javascript small { color: #f4d35e; }
  .tone-html small { color: #f1845e; }
  .tone-css small { color: #74baf3; }

  :global(.svelte-flow__handle) {
    width: 8px;
    height: 8px;
    border: 2px solid #11161d;
    background: #7aa2f3;
  }

  .tone-javascript :global(.svelte-flow__handle) { background: #d7b83f; }
  .tone-html :global(.svelte-flow__handle) { background: #d86b43; }
  .tone-css :global(.svelte-flow__handle) { background: #5ba5e8; }
</style>
