<script lang="ts">
  import { onMount } from "svelte";

  export type SelectOption = {
    value: string;
    label: string;
  };

  export let value = "";
  export let label = "Выбрать";
  export let ariaLabel = label;
  export let options: SelectOption[] = [];
  export let onChange: (nextValue: string) => void = () => undefined;

  let open = false;
  let root: HTMLDivElement | null = null;
  let highlightedIndex = 0;

  $: selected = options.find((option) => option.value === value) ?? options[0];
  $: selectedIndex = Math.max(0, options.findIndex((option) => option.value === selected?.value));

  function choose(nextValue: string) {
    value = nextValue;
    open = false;
    onChange(nextValue);
  }

  function toggle() {
    open = !open;
    if (open) highlightedIndex = selectedIndex;
  }

  function onTriggerKeydown(event: KeyboardEvent) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        open = true;
        highlightedIndex = selectedIndex;
        return;
      }
      highlightedIndex =
        event.key === "ArrowDown"
          ? Math.min(options.length - 1, highlightedIndex + 1)
          : Math.max(0, highlightedIndex - 1);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (open) choose(options[highlightedIndex]?.value ?? value);
      else toggle();
    } else if (event.key === "Escape" && open) {
      event.preventDefault();
      open = false;
    }
  }

  function closeOnOutsideClick(event: MouseEvent) {
    if (open && root && !root.contains(event.target as Node)) open = false;
  }

  onMount(() => {
    window.addEventListener("click", closeOnOutsideClick);
    return () => window.removeEventListener("click", closeOnOutsideClick);
  });
</script>

<svelte:window on:keydown={(event) => event.key === "Escape" && (open = false)} />

<div class="select-menu" bind:this={root}>
  <button
    class="select-trigger"
    type="button"
    aria-haspopup="listbox"
    aria-expanded={open}
    aria-label={ariaLabel}
    on:click|stopPropagation={toggle}
    on:keydown={onTriggerKeydown}
  >
    <span>{selected?.label ?? label}</span>
    <span class="select-chevron" aria-hidden="true">⌄</span>
  </button>

  {#if open}
    <div class="select-content" role="listbox" aria-label={ariaLabel}>
      {#each options as option, index (option.value)}
        <button
          class:selected={option.value === value}
          class:highlighted={index === highlightedIndex}
          class="select-item"
          type="button"
          role="option"
          aria-selected={option.value === value}
          on:mouseenter={() => (highlightedIndex = index)}
          on:click={() => choose(option.value)}
        >
          <span>{option.label}</span>
          {#if option.value === value}<span class="select-check" aria-hidden="true">✓</span>{/if}
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .select-menu { position: relative; min-width: 0; }
  .select-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    min-height: 38px;
    gap: 10px;
    padding: 0 11px;
    border: 1px solid #3b4655;
    border-radius: 7px;
    background: #151a21;
    color: #e8edf3;
    cursor: pointer;
    font: 500 12px/1 var(--font-sans);
    text-align: left;
  }
  .select-trigger:hover,
  .select-trigger[aria-expanded="true"] { border-color: #9dbdff; background: #202b3b; }
  .select-trigger:focus-visible { outline: 2px solid #b7d4ff; outline-offset: 2px; }
  .select-chevron { color: #b7d4ff; font-size: 14px; line-height: 1; }
  .select-content {
    position: absolute;
    z-index: 80;
    top: calc(100% + 6px);
    right: 0;
    left: 0;
    display: grid;
    max-height: 360px;
    overflow-y: auto;
    padding: 4px;
    border: 1px solid #53657d;
    border-radius: 8px;
    background: #11161e;
    box-shadow: 0 18px 44px rgba(0, 0, 0, .45);
  }
  .select-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 34px;
    padding: 0 9px;
    border: 0;
    border-radius: 5px;
    background: transparent;
    color: #dfe7f2;
    cursor: pointer;
    font: 500 12px/1.25 var(--font-sans);
    text-align: left;
  }
  .select-item:hover,
  .select-item.highlighted { background: #2a3a50; color: #fff; }
  .select-item.selected { color: #d7e6ff; font-weight: 700; }
  .select-check { color: #b7d4ff; font-weight: 800; }
</style>
