<script lang="ts">
  export let language = "javascript";
  export let size = 20;
  export let className = "";

  const labels: Record<string, string> = {
    javascript: "JavaScript",
    typescript: "TypeScript",
    react: "React",
    svelte: "Svelte",
    vue: "Vue",
  };

  $: label = labels[language] ?? language;
</script>

{#if language === "javascript"}
  <svg class={className} width={size} height={size} viewBox="0 0 24 24" role="img" aria-label={label}>
    <rect width="24" height="24" rx="3" fill="#F7DF1E" />
    <path fill="#000" d="M14.97 18.95c.5.82 1.16 1.42 2.32 1.42.97 0 1.6-.49 1.6-1.16 0-.8-.64-1.09-1.71-1.56l-.59-.25c-1.7-.72-2.83-1.63-2.83-3.55 0-1.77 1.35-3.11 3.45-3.11 1.5 0 2.58.52 3.35 1.89l-1.83 1.18c-.4-.73-.84-1.02-1.52-1.02-.69 0-1.13.44-1.13 1.02 0 .71.44 1 1.45 1.43l.59.25c2 .86 3.13 1.74 3.13 3.71 0 2.13-1.67 3.28-3.91 3.28-2.19 0-3.61-1.04-4.3-2.41zm-8.5.21c.36.65.69 1.2 1.49 1.2.77 0 1.25-.48 1.25-1.46v-7.94h2.35v7.97c0 2.43-1.43 3.54-3.51 3.54-1.88 0-2.97-.97-3.52-2.14z" />
  </svg>
{:else if language === "typescript"}
  <svg class={className} width={size} height={size} viewBox="0 0 24 24" role="img" aria-label={label}>
    <rect width="24" height="24" rx="3" fill="#3178C6" />
    <text x="12" y="17" text-anchor="middle" fill="white" font-size="10" font-weight="700">TS</text>
  </svg>
{:else}
  <span class={className} style={`display:inline-flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;border-radius:3px;background:var(--bg-muted);color:var(--text-heading);font-size:${size * 0.45}px;font-weight:700`} aria-label={label}>{language.slice(0, 2).toUpperCase()}</span>
{/if}
