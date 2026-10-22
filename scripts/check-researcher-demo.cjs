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
      await page.locator(".hero-demo-block").first().waitFor();
      await page.screenshot({
        path: `.work/public-methods/${name}-landing-initial.png`,
        fullPage: true,
      });
      assert.equal(await page.locator(".research-intro button").count(), 0);
      assert.match(
        await page.locator(".research-intro").innerText(),
        /психологических исследований/,
      );
      assert.equal(await page.locator(".landing img").count(), 0);
      assert.equal(await page.locator(".landing [role=tablist]").count(), 0);
      assert.equal(await page.locator(".landing-component").count(), 10);
      const composer = page.locator(".hero-composer");
      const ids = () =>
        composer
          .locator(".hero-demo-block")
          .evaluateAll((nodes) => nodes.map((n) => n.dataset.blockId));
      await composer
        .locator('[data-block-id="success"]')
        .getByRole("radio", { name: "Мужской", exact: true })
        .check();
      assert(
        await composer
          .locator('[data-block-id="success"]')
          .getByRole("radio", { name: "Мужской", exact: true })
          .isChecked(),
      );
      const handle = composer
        .getByRole("button", { name: "Перетащить тест" })
        .first();
      await handle.focus();
      await page.keyboard.press("Space");
      await page.waitForTimeout(150);
      await page.keyboard.press("ArrowDown");
      await page.waitForTimeout(150);
      await page.keyboard.press("Space");
      await page.waitForFunction(
        () =>
          document
            .querySelector(".hero-demo-block")
            ?.getAttribute("data-block-id") === "ambiguity",
      );
      assert.deepEqual(await ids(), [
        "ambiguity",
        "success",
        "stress",
        "custom",
      ]);
      await composer
        .getByRole("button", {
          name: "Выше: Жизненная успешность",
          exact: true,
        })
        .click();
      assert.equal((await ids())[0], "success");
      const originalHeight = (
        await page.locator(".landing-hero-image").boundingBox()
      ).height;
      for (let i = 0; i < 4; i++)
        await composer
          .getByRole("button", { name: /^Удалить:/ })
          .first()
          .click();
      assert.equal(await composer.locator(".hero-demo-block").count(), 0);
      assert(
        Math.abs(
          (await page.locator(".landing-hero-image").boundingBox()).height -
            originalHeight,
        ) <= 1,
        "Hero height changed after deletion",
      );
      await page.waitForTimeout(350);
      assert.equal(await composer.locator(".hero-demo-block").count(), 0);
      await composer.locator(".hero-demo-block").first().waitFor();
      assert.equal(await composer.locator(".hero-demo-block").count(), 4);
      assert(
        await composer
          .locator(".hero-composer-list")
          .evaluate((n) => n.classList.contains("is-restored")),
      );
      await page.screenshot({
        path: `.work/public-methods/${name}-hero-composer.png`,
      });
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
