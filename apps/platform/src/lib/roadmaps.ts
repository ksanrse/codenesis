export type RoadmapStage = {
  id: string;
  title: string;
  description: string;
  why: string;
  topics: string[];
  exerciseIds: string[];
};

export type RoadmapChild = {
  id: string;
  title: string;
  description: string;
  tone: "html" | "css" | "javascript";
  kind: "external" | "internal";
  href?: string;
  roadmapId?: string;
};

export type Roadmap = {
  id: string;
  title: string;
  description: string;
  audience: string;
  stages: RoadmapStage[];
  children?: RoadmapChild[];
  tone?: RoadmapChild["tone"];
};

export type SkillTreeRole = {
  id: string;
  title: string;
  shortLabel: string;
  description: string;
  tone: "frontend" | "fullstack" | "backend" | "ml";
  roadmapId?: string;
};

export type SkillTreeSkill = {
  id: string;
  title: string;
  shortLabel: string;
  description: string;
  tone: "html" | "css" | "javascript" | "python" | "database";
  kind: "external" | "internal";
  href?: string;
  roadmapId?: string;
  exerciseIds: string[];
};

export type SkillTreeConnection = {
  roleId: SkillTreeRole["id"];
  skillId: SkillTreeSkill["id"];
};

const javascriptRoadmap: Roadmap = {
  id: "javascript",
  title: "JavaScript",
  description:
    "Путь от первых строк JavaScript до уверенной работы с браузером, сетью и архитектурой приложений.",
  audience: "С нуля до самостоятельного frontend-разработчика",
  tone: "javascript",
  stages: [
    {
      id: "javascript-basics",
      title: "Основы JavaScript",
      description: "Разбираемся, как язык хранит данные, принимает решения и выполняет код.",
      why: "Это словарь и грамматика языка. Без уверенной работы с типами, условиями и функциями любой следующий раздел будет ощущаться набором исключений.",
      topics: [
        "Подключение JavaScript и структура кода",
        "Строгий режим",
        "Переменные и константы",
        "Типы данных",
        "Преобразование типов",
        "Операторы и сравнения",
        "Условия и логические операторы",
        "Циклы",
        "Функции и стрелочные функции",
      ],
      exerciseIds: ["types-typeof-label", "switch-traffic-light", "arrow-square"],
    },
    {
      id: "objects",
      title: "Объекты",
      description: "Учимся моделировать сущности и понимать ссылочную природу объектов.",
      why: "Почти все данные приложения — пользователи, настройки, ответы API — представлены объектами. Здесь формируется понимание ссылок, this и создания экземпляров.",
      topics: [
        "Объекты и свойства",
        "Копирование объектов и ссылки",
        "Сборка мусора",
        "Методы объекта и this",
        "Конструкторы и оператор new",
        "Опциональная цепочка",
        "Symbol",
        "Преобразование объектов в примитивы",
      ],
      exerciseIds: ["objects-create-user", "copy-shallow-clone", "methods-counter"],
    },
    {
      id: "data-types",
      title: "Структуры данных",
      description: "Выбираем правильное представление данных и уверенно преобразуем коллекции.",
      why: "Интерфейсы постоянно фильтруют, группируют и преобразуют коллекции. Правильная структура данных делает такой код короче и предсказуемее.",
      topics: [
        "Числа и строки",
        "Массивы",
        "Методы массивов",
        "Перебираемые объекты",
        "Map и Set",
        "WeakMap и WeakSet",
        "Object.keys, values и entries",
        "Деструктуризация",
        "Дата и время",
        "JSON",
      ],
      exerciseIds: ["polyfill-my-map", "polyfill-my-reduce", "data-types-json-stringify-pretty"],
    },
    {
      id: "advanced-functions",
      title: "Функции глубже",
      description: "Понимаем область видимости, контекст вызова и жизненный цикл функции.",
      why: "Замыкания и функции высшего порядка лежат в основе обработчиков, компонентов и библиотек. Они помогают управлять состоянием без глобальных переменных.",
      topics: [
        "Рекурсия и стек",
        "Остаточные параметры и spread",
        "Замыкания и лексическое окружение",
        "Поднятие объявлений и var",
        "Глобальный объект",
        "Объект функции и NFE",
        "setTimeout и setInterval",
        "Декораторы, call и apply",
        "Привязка контекста через bind",
      ],
      exerciseIds: [
        "function-expression-counter",
        "function-expression-pipe",
        "function-expression-memoize",
      ],
    },
    {
      id: "prototypes-classes",
      title: "Прототипы и классы",
      description: "Строим расширяемые модели без магии вокруг наследования.",
      why: "Даже если писать только современный class, JavaScript продолжает работать через прототипы. Понимание механизма упрощает отладку библиотек и наследования.",
      topics: [
        "Прототипное наследование",
        "F.prototype",
        "Встроенные прототипы",
        "Синтаксис class",
        "Наследование классов",
        "Статические и приватные поля",
        "Проверка класса через instanceof",
        "Примеси",
      ],
      exerciseIds: ["constructor-user", "constructor-with-method", "polyfill-my-new"],
    },
    {
      id: "errors-async",
      title: "Ошибки и асинхронность",
      description:
        "Управляем операциями, результат которых появится позже или может не появиться вовсе.",
      why: "Запросы, таймеры и пользовательские действия не завершаются мгновенно. Этот этап учит сохранять управляемость кода при задержках и ошибках.",
      topics: [
        "try...catch и пользовательские ошибки",
        "Callback-функции",
        "Promise",
        "Цепочки промисов",
        "Обработка ошибок в промисах",
        "Promise API",
        "Микрозадачи и event loop",
        "async и await",
        "Генераторы и асинхронные итераторы",
      ],
      exerciseIds: ["autocomplete-search", "switch-state-transition", "switch-normalize-event"],
    },
    {
      id: "modules-tooling",
      title: "Модули и качество кода",
      description: "Собираем программу из понятных частей и учимся доверять изменениям.",
      why: "Рабочий проект должен переживать изменения. Модули, тесты и отладка снижают цену каждой новой функции и помогают находить ошибки раньше пользователя.",
      topics: [
        "Модули ES и динамический import",
        "Экспорт и импорт",
        "Отладка в браузере",
        "Стиль и читаемость кода",
        "Комментарии и документация",
        "Автоматическое тестирование",
        "Транспиляция и сборка",
        "Основы TypeScript",
      ],
      exerciseIds: ["quality-fix-average", "quality-early-return", "quality-debug-trace"],
    },
    {
      id: "browser-dom",
      title: "Браузер и DOM",
      description: "Связываем JavaScript с тем, что пользователь видит на экране.",
      why: "DOM — реальная поверхность frontend-приложения. Здесь данные превращаются в элементы, размеры, состояния и доступный пользователю интерфейс.",
      topics: [
        "Окружение браузера",
        "DOM-дерево",
        "Навигация по DOM",
        "Поиск элементов",
        "Свойства узлов, атрибуты и свойства",
        "Изменение документа",
        "Стили и CSS-классы",
        "Размеры, прокрутка и координаты",
      ],
      exerciseIds: ["todo-list", "modal-component", "objects-read-property"],
    },
    {
      id: "events-forms",
      title: "События и формы",
      description: "Создаём интерфейсы, которые корректно реагируют на действия пользователя.",
      why: "Интерфейс существует ради взаимодействия. События и формы связывают действия пользователя с состоянием приложения без случайных побочных эффектов.",
      topics: [
        "Браузерные события",
        "Всплытие и погружение",
        "Делегирование событий",
        "Действия браузера по умолчанию",
        "Пользовательские события",
        "События мыши, клавиатуры и указателя",
        "Элементы форм",
        "Фокус, change, input и submit",
      ],
      exerciseIds: ["modal-component", "todo-list", "data-types-parse-form-values"],
    },
    {
      id: "network-storage",
      title: "Сеть и хранение данных",
      description: "Получаем данные с сервера и сохраняем состояние между посещениями.",
      why: "Настоящее приложение не живёт в одной вкладке: оно получает серверные данные, отменяет устаревшие запросы и восстанавливает состояние после перезагрузки.",
      topics: [
        "Fetch API",
        "FormData",
        "Отмена запросов через AbortController",
        "CORS",
        "URL и URLSearchParams",
        "WebSocket",
        "Cookie",
        "LocalStorage и SessionStorage",
        "IndexedDB",
      ],
      exerciseIds: ["autocomplete-search", "data-types-json-stringify-pretty", "types-json-kind"],
    },
    {
      id: "production-frontend",
      title: "Frontend в production",
      description: "Закрепляем фундамент на реальном приложении и готовим его к пользователям.",
      why: "Финальный этап объединяет язык и браузер в продукт: доступный, быстрый, безопасный и достаточно понятный, чтобы его можно было развивать дальше.",
      topics: [
        "Компонентный подход",
        "Управление состоянием",
        "Маршрутизация",
        "Доступность интерфейсов",
        "Адаптивная вёрстка",
        "Производительность",
        "Безопасность в браузере",
        "Проектирование и деплой приложения",
      ],
      exerciseIds: ["todo-list", "modal-component", "autocomplete-search"],
    },
  ],
};

