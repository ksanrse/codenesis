import { expect, test } from "@playwright/test";

test("e2e db uses an isolated sqlite file", async ({ request }) => {
  const response = await request.get("http://127.0.0.1:41732/api/health");
  await expect(response).toBeOK();

  const health = (await response.json()) as { dbPath: string; ok: boolean };
  expect(health.ok).toBe(true);
  expect(health.dbPath.replaceAll("\\", "/")).toContain("data/e2e.sqlite");
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
            typeof (window as Window & { __foruntendoSetEditorValue?: unknown })
              .__foruntendoSetEditorValue,
        ),
      { timeout: 15_000 },
    )
    .toBe("function");

  await page.evaluate((source) => {
    (
      window as Window & { __foruntendoSetEditorValue?: (value: string) => void }
    ).__foruntendoSetEditorValue?.(source);
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
  await expect(nav.locator(".profile-dropdown-item")).toHaveCount(2);

  await page.setViewportSize({ width: 610, height: 989 });
  await expect(nav.locator(".nav-profile-button")).toBeVisible();
  await expect(nav.locator(".nav-menu-button")).toBeVisible();
});

test("editor tabs and menu are interactive", async ({ page }) => {
  await page.goto("/#/challenges/switch-http-status");

  const editorArea = page.locator(".challenge-editor-area");
  await expect(page.locator(".challenge-sidebar .panel-tab-icon")).toHaveCount(0);

  await editorArea.getByTestId("editor-tests-tab").click();
  await expect(editorArea.locator(".file-tab.active")).toContainText(".test.");
  await expect(editorArea.locator(".monaco-editor")).toContainText("describe");

  await editorArea.getByTestId("editor-menu-button").click();
  await expect(editorArea.locator(".editor-dropdown.is-open")).toBeVisible();
  await expect(editorArea.locator(".editor-theme-control")).toHaveCount(2);
  await expect(editorArea.locator(".editor-dropdown-item")).toHaveCount(4);

  await editorArea.getByTestId("editor-menu-shortcuts").click();
  await expect(editorArea.getByTestId("editor-shortcuts-tab")).toBeVisible();
  await expect(editorArea.locator(".editor-shortcut-row")).toHaveCount(23);

  await editorArea.getByTestId("editor-add-tab").click();
  await expect(editorArea.getByTestId("editor-new-tab")).toBeVisible();
  await expect(editorArea.locator(".editor-tab-picker button")).toHaveCount(6);

  await editorArea.locator(".editor-tab-picker").getByText("Код", { exact: true }).click();
  await expect(editorArea.locator(".file-tab.active")).toContainText("index.js");
});

test("solution tab reveals hint before full answer", async ({ page }) => {
  await page.goto("/#/challenges/function-expression-greeter");

  await page.locator(".challenge-sidebar").getByRole("button", { name: "Решение" }).click();
  await expect(page.locator(".challenge-helper-card")).toContainText(
    "Ты хочешь получить подсказку?",
  );

  await page.getByRole("button", { name: "Да, показать подсказку" }).click();
  await expect(page.locator(".challenge-helper-card")).toContainText("Подсказка");
  await expect(page.locator(".solution-code")).toHaveCount(0);

  await page.getByRole("button", { name: "Открыть полное решение" }).click();
  await expect(page.locator(".solution-code")).toContainText("makeGreeter");
  await expect(page.locator(".solution-code")).toContainText("Hello");
});

test("challenge collection drawer opens as a viewport overlay", async ({ page }) => {
  await page.goto("/#/challenges/types-typeof-label");

  await page.getByRole("button", { name: /JS \/ types/ }).click();
  const drawer = page.locator(".challenge-collection-drawer.is-open");
  await expect(drawer).toBeVisible();

  const box = await drawer.boundingBox();
  const viewport = page.viewportSize();
  expect(box).not.toBeNull();
  expect(viewport).not.toBeNull();
  expect(box!.y).toBeLessThanOrEqual(1);
  expect(box!.height).toBeGreaterThanOrEqual(viewport!.height - 1);

  const topElementClass = await page.evaluate(() => {
    const element = document.elementFromPoint(24, 24);
    return element?.closest(".challenge-collection-drawer")?.className ?? "";
  });
  expect(topElementClass).toContain("challenge-collection-drawer");
});

test("complete button runs full tests and then becomes next task", async ({ page }) => {
  await page.goto("/#/challenges/types-typeof-label");

  await expect
    .poll(() =>
      page.evaluate(
        () =>
          typeof (window as Window & { __foruntendoSetEditorValue?: unknown })
            .__foruntendoSetEditorValue,
      ),
    )
    .toBe("function");

  await page.evaluate(() => {
    (window as Window & { __foruntendoSetEditorValue?: (value: string) => void })
      .__foruntendoSetEditorValue?.(`export function getTypeLabel(value) {
  return typeof value;
}
`);
  });

  const completeButton = page.getByRole("button", { name: /Завершить/ });
  await expect(completeButton).toBeEnabled();

  await completeButton.click();
  await expect(page.getByTestId("editor-code-tab")).toHaveClass(/active/);
  await expect(page.getByTestId("editor-full-tests-tab")).toBeVisible();
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
          typeof (window as Window & { __foruntendoSetEditorValue?: unknown })
            .__foruntendoSetEditorValue,
      ),
    )
    .toBe("function");

  await page.evaluate(() => {
    (window as Window & { __foruntendoSetEditorValue?: (value: string) => void })
      .__foruntendoSetEditorValue?.(`const configs = {
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
  await expect(page.getByTestId("editor-code-tab")).toHaveClass(/active/);
  await expect(page.getByTestId("editor-full-tests-tab")).toBeVisible();
  await expect(page.locator(".file-tab.active")).toContainText("index.js");
  await expect(page.locator(".monaco-editor")).toContainText("getNotificationSettings");
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
  await expect(page.locator(".challenge-sidebar")).toBeVisible();
  await expect(page.locator(".challenge-editor-area")).toBeVisible();
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
          typeof (window as Window & { __foruntendoSetEditorValue?: unknown })
            .__foruntendoSetEditorValue,
      ),
    )
    .toBe("function");

  await page.evaluate(() => {
    (window as Window & { __foruntendoSetEditorValue?: (value: string) => void })
      .__foruntendoSetEditorValue?.(`export const makeGreeter = function (name) {
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
