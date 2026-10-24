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
      assert.equal(await page.locator(".landing h1").count(), 1);
      assert.equal(await page.locator('meta[name="description"]').count(), 1);
      assert.match(await page.title(), /статистический анализ/);
      assert.match(
        await page.locator(".research-intro").innerText(),
        /психологических исследований/,
      );
      assert.equal(await page.locator(".landing img").count(), 0);
      assert.equal(await page.locator(".landing [role=tablist]").count(), 0);
      assert.equal(await page.locator(".landing-component").count(), 6);
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
      assert.equal(await page.locator("#builder figure").count(), 0);
      assert.equal(
        await page.locator(".builder-feature-list article").count(),
        6,
      );
      await page.locator(".media-catalog input").first().fill("MSPSS");
      await page
        .locator(".media-catalog")
        .getByRole("button", { name: "Добавить в опрос", exact: true })
        .click();
      await page.locator(".media-catalog").getByRole("status").waitFor();
      await page.locator(".media-catalog input").first().fill("");
      const taking = page.locator(".media-desktop");
      assert.equal(await taking.locator(".demo-answer").count(), 4);
      assert.equal(
        await taking
          .getByRole("button", { name: "Далее", exact: true })
          .count(),
        0,
      );
      await taking
        .getByRole("button", { name: "Совершенно верно", exact: true })
        .click();
      await taking.getByText("Вопрос 2 из 10", { exact: true }).waitFor();
      const results = page.locator("#results");
      assert.equal(await results.locator(".respondent-row").count(), 6);
      assert.equal(await results.locator(".method-details-row").count(), 1);
      assert.equal(
        await results
          .getByRole("button", {
            name: /Экспортировать|Сохранить выборку|Показать показатели качества/,
          })
          .count(),
        0,
      );
      assert.match(await results.innerText(), /Гарри Поттер/);
      const analysis = page.locator(".media-analysis");
      assert.equal(await analysis.getByRole("combobox").count(),0);
      assert.match(await analysis.locator(".metrics").innerText(),/0,82358/);
      assert.match(await analysis.locator(".metrics").innerText(),/0,00099/);
      await analysis.getByText("Формула и исходные данные примера",{exact:true}).click();
      assert.equal(await analysis.locator(".landing-report-audit tbody tr").count(),12);
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
        `${name}: 6 inline components, catalogue, taking, full respondent results, Pearson report; no API mutations.`,
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
