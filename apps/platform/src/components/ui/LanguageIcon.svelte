<script lang="ts">
  import cssIcon from "../../assets/symbols/css.svg";
  import htmlIcon from "../../assets/symbols/html.svg";
  import javascriptIcon from "../../assets/symbols/javascript.svg";
  import pythonIcon from "../../assets/symbols/python.svg";

  export let language = "javascript";
  export let size = 20;
  export let className = "";

  const labels: Record<string, string> = {
    javascript: "JavaScript",
    typescript: "TypeScript",
    react: "React",
    svelte: "Svelte",
    vue: "Vue",
    solid: "Solid",
  };

  $: label = labels[language] ?? language;
  $: symbolIcon = ({ css: cssIcon, html: htmlIcon, javascript: javascriptIcon, python: pythonIcon } as Record<string, string>)[language];
</script>

{#if symbolIcon}
  <img class={className} src={symbolIcon} width={size} height={size} alt={label} />
{:else if language === "javascript"}
  <svg class={className} width={size} height={size} viewBox="0 0 24 24" role="img" aria-label={label}>
    <rect width="24" height="24" rx="3" fill="#F7DF1E" />
    <path fill="#000" d="M14.97 18.95c.5.82 1.16 1.42 2.32 1.42.97 0 1.6-.49 1.6-1.16 0-.8-.64-1.09-1.71-1.56l-.59-.25c-1.7-.72-2.83-1.63-2.83-3.55 0-1.77 1.35-3.11 3.45-3.11 1.5 0 2.58.52 3.35 1.89l-1.83 1.18c-.4-.73-.84-1.02-1.52-1.02-.69 0-1.13.44-1.13 1.02 0 .71.44 1 1.45 1.43l.59.25c2 .86 3.13 1.74 3.13 3.71 0 2.13-1.67 3.28-3.91 3.28-2.19 0-3.61-1.04-4.3-2.41zm-8.5.21c.36.65.69 1.2 1.49 1.2.77 0 1.25-.48 1.25-1.46v-7.94h2.35v7.97c0 2.43-1.43 3.54-3.51 3.54-1.88 0-2.97-.97-3.52-2.14z" />
  </svg>
{:else if language === "typescript"}
  <svg class={className} width={size} height={size} viewBox="0 0 24 24" role="img" aria-label={label}>
    <rect width="24" height="24" rx="3" fill="#3178C6" />
    <text x="12" y="17" text-anchor="middle" fill="white" font-size="10" font-weight="700">TS</text>
  </svg>
{:else if language === "react"}
  <svg class={className} width={size} height={size} viewBox="0 0 24 24" role="img" aria-label={label} fill="none" stroke="currentColor" stroke-width="1.6">
    <circle cx="12" cy="12" r="2.1" fill="currentColor" stroke="none" />
    <ellipse cx="12" cy="12" rx="9" ry="3.5" />
    <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(60 12 12)" />
    <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(120 12 12)" />
  </svg>
{:else if language === "vue"}
  <svg class={className} width={size} height={size} viewBox="0 0 24 24" role="img" aria-label={label}>
    <path fill="currentColor" d="M1.5 3.5h5L12 13l5.5-9.5h5L12 21 1.5 3.5Z" />
    <path fill="var(--bg-card)" d="M6.5 3.5h3L12 8l2.5-4.5h3L12 13 6.5 3.5Z" />
  </svg>
{:else if language === "svelte"}
  <svg class={className} width={size} height={size} viewBox="0 0 24 24" role="img" aria-label={label} fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
    <path d="M16.5 4.5 10 2.8a4 4 0 0 0-4.6 2.3L4.7 7a4 4 0 0 0 2.6 5.3l7.4 2a2 2 0 0 1 1.3 2.6l-.2.5a2 2 0 0 1-2.3 1.1L7 16.8" />
    <path d="m7.5 19.5 6.5 1.7a4 4 0 0 0 4.6-2.3l.7-1.9a4 4 0 0 0-2.6-5.3l-7.4-2A2 2 0 0 1 8 7.1l.2-.5a2 2 0 0 1 2.3-1.1L17 7.2" />
  </svg>
{:else if language === "solid"}
  <svg class={className} width={size} height={size} viewBox="0 0 24 24" role="img" aria-label={label}>
    <path fill="currentColor" d="m3 7 7.5-5L21 5.5l-7.5 5L3 7Zm0 3.5 10.5 3.5L21 9v4l-7.5 5L3 14.5v-4Zm0 7 10.5 3.5L21 16v3l-7.5 5L3 20.5v-3Z" />
  </svg>
{:else if language === "html"}
  <svg class={className} width={size} height={size} viewBox="0 0 24 24" role="img" aria-label="HTML">
    <path fill="#e44d26" d="M3 2h18l-1.64 18.5L12 22l-7.36-1.5L3 2Z"/><path fill="#f16529" d="m12 3.5 5.8 0-1.1 12.4-4.7 1.1V3.5Z"/><path fill="#fff" d="M6.8 6.2h10.6l-.3 3H9.9l.2 2.1h6.8l-.7 6.1-4.2 1-4.2-1-.3-3h2.9l.2 1.3 1.4.3 1.4-.3.2-1.7H7.4L6.8 6.2Z"/>
  </svg>
{:else if language === "css"}
  <svg class={className} width={size} height={size} viewBox="0 0 24 24" role="img" aria-label="CSS">
    <rect width="24" height="24" rx="3" fill="#1572b6" />
    <text x="12" y="15.5" text-anchor="middle" fill="white" font-size="7" font-weight="800" letter-spacing="-.2">CSS</text>
  </svg>
{:else if language === "python"}
  <svg class={className} width={size} height={size} viewBox="0 0 24 24" role="img" aria-label="Python">
    <path fill="#3776ab" d="M11.8 2C7.5 2 7.7 3.9 7.7 3.9v2.3h4.2v.7H6.1S2 6.4 2 10.7c0 4.3 3.6 4.1 3.6 4.1h2.1v-2.4s-.1-3.6 3.5-3.6h4.1s2.3 0 2.3-2.2V4.4S18 2 11.8 2Zm-2.3 1.4a.8.8 0 1 1 0 1.6.8.8 0 0 1 0-1.6Z"/><path fill="#ffd343" d="M12.2 22c4.3 0 4.1-1.9 4.1-1.9v-2.3h-4.2v-.7h5.8s4.1.5 4.1-3.8-3.6-4.1-3.6-4.1h-2.1v2.4s.1 3.6-3.5 3.6H8.7s-2.3 0-2.3 2.2v2.2S6 22 12.2 22Zm2.3-1.4a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6Z"/>
  </svg>
{:else if language === "database"}
  <svg class={`block shrink-0 ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="Databases">
    <ellipse cx="12" cy="5" rx="8" ry="3" />
    <path d="M4 5v7c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
    <path d="M4 12v7c0 1.66 3.58 3 8 3s8-1.34 8-3v-7" />
  </svg>
{:else}
  <span
    class={`inline-flex items-center justify-center rounded-[3px] bg-surface-muted text-foreground font-bold ${className}`}
    style:width={`${size}px`}
    style:height={`${size}px`}
    style:font-size={`${size * 0.45}px`}
    aria-label={label}
  >
    {language.slice(0, 2).toUpperCase()}
  </span>
{/if}
