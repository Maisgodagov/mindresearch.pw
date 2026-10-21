const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const assert = require("node:assert/strict");
const { mkdirSync } = require("node:fs");
(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    for (const [name, width, height] of [
      ["desktop", 1440, 1000],
      ["mobile", 390, 844],
    ]) {
      const page = await browser.newPage({
        acceptDownloads: true,
        viewport: { width, height },
      });
      page.setDefaultTimeout(8000);
      const errors = [],
        mutations = [];
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("request", (r) => {
        if (
          r.method() !== "GET" &&
          r.url().includes("/api/") &&
          !r.url().includes("/api/auth/refresh")
        )
          mutations.push(r.url());
      });
      await page.goto("http://127.0.0.1:5181/for-researchers");
      await page.locator(".media-builder textarea").first().waitFor();
      await page.screenshot({
        path: `.work/public-methods/${name}-landing-initial.png`,
        fullPage: true,
      });
      assert.equal(await page.locator(".landing img").count(), 0);
      assert.equal(await page.locator(".landing [role=tablist]").count(), 0);
      assert.equal(await page.locator(".landing-component").count(), 10);
      await page
        .locator(".media-builder textarea")
        .first()
        .fill("Добро пожаловать в пример");
      await page
        .getByRole("textbox", { name: "Текст своего вопроса", exact: true })
        .fill("Что помогает вам отдыхать?");
      await page
        .getByRole("button", { name: "Добавить вариант ответа", exact: true })
        .click();
      assert.equal(await page.locator(".media-custom .option").count(), 4);
      await page.locator(".media-catalog input").first().fill("MSPSS");
      await page
        .locator(".media-catalog")
        .getByRole("button", { name: "Добавить в опрос", exact: true })
        .click();
      await page.locator(".media-catalog").getByRole("status").waitFor();
      await page.locator(".media-catalog input").first().fill("");
      const taking = page.locator(".media-desktop");
      await taking
        .getByRole("button", { name: "Согласен", exact: true })
        .click();
      await taking.getByRole("button", { name: "Далее", exact: true }).click();
      await taking.getByText("Вопрос 2 из 12", { exact: true }).waitFor();
      await page
        .getByRole("checkbox", { name: "Выбрать Участник 01", exact: true })
        .check();
      await page
        .getByRole("checkbox", { name: "Выбрать Участник 02", exact: true })
        .check();
      await page
        .getByRole("button", { name: "Сохранить выборку · 2", exact: true })
        .click();
      const download = page.waitForEvent("download");
      await page.getByRole("button", { name: /Экспортировать/ }).click();
      const file = await download;
      assert.match(file.suggestedFilename(), /xlsx$/);
      mkdirSync(".work/public-methods", { recursive: true });
      await file.saveAs(`.work/public-methods/${name}-demo-results.xlsx`);
      const analysis = page.locator(".media-analysis");
      await analysis
        .getByRole("combobox", { name: "Выборка", exact: true })
        .click();
      await page
        .getByRole("option", { name: "Моя выборка · 2", exact: true })
        .click();
      await analysis
        .getByRole("button", { name: "Проверить данные", exact: true })
        .click();
      await analysis
        .getByRole("button", { name: "Рассчитать", exact: true })
        .click();
      assert.match(
        await analysis.locator(".demo-calculated").innerText(),
        /29,5/,
      );
      await page.screenshot({
        path: `.work/public-methods/${name}-landing-inline.png`,
        fullPage: true,
      });
      assert(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        `${name}: horizontal overflow`,
      );
      assert.deepEqual(errors, []);
      assert.deepEqual(mutations, []);
      console.log(
        `${name}: 10 inline components, editing, catalogue, taking, Excel, shared sample, calculation; no API mutations.`,
      );
      await page.close();
    }
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