const frontendRoadmap: Roadmap = {
  id: "frontend",
  title: "Frontend",
  description:
    "Большая карта frontend-разработки: HTML, CSS и JavaScript в одном последовательном пути.",
  audience: "От структуры страницы до интерактивного приложения",
  stages: [],
  children: [
    {
      id: "html",
      title: "HTML",
      description: "Структура страниц, семантика и доступный контент.",
      tone: "html",
      kind: "external",
      href: "https://roadmap.sh/html",
    },
    {
      id: "css",
      title: "CSS",
      description: "Стили, раскладка, адаптивность и визуальная система.",
      tone: "css",
      kind: "external",
      href: "https://roadmap.sh/css",
    },
    {
      id: "javascript",
      title: "JavaScript",
      description: "Язык, браузерные API, асинхронность и логика интерфейсов.",
      tone: "javascript",
      kind: "internal",
      roadmapId: "javascript",
    },
  ],
};

export const skillTreeRoles: SkillTreeRole[] = [
  {
    id: "frontend-role",
    title: "Frontend",
    shortLabel: "FE",
    description: "Интерфейсы, браузер и визуальная часть продукта.",
    tone: "frontend",
    roadmapId: "frontend",
  },
  {
    id: "fullstack-role",
    title: "Full Stack",
    shortLabel: "FS",
    description: "Полный путь от интерфейса до сервера и данных.",
    tone: "fullstack",
  },
  {
    id: "backend-role",
    title: "Backend",
    shortLabel: "BE",
    description: "Серверная логика, API и хранение данных.",
    tone: "backend",
  },
  {
    id: "ml-role",
    title: "ML",
    shortLabel: "ML",
    description: "Модели, данные и эксперименты машинного обучения.",
    tone: "ml",
  },
];

