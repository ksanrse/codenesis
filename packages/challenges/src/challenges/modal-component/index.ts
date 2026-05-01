import type { ChallengeDefinition, ChallengeFile } from "../../types.ts";
import { getChallengePoints } from "../../ranking.ts";

const jsStarter: ChallengeFile[] = [
  {
    path: "src/index.js",
    content: `/**
 * Creates a modal component.
 * @param {Object} options
 * @param {string} options.title - Modal title
 * @param {string} options.content - Modal body content (HTML string)
 * @param {function} [options.onClose] - Called when the modal is closed
 * @returns {{ open: () => void, close: () => void, destroy: () => void }}
 */
export function createModal(options) {
  // Your implementation here
  return { open() {}, close() {}, destroy() {} };
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
  <title>Modal Component</title>
  <link rel="stylesheet" href="src/styles.css" />
</head>
<body>
  <button id="open-modal">Open Modal</button>
  <script type="module">
    import { createModal } from './src/index.js';
    const modal = createModal({
      title: 'Hello World',
      content: '<p>This is a modal dialog.</p>',
    });
    document.getElementById('open-modal').addEventListener('click', () => modal.open());
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
    content: `export interface ModalOptions {
  title: string;
  content: string;
  onClose?: () => void;
}

export interface ModalInstance {
  open: () => void;
  close: () => void;
  destroy: () => void;
}

/**
 * Creates a modal component.
 */
export function createModal(options: ModalOptions): ModalInstance {
  // Your implementation here
  return { open() {}, close() {}, destroy() {} };
}
`,
  },
  { ...jsStarter[1]!, path: "index.html" },
  { ...jsStarter[2]!, path: "src/styles.css" },
];

const jsTests: ChallengeFile[] = [
  {
    path: "src/index.test.js",
    content: `import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createModal } from './index.js';

describe('Modal Component', () => {
  let modal;

  afterEach(() => {
    modal?.destroy();
  });

  it('should open and display the modal with title and content', () => {
    modal = createModal({ title: 'Test', content: '<p>Hello</p>' });
    modal.open();
    expect(document.querySelector('[role="dialog"]')).toBeTruthy();
    expect(document.body.textContent).toContain('Test');
    expect(document.body.textContent).toContain('Hello');
  });

  it('should close the modal', () => {
    modal = createModal({ title: 'Test', content: '' });
    modal.open();
    modal.close();
    const dialog = document.querySelector('[role="dialog"]');
    expect(!dialog || dialog.getAttribute('aria-hidden') === 'true' || getComputedStyle(dialog).display === 'none').toBe(true);
  });

  it('should call onClose callback when closed', () => {
    const onClose = vi.fn();
    modal = createModal({ title: 'Test', content: '', onClose });
    modal.open();
    modal.close();
    expect(onClose).toHaveBeenCalled();
  });

  it('should close when clicking the backdrop', () => {
    const onClose = vi.fn();
    modal = createModal({ title: 'Test', content: '', onClose });
    modal.open();
    const backdrop = document.querySelector('[data-backdrop], .modal-backdrop, .overlay');
    backdrop?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onClose).toHaveBeenCalled();
  });

  it('should close when pressing Escape', () => {
    const onClose = vi.fn();
    modal = createModal({ title: 'Test', content: '', onClose });
    modal.open();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(onClose).toHaveBeenCalled();
  });
});
`,
  },
];

const emptyLangs: ChallengeFile[] = [];
const rank = 5;

export const modalComponent: ChallengeDefinition = {
  id: "modal-component",
  title: "Modal Component",
  description: `Модальное окно кажется простым, пока не начинаешь закрывать его клавиатурой, кликом по фону и правильно описывать для screen reader.

Напиши \`createModal(options)\`. Функция должна вернуть объект с методами \`open()\`, \`close()\` и \`destroy()\`. При открытии на странице появляется backdrop и окно с заголовком и HTML-контентом.

## Требования

1. \`open()\` показывает модальное окно с \`options.title\` и \`options.content\`.
2. \`close()\` скрывает окно и вызывает \`options.onClose\`, если callback передан.
3. Клик по backdrop закрывает модальное окно.
4. Нажатие Escape закрывает модальное окно.
5. Используй \`role="dialog"\` и \`aria-modal="true"\`.
6. \`destroy()\` должен убрать созданные DOM-элементы и обработчики.

## Интерфейс

Экспортируй функцию \`createModal(options)\`.`,
  difficulty: "Starter",
  category: "UI Components",
  group: "Компоненты интерфейса",
  languages: ["javascript", "typescript"],
  rank,
  reputation: getChallengePoints(rank),
  tags: ["accessibility", "dom", "keyboard-navigation", "focus-management"],
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
