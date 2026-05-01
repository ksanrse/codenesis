import type { ChallengeFile, Language } from "../../types.ts";

const jsStarter: ChallengeFile[] = [
  {
    path: "src/index.js",
    content: `/**
 * Creates a todo list application inside the given container.
 * @param {HTMLElement} container - The DOM element to mount the app into.
 */
export function createTodoApp(container) {
  // Your implementation here
  container.innerHTML = '<h1>Todo List</h1>';
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
  <title>Todo List</title>
  <link rel="stylesheet" href="src/styles.css" />
</head>
<body>
  <div id="app"></div>
  <script type="module">
    import { createTodoApp } from './src/index.js';
    createTodoApp(document.getElementById('app'));
  </script>
</body>
</html>`,
  },
  {
    path: "src/styles.css",
    content: `* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: system-ui, sans-serif; padding: 2rem; background: #f5f5f5; }
`,
  },
];

const tsStarter: ChallengeFile[] = [
  {
    path: "src/index.ts",
    content: `interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

/**
 * Creates a todo list application inside the given container.
 */
export function createTodoApp(container: HTMLElement): void {
  // Your implementation here
  container.innerHTML = '<h1>Todo List</h1>';
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
  <title>Todo List</title>
  <link rel="stylesheet" href="src/styles.css" />
</head>
<body>
  <div id="app"></div>
  <script type="module">
    import { createTodoApp } from './src/index.ts';
    createTodoApp(document.getElementById('app'));
  </script>
</body>
</html>`,
  },
  {
    path: "src/styles.css",
    content: `* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: system-ui, sans-serif; padding: 2rem; background: #f5f5f5; }
`,
  },
];

export const starterFiles: Record<Language, ChallengeFile[]> = {
  javascript: jsStarter,
  typescript: tsStarter,
  react: [],
  svelte: [],
  vue: [],
};
