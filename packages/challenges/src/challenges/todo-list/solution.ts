import type { ChallengeFile, Language } from "../../types.ts";

const tsSolution: ChallengeFile[] = [
  {
    path: "src/index.ts",
    content: `interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

type Filter = 'all' | 'active' | 'completed';

const STORAGE_KEY = 'foruntendo-todos';

function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTodos(todos: Todo[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

export function createTodoApp(container: HTMLElement): void {
  let todos = loadTodos();
  let filter: Filter = 'all';
  let nextId = todos.reduce((max, t) => Math.max(max, t.id), 0) + 1;

  function render(): void {
    const filtered = todos.filter(t => {
      if (filter === 'active') return !t.completed;
      if (filter === 'completed') return t.completed;
      return true;
    });
    const activeCount = todos.filter(t => !t.completed).length;

    container.innerHTML = \`
      <div class="todo-app">
        <h1>Todo List</h1>
        <form class="todo-form">
          <input type="text" placeholder="What needs to be done?" autofocus />
          <button type="submit">Add</button>
        </form>
        <ul class="todo-list">
          \${filtered.map(t => \`
            <li class="\${t.completed ? 'completed' : ''}" data-id="\${t.id}">
              <input type="checkbox" \${t.completed ? 'checked' : ''} />
              <span>\${t.text}</span>
              <button data-action="delete" aria-label="Delete todo">×</button>
            </li>
          \`).join('')}
        </ul>
        <div class="todo-footer">
          <span>\${activeCount} item\${activeCount !== 1 ? 's' : ''} left</span>
          <div class="filters">
            <button class="\${filter === 'all' ? 'active' : ''}" data-filter="all">All</button>
            <button class="\${filter === 'active' ? 'active' : ''}" data-filter="active">Active</button>
            <button class="\${filter === 'completed' ? 'active' : ''}" data-filter="completed">Completed</button>
          </div>
        </div>
      </div>
    \`;

    container.querySelector('form')!.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = container.querySelector<HTMLInputElement>('input[type="text"]')!;
      const text = input.value.trim();
      if (!text) return;
      todos.push({ id: nextId++, text, completed: false });
      saveTodos(todos);
      render();
    });

    container.querySelectorAll('li').forEach(li => {
      const id = Number(li.dataset.id);
      li.querySelector('input[type="checkbox"]')!.addEventListener('change', () => {
        const todo = todos.find(t => t.id === id);
        if (todo) todo.completed = !todo.completed;
        saveTodos(todos);
        render();
      });
      li.querySelector('[data-action="delete"]')!.addEventListener('click', () => {
        todos = todos.filter(t => t.id !== id);
        saveTodos(todos);
        render();
      });
    });

    container.querySelectorAll('[data-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        filter = (btn as HTMLElement).dataset.filter as Filter;
        render();
      });
    });
  }

  render();
}
`,
  },
];

export const solutionFiles: Record<Language, ChallengeFile[]> = {
  javascript: tsSolution.map((f) => ({
    ...f,
    path: f.path.replace(".ts", ".js"),
  })),
  typescript: tsSolution,
  react: [],
  svelte: [],
  vue: [],
};
