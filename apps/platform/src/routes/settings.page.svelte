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

<div class="container">
  <div class="page-header"><h1>Настройки</h1><p class="page-subtitle">Тема интерфейса и спокойные глобальные настройки.</p></div>
  <section class="settings-section"><div class="section-heading"><h2>Интерфейс</h2><p>Переключатель темы вынесен сюда, чтобы верхняя навигация оставалась спокойной.</p></div><div class="settings-panel"><div><div class="attempt-title">Тема</div><div class="attempt-meta">{labels[theme]}</div></div><div style="display:flex;gap:8px">{#each Object.keys(labels) as value}<button type="button" class:btn-primary={theme === value} class:btn-outline={theme !== value} class="btn btn-sm" on:click={() => (theme = value as Theme)}>{labels[value as Theme]}</button>{/each}</div></div></section>
  <section class="settings-section"><div class="section-heading"><h2>Редактор</h2><p>Тема Monaco и шорткаты доступны из меню на странице задачи.</p></div></section>
</div>
