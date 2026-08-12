import { expect, test } from "@playwright/test";

test("e2e db uses an isolated sqlite file", async ({ request }) => {
  const response = await request.get("http://127.0.0.1:41732/api/health");
  await expect(response).toBeOK();

  const health = (await response.json()) as { dbPath: string; ok: boolean };
  expect(health.ok).toBe(true);
  expect(health.dbPath.replaceAll("\\", "/")).toContain("data/e2e.sqlite");
});

test("legacy browser progress migrates to the server", async ({ page, request }) => {
  const attemptId = "legacy-migration-attempt";
  await page.addInitScript(
    ({ id }) => {
      localStorage.setItem(
        "foruntendo:db:v1",
        JSON.stringify({
          version: 1,
          attempts: [
            {
              id,
              challengeId: "types-typeof-label",
              challengeTitle: "Определитель типа",
              language: "javascript",
              status: "passed",
              passed: 2,
              failed: 0,
              total: 2,
              files: { "src/index.js": "export const getTypeLabel = value => typeof value;" },
              output: "legacy progress",
              createdAt: "2026-08-01T10:00:00.000Z",
            },
          ],
          drafts: {},
        }),
      );
    },
    { id: attemptId },
  );

  await page.goto("/#/");

  await expect
    .poll(async () => {
      const response = await request.get("http://127.0.0.1:41732/api/state");
      const state = (await response.json()) as { attempts: Array<{ id: string }> };
      return state.attempts.some((attempt) => attempt.id === attemptId);
    })
    .toBe(true);
});

test("passing the same code after a failed stored attempt marks challenge as solved", async ({
  page,
  request,
}) => {
  const solution = `export function getShippingPrice(method) {
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
`;

  await request.post("http://127.0.0.1:41732/api/attempts", {
    data: {
      challengeId: "switch-shipping-price",
      challengeTitle: "Стоимость доставки",
      language: "javascript",
      status: "failed",
      passed: 0,
      failed: 2,
      total: 2,
      files: { "src/index.js": solution },
      output: "seeded failed attempt with same source",
    },
  });

  await page.goto("/#/challenges/switch-shipping-price");
  await expect
    .poll(
      () =>
        page.evaluate(
          () =>
            typeof (window as Window & { __codenesisSetEditorValue?: unknown })
              .__codenesisSetEditorValue,
        ),
      { timeout: 15_000 },
    )
    .toBe("function");

  await page.evaluate((source) => {
    (
      window as Window & { __codenesisSetEditorValue?: (value: string) => void }
    ).__codenesisSetEditorValue?.(source);
  }, solution);

  await page.locator(".challenge-action-right .btn-primary").click();
  await expect(page.locator(".output-panel.has-results")).toBeVisible();

  const completeButton = page.locator(".challenge-action-right .btn").last();
  await expect(completeButton).toBeEnabled();
  await completeButton.click();

  await expect
    .poll(async () => {
      const response = await request.get("http://127.0.0.1:41732/api/state");
      const state = (await response.json()) as {
        attempts: Array<{ challengeId: string; status: string }>;
      };
      return state.attempts.filter(
        (attempt) => attempt.challengeId === "switch-shipping-price" && attempt.status === "passed",
      ).length;
    })
    .toBe(1);

  await page.getByRole("button", { name: "Попытки" }).click();
  await expect(page.locator(".challenge-attempt-row").first()).toContainText("пройдено");
});

test("top navigation keeps primary links separate from profile menu", async ({ page }) => {
  await page.goto("/#/challenges/switch-shipping-price");

  const nav = page.locator(".navbar");
  await expect(nav.locator(".nav-links .nav-link")).toHaveCount(3);
  await expect(nav.locator(".nav-links .nav-link.active")).toHaveText("Задачи");
  await expect(nav.locator(".nav-profile-button")).toBeVisible();
  await expect(nav.locator(".nav-menu-button")).toBeHidden();

  await nav.locator(".nav-profile-button").click();
  await expect(nav.locator(".profile-dropdown.is-open")).toBeVisible();
  await expect(nav.locator(".profile-dropdown-item")).toHaveCount(3);

  await page.setViewportSize({ width: 610, height: 989 });
  await expect(nav.locator(".nav-profile-button")).toBeVisible();
  await expect(nav.locator(".nav-menu-button")).toBeVisible();
});

