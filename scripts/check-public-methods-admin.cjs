const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const { readFileSync, mkdirSync } = require("node:fs");
const { resolve } = require("node:path");
const assert = require("node:assert/strict");
const base = process.env.PUBLIC_METHODS_PREVIEW || "http://127.0.0.1:5181";
if (!/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(base))
  throw new Error("Only local previews allowed");
(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    for (const width of [1440, 390]) {
      const items = JSON.parse(
        readFileSync("apps/api/src/public-methods/catalog.json", "utf8"),
      ).map((m) => ({
        slug: m.slug,
        draft: structuredClone(m),
        published: structuredClone(m),
        revision: 1,
      }));
      const context = await browser.newContext({
        viewport: { width, height: 1000 },
      });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.route("**/api/**", async (route) => {
        const req = route.request(),
          path = new URL(req.url()).pathname;
        if (path === "/api/auth/refresh")
          return route.fulfill({ json: { token: "synthetic-preview-admin" } });
        if (path === "/api/account/me")
          return route.fulfill({
            json: {
              id: "synthetic-admin",
              email: "preview@example.test",
              name: "Проверка",
              role: "owner",
              bio: null,
              avatarSeed: "test",
              publicSlug: null,
              isProfilePublic: false,
              createdAt: "2026-10-21T00:00:00Z",
            },
          });
        if (path === "/api/admin/public-methods")
          return route.fulfill({ json: items });
        if (path.startsWith("/api/admin/public-methods/")) {
          const input = req.postDataJSON(),
            item = items.find((i) => i.slug === path.split("/").at(-1));
          assert.equal(item.revision, input.revision);
          item.draft = input.content;
          if (input.action === "publish")
            item.published = structuredClone(input.content);
          if (input.action === "unpublish") item.published = null;
          item.revision++;
          return route.fulfill({ json: { revision: item.revision } });
        }
        return route.fulfill({ json: { ok: true } });
      });
      await page.goto(base + "/app/admin/public-methods");
      await page.locator(".pma-tabs button").first().waitFor();
      await page.locator(".pma-tabs button").first().click();
      await page.locator(".pma-fields").waitFor();
      const original = items[0].published.intro;
      await page
        .getByLabel("Короткое описание")
        .fill("Тестовый текст для проверки черновика.");
      await page
        .getByRole("button", { name: "Сохранить черновик", exact: true })
        .click();
      await page
        .getByText("Черновик сохранён. Публичная страница не изменилась.", {
          exact: true,
        })
        .waitFor();
      assert.equal(items[0].published.intro, original);
      await page
        .getByRole("button", { name: "Опубликовать", exact: true })
        .click();
      await page
        .getByText(
          "Страница опубликована. Новый текст уже доступен посетителям.",
          { exact: true },
        )
        .waitFor();
      assert.equal(
        items[0].published.intro,
        "Тестовый текст для проверки черновика.",
      );
      await page
        .getByRole("button", { name: "Предпросмотр текста", exact: true })
        .click();
      await page.getByRole("dialog").waitFor();
      assert(
        await page
          .getByRole("dialog")
          .getByText("Тестовый текст для проверки черновика.", { exact: true })
          .isVisible(),
      );
      await page.locator(".ant-modal-close").click();
      await page.getByRole("dialog").waitFor({ state: "hidden" });
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      );
      mkdirSync(".work/public-methods", { recursive: true });
      await page.screenshot({
        path: resolve(".work/public-methods", `admin-${width}.png`),
        fullPage: true,
      });
      await page
        .getByRole("button", { name: "Снять с публикации", exact: true })
        .click();
      await page
        .getByText(
          "Страница снята с публикации. Старые результаты сохраняются.",
          { exact: true },
        )
        .waitFor();
      assert.equal(items[0].published, null);
      assert.deepEqual(errors, []);
      await context.close();
      console.log(
        JSON.stringify({
          adminViewport: width,
          draft: true,
          publish: true,
          preview: true,
          unpublish: true,
        }),
      );
    }
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