export const skillTreeSkills: SkillTreeSkill[] = [
  {
    id: "html-skill",
    title: "HTML",
    shortLabel: "HTML",
    description: "Семантическая структура и доступность страницы.",
    tone: "html",
    kind: "external",
    href: "https://roadmap.sh/html",
    exerciseIds: [],
  },
  {
    id: "css-skill",
    title: "CSS",
    shortLabel: "CSS",
    description: "Стили, раскладка, адаптивность и визуальная система.",
    tone: "css",
    kind: "external",
    href: "https://roadmap.sh/css",
    exerciseIds: [],
  },
  {
    id: "javascript-skill",
    title: "JavaScript",
    shortLabel: "JS",
    description: "Язык, браузерные API, асинхронность и логика интерфейсов.",
    tone: "javascript",
    kind: "internal",
    roadmapId: "javascript",
    exerciseIds: [...new Set(javascriptRoadmap.stages.flatMap((stage) => stage.exerciseIds))],
  },
  {
    id: "python-skill",
    title: "Python",
    shortLabel: "PY",
    description: "Общий язык для backend, автоматизации и ML.",
    tone: "python",
    kind: "external",
    href: "https://roadmap.sh/python",
    exerciseIds: [],
  },
  {
    id: "databases-skill",
    title: "Databases",
    shortLabel: "DB",
    description: "Модели данных, запросы и надёжное хранение.",
    tone: "database",
    kind: "external",
    href: "https://roadmap.sh/sql",
    exerciseIds: [],
  },
];

export const skillTreeConnections: SkillTreeConnection[] = [
  { roleId: "frontend-role", skillId: "html-skill" },
  { roleId: "frontend-role", skillId: "css-skill" },
  { roleId: "frontend-role", skillId: "javascript-skill" },
  { roleId: "fullstack-role", skillId: "html-skill" },
  { roleId: "fullstack-role", skillId: "css-skill" },
  { roleId: "fullstack-role", skillId: "javascript-skill" },
  { roleId: "fullstack-role", skillId: "python-skill" },
  { roleId: "fullstack-role", skillId: "databases-skill" },
  { roleId: "backend-role", skillId: "javascript-skill" },
  { roleId: "backend-role", skillId: "python-skill" },
  { roleId: "backend-role", skillId: "databases-skill" },
  { roleId: "ml-role", skillId: "python-skill" },
  { roleId: "ml-role", skillId: "databases-skill" },
];

export const optionalSkillTreeConnectionKeys = new Set([
  "fullstack-role:python-skill",
  "fullstack-role:databases-skill",
  "backend-role:javascript-skill",
  "backend-role:python-skill",
  "ml-role:databases-skill",
]);

export const roadmaps: Roadmap[] = [frontendRoadmap];
const roadmapIndex = new Map<string, Roadmap>(
  [frontendRoadmap, javascriptRoadmap].map((roadmap) => [roadmap.id, roadmap]),
);

export function getRoadmapById(id: string): Roadmap | undefined {
  return roadmapIndex.get(id);
}

export function getRoadmapTopicCount(roadmap: Roadmap): number {
  return roadmap.stages.reduce((total, stage) => total + stage.topics.length, 0);
}
