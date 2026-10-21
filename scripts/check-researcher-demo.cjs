const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const assert = require("node:assert/strict");
(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage({ acceptDownloads: true });
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
  await page.getByRole("tab", { name: /Собрать опрос/ }).waitFor();
  assert.equal(await page.locator(".research-landing img").count(), 0);
  await page.locator("#survey-title").fill("Мой пример");
  await page.getByRole("button", { name: "Создать тест", exact: true }).click();
  await page.locator(".demo-own textarea").fill("Мой вопрос");
  await page.getByRole("button", { name: "Предпросмотр", exact: true }).click();
  await page.getByRole("button", { name: "Вернуться к примеру" }).click();
  await page.getByRole("tab", { name: /Результаты/ }).click();
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
  await file.saveAs(".work/public-methods/demo-results.xlsx");
  await page.getByRole("tab", { name: /Статистика/ }).click();
  await page.getByRole("combobox").nth(1).click();
  await page
    .getByRole("option", { name: "Моя выборка · 2", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Проверить данные", exact: true })
    .click();
  await page.getByRole("button", { name: "Рассчитать", exact: true }).click();
  await page.getByText("Включено: 2.", { exact: false }).waitFor();
  assert.match(await page.locator(".demo-calculated").innerText(), /29,5/);
  assert.deepEqual(errors, []);
  assert.deepEqual(mutations, []);
  console.log(
    "Landing: editing, preview, selection, local sample, Excel and calculations passed; no API mutations.",
  );
  await browser.close();
})();
