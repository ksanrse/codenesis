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
  let logoLanguage = $derived(data.tone === "database" ? "database" : data.tone);
  let toneColor = $derived(
    data.tone === "html"
      ? "var(--language-html)"
      : data.tone === "css"
        ? "var(--language-css)"
        : data.tone === "javascript"
          ? "var(--language-javascript)"
          : data.tone === "react"
            ? "var(--language-react)"
            : data.tone === "vue"
              ? "var(--language-vue)"
              : data.tone === "svelte"
                ? "var(--language-svelte)"
                : data.tone === "solid"
                  ? "var(--language-solid)"
          : data.tone === "python"
            ? "var(--language-python)"
            : "var(--language-database)",
  );
</script>

<article
  class={`relative cursor-pointer text-foreground transition duration-150 ${data.dimmed ? "opacity-30 saturate-50" : "opacity-100"} ${data.kind === "role" ? "min-h-[180px] w-[220px]" : "grid size-[124px] place-items-center"}`}
  style={`--skill-tone:${toneColor};`}
  aria-label={`${data.title}: ${Math.round(progress * 100)}%`}
>
  {#if data.hasTarget}<Handle type="target" position={Position.Top} {isConnectable} aria-hidden="true" tabindex={-1} />{/if}
  <span
    class={`node-main ${data.kind === "role"
      ? `flex min-h-[180px] w-full flex-col items-center justify-center rounded-md border bg-card px-4 py-5 text-center shadow-panel transition ${selected || data.active ? "border-border-strong bg-surface-muted shadow-float" : "border-border hover:border-border-strong hover:bg-surface"}`
      : "flex h-full w-full items-center justify-center"}`}
  >
    {#if data.kind === "role" && data.markUrl}
      <img class="mb-3 max-h-[88px] w-full object-contain" src={data.markUrl} alt="" aria-hidden="true" />
    {/if}
    {#if data.kind === "skill"}
      <span class={`relative grid size-[120px] place-items-center overflow-hidden rounded-full border bg-card shadow-panel transition ${selected ? "border-border-strong shadow-float" : "border-border hover:border-border-strong"}`}>
        <span class="absolute inset-x-0 bottom-0 z-2 bg-[var(--skill-tone)] opacity-70 transition-[height] duration-200" style={`height: ${Math.round(progress * 100)}%`} aria-hidden="true"></span>
        <span class="relative z-3 block size-12 [&_.skill-logo]:absolute [&_.skill-logo]:inset-0 [&_.skill-logo]:size-full [&_.skill-logo]:object-contain">
          <LanguageIcon language={logoLanguage} size={46} className="skill-logo" />
        </span>
      </span>
    {:else}
      <span class="grid justify-items-center gap-0 text-center">
        <span class="font-mono text-[11px] font-bold leading-none tracking-[0.08em] text-foreground">{String(Math.round(progress * 100)).padStart(3, "0")}%</span>
        <strong class="text-lg leading-[1.15]">{data.title}</strong>
      </span>
    {/if}
  </span>
  {#if data.hasSource}<Handle type="source" position={Position.Bottom} {isConnectable} aria-hidden="true" tabindex={-1} />{/if}
</article>