test("challenge catalog keeps cards compact and virtualized", async ({ page }) => {
  await page.goto("/#/challenges");

  const cards = page.locator(".challenge-card");
  await expect(cards.first()).toBeVisible();
  await expect(cards.first().locator(".card-title")).toBeVisible();
  await expect(cards.first().locator(".badge-rank")).toBeVisible();
  await expect(cards.first().locator(".challenge-tag").first()).toBeVisible();
  await expect(page.locator(".card-desc")).toHaveCount(0);
  expect(await cards.count()).toBeLessThan(30);
});

test("challenge catalog filters are accessible custom menus without hover motion", async ({
  page,
}) => {
  await page.goto("/#/challenges");

  const firstCard = page.locator(".challenge-card").first();
  await firstCard.hover();
  await expect
    .poll(() =>
      firstCard.evaluate((element) => ({
        transform: getComputedStyle(element).transform,
        transition: getComputedStyle(element).transition,
      })),
    )
    .toEqual({ transform: "none", transition: "none" });

  await page.getByRole("button", { name: "Уровень" }).click();
  const levelMenu = page.getByRole("listbox", { name: "Уровень" });
  await expect(levelMenu).toBeVisible();
  await expect(levelMenu.getByRole("option", { name: "F8", exact: true })).toBeVisible();
  await levelMenu.getByRole("option", { name: "F2", exact: true }).click();
  await expect(page.getByRole("button", { name: "Уровень" })).toContainText("F2");
});

test("editor switches between source and public tests", async ({ page }) => {
  await page.goto("/#/challenges/switch-http-status");

  const editorArea = page.locator(".editor-code-block");
  await editorArea.getByRole("button", { name: "Тесткейсы" }).click();
  await expect(editorArea.locator(".file-tab.active")).toContainText(".test.");
  await expect(editorArea.locator(".monaco-editor")).toContainText("describe");

  await editorArea.getByRole("button", { name: "Код", exact: true }).click();
  await expect(editorArea.locator(".file-tab.active")).toContainText("index.js");
});

test("solution tab explains how solution access works", async ({ page }) => {
  await page.goto("/#/challenges/function-expression-greeter");

  await page.locator(".challenge-info").getByRole("button", { name: "Решение" }).click();
  await expect(page.locator(".challenge-helper-card")).toContainText(
    "Подсказка и готовое решение доступны после открытия соответствующей вкладки.",
  );
});

test("shared roadmap shows connected roles and skill progress", async ({ page }) => {
  await page.goto("/#/roadmaps?demo=1");

  await expect(page.getByRole("heading", { name: "Skill tree" })).toBeVisible();
  await expect(
    page.getByRole("group", { name: "Навык: HTML" }).locator(".skill-tree-node"),
  ).toHaveAttribute("aria-label", /0%/);
  await expect(
    page.getByRole("group", { name: "Навык: CSS" }).locator(".skill-tree-node"),
  ).toHaveAttribute("aria-label", /100%/);
  await expect(
    page.getByRole("group", { name: "Навык: JavaScript" }).locator(".skill-tree-node"),
  ).toHaveAttribute("aria-label", /50%/);
  await expect(page.getByRole("group", { name: "Направление: Full Stack" })).toBeVisible();

  const frontendTrack = page.getByRole("group", { name: "Направление: Frontend" });
  await frontendTrack.getByRole("button", { name: "Выбрать трек" }).click();
  await expect(frontendTrack.getByRole("button", { name: "Трек выбран" })).toBeVisible();
  await expect(
    page.getByRole("group", { name: "Направление: Backend" }).locator(".skill-tree-node"),
  ).toHaveClass(/dimmed/);
  await expect(
    page.locator('.svelte-flow__edge path[style*="stroke-dasharray"]').first(),
  ).toBeVisible();

  await page.getByRole("group", { name: "Навык: JavaScript" }).click();
  const skillDrawer = page.getByRole("complementary", { name: "Навык: JavaScript" });
  await expect(skillDrawer).toContainText("50%");
  await expect(skillDrawer.getByRole("link", { name: /Перейти к курсу JavaScript/ })).toBeVisible();
});

