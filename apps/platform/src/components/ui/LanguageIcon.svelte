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
  <svg class={`block shrink-0 ${className}`} width={size} height={size} viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Databases">
    <ellipse cx="12" cy="5" rx="9" ry="3" fill="#94a3b8"/><path fill="#64748b" d="M3 5v7c0 1.7 4 3 9 3s9-1.3 9-3V5c0 1.7-4 3-9 3S3 6.7 3 5Z"/><path fill="#475569" d="M3 12v7c0 1.7 4 3 9 3s9-1.3 9-3v-7c0 1.7-4 3-9 3s-9-1.3-9-3Z"/>
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
