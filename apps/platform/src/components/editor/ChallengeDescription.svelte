<script lang="ts">
  export let markdown = '';

  type Section = { title: string | null; body: string; collapsible: boolean };

  const collapsible = new Set(['Требования', 'Интерфейс']);

  $: sections = splitSections(markdown);

  function splitSections(source: string): Section[] {
    const result: Section[] = [{ title: null, body: '', collapsible: false }];

    for (const line of source.split('\n')) {
      const heading = line.match(/^##\s+(.+)$/);
      if (heading) {
        result.push({ title: heading[1].trim(), body: '', collapsible: collapsible.has(heading[1].trim()) });
      } else {
        result[result.length - 1].body += (result[result.length - 1].body ? '\n' : '') + line;
      }
    }

    return result.filter((section) => section.title || section.body.trim());
  }

  function render(source: string) {
    return source
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/`([^`]+)`/g, '<code class="rounded bg-surface-muted px-1.5 py-0.5 font-mono text-[0.9em] text-foreground">$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\n\n+/g, '</p><p>')
      .replace(/\n/g, '<br>');
  }
</script>

<div class="space-y-4 text-sm leading-7 text-content">
  {#each sections as section}
    {#if !section.title}
      <div class="rounded-xl border border-border bg-background p-4">
        <p>{@html render(section.body)}</p>
      </div>
    {:else if section.collapsible}
      <details class="group rounded-xl border border-border bg-background p-4" open>
        <summary class="cursor-pointer list-none text-sm font-semibold text-foreground">
          <span>{section.title}</span>
        </summary>
        <div class="mt-3 text-muted">
          <p>{@html render(section.body)}</p>
        </div>
      </details>
    {:else}
      <div class="rounded-xl border border-border bg-background p-4">
        <h2 class="text-base font-semibold text-foreground">{section.title}</h2>
        <div class="mt-3 text-muted">
          <p>{@html render(section.body)}</p>
        </div>
      </div>
    {/if}
  {/each}
</div>