test("frontend roadmap opens a mini-roadmap in a floating details panel", async ({ page }) => {
  await page.goto("/#/roadmaps/frontend");

  await page.getByLabel("Мини-roadmap: JavaScript").click();
  const drawer = page.getByRole("complementary", { name: "Подробнее: JavaScript" });
  await expect(drawer).toBeVisible();
  await expect(drawer).toContainText("Коротко");
  await expect(drawer.getByRole("link", { name: /Открыть карту JavaScript/ })).toBeVisible();

  const box = await drawer.boundingBox();
  const viewport = page.viewportSize();
  expect(box).not.toBeNull();
  expect(viewport).not.toBeNull();
  expect(box!.x).toBeGreaterThan(viewport!.width / 2);
  expect(box!.y).toBeGreaterThanOrEqual(64);
  expect(box!.height).toBeGreaterThanOrEqual(viewport!.height - 100);

  await drawer.getByRole("button", { name: "Закрыть описание" }).click();
  await expect(drawer).toBeHidden();

  await page.getByLabel("Мини-roadmap: JavaScript").click();
  await drawer.getByRole("link", { name: /Открыть карту JavaScript/ }).click();
  await expect(page).toHaveURL(/\/roadmaps\/javascript/);
  await expect(page.getByRole("heading", { name: "JavaScript" })).toBeVisible();
  await expect(page.locator(".roadmap-node.tone-javascript")).toHaveCount(11);

  await page.locator(".roadmap-node").first().click();
  const courseDrawer = page.getByRole("complementary", { name: "Подробнее: Основы JavaScript" });
  await expect(courseDrawer).toBeVisible();
  await expect(courseDrawer).toContainText("Коротко");
  await expect(courseDrawer).not.toContainText("Этап");
  await expect(courseDrawer.locator(".exercise-status")).toHaveCount(3);
  await expect(courseDrawer.getByRole("link", { name: "Перейти к курсу →" })).toBeVisible();
});

test("complete button runs full tests and then becomes next task", async ({ page }) => {
  await page.goto("/#/challenges/types-typeof-label");

  await expect
    .poll(() =>
      page.evaluate(
        () =>
          typeof (window as Window & { __codenesisSetEditorValue?: unknown })
            .__codenesisSetEditorValue,
      ),
    )
    .toBe("function");

  await page.evaluate(() => {
    (window as Window & { __codenesisSetEditorValue?: (value: string) => void })
      .__codenesisSetEditorValue?.(`export function getTypeLabel(value) {
  return typeof value;
}
`);
  });

  const completeButton = page.getByRole("button", { name: /Завершить/ });
  await expect(completeButton).toBeEnabled();

  await completeButton.click();
  await expect(
    page.locator(".editor-panel-tabs").getByRole("button", { name: "Код", exact: true }),
  ).toHaveClass(/active/);
  await expect(
    page.locator(".editor-panel-tabs").getByRole("button", { name: "Все тесты" }),
  ).toBeVisible();
  await expect(page.locator(".file-tab.active")).toContainText("index.js");
  await expect(page.locator(".monaco-editor")).toContainText("getTypeLabel");
  await expect(page.locator(".output-panel")).toContainText(
    "detects all primitive typeof labels used in modern JavaScript",
  );
  const nextButton = page.getByRole("button", { name: /Следующее задание/ });
  await expect(nextButton).toBeEnabled();

  await nextButton.click();
  await expect(page).toHaveURL(/\/challenges\/types-nullish-check/);
  await expect(page.locator(".output-panel")).toContainText(
    "Запусти тесты, чтобы проверить решение.",
  );
  await expect(page.locator(".output-panel")).not.toContainText(
    "detects all primitive typeof labels used in modern JavaScript",
  );
});

