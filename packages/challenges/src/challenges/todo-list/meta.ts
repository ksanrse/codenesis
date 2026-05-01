import type { ChallengeMeta } from "../../types.ts";
import { getChallengePoints } from "../../ranking.ts";

const rank = 5;

export const meta: ChallengeMeta = {
  id: "todo-list",
  title: "Todo List App",
  description: `Todo list - хорошая базовая задача на состояние интерфейса. Здесь нужно не нарисовать список один раз, а сделать маленькое приложение, которое реагирует на действия пользователя и сохраняет данные.

Собери \`createTodoApp(container)\`: функция монтирует приложение в переданный элемент. Пользователь должен добавлять задачи, отмечать выполненные, удалять лишние, фильтровать список и не терять задачи после перезагрузки страницы.

## Требования

1. Input и кнопка добавляют новую задачу; Enter в input делает то же самое.
2. Пустую задачу добавлять нельзя.
3. У каждой задачи можно переключить статус completed / active.
4. У каждой задачи есть отдельная кнопка удаления.
5. Фильтры All, Active и Completed показывают нужную часть списка.
6. Показывай количество активных задач.
7. Сохраняй задачи в \`localStorage\` и восстанавливай их при новом запуске.

## Интерфейс

Экспортируй функцию \`createTodoApp(container)\`, которая монтирует приложение в переданный DOM-элемент.`,
  difficulty: "Starter",
  category: "JavaScript",
  group: "DOM и состояние",
  languages: ["javascript", "typescript"],
  rank,
  reputation: getChallengePoints(rank),
  tags: ["dom", "state-management", "local-storage", "crud"],
};
