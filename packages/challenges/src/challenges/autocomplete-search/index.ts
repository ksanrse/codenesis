import type { ChallengeDefinition, ChallengeFile } from "../../types.ts";
import { getChallengePoints } from "../../ranking.ts";

const jsStarter: ChallengeFile[] = [
  {
    path: "src/index.js",
    content: `/**
 * Creates an autocomplete search component.
 * @param {HTMLElement} container - The DOM element to mount into
 * @param {Object} options
 * @param {function} options.fetchSuggestions - Async function that takes a query string and returns results
 * @param {function} [options.onSelect] - Called when a suggestion is selected
 */
export function createAutocomplete(container, options) {
  // Your implementation here
  container.innerHTML = '<input type="text" placeholder="Search..." />';
}
`,
  },
  {
    path: "index.html",
    content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Autocomplete Search</title>
  <link rel="stylesheet" href="src/styles.css" />
</head>
<body>
  <div id="app"></div>
  <script type="module">
    import { createAutocomplete } from './src/index.js';

    const fruits = ['Apple', 'Apricot', 'Banana', 'Blueberry', 'Cherry', 'Date', 'Grape', 'Lemon', 'Mango', 'Orange', 'Peach', 'Pear', 'Strawberry'];

    createAutocomplete(document.getElementById('app'), {
      fetchSuggestions: async (query) => {
        await new Promise(r => setTimeout(r, 100));
        return fruits.filter(f => f.toLowerCase().includes(query.toLowerCase()));
      },
      onSelect: (item) => console.log('Selected:', item),
    });
  </script>
</body>
</html>`,
  },
  {
    path: "src/styles.css",
    content: `* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: system-ui, sans-serif; padding: 2rem; }
`,
  },
];

const tsStarter: ChallengeFile[] = [
  {
    path: "src/index.ts",
    content: `export interface AutocompleteOptions {
  fetchSuggestions: (query: string) => Promise<string[]>;
  onSelect?: (item: string) => void;
  debounceMs?: number;
}

/**
 * Creates an autocomplete search component.
 */
export function createAutocomplete(container: HTMLElement, options: AutocompleteOptions): void {
  // Your implementation here
  container.innerHTML = '<input type="text" placeholder="Search..." />';
}
`,
  },
  { ...jsStarter[1]!, path: "index.html" },
  { ...jsStarter[2]!, path: "src/styles.css" },
];

const jsTests: ChallengeFile[] = [
  {
    path: "src/index.test.js",
    content: `import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createAutocomplete } from './index.js';

describe('Autocomplete Search', () => {
  let container;
  const mockFetch = vi.fn(async (query) => {
    return ['Apple', 'Apricot', 'Banana'].filter(f =>
      f.toLowerCase().includes(query.toLowerCase())
    );
  });

  beforeEach(() => {
    vi.useFakeTimers();
    container = document.createElement('div');
    document.body.appendChild(container);
    mockFetch.mockClear();
  });

  it('should render an input field', () => {
    createAutocomplete(container, { fetchSuggestions: mockFetch });
    const input = container.querySelector('input');
    expect(input).toBeTruthy();
  });

  it('should show suggestions after typing', async () => {
    createAutocomplete(container, { fetchSuggestions: mockFetch });
    const input = container.querySelector('input');
    input.value = 'ap';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    await vi.advanceTimersByTimeAsync(400);

    expect(mockFetch).toHaveBeenCalledWith('ap');
    expect(container.textContent).toContain('Apple');
    expect(container.textContent).toContain('Apricot');
  });

  it('should debounce API calls', async () => {
    createAutocomplete(container, { fetchSuggestions: mockFetch });
    const input = container.querySelector('input');

    input.value = 'a';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.value = 'ap';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.value = 'app';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    await vi.advanceTimersByTimeAsync(400);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith('app');
  });

  it('should call onSelect when a suggestion is clicked', async () => {
    const onSelect = vi.fn();
    createAutocomplete(container, { fetchSuggestions: mockFetch, onSelect });
    const input = container.querySelector('input');
    input.value = 'ap';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    await vi.advanceTimersByTimeAsync(400);

    const suggestion = [...container.querySelectorAll('li, [role="option"], .suggestion')]
      .find(el => el.textContent?.includes('Apple'));
    suggestion?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(onSelect).toHaveBeenCalledWith('Apple');
  });

  it('should navigate suggestions with keyboard', async () => {
    createAutocomplete(container, { fetchSuggestions: mockFetch });
    const input = container.querySelector('input');
    input.value = 'ap';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    await vi.advanceTimersByTimeAsync(400);

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));

    const active = container.querySelector('[aria-selected="true"], .active, .highlighted');
    expect(active).toBeTruthy();
  });
});
`,
  },
];

const emptyLangs: ChallengeFile[] = [];
const rank = 6;

export const autocompleteSearch: ChallengeDefinition = {
  id: "autocomplete-search",
  title: "Autocomplete Search",
  description: `Autocomplete - это поле поиска, которое показывает варианты по мере ввода. В этой задаче важно не просто вывести список, а сделать компонент, которым можно пользоваться мышью и клавиатурой.

Собери DOM-компонент \`createAutocomplete(container, options)\`. Он сам создает input, запрашивает подсказки через \`fetchSuggestions(query)\`, показывает dropdown и сообщает о выборе через \`onSelect(item)\`.

## Требования

1. Создай текстовое поле ввода внутри \`container\`.
2. При вводе текста подожди 300ms после последнего изменения перед вызовом \`fetchSuggestions\`.
3. Покажи найденные варианты в списке под полем.
4. По клику на вариант вызови \`onSelect\` с выбранной строкой.
5. Поддержи клавиатуру: Arrow Up/Down меняют активный вариант, Enter выбирает его, Escape закрывает список.
6. Добавь базовую доступность: \`role="listbox"\`, \`role="option"\`, \`aria-selected\` и \`aria-expanded\`.

## Интерфейс

Экспортируй функцию \`createAutocomplete(container, options)\`.`,
  difficulty: "Mid",
  category: "JavaScript",
  group: "Асинхронный интерфейс",
  languages: ["javascript", "typescript"],
  rank,
  reputation: getChallengePoints(rank),
  tags: ["async", "debounce", "keyboard-navigation", "accessibility"],
  starterFiles: {
    javascript: jsStarter,
    typescript: tsStarter,
    react: emptyLangs,
    svelte: emptyLangs,
    vue: emptyLangs,
  },
  testFiles: {
    javascript: jsTests,
    typescript: jsTests.map((f) => ({
      ...f,
      path: f.path.replace(".js", ".ts"),
      content: f.content.replace("./index.js", "./index.ts"),
    })),
    react: emptyLangs,
    svelte: emptyLangs,
    vue: emptyLangs,
  },
  solutionFiles: {
    javascript: emptyLangs,
    typescript: emptyLangs,
    react: emptyLangs,
    svelte: emptyLangs,
    vue: emptyLangs,
  },
  dependencies: {
    javascript: {},
    typescript: {},
    react: {},
    svelte: {},
    vue: {},
  },
};
