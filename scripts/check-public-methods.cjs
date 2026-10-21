// Browser acceptance check against the isolated local preview, never production data.
// PLAYWRIGHT_MODULE may point to an existing Playwright installation.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const { mkdirSync, writeFileSync } = require("node:fs");
const { resolve } = require("node:path");
const assert = require("node:assert/strict");
const base = process.env.PUBLIC_METHODS_PREVIEW || "http://127.0.0.1:5181";
if (!/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(base))
  throw new Error("Only local preview URLs are allowed");
const output = resolve(
  process.env.PUBLIC_METHODS_ARTIFACTS || ".work/public-methods",
);
mkdirSync(output, { recursive: true });
(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const results = [];
  const errors = [];
  try {
    for (const [name, width, height] of [
      ["desktop", 1440, 1000],
      ["mobile", 390, 844],
    ]) {
      const context = await browser.newContext({
        viewport: { width, height },
        acceptDownloads: true,
      });
      const page = await context.newPage();
      page.on("pageerror", (e) => errors.push(e.message));
      const capture = async (label) => {
        await page.screenshot({
          path: resolve(output, `${name}-${label}.png`),
          fullPage: true,
        });
        assert(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 1,
          ),
          `Horizontal overflow: ${name}-${label}`,
        );
      };
      await page.goto(base + "/methods");
      await page.getByRole("heading", { name: "Методики", exact: true }).waitFor();
      await page.locator(".ml-method").first().waitFor();
      assert.equal(await page.locator(".ml-method").count(), 3);
      await capture("catalog");
      await page.getByRole("textbox", { name: "Поиск методики" }).fill("zzzz");
      await page.getByRole("heading", { name: "Методики не найдены" }).waitFor();
      await page.getByRole("button", { name: "Сбросить поиск" }).click();
      await page
        .getByRole("link", { name: "Шкала самооценки Розенберга", exact: true })
        .click();
      await page
        .getByRole("heading", { name: "Источники и версия", exact: true })
        .waitFor();
      await capture("article");
      await page
        .getByRole("link", { name: "Пройти методику", exact: true })
        .click();
      await page.locator(".pm-consent input").check();
      await page.getByRole("button", { name: "Начать", exact: true }).click();
      await page.locator(".pm-option").first().waitFor();
      await capture("question");
      for (let i = 0; i < 10; i++) {
        if (i === 1)
          await page.route("**/api/public/assessments/*/save", (route) =>
            route.abort(),
          );
        await page.getByRole("radio").first().check();
        if (i === 1) {
          await page
            .getByRole("alert")
            .filter({ hasText: "Нет соединения с сервером" })
            .waitFor();
          await page.unroute("**/api/public/assessments/*/save");
        }
        await page
          .getByRole("button", {
            name: i === 9 ? "Посмотреть результат" : "Далее",
            exact: true,
          })
          .waitFor({ state: "visible" });
        await page.waitForFunction(
          () =>
            !document.querySelector(".pm-question-controls button:last-child")
              .disabled,
        );
        if (i === 0) {
          await page.reload();
          await page.locator(".pm-option").first().waitFor();
          assert(
            await page.getByRole("radio").first().isChecked(),
            "Answer survives reload",
          );
        }
        await page
          .getByRole("button", {
            name: i === 9 ? "Посмотреть результат" : "Далее",
            exact: true,
          })
          .click();
        if (i < 9)
          await page
            .getByText(`Вопрос ${i + 2} из 10`, { exact: true })
            .waitFor();
      }
      await page.locator(".pm-result-value").waitFor();
      assert.equal(
        await page.locator(".pm-result-value strong").textContent(),
        "15",
      );
      await capture("result");
      await page
        .getByRole("button", { name: "Карточка результата", exact: true })
        .click();
      const image = page.getByAltText(
        "Предпросмотр карточки вашего результата",
      );
      await image.waitFor();
      await image.evaluate((img) => img.decode());
      assert.equal(await image.evaluate((img) => img.naturalWidth), 1080);
      assert.equal(await image.evaluate((img) => img.naturalHeight), 1920);
      const [download] = await Promise.all([
        page.waitForEvent("download"),
        page.getByRole("link", { name: "Скачать PNG", exact: true }).click(),
      ]);
      await download.saveAs(resolve(output, `${name}-result-card.png`));
      await page.locator(".ant-modal-close").click();
      // The same URL gives another browser no access to the private result.
      const outsider = await browser.newContext();
      const forbidden = await outsider.request.get(
        base +
          "/api/public/assessments/" +
          new URL(page.url()).searchParams.get("id"),
      );
      assert.equal(forbidden.status(), 404);
      await outsider.close();
      // Multi-scale layout and its downloadable card, using real shared scoring on synthetic answers.
      const mspss = await page.evaluate(async () => {
        const a = await (
          await fetch(
            "/api/public/methods/perceived-social-support/assessments",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ adult: true }),
            },
          )
        ).json();
        const r = await fetch(`/api/public/assessments/${a.id}/complete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            answers: Object.fromEntries(
              a.definition.questions.map((q) => [q.code, 5]),
            ),
            position: 11,
            revision: 0,
          }),
        });
        if (!r.ok) throw new Error("MSPSS failed");
        return a.id;
      });
      await page.goto(base + "/assessment/result?id=" + mspss);
      await page.locator(".pm-result-value").waitFor();
      assert.equal(await page.locator(".pm-scale").count(), 4);
      await capture("mspss");
      await page
        .getByRole("button", { name: "Карточка результата", exact: true })
        .click();
      await page
        .getByAltText("Предпросмотр карточки вашего результата")
        .waitFor();
      const [multiDownload] = await Promise.all([
        page.waitForEvent("download"),
        page.getByRole("link", { name: "Скачать PNG", exact: true }).click(),
      ]);
      await multiDownload.saveAs(resolve(output, `${name}-mspss-card.png`));
      await page.locator(".ant-modal-close").click();
      await page
        .getByRole("button", { name: "Удалить моё прохождение", exact: true })
        .click();
      await page.getByRole("button", { name: "Удалить", exact: true }).click();
      await page
        .getByRole("heading", {
          name: "На чью поддержку вы опираетесь",
          exact: true,
        })
        .waitFor();
      results.push({
        viewport: name,
        publicMethods: 3,
        completed: true,
        resume: true,
        offlineRecovery: true,
        private: true,
        card: "1080x1920",
        multiScale: true,
        deleted: true,
      });
      await context.close();
    }
    const nojs = await browser.newContext({ javaScriptEnabled: false });
    const page = await nojs.newPage();
    await page.goto(base + "/methods/general-self-efficacy");
    assert(
      await page
        .getByRole("heading", {
          name: "Как рассчитывается результат",
          exact: true,
        })
        .isVisible(),
    );
    assert.equal(
      await page.locator("link[rel=canonical]").getAttribute("href"),
      "https://mindresearch.pro/methods/general-self-efficacy",
    );
    await nojs.close();
    assert.deepEqual(errors, []);
    writeFileSync(
      resolve(output, "checks.json"),
      JSON.stringify(
        { results, serverRendered: true, pageErrors: errors },
        null,
        2,
      ),
    );
    console.log(
      JSON.stringify(
        { results, serverRendered: true, pageErrors: errors, output },
        null,
        2,
      ),
    );
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
