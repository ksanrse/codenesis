<script lang="ts">
  export let markdown = '';
  type Section = { title: string | null; body: string; collapsible: boolean };
  const collapsible = new Set(['Требования', 'Интерфейс']);
  $: sections = splitSections(markdown);
  function splitSections(source: string): Section[] {
    const result: Section[] = [{ title: null, body: '', collapsible: false }];
    for (const line of source.split('\n')) {
      const heading = line.match(/^##\s+(.+)$/);
      if (heading) result.push({ title: heading[1].trim(), body: '', collapsible: collapsible.has(heading[1].trim()) });
      else result[result.length - 1].body += (result[result.length - 1].body ? '\n' : '') + line;
    }
    return result.filter((section) => section.title || section.body.trim());
  }
  function render(source: string) {
    return source.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/`([^`]+)`/g, '<code class="description-inline-code">$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\n\n+/g, '</p><p>').replace(/\n/g, '<br>');
  }
</script>

<div class="challenge-description">
  {#each sections as section}
    {#if !section.title}
      <div class="description-copy"><p>{@html render(section.body)}</p></div>
    {:else if section.collapsible}
      <details class="description-collapsible" open><summary class="description-collapsible-summary"><span>{section.title}</span></summary><div class="description-collapsible-body"><p>{@html render(section.body)}</p></div></details>
    {:else}
      <div class="description-section"><h2 class="description-section-title">{section.title}</h2><p class="description-copy">{@html render(section.body)}</p></div>
    {/if}
  {/each}
</div>
