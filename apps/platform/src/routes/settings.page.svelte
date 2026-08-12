<script lang="ts">
  import { onMount } from "svelte";

  type Theme = "system" | "dark" | "light";
  const labels: Record<Theme, string> = {
    system: "Системная",
    dark: "Тёмная",
    light: "Светлая",
  };
  let theme: Theme = "system";
  const effective = (value: Theme) =>
    value === "system"
      ? matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : value;
  function apply() {
    document.documentElement.setAttribute("data-theme", effective(theme));
    localStorage.setItem("theme", theme);
  }
  onMount(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light" || saved === "system") theme = saved;
    apply();
  });
  $: if (typeof window !== "undefined") apply();
</script>

<div class="container mx-auto max-w-[var(--container-width)] px-[var(--page-x)] py-[var(--page-y)]">
  <header class="mb-6 border-b border-border pb-5">
    <h1 class="text-[clamp(28px,4vw,38px)] font-semibold tracking-[-0.03em] text-foreground">Настройки</h1>
    <p class="mt-1 text-sm leading-6 text-muted">Тема интерфейса и спокойные глобальные настройки.</p>
  </header>

  <section class="space-y-4">
    <div>
      <h2 class="text-lg font-semibold tracking-[-0.03em] text-foreground">Интерфейс</h2>
      <p class="mt-1 text-sm text-muted">Переключатель темы вынесен сюда, чтобы верхняя навигация оставалась спокойной.</p>
    </div>
    <div class="flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-xl)] border border-border bg-surface p-4">
      <div>
        <div class="text-sm font-medium text-foreground">Тема</div>
        <div class="text-sm text-muted">{labels[theme]}</div>
      </div>
      <div class="flex flex-wrap gap-2">
        {#each Object.keys(labels) as value}
          <button
            type="button"
            class={`btn btn-sm ${theme === value ? "btn-primary" : "btn-outline"}`}
            on:click={() => (theme = value as Theme)}
          >
            {labels[value as Theme]}
          </button>
        {/each}
      </div>
    </div>
  </section>

  <section class="mt-8 space-y-2">
    <h2 class="text-lg font-semibold tracking-[-0.03em] text-foreground">Редактор</h2>
    <p class="text-sm leading-6 text-muted">Тема Monaco и шорткаты доступны из меню на странице задачи.</p>
  </section>
</div>
