import type { ChallengeFile, Language } from "../../types.ts";

const jsTests: ChallengeFile[] = [
  {
    path: "src/index.test.js",
    content: `import { describe, it, expect, beforeEach } from 'vitest';
import { createTodoApp } from './index.js';

describe('Todo List App', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    localStorage.clear();
    createTodoApp(container);
  });

  it('should render an input field for adding todos', () => {
    const input = container.querySelector('input[type="text"], input:not([type])');
    expect(input).toBeTruthy();
  });

  it('should add a todo when submitting', () => {
    const input = container.querySelector('input[type="text"], input:not([type])');
    input.value = 'Buy groceries';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    const form = container.querySelector('form');
    if (form) {
      form.dispatchEvent(new Event('submit', { bubbles: true }));
    } else {
      const btn = container.querySelector('button');
      btn.click();
    }

    expect(container.textContent).toContain('Buy groceries');
  });

  it('should toggle a todo as completed', () => {
    const input = container.querySelector('input[type="text"], input:not([type])');
    input.value = 'Test todo';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    const form = container.querySelector('form');
    if (form) {
      form.dispatchEvent(new Event('submit', { bubbles: true }));
    } else {
      container.querySelector('button').click();
    }

    const todoItem = container.querySelector('li') || container.querySelector('[data-todo]');
    const checkbox = todoItem?.querySelector('input[type="checkbox"]');
    if (checkbox) {
      checkbox.click();
      expect(checkbox.checked).toBe(true);
    } else {
      todoItem?.click();
      expect(todoItem?.classList.contains('completed') || todoItem?.getAttribute('data-completed') === 'true').toBe(true);
    }
  });

  it('should delete a todo', () => {
    const input = container.querySelector('input[type="text"], input:not([type])');
    input.value = 'Delete me';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    const form = container.querySelector('form');
    if (form) {
      form.dispatchEvent(new Event('submit', { bubbles: true }));
    } else {
      container.querySelector('button').click();
    }

    expect(container.textContent).toContain('Delete me');

    const deleteBtn = container.querySelector('[data-action="delete"], .delete-btn, button[aria-label*="delete" i]')
      || [...container.querySelectorAll('button')].find(b => b.textContent.includes('×') || b.textContent.includes('Delete') || b.textContent.includes('Remove'));
    deleteBtn?.click();

    expect(container.textContent).not.toContain('Delete me');
  });

  it('should show the count of active items', () => {
    const input = container.querySelector('input[type="text"], input:not([type])');

    ['Task 1', 'Task 2', 'Task 3'].forEach(text => {
      input.value = text;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      const form = container.querySelector('form');
      if (form) {
        form.dispatchEvent(new Event('submit', { bubbles: true }));
      } else {
        container.querySelector('button').click();
      }
    });

    expect(container.textContent).toMatch(/3/);
  });
});
`,
  },
];

const tsTests: ChallengeFile[] = [
  {
    path: "src/index.test.ts",
    content: jsTests[0]!.content.replace("./index.js", "./index.ts"),
  },
];

export const testFiles: Record<Language, ChallengeFile[]> = {
  javascript: jsTests,
  typescript: tsTests,
  react: [],
  svelte: [],
  vue: [],
};