test("submit attempts are scored by full tests, not public check tests", async ({
  page,
  request,
}) => {
  await page.goto("/#/challenges/switch-notification-channel");

  await expect
    .poll(() =>
      page.evaluate(
        () =>
          typeof (window as Window & { __codenesisSetEditorValue?: unknown })
            .__codenesisSetEditorValue,
      ),
    )
    .toBe("function");

  await page.evaluate(() => {
    (window as Window & { __codenesisSetEditorValue?: (value: string) => void })
      .__codenesisSetEditorValue?.(`const configs = {
  email: { async: true, retries: 3 },
  sms: { async: true, retries: 1 },
  push: { async: false, retries: 0 },
};

export function getNotificationSettings(channel) {
  switch (channel) {
    case 'email':
      return configs.email;
    case 'sms':
      return configs.sms;
    case 'push':
      return configs.push;
    default:
      return { async: false, retries: 0, disabled: true };
  }
}
`);
  });

  await page.getByRole("button", { name: /Проверить/ }).click();
  await expect(page.locator(".output-panel.has-results")).toBeVisible();
  await expect(page.locator(".output-panel")).toContainText("4 пройдено");

  await page.getByRole("button", { name: /Завершить/ }).click();
  await expect(
    page.locator(".editor-panel-tabs").getByRole("button", { name: "Код", exact: true }),
  ).toHaveClass(/active/);
  await expect(
    page.locator(".editor-panel-tabs").getByRole("button", { name: "Все тесты" }),
  ).toBeVisible();
  await expect(page.locator(".file-tab.active")).toContainText("index.js");
  await expect(page.locator(".output-panel")).toContainText("returns a fresh object on each call");
  await expect(page.locator(".output-panel")).toContainText("1 ошибок");

  await expect
    .poll(async () => {
      const response = await request.get("http://127.0.0.1:41732/api/state");
      const state = (await response.json()) as {
        attempts: Array<{
          challengeId: string;
          failed: number;
          passed: number;
          status: string;
          total: number;
        }>;
      };
      return state.attempts.find(
        (attempt) => attempt.challengeId === "switch-notification-channel",
      );
    })
    .toEqual(
      expect.objectContaining({
        failed: 1,
        passed: 5,
        status: "failed",
        total: 6,
      }),
    );
});

test("challenge editor runs tests and stores changed attempts only in e2e db", async ({
  page,
  request,
}) => {
  await page.goto("/#/challenges/function-expression-greeter");

  await expect(page.locator(".challenge-layout")).toBeVisible();
  await expect(page.locator(".challenge-info")).toBeVisible();
  await expect(page.locator(".editor-code-block")).toBeVisible();
  await expect(page.locator(".challenge-title")).toBeVisible();

  const checkButton = page.locator(".challenge-action-right .btn-primary");
  await expect(checkButton).toBeEnabled();
  await checkButton.click();

  await expect(page.locator(".output-panel.has-results")).toBeVisible();
  await expect(page.locator(".test-result")).toHaveCount(2);
  await expect(page.locator(".test-result.test-fail")).toHaveCount(2);
  await expect(page.locator(".output-panel")).toContainText("makeGreeter > returns a function");

  await expect
    .poll(async () => {
      const response = await request.get("http://127.0.0.1:41732/api/state");
      const state = (await response.json()) as {
        attempts: Array<{ challengeId: string }>;
      };
      return state.attempts.filter(
        (attempt) => attempt.challengeId === "function-expression-greeter",
      ).length;
    })
    .toBe(0);

  await expect
    .poll(() =>
      page.evaluate(
        () =>
          typeof (window as Window & { __codenesisSetEditorValue?: unknown })
            .__codenesisSetEditorValue,
      ),
    )
    .toBe("function");

  await page.evaluate(() => {
    (window as Window & { __codenesisSetEditorValue?: (value: string) => void })
      .__codenesisSetEditorValue?.(`export const makeGreeter = function (name) {
  return function () {
    return \`Hello, \${name}!\`;
  };
};
`);
  });

  await checkButton.click();

  await expect
    .poll(async () => {
      const response = await request.get("http://127.0.0.1:41732/api/state");
      const state = (await response.json()) as {
        attempts: Array<{ challengeId: string }>;
      };
      return state.attempts.filter(
        (attempt) => attempt.challengeId === "function-expression-greeter",
      ).length;
    })
    .toBe(0);

  const completeButton = page.getByRole("button", { name: /Завершить/ });
  await expect(completeButton).toBeEnabled();
  await completeButton.click();

  await expect
    .poll(
      async () => {
        const response = await request.get("http://127.0.0.1:41732/api/state");
        const state = (await response.json()) as {
          attempts: Array<{ challengeId: string; failed: number; status: string; total: number }>;
        };
        return state.attempts[0];
      },
      { timeout: 10_000 },
    )
    .toEqual(
      expect.objectContaining({
        challengeId: "function-expression-greeter",
        failed: 0,
        passed: 3,
        status: "passed",
        total: 3,
      }),
    );

  await page.getByRole("button", { name: "Попытки" }).click();
  await expect(page.locator(".challenge-attempt-row")).toHaveCount(1);
  await expect(page.locator(".challenge-attempt-row")).toContainText("пройдено");
});
