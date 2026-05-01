import type { ChallengeDefinition, ChallengeFile } from "../../types.ts";
import { getChallengePoints } from "../../ranking.ts";

interface SwitchChallengeConfig {
  id: string;
  title: string;
  description: string;
  starter: string;
  tests: string;
  fullTests?: string;
  solution?: string;
  difficulty?: ChallengeDefinition["difficulty"];
  rank?: number;
  reputation?: number;
  tags: string[];
}

const emptyLangs: ChallengeFile[] = [];

function createSwitchChallenge(config: SwitchChallengeConfig): ChallengeDefinition {
  const rank = config.rank ?? 1;
  const starterFiles: ChallengeFile[] = [
    {
      path: "src/index.js",
      content: config.starter,
    },
  ];
  const testFiles: ChallengeFile[] = [
    {
      path: "src/index.test.js",
      content: config.tests,
    },
  ];
  const fullTestFiles: ChallengeFile[] = [
    {
      path: "src/index.full.test.js",
      content: config.fullTests ?? config.tests,
    },
  ];
  const solutionFiles: ChallengeFile[] = config.solution
    ? [
        {
          path: "src/index.js",
          content: config.solution,
        },
      ]
    : emptyLangs;

  return {
    id: config.id,
    title: config.title,
    description: config.description,
    difficulty: config.difficulty ?? "Starter",
    category: "JavaScript",
    group: "Switch в JavaScript",
    languages: ["javascript"],
    rank,
    reputation: config.reputation ?? getChallengePoints(rank),
    tags: ["JS/switch", "switch", "control-flow", ...config.tags],
    starterFiles: {
      javascript: starterFiles,
      typescript: emptyLangs,
      react: emptyLangs,
      svelte: emptyLangs,
      vue: emptyLangs,
    },
    testFiles: {
      javascript: testFiles,
      typescript: emptyLangs,
      react: emptyLangs,
      svelte: emptyLangs,
      vue: emptyLangs,
    },
    fullTestFiles: {
      javascript: fullTestFiles,
      typescript: emptyLangs,
      react: emptyLangs,
      svelte: emptyLangs,
      vue: emptyLangs,
    },
    solutionFiles: {
      javascript: solutionFiles,
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
}

export const switchChallenges: ChallengeDefinition[] = [
  createSwitchChallenge({
    id: "switch-traffic-light",
    title: "Сигнал светофора",
    description: `Когда значений немного и каждое значение означает отдельное действие, \`switch\` помогает сделать код прямым и читаемым. Светофор - хороший минимальный пример: цвет уже является готовым кодом состояния, а функция должна только выбрать нужную команду.

Напиши \`getTrafficAction(color)\`: функция получает строку с цветом сигнала и возвращает короткое действие для пользователя. Не нужно придумывать сложную логику или проверять похожие цвета. Сравнивай только с теми строками, которые перечислены в требованиях.

Примеры:

\`getTrafficAction("red") // "stop"\`
\`getTrafficAction("yellow") // "wait"\`
\`getTrafficAction("green") // "go"\`
\`getTrafficAction("blue") // "unknown"\`

## Требования

1. Экспортируй функцию \`getTrafficAction(color)\`.
2. Используй \`switch\` по значению \`color\`.
3. Для \`"red"\` верни \`"stop"\`.
4. Для \`"yellow"\` верни \`"wait"\`.
5. Для \`"green"\` верни \`"go"\`.
6. Для любого другого значения верни \`"unknown"\`.

## Интерфейс

Экспортируй функцию \`getTrafficAction(color)\`.`,
    starter: `export function getTrafficAction(color) {
  // Выбери действие по цвету светофора
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { getTrafficAction } from './index.js';

describe('getTrafficAction', () => {
  it('returns actions for known lights', () => {
    expect(getTrafficAction('red')).toBe('stop');
    expect(getTrafficAction('yellow')).toBe('wait');
    expect(getTrafficAction('green')).toBe('go');
  });

  it('returns unknown for unsupported lights', () => {
    expect(getTrafficAction('blue')).toBe('unknown');
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { getTrafficAction } from './index.js';

describe('getTrafficAction', () => {
  it('maps every supported color to one action', () => {
    expect(getTrafficAction('red')).toBe('stop');
    expect(getTrafficAction('yellow')).toBe('wait');
    expect(getTrafficAction('green')).toBe('go');
  });

  it('does not guess unknown values', () => {
    expect(getTrafficAction('RED')).toBe('unknown');
    expect(getTrafficAction('')).toBe('unknown');
    expect(getTrafficAction(null)).toBe('unknown');
  });
});
`,
    solution: `export function getTrafficAction(color) {
  switch (color) {
    case 'red':
      return 'stop';
    case 'yellow':
      return 'wait';
    case 'green':
      return 'go';
    default:
      return 'unknown';
  }
}
`,
    tags: ["strings", "default-case"],
    rank: 1,
  }),
  createSwitchChallenge({
    id: "switch-http-status",
    title: "HTTP status через switch",
    description: `HTTP-статус - это числовой код ответа сервера. В приложении такой код редко показывают пользователю напрямую: обычно его переводят в короткую метку, по которой дальше можно выбрать текст, цвет или действие.

Напиши \`describeStatus(status)\`: функция получает HTTP-статус числом и возвращает строковую метку. Здесь важно заметить, что несколько разных кодов могут означать одну группу ошибок. Например, \`401\` и \`403\` относятся к проблемам авторизации, поэтому обе ветки должны вернуть одну и ту же строку.

Примеры:

\`describeStatus(200) // "ok"\`
\`describeStatus(401) // "auth-error"\`
\`describeStatus(418) // "unknown"\`

## Требования

1. Экспортируй функцию \`describeStatus(status)\`.
2. Используй \`switch\` по значению \`status\`.
3. Для \`200\` верни \`"ok"\`.
4. Для \`201\` верни \`"created"\`.
5. Для \`400\` верни \`"bad-request"\`.
6. Для \`401\` и \`403\` верни \`"auth-error"\`.
7. Для остальных статусов верни \`"unknown"\`.

## Интерфейс

Экспортируй функцию \`describeStatus(status)\`.`,
    starter: `export function describeStatus(status) {
  // Решение должно быть через switch
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { describeStatus } from './index.js';

describe('describeStatus', () => {
  it('describes success statuses', () => {
    expect(describeStatus(200)).toBe('ok');
    expect(describeStatus(201)).toBe('created');
  });

  it('groups auth errors', () => {
    expect(describeStatus(401)).toBe('auth-error');
    expect(describeStatus(403)).toBe('auth-error');
  });

  it('handles bad requests and unknown statuses', () => {
    expect(describeStatus(400)).toBe('bad-request');
    expect(describeStatus(418)).toBe('unknown');
  });
});
`,
    solution: `export function describeStatus(status) {
  switch (status) {
    case 200:
      return 'ok';
    case 201:
      return 'created';
    case 400:
      return 'bad-request';
    case 401:
    case 403:
      return 'auth-error';
    default:
      return 'unknown';
  }
}
`,
    tags: ["http", "default-case"],
    rank: 2,
  }),
  createSwitchChallenge({
    id: "switch-currency-symbol",
    title: "Символ валюты",
    description: `В платежном интерфейсе сумма часто хранится отдельно от валюты. Чтобы красиво показать цену, нужно превратить код валюты вроде \`"USD"\` или \`"EUR"\` в символ.

Напиши \`getCurrencySymbol(code)\`: функция получает трехбуквенный код валюты и возвращает символ. Не нужно нормализовать регистр: если пришло \`"usd"\`, это неизвестный код. Такая строгость помогает увидеть, что \`switch\` сравнивает значения точно.

Примеры:

\`getCurrencySymbol("USD") // "$"\`
\`getCurrencySymbol("RUB") // "₽"\`
\`getCurrencySymbol("usd") // "?"\`

## Требования

1. Экспортируй функцию \`getCurrencySymbol(code)\`.
2. Используй \`switch\` по значению \`code\`.
3. Для \`"USD"\` верни \`"$"\`.
4. Для \`"EUR"\` верни \`"€"\`.
5. Для \`"RUB"\` верни \`"₽"\`.
6. Для \`"JPY"\` верни \`"¥"\`.
7. Для неизвестного кода верни \`"?"\`.

## Интерфейс

Экспортируй функцию \`getCurrencySymbol(code)\`.`,
    starter: `export function getCurrencySymbol(code) {
  // Верни символ валюты
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { getCurrencySymbol } from './index.js';

describe('getCurrencySymbol', () => {
  it('returns symbols for common currencies', () => {
    expect(getCurrencySymbol('USD')).toBe('$');
    expect(getCurrencySymbol('EUR')).toBe('€');
    expect(getCurrencySymbol('RUB')).toBe('₽');
  });

  it('returns a fallback symbol for unknown codes', () => {
    expect(getCurrencySymbol('GBP')).toBe('?');
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { getCurrencySymbol } from './index.js';

describe('getCurrencySymbol', () => {
  it('supports the full required list', () => {
    expect(getCurrencySymbol('USD')).toBe('$');
    expect(getCurrencySymbol('EUR')).toBe('€');
    expect(getCurrencySymbol('RUB')).toBe('₽');
    expect(getCurrencySymbol('JPY')).toBe('¥');
  });

  it('keeps comparison strict and explicit', () => {
    expect(getCurrencySymbol('usd')).toBe('?');
    expect(getCurrencySymbol('')).toBe('?');
  });
});
`,
    solution: `export function getCurrencySymbol(code) {
  switch (code) {
    case 'USD':
      return '$';
    case 'EUR':
      return '€';
    case 'RUB':
      return '₽';
    case 'JPY':
      return '¥';
    default:
      return '?';
  }
}
`,
    tags: ["strings", "strict-comparison"],
    rank: 1,
  }),
  createSwitchChallenge({
    id: "switch-shipping-price",
    title: "Стоимость доставки",
    description: `Способ доставки обычно приходит строковым кодом: например, \`"standard"\` или \`"express"\`. По этому коду нужно выбрать фиксированную цену, которую потом можно добавить к итоговой стоимости заказа.

Напиши \`getShippingPrice(method)\`: функция получает код доставки и возвращает стоимость числом. Если код неизвестен, это уже не просто запасной текст, а ошибка в данных. Поэтому в таком случае нужно выбросить исключение, чтобы вызывающий код не продолжил расчет с неправильной доставкой.

Примеры:

\`getShippingPrice("pickup") // 0\`
\`getShippingPrice("express") // 700\`
\`getShippingPrice("drone") // throws Error("Unknown shipping method")\`

## Требования

1. Экспортируй функцию \`getShippingPrice(method)\`.
2. Используй \`switch\` по строке \`method\`.
3. \`"pickup"\` должен вернуть \`0\`.
4. \`"standard"\` должен вернуть \`300\`.
5. \`"express"\` должен вернуть \`700\`.
6. \`"overnight"\` должен вернуть \`1200\`.
7. Для неизвестного способа выброси ошибку с текстом \`"Unknown shipping method"\`.

## Интерфейс

Экспортируй функцию \`getShippingPrice(method)\`.`,
    starter: `export function getShippingPrice(method) {
  // Верни стоимость или выброси ошибку
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { getShippingPrice } from './index.js';

describe('getShippingPrice', () => {
  it('returns prices for known methods', () => {
    expect(getShippingPrice('pickup')).toBe(0);
    expect(getShippingPrice('standard')).toBe(300);
    expect(getShippingPrice('express')).toBe(700);
    expect(getShippingPrice('overnight')).toBe(1200);
  });

  it('throws for unknown methods', () => {
    expect(() => getShippingPrice('drone')).toThrow('Unknown shipping method');
  });
});
`,
    solution: `export function getShippingPrice(method) {
  switch (method) {
    case 'pickup':
      return 0;
    case 'standard':
      return 300;
    case 'express':
      return 700;
    case 'overnight':
      return 1200;
    default:
      throw new Error('Unknown shipping method');
  }
}
`,
    tags: ["errors", "strings"],
    rank: 2,
  }),
  createSwitchChallenge({
    id: "switch-log-prefix",
    title: "Префикс лога",
    description: `В модулях логирования уровень сообщения превращается в короткий префикс — \`[ERROR]\`, \`[WARN]\`, \`[INFO]\`. Префикс собирается отдельно, а потом склеивается с текстом сообщения.

Напиши \`formatLogEntry(level, message)\`: через \`switch\` присвой переменной \`prefix\` нужный префикс, а после \`switch\` верни строку \`\${prefix} \${message}\`. Каждая ветка должна заканчиваться \`break\`, иначе выполнение провалится в следующую ветку и перезапишет \`prefix\`.

Примеры:

\`formatLogEntry("error", "File not found") // "[ERROR] File not found"\`
\`formatLogEntry("warn", "Disk space low") // "[WARN] Disk space low"\`
\`formatLogEntry("info", "Server started") // "[INFO] Server started"\`
\`formatLogEntry("debug", "Request received") // "[LOG] Request received"\`

## Требования

1. Экспортируй функцию \`formatLogEntry(level, message)\`.
2. Используй \`switch\` по строке \`level\`.
3. Завершай каждую ветку \`break\`, а не \`return\`.
4. Для \`"error"\` установи \`prefix = "[ERROR]"\`.
5. Для \`"warn"\` установи \`prefix = "[WARN]"\`.
6. Для \`"info"\` установи \`prefix = "[INFO]"\`.
7. Для неизвестного уровня установи \`prefix = "[LOG]"\`.
8. После \`switch\` верни \`\`\${prefix} \${message}\`\`.

## Интерфейс

Экспортируй функцию \`formatLogEntry(level, message)\`.`,
    starter: `export function formatLogEntry(level, message) {
  let prefix;
  // Через switch по level присвой prefix
  // Каждая ветка должна заканчиваться break

  return \`\${prefix} \${message}\`;
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { formatLogEntry } from './index.js';

describe('formatLogEntry', () => {
  it('applies correct prefixes for known levels', () => {
    expect(formatLogEntry('error', 'File not found')).toBe('[ERROR] File not found');
    expect(formatLogEntry('warn', 'Disk space low')).toBe('[WARN] Disk space low');
    expect(formatLogEntry('info', 'Server started')).toBe('[INFO] Server started');
  });

  it('uses a fallback prefix for unknown levels', () => {
    expect(formatLogEntry('debug', 'Request received')).toBe('[LOG] Request received');
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { formatLogEntry } from './index.js';

describe('formatLogEntry', () => {
  it('applies correct prefixes for known levels', () => {
    expect(formatLogEntry('error', 'File not found')).toBe('[ERROR] File not found');
    expect(formatLogEntry('warn', 'Disk space low')).toBe('[WARN] Disk space low');
    expect(formatLogEntry('info', 'Server started')).toBe('[INFO] Server started');
  });

  it('uses a fallback prefix for unknown levels', () => {
    expect(formatLogEntry('debug', 'Request received')).toBe('[LOG] Request received');
    expect(formatLogEntry('verbose', 'Detailed output')).toBe('[LOG] Detailed output');
  });

  it('combines prefix and message correctly', () => {
    expect(formatLogEntry('error', '')).toBe('[ERROR] ');
    expect(formatLogEntry('info', 'Hello World')).toBe('[INFO] Hello World');
  });
});
`,
    solution: `export function formatLogEntry(level, message) {
  let prefix;
  switch (level) {
    case 'error':
      prefix = '[ERROR]';
      break;
    case 'warn':
      prefix = '[WARN]';
      break;
    case 'info':
      prefix = '[INFO]';
      break;
    default:
      prefix = '[LOG]';
  }
  return \`\${prefix} \${message}\`;
}
`,
    tags: ["break", "string-template", "logging"],
    rank: 2,
  }),
  createSwitchChallenge({
    id: "switch-file-extension",
    title: "Тип файла по расширению",
    description: `Расширение файла - это короткий код в конце имени: \`"png"\`, \`"pdf"\`, \`"zip"\`. По нему часто выбирают иконку, способ предпросмотра или обработчик загрузки.

Напиши \`getFileCategory(extension)\`: функция получает расширение без точки и возвращает категорию файла. Некоторые расширения должны попадать в одну категорию. Например, \`"jpg"\`, \`"jpeg"\` и \`"png"\` - это изображения, поэтому их можно сгруппировать несколькими \`case\` подряд.

Примеры:

\`getFileCategory("png") // "image"\`
\`getFileCategory("pdf") // "document"\`
\`getFileCategory("zip") // "archive"\`
\`getFileCategory("exe") // "unknown"\`

## Требования

1. Экспортируй функцию \`getFileCategory(extension)\`.
2. Используй \`switch\` и группировку \`case\`.
3. Для \`"jpg"\`, \`"jpeg"\`, \`"png"\`, \`"gif"\` верни \`"image"\`.
4. Для \`"pdf"\`, \`"doc"\`, \`"docx"\` верни \`"document"\`.
5. Для \`"zip"\` и \`"rar"\` верни \`"archive"\`.
6. Для остальных расширений верни \`"unknown"\`.

## Интерфейс

Экспортируй функцию \`getFileCategory(extension)\`.`,
    starter: `export function getFileCategory(extension) {
  // Сгруппируй расширения по категориям
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { getFileCategory } from './index.js';

describe('getFileCategory', () => {
  it('groups image extensions', () => {
    expect(getFileCategory('jpg')).toBe('image');
    expect(getFileCategory('png')).toBe('image');
  });

  it('groups documents and archives', () => {
    expect(getFileCategory('pdf')).toBe('document');
    expect(getFileCategory('zip')).toBe('archive');
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { getFileCategory } from './index.js';

describe('getFileCategory', () => {
  it('groups every required extension', () => {
    expect(getFileCategory('jpg')).toBe('image');
    expect(getFileCategory('jpeg')).toBe('image');
    expect(getFileCategory('png')).toBe('image');
    expect(getFileCategory('gif')).toBe('image');
    expect(getFileCategory('pdf')).toBe('document');
    expect(getFileCategory('doc')).toBe('document');
    expect(getFileCategory('docx')).toBe('document');
    expect(getFileCategory('zip')).toBe('archive');
    expect(getFileCategory('rar')).toBe('archive');
  });

  it('uses unknown for unsupported extensions', () => {
    expect(getFileCategory('exe')).toBe('unknown');
    expect(getFileCategory('')).toBe('unknown');
  });
});
`,
    solution: `export function getFileCategory(extension) {
  switch (extension) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return 'image';
    case 'pdf':
    case 'doc':
    case 'docx':
      return 'document';
    case 'zip':
    case 'rar':
      return 'archive';
    default:
      return 'unknown';
  }
}
`,
    tags: ["fallthrough", "grouping"],
    rank: 3,
  }),
  createSwitchChallenge({
    id: "switch-user-role",
    title: "Права пользователя",
    description: `Роль пользователя часто раскрывается в набор разрешений. Например, гость может только читать, редактор может читать и писать, а владелец может управлять оплатой.

Напиши \`getRolePermissions(role)\`: функция получает роль и возвращает массив разрешений для этой роли. Здесь важно вернуть именно массив строк. Для неизвестной роли не нужно бросать ошибку: безопаснее вернуть пустой список прав.

Примеры:

\`getRolePermissions("guest") // ["read"]\`
\`getRolePermissions("admin") // ["read", "write", "delete"]\`
\`getRolePermissions("anonymous") // []\`

## Требования

1. Экспортируй функцию \`getRolePermissions(role)\`.
2. Используй \`switch\` по роли.
3. Для \`"guest"\` верни \`["read"]\`.
4. Для \`"editor"\` верни \`["read", "write"]\`.
5. Для \`"admin"\` верни \`["read", "write", "delete"]\`.
6. Для \`"owner"\` верни \`["read", "write", "delete", "billing"]\`.
7. Для неизвестной роли верни пустой массив.

## Интерфейс

Экспортируй функцию \`getRolePermissions(role)\`.`,
    starter: `export function getRolePermissions(role) {
  // Верни массив прав для роли
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { getRolePermissions } from './index.js';

describe('getRolePermissions', () => {
  it('returns permissions for known roles', () => {
    expect(getRolePermissions('guest')).toEqual(['read']);
    expect(getRolePermissions('editor')).toEqual(['read', 'write']);
    expect(getRolePermissions('admin')).toEqual(['read', 'write', 'delete']);
    expect(getRolePermissions('owner')).toEqual(['read', 'write', 'delete', 'billing']);
  });

  it('returns an empty list for unknown roles', () => {
    expect(getRolePermissions('anonymous')).toEqual([]);
  });
});
`,
    solution: `export function getRolePermissions(role) {
  switch (role) {
    case 'guest':
      return ['read'];
    case 'editor':
      return ['read', 'write'];
    case 'admin':
      return ['read', 'write', 'delete'];
    case 'owner':
      return ['read', 'write', 'delete', 'billing'];
    default:
      return [];
  }
}
`,
    tags: ["arrays", "roles"],
    rank: 2,
  }),
  createSwitchChallenge({
    id: "switch-weekday-type",
    title: "Тип дня недели",
    description: `Номер дня недели можно сгруппировать в рабочие и выходные дни. В \`switch\` для этого удобно использовать несколько \`case\` подряд: разные входные значения попадают в одну общую ветку.

Напиши \`getWeekdayType(day)\`: функция получает номер дня недели, где \`1\` - понедельник, а \`7\` - воскресенье. Числа от \`1\` до \`5\` считаются рабочими днями, \`6\` и \`7\` - выходными. Все остальные значения считаются некорректными.

Примеры:

\`getWeekdayType(1) // "workday"\`
\`getWeekdayType(6) // "weekend"\`
\`getWeekdayType(0) // "invalid"\`

## Требования

1. Экспортируй функцию \`getWeekdayType(day)\`.
2. Используй \`switch\` и группировку \`case\`.
3. Для \`1\`, \`2\`, \`3\`, \`4\`, \`5\` верни \`"workday"\`.
4. Для \`6\` и \`7\` верни \`"weekend"\`.
5. Для остальных значений верни \`"invalid"\`.
6. Не решай задачу через длинную цепочку \`if/else\`.

## Интерфейс

Экспортируй функцию \`getWeekdayType(day)\`.`,
    starter: `export function getWeekdayType(day) {
  // 1 = понедельник, 7 = воскресенье
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { getWeekdayType } from './index.js';

describe('getWeekdayType', () => {
  it('detects workdays', () => {
    expect(getWeekdayType(1)).toBe('workday');
    expect(getWeekdayType(3)).toBe('workday');
    expect(getWeekdayType(5)).toBe('workday');
  });

  it('detects weekends', () => {
    expect(getWeekdayType(6)).toBe('weekend');
    expect(getWeekdayType(7)).toBe('weekend');
  });

  it('detects invalid values', () => {
    expect(getWeekdayType(0)).toBe('invalid');
    expect(getWeekdayType(8)).toBe('invalid');
  });
});
`,
    solution: `export function getWeekdayType(day) {
  switch (day) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
      return 'workday';
    case 6:
    case 7:
      return 'weekend';
    default:
      return 'invalid';
  }
}
`,
    tags: ["fallthrough", "numbers"],
    rank: 2,
  }),
  createSwitchChallenge({
    id: "switch-priority-score",
    title: "Приоритет задачи",
    description: `В трекере задач приоритет часто хранится строкой: \`"low"\`, \`"normal"\`, \`"high"\`. Для сортировки такую строку удобно превратить в число: чем выше число, тем раньше задача должна попасть в список.

Напиши \`getPriorityScore(priority)\`: функция получает приоритет и возвращает числовой вес. В этой задаче важно не только выбрать значения через \`switch\`, но и правильно обработать отсутствие приоритета: неизвестная строка должна считаться обычной задачей, а не самой важной.

Примеры:

\`getPriorityScore("low") // 1\`
\`getPriorityScore("urgent") // 4\`
\`getPriorityScore("later") // 2\`

## Требования

1. Экспортируй функцию \`getPriorityScore(priority)\`.
2. Используй \`switch\` по строке \`priority\`.
3. Для \`"low"\` верни \`1\`.
4. Для \`"normal"\` верни \`2\`.
5. Для \`"high"\` верни \`3\`.
6. Для \`"urgent"\` верни \`4\`.
7. Для неизвестного приоритета верни \`2\`.

## Интерфейс

Экспортируй функцию \`getPriorityScore(priority)\`.`,
    starter: `export function getPriorityScore(priority) {
  // Верни числовой вес приоритета
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { getPriorityScore } from './index.js';

describe('getPriorityScore', () => {
  it('returns scores for known priorities', () => {
    expect(getPriorityScore('low')).toBe(1);
    expect(getPriorityScore('normal')).toBe(2);
    expect(getPriorityScore('high')).toBe(3);
    expect(getPriorityScore('urgent')).toBe(4);
  });

  it('uses normal priority as a fallback', () => {
    expect(getPriorityScore('later')).toBe(2);
  });
});
`,
    solution: `export function getPriorityScore(priority) {
  switch (priority) {
    case 'low':
      return 1;
    case 'normal':
      return 2;
    case 'high':
      return 3;
    case 'urgent':
      return 4;
    default:
      return 2;
  }
}
`,
    tags: ["numbers", "fallback"],
    rank: 1,
  }),
  createSwitchChallenge({
    id: "switch-notification-channel",
    title: "Канал уведомлений",
    description: `Каналы уведомлений настраиваются по-разному. Email может повторять отправку несколько раз, SMS лучше не спамить, а push-уведомление можно отправить сразу без очереди.

Напиши \`getNotificationSettings(channel)\`: функция получает название канала и возвращает объект настроек. Для неизвестного канала верни безопасные настройки по умолчанию: отправка отключена. Каждый вызов должен возвращать новый объект, чтобы один результат нельзя было случайно изменить и сломать следующий вызов.

Примеры:

\`getNotificationSettings("email") // { async: true, retries: 3 }\`
\`getNotificationSettings("fax") // { async: false, retries: 0, disabled: true }\`

## Требования

1. Экспортируй функцию \`getNotificationSettings(channel)\`.
2. Используй \`switch\` по строке \`channel\`.
3. Для \`"email"\` верни \`{ async: true, retries: 3 }\`.
4. Для \`"sms"\` верни \`{ async: true, retries: 1 }\`.
5. Для \`"push"\` верни \`{ async: false, retries: 0 }\`.
6. Для неизвестного канала верни \`{ async: false, retries: 0, disabled: true }\`.

## Интерфейс

Экспортируй функцию \`getNotificationSettings(channel)\`.`,
    starter: `export function getNotificationSettings(channel) {
  // Верни объект конфигурации
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { getNotificationSettings } from './index.js';

describe('getNotificationSettings', () => {
  it('returns config for known channels', () => {
    expect(getNotificationSettings('email')).toEqual({ async: true, retries: 3 });
    expect(getNotificationSettings('sms')).toEqual({ async: true, retries: 1 });
    expect(getNotificationSettings('push')).toEqual({ async: false, retries: 0 });
  });

  it('disables unknown channels', () => {
    expect(getNotificationSettings('fax')).toEqual({
      async: false,
      retries: 0,
      disabled: true,
    });
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { getNotificationSettings } from './index.js';

describe('getNotificationSettings', () => {
  it('returns config for known channels', () => {
    expect(getNotificationSettings('email')).toEqual({ async: true, retries: 3 });
    expect(getNotificationSettings('sms')).toEqual({ async: true, retries: 1 });
    expect(getNotificationSettings('push')).toEqual({ async: false, retries: 0 });
  });

  it('disables unknown channels', () => {
    expect(getNotificationSettings('fax')).toEqual({
      async: false,
      retries: 0,
      disabled: true,
    });
  });

  it('returns a fresh object on each call', () => {
    const first = getNotificationSettings('email');
    const second = getNotificationSettings('email');

    expect(first).toEqual(second);
    expect(first).not.toBe(second);
  });
});
`,
    solution: `export function getNotificationSettings(channel) {
  switch (channel) {
    case 'email':
      return { async: true, retries: 3 };
    case 'sms':
      return { async: true, retries: 1 };
    case 'push':
      return { async: false, retries: 0 };
    default:
      return { async: false, retries: 0, disabled: true };
  }
}
`,
    difficulty: "Mid",
    rank: 4,
    tags: ["objects", "configuration"],
  }),
  createSwitchChallenge({
    id: "switch-calculator-operation",
    title: "Операция калькулятора",
    description: `В калькуляторах, конструкторах формул и командных панелях действие часто передаётся строкой: \`"add"\`, \`"divide"\`. Это позволяет вызывающему коду не знать об арифметике напрямую — он просто говорит «сложи» или «раздели», а функция выбирает нужное действие.

Напиши \`calculateByOperation(left, right, operation)\`: через \`switch\` по строке \`operation\` выбери арифметическое действие и верни результат. Два случая требуют выброса ошибки. Для неизвестной операции это очевидно. Для деления — важно: JavaScript при \`right === 0\` молча вернёт \`Infinity\`, а не ошибку, поэтому нужно проверить делитель явно.

Примеры:

\`calculateByOperation(2, 3, "add") // 5\`
\`calculateByOperation(10, 4, "subtract") // 6\`
\`calculateByOperation(5, 2, "divide") // 2.5\`
\`calculateByOperation(8, 0, "divide") // выбрасывает Error("Cannot divide by zero")\`
\`calculateByOperation(1, 2, "power") // выбрасывает Error("Unknown operation")\`

## Требования

1. Экспортируй функцию \`calculateByOperation(left, right, operation)\`.
2. Используй \`switch\` по строке \`operation\`.
3. \`"add"\` — верни \`left + right\`.
4. \`"subtract"\` — верни \`left - right\`.
5. \`"multiply"\` — верни \`left * right\`.
6. \`"divide"\` — верни \`left / right\`; если \`right === 0\`, выброси \`Error("Cannot divide by zero")\`.
7. Для неизвестной операции выброси \`Error("Unknown operation")\`.

## Интерфейс

Экспортируй функцию \`calculateByOperation(left, right, operation)\`.`,
    starter: `export function calculateByOperation(left, right, operation) {
  // Выбери арифметическую операцию
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { calculateByOperation } from './index.js';

describe('calculateByOperation', () => {
  it('performs basic operations', () => {
    expect(calculateByOperation(2, 3, 'add')).toBe(5);
    expect(calculateByOperation(10, 4, 'subtract')).toBe(6);
    expect(calculateByOperation(6, 7, 'multiply')).toBe(42);
    expect(calculateByOperation(12, 3, 'divide')).toBe(4);
  });

  it('throws for division by zero', () => {
    expect(() => calculateByOperation(8, 0, 'divide')).toThrow('Cannot divide by zero');
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { calculateByOperation } from './index.js';

describe('calculateByOperation', () => {
  it('performs basic operations', () => {
    expect(calculateByOperation(2, 3, 'add')).toBe(5);
    expect(calculateByOperation(10, 4, 'subtract')).toBe(6);
    expect(calculateByOperation(6, 7, 'multiply')).toBe(42);
    expect(calculateByOperation(12, 3, 'divide')).toBe(4);
  });

  it('handles negative and fractional results', () => {
    expect(calculateByOperation(2, 5, 'subtract')).toBe(-3);
    expect(calculateByOperation(5, 2, 'divide')).toBe(2.5);
  });

  it('throws clear errors for invalid operations', () => {
    expect(() => calculateByOperation(8, 0, 'divide')).toThrow('Cannot divide by zero');
    expect(() => calculateByOperation(1, 2, 'power')).toThrow('Unknown operation');
  });
});
`,
    solution: `export function calculateByOperation(left, right, operation) {
  switch (operation) {
    case 'add':
      return left + right;
    case 'subtract':
      return left - right;
    case 'multiply':
      return left * right;
    case 'divide':
      if (right === 0) {
        throw new Error('Cannot divide by zero');
      }
      return left / right;
    default:
      throw new Error('Unknown operation');
  }
}
`,
    tags: ["math", "errors"],
    rank: 4,
  }),
  createSwitchChallenge({
    id: "switch-command-router",
    title: "Роутер команд",
    description: `CLI-приложения и командные панели часто получают действие строкой: \`"start"\`, \`"stop"\`, \`"restart"\`. Каждая команда должна вернуть структурированный результат, чтобы внешний код понимал, что делать дальше.

Напиши \`routeCommand(command)\`: функция получает команду и возвращает объект с полями \`action\` и \`message\`. Эта задача немного сложнее простого выбора строки: каждая ветка должна вернуть объект одинаковой формы, а неизвестная команда должна вернуть ошибочный результат без исключения.

Примеры:

\`routeCommand("start") // { action: "start-service", message: "Service is starting" }\`
\`routeCommand("status") // { action: "show-status", message: "Reading service status" }\`
\`routeCommand("deploy") // { action: "error", message: "Unknown command" }\`

## Требования

1. Экспортируй функцию \`routeCommand(command)\`.
2. Используй \`switch\` по строке \`command\`.
3. Для \`"start"\` верни \`{ action: "start-service", message: "Service is starting" }\`.
4. Для \`"stop"\` верни \`{ action: "stop-service", message: "Service is stopping" }\`.
5. Для \`"restart"\` верни \`{ action: "restart-service", message: "Service is restarting" }\`.
6. Для \`"status"\` верни \`{ action: "show-status", message: "Reading service status" }\`.
7. Для неизвестной команды верни \`{ action: "error", message: "Unknown command" }\`.

## Интерфейс

Экспортируй функцию \`routeCommand(command)\`.`,
    starter: `export function routeCommand(command) {
  // Верни объект действия для команды
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { routeCommand } from './index.js';

describe('routeCommand', () => {
  it('routes service commands', () => {
    expect(routeCommand('start')).toEqual({
      action: 'start-service',
      message: 'Service is starting',
    });
    expect(routeCommand('restart')).toEqual({
      action: 'restart-service',
      message: 'Service is restarting',
    });
  });

  it('returns an error action for unknown commands', () => {
    expect(routeCommand('deploy')).toEqual({
      action: 'error',
      message: 'Unknown command',
    });
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { routeCommand } from './index.js';

describe('routeCommand', () => {
  it('routes every known command', () => {
    expect(routeCommand('start')).toEqual({
      action: 'start-service',
      message: 'Service is starting',
    });
    expect(routeCommand('stop')).toEqual({
      action: 'stop-service',
      message: 'Service is stopping',
    });
    expect(routeCommand('restart')).toEqual({
      action: 'restart-service',
      message: 'Service is restarting',
    });
    expect(routeCommand('status')).toEqual({
      action: 'show-status',
      message: 'Reading service status',
    });
  });

  it('keeps unknown commands non-throwing and explicit', () => {
    expect(routeCommand('deploy')).toEqual({
      action: 'error',
      message: 'Unknown command',
    });
  });
});
`,
    solution: `export function routeCommand(command) {
  switch (command) {
    case 'start':
      return { action: 'start-service', message: 'Service is starting' };
    case 'stop':
      return { action: 'stop-service', message: 'Service is stopping' };
    case 'restart':
      return { action: 'restart-service', message: 'Service is restarting' };
    case 'status':
      return { action: 'show-status', message: 'Reading service status' };
    default:
      return { action: 'error', message: 'Unknown command' };
  }
}
`,
    tags: ["objects", "commands"],
    rank: 3,
  }),
  createSwitchChallenge({
    id: "switch-normalize-event",
    title: "Нормализация события",
    description: `В аналитике одно и то же действие может приходить из разных мест с разными именами. Например, кнопка может отправить \`"click"\`, форма - \`"submit"\`, а мобильный клиент - \`"tap"\`. Перед сохранением такие события удобно привести к единому формату.

Напиши \`normalizeEventName(eventName)\`: функция получает имя события и возвращает нормализованную строку. Несколько входных значений должны попадать в одну группу. Если событие неизвестно, верни \`"custom"\`, чтобы его можно было обработать отдельно.

Примеры:

\`normalizeEventName("click") // "interaction"\`
\`normalizeEventName("tap") // "interaction"\`
\`normalizeEventName("page_view") // "navigation"\`
\`normalizeEventName("purchase") // "custom"\`

## Требования

1. Экспортируй функцию \`normalizeEventName(eventName)\`.
2. Используй \`switch\` и группировку \`case\`.
3. \`"click"\`, \`"tap"\`, \`"submit"\` должны вернуть \`"interaction"\`.
4. \`"page_view"\`, \`"route_change"\` должны вернуть \`"navigation"\`.
5. \`"error"\`, \`"exception"\` должны вернуть \`"failure"\`.
6. \`"login"\`, \`"logout"\` должны вернуть \`"auth"\`.
7. Для неизвестного события верни \`"custom"\`.

## Интерфейс

Экспортируй функцию \`normalizeEventName(eventName)\`.`,
    starter: `export function normalizeEventName(eventName) {
  // Приведи событие к общей категории
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { normalizeEventName } from './index.js';

describe('normalizeEventName', () => {
  it('normalizes interaction and navigation events', () => {
    expect(normalizeEventName('click')).toBe('interaction');
    expect(normalizeEventName('tap')).toBe('interaction');
    expect(normalizeEventName('page_view')).toBe('navigation');
  });

  it('returns custom for unknown events', () => {
    expect(normalizeEventName('purchase')).toBe('custom');
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { normalizeEventName } from './index.js';

describe('normalizeEventName', () => {
  it('normalizes every required group', () => {
    expect(normalizeEventName('click')).toBe('interaction');
    expect(normalizeEventName('tap')).toBe('interaction');
    expect(normalizeEventName('submit')).toBe('interaction');
    expect(normalizeEventName('page_view')).toBe('navigation');
    expect(normalizeEventName('route_change')).toBe('navigation');
    expect(normalizeEventName('error')).toBe('failure');
    expect(normalizeEventName('exception')).toBe('failure');
    expect(normalizeEventName('login')).toBe('auth');
    expect(normalizeEventName('logout')).toBe('auth');
  });

  it('keeps unknown events as custom', () => {
    expect(normalizeEventName('purchase')).toBe('custom');
    expect(normalizeEventName(undefined)).toBe('custom');
  });
});
`,
    solution: `export function normalizeEventName(eventName) {
  switch (eventName) {
    case 'click':
    case 'tap':
    case 'submit':
      return 'interaction';
    case 'page_view':
    case 'route_change':
      return 'navigation';
    case 'error':
    case 'exception':
      return 'failure';
    case 'login':
    case 'logout':
      return 'auth';
    default:
      return 'custom';
  }
}
`,
    tags: ["fallthrough", "analytics"],
    rank: 3,
  }),
  createSwitchChallenge({
    id: "switch-state-transition",
    title: "Переход состояния заказа",
    description: `Многие приложения работают как маленькие автоматы состояний. Заказ может быть \`"draft"\`, затем \`"paid"\`, затем \`"shipped"\`, затем \`"delivered"\`. Не каждое действие разрешено в каждом состоянии.

Напиши \`getNextOrderStatus(status, event)\`: функция получает текущее состояние заказа и событие, которое с ним произошло. Через \`switch\` по текущему состоянию выбери, какие события можно обработать. Если переход разрешен, верни новое состояние. Если событие не подходит для текущего состояния, верни исходное состояние без изменений.

Примеры:

\`getNextOrderStatus("draft", "pay") // "paid"\`
\`getNextOrderStatus("paid", "ship") // "shipped"\`
\`getNextOrderStatus("paid", "deliver") // "paid"\`
\`getNextOrderStatus("delivered", "refund") // "refunded"\`

## Требования

1. Экспортируй функцию \`getNextOrderStatus(status, event)\`.
2. Используй \`switch\` по текущему \`status\`.
3. Из \`"draft"\` событие \`"pay"\` переводит в \`"paid"\`.
4. Из \`"paid"\` событие \`"ship"\` переводит в \`"shipped"\`, а \`"cancel"\` - в \`"cancelled"\`.
5. Из \`"shipped"\` событие \`"deliver"\` переводит в \`"delivered"\`.
6. Из \`"delivered"\` событие \`"refund"\` переводит в \`"refunded"\`.
7. Для неподходящего события верни исходный \`status\`.

## Интерфейс

Экспортируй функцию \`getNextOrderStatus(status, event)\`.`,
    starter: `export function getNextOrderStatus(status, event) {
  // Верни следующее состояние заказа
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { getNextOrderStatus } from './index.js';

describe('getNextOrderStatus', () => {
  it('moves through the happy path', () => {
    expect(getNextOrderStatus('draft', 'pay')).toBe('paid');
    expect(getNextOrderStatus('paid', 'ship')).toBe('shipped');
    expect(getNextOrderStatus('shipped', 'deliver')).toBe('delivered');
  });

  it('keeps the current status for invalid events', () => {
    expect(getNextOrderStatus('paid', 'deliver')).toBe('paid');
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { getNextOrderStatus } from './index.js';

describe('getNextOrderStatus', () => {
  it('supports valid transitions', () => {
    expect(getNextOrderStatus('draft', 'pay')).toBe('paid');
    expect(getNextOrderStatus('paid', 'ship')).toBe('shipped');
    expect(getNextOrderStatus('paid', 'cancel')).toBe('cancelled');
    expect(getNextOrderStatus('shipped', 'deliver')).toBe('delivered');
    expect(getNextOrderStatus('delivered', 'refund')).toBe('refunded');
  });

  it('does not move on invalid events or unknown statuses', () => {
    expect(getNextOrderStatus('paid', 'deliver')).toBe('paid');
    expect(getNextOrderStatus('draft', 'ship')).toBe('draft');
    expect(getNextOrderStatus('cancelled', 'ship')).toBe('cancelled');
  });
});
`,
    solution: `export function getNextOrderStatus(status, event) {
  switch (status) {
    case 'draft':
      return event === 'pay' ? 'paid' : status;
    case 'paid':
      switch (event) {
        case 'ship':
          return 'shipped';
        case 'cancel':
          return 'cancelled';
        default:
          return status;
      }
    case 'shipped':
      return event === 'deliver' ? 'delivered' : status;
    case 'delivered':
      return event === 'refund' ? 'refunded' : status;
    default:
      return status;
  }
}
`,
    difficulty: "Mid",
    tags: ["state-machine", "nested-switch"],
    rank: 5,
  }),
  createSwitchChallenge({
    id: "switch-my-switch",
    title: "Свой switch",
    description: `Оператор \`switch\` выбирает первую ветку, значение которой строго совпало с входом. В реальном JavaScript внутри \`switch\` можно писать любой код, но для тренировки мы сделаем маленькую функцию, которая повторяет главную идею: пройти по списку вариантов, найти первое совпадение и вернуть результат выбранной ветки.

Напиши \`mySwitch(value, cases, defaultCase)\`. \`cases\` - это массив пар \`[caseValue, result]\`. Функция должна пройти по массиву сверху вниз и сравнить \`caseValue\` с \`value\` через строгое равенство \`===\`. Если совпадение найдено, нужно вернуть \`result\`. Если \`result\` является функцией, вызови ее с исходным \`value\` и верни результат вызова.

Если совпадений нет, используй \`defaultCase\`. Он работает так же: если это функция, вызови ее с \`value\`; иначе верни как есть. Внутри \`mySwitch\` не используй настоящий оператор \`switch\`: цель задачи - руками собрать похожий механизм выбора.

Примеры:

\`mySwitch("red", [["red", "stop"], ["green", "go"]], "unknown") // "stop"\`
\`mySwitch(2, [[1, "one"], [2, (value) => value * 10]], 0) // 20\`
\`mySwitch("2", [[2, "number"]], "default") // "default"\`

## Требования

1. Экспортируй функцию \`mySwitch(value, cases, defaultCase)\`.
2. Проходи по \`cases\` в исходном порядке.
3. Сравнивай \`caseValue\` и \`value\` через \`===\`.
4. Верни результат первого совпавшего case.
5. Если выбранный результат является функцией, вызови его с \`value\`.
6. Если совпадений нет, верни \`defaultCase\` или результат вызова \`defaultCase(value)\`, если это функция.
7. Не используй оператор \`switch\` внутри \`mySwitch\`.

## Интерфейс

Экспортируй функцию \`mySwitch(value, cases, defaultCase)\`.`,
    starter: `export function mySwitch(value, cases, defaultCase) {
  // Реализуй выбор ветки без оператора switch
}
`,
    tests: `import { describe, expect, it } from 'vitest';
import { mySwitch } from './index.js';

describe('mySwitch', () => {
  it('returns the result for the first matching case', () => {
    expect(mySwitch('red', [['red', 'stop'], ['green', 'go']], 'unknown')).toBe('stop');
  });

  it('uses the default case when nothing matches', () => {
    expect(mySwitch('blue', [['red', 'stop']], 'unknown')).toBe('unknown');
  });

  it('calls function results with the original value', () => {
    expect(mySwitch(2, [[2, (value) => value * 10]], 0)).toBe(20);
  });
});
`,
    fullTests: `import { describe, expect, it } from 'vitest';
import { mySwitch } from './index.js';

describe('mySwitch', () => {
  it('returns the result for the first matching case', () => {
    expect(mySwitch('red', [['red', 'stop'], ['green', 'go']], 'unknown')).toBe('stop');
    expect(mySwitch('red', [['red', 'first'], ['red', 'second']], 'unknown')).toBe('first');
  });

  it('compares values strictly', () => {
    expect(mySwitch('2', [[2, 'number']], 'default')).toBe('default');
    expect(mySwitch(0, [[false, 'false'], [0, 'zero']], 'default')).toBe('zero');
  });

  it('calls function results and function defaults', () => {
    expect(mySwitch(2, [[2, (value) => value * 10]], 0)).toBe(20);
    expect(mySwitch(5, [[1, 'one']], (value) => value + 1)).toBe(6);
  });

  it('does not require case results to be strings', () => {
    const objectResult = { matched: true };
    expect(mySwitch('ok', [['ok', objectResult]], null)).toBe(objectResult);
  });
});
`,
    solution: `export function mySwitch(value, cases, defaultCase) {
  for (const [caseValue, result] of cases) {
    if (caseValue === value) {
      return typeof result === 'function' ? result(value) : result;
    }
  }

  return typeof defaultCase === 'function' ? defaultCase(value) : defaultCase;
}
`,
    difficulty: "Mid",
    tags: ["polyfill", "strict-comparison", "functions"],
    rank: 5,
  }),
];
