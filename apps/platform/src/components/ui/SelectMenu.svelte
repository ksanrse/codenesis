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

<div class="relative min-w-0" bind:this={root}>
  <button
    type="button"
    aria-haspopup="listbox"
    aria-expanded={open}
    aria-label={ariaLabel}
    on:click|stopPropagation={toggle}
    on:keydown={onTriggerKeydown}
    class:border-border-strong={open}
    class:bg-surface-muted={open}
    class="flex min-h-9 w-full items-center justify-between gap-2 rounded-md border border-border bg-surface px-3 text-left text-[12px] font-medium leading-none text-content transition-colors duration-150 ease-[var(--ease-standard)] hover:border-border-strong hover:bg-surface-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--focus-ring)] focus-visible:outline-offset-2"
  >
    <span>{selected?.label ?? label}</span>
    <span class="text-dim text-sm leading-none" aria-hidden="true">⌄</span>
  </button>

  {#if open}
    <div class="absolute left-0 right-0 top-full z-50 mt-1.5 grid max-h-[360px] overflow-y-auto rounded-lg border border-border-strong bg-background p-1 shadow-float" role="listbox" aria-label={ariaLabel}>
      {#each options as option, index (option.value)}
        <button
          class:selected={option.value === value}
          class:highlighted={index === highlightedIndex}
          class="flex min-h-8 items-center justify-between gap-3 rounded-md px-2.5 text-left text-[12px] font-medium leading-[1.25] text-content transition-colors duration-150 ease-[var(--ease-standard)] hover:bg-surface-muted hover:text-foreground"
          type="button"
          role="option"
          aria-selected={option.value === value}
          on:mouseenter={() => (highlightedIndex = index)}
          on:click={() => choose(option.value)}
        >
          <span>{option.label}</span>
          {#if option.value === value}<span class="text-dim font-semibold" aria-hidden="true">✓</span>{/if}
        </button>
      {/each}
    </div>
  {/if}
</div>
