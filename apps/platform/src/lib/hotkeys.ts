export interface HotkeyInfo {
  keys: string;
  title: string;
  description: string;
  scope: string;
}

export const activeHotkeys: HotkeyInfo[] = [
  {
    keys: "Ctrl + S",
    title: "Сохранить и форматировать",
    description: "Сохраняет черновик и форматирует активный файл Monaco.",
    scope: "Редактор",
  },
  {
    keys: "Ctrl + Enter",
    title: "Запустить тесты",
    description: "LeetCode-подобный shortcut для запуска проверки текущего решения.",
    scope: "Задача",
  },
  {
    keys: "Ctrl + Shift + Enter",
    title: "Запустить тесты",
    description:
      "Аналог запуска example testcases на LeetCode; сейчас запускает весь локальный набор.",
    scope: "Задача",
  },
  {
    keys: "Ctrl + Alt + L",
    title: "Сбросить решение",
    description: "Очищает локальный черновик и возвращает starter-файлы задачи.",
    scope: "Задача",
  },
];

export const leetcodeReferenceHotkeys: HotkeyInfo[] = [
  {
    keys: "Ctrl + Enter",
    title: "Run / Submit",
    description: "Часто используется расширениями LeetCode для запуска или отправки решения.",
    scope: "LeetCode",
  },
  {
    keys: "Ctrl + Shift + Enter",
    title: "Run example testcases",
    description: "Встречается как shortcut для запуска примеров.",
    scope: "LeetCode",
  },
  {
    keys: "Ctrl / Command + T",
    title: "Focus testcases",
    description: "Shortcut для перехода к тесткейсам в LeetCode Helper.",
    scope: "LeetCode",
  },
  {
    keys: "Ctrl / Command + C",
    title: "Focus code editor",
    description: "Shortcut для возврата фокуса в редактор кода в LeetCode Helper.",
    scope: "LeetCode",
  },
  {
    keys: "Ctrl + Alt + L",
    title: "Reset to default",
    description: "Shortcut очистки решения в расширении leetcode-shortcuts.",
    scope: "LeetCode",
  },
];
