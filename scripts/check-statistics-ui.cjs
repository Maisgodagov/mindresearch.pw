const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const { spawnSync } = require("child_process"),
  assert = require("assert/strict"),
  crypto = require("crypto"),
  fs = require("fs");
// Run from repo root after npm run build; point STATISTICS_PYTHON at the pinned Python environment.
const root = process.cwd();
const id = (n) => "00000000-0000-4000-8000-" + String(n).padStart(12, "0");
(async () => {
  const { methods, prepareInput } = await import(
    "file:///" +
      root.replaceAll("\\", "/") +
      "/apps/api/dist/statistics/domain.js"
  );
  const variables = [
    { id: "age", label: "Возраст", source: "Анкета", version: null },
    {
      id: "score:one:score:v1",
      label: "Авторская методика · Общий балл",
      source: "Авторская методика",
      version: "v1",
    },
  ];
  const people = Array.from({ length: 8 }, (_, i) => ({
    id: id(i + 20),
    alias: "Участник " + (i + 1),
    age: 21 + i,
    gender: "Женский",
    status: "completed",
    groups: [],
    values: { age: 21 + i, "score:one:score:v1": i * 2 + 3 },
  }));
  const rows = Object.fromEntries(people.map((p) => [p.id, p.values]));
  let samples = [
    {
      id: id(2),
      name: "Младшая группа",
      revision: 1,
      members: people.slice(0, 3).map((p) => p.id),
      candidates: [people[3].id],
      unavailable: [],
      definition: {
        completedOnly: true,
        conditions: [{ title: "Возраст", min: 20, max: 24 }],
      },
    },
    {
      id: id(3),
      name: "Старшая группа",
      revision: 1,
      members: people.slice(4).map((p) => p.id),
      candidates: [],
      unavailable: [],
      definition: {
        completedOnly: true,
        conditions: [{ title: "Возраст", min: 25 }],
      },
    },
  ];
  const analyses = [];
  let polls = 0;
  let researcher = false;
  const errors = [];
  let downloads = 0;
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
      acceptDownloads: true,
    });
    page.on("pageerror", (e) => errors.push(e.message));
    await page.route("**/api/**", async (route) => {
      const path = new URL(route.request().url()).pathname,
        body = route.request().postDataJSON(),
        verb = route.request().method();
      let data = {};
      if (path === "/api/auth/refresh") data = { token: "fixture" };
      else if (path === "/api/account/me")
        data = {
          id: "u",
          role: researcher ? "researcher" : "owner",
          name: "Исследователь",
        };
      else if (path === "/api/admin/surveys")
        data = [
          {
            id: id(1),
            slug: "fixture",
            title: "Проверка статистического анализа",
            responses: 8,
            completed: 8,
          },
        ];
      else if (path.endsWith("/statistics"))
        data = {
          canWrite: true,
          methods,
          variables,
          participants: people,
          samples,
          analyses: analyses.map(({ input, result, ...a }) => a),
        };
      else if (path.endsWith("/statistics/samples") && verb === "POST") {
        samples.push({
          id: id(4),
          name: body.name || "Выборка",
          revision: 1,
          members: people.map((p) => p.id),
          candidates: [],
          unavailable: [],
          definition: { completedOnly: body.completedOnly, conditions: [] },
        });
        data = { id: id(4) };
      } else if (path.includes("/statistics/samples/") && verb === "PUT") {
        const s = samples.find((s) => path.endsWith(s.id));
        s.name = body.name;
        s.members = body.memberIds;
        s.revision++;
        s.candidates = [];
        data = { ok: true };
      } else if (path.endsWith("/statistics/preview")) {
        const groups = body.groups.map((g) => ({
          sample: samples.find((s) => s.id === g.sampleId),
          variable: variables.find((v) => v.id === g.variableId),
        }));
        data = {
          hash: "fixture-hash",
          input: {
            config: { method: body.method, alpha: body.alpha, mu: body.mu },
            groups: prepareInput(
              body.method,
              groups,
              people,
              rows,
              body.manual,
            ),
            snapshotAt: new Date().toISOString(),
            manualReason: body.manualReason,
            policy: "complete cases",
          },
        };
      } else if (path.endsWith("/statistics/analyses") && verb === "POST") {
        const groups = body.groups.map((g) => ({
          sample: samples.find((s) => s.id === g.sampleId),
          variable: variables.find((v) => v.id === g.variableId),
        }));
        const source = prepareInput(
          body.method,
          groups,
          people,
          rows,
          body.manual,
        );
        const calc = spawnSync(
          process.env.STATISTICS_PYTHON || "python",
          [root + "/apps/api/statistics/engine.py"],
          {
            env: { ...process.env, PYTHONIOENCODING: "utf-8" },
            input: JSON.stringify({
              method: body.method,
              alpha: body.alpha,
              mu: body.mu,
              groups: source.map((g) => ({
                label: g.label,
                values: g.included.map((r) => r.value),
              })),
            }),
            encoding: "utf8",
          },
        );
        if (calc.status !== 0) throw Error(calc.stderr);
        const result = JSON.parse(calc.stdout);
        assert(!result.error, result.error);
        analyses.unshift({
          id: body.requestId,
          name: body.name || methods.find((m) => m.id === body.method).label,
          status: "queued",
          createdAt: new Date().toISOString(),
          input: {
            config: { method: body.method, alpha: body.alpha, mu: body.mu },
            groups: source,
            snapshotAt: new Date().toISOString(),
            manualReason: "",
            policy: "complete cases",
          },
          result: result.result,
        });
        data = { id: body.requestId };
      } else if (path.endsWith("/statistics/analyses") && verb === "GET") {
        polls++;
        analyses.forEach((a) => (a.status = "completed"));
        data = analyses.map(({ input, result, ...a }) => a);
      } else if (path.includes("/statistics/analyses/"))
        data = analyses.find((a) => path.endsWith(a.id));
      else if (path.endsWith("/results"))
        data = {
          sections: [],
          respondents: people.map((p) => ({
            ...p,
            startedAt: "2026-10-18T12:00:00Z",
            completedAt: "2026-10-18T12:10:00Z",
            answered: 3,
            detailsLoaded: true,
          })),
          deletedRespondents: [],
          distribution: [],
          questions: [],
          hasAge: true,
          hasGender: true,
        };
      else if (path.endsWith("/quality-v2"))
        data = { jobs: [], versions: [], baseline: null };
      else if (path.endsWith("/access")) data = { permission: "owner" };
      else if (
        path === "/api/sharing/shared" ||
        path === "/api/account/surveys/trash"
      )
        data = [];
      await route.fulfill({ json: data });
    });
    await page.goto("http://127.0.0.1:5199/app/surveys/" + id(1) + "/results");
    await page.waitForTimeout(1500);
    await page
      .getByRole("button", { name: "Сохранить выборку · 8", exact: true })
      .click();
    const app = page.getByRole("region", { name: "Статистический анализ" });
    await app
      .getByLabel("Название · необязательно", { exact: true })
      .fill("Весь опрос");
    await app
      .getByRole("button", { name: "Сохранить выборку", exact: true })
      .click();
    await app.getByRole("heading", { name: /Весь опрос/ }).waitFor();
    assert.equal(samples[2].members.length, 8);
    await app
      .getByRole("button", { name: "Состав и название" })
      .first()
      .click();
    const sampleDialog = page.getByRole("dialog");
    await sampleDialog.getByLabel(/Только подходящие вне группы/).check();
    await sampleDialog.getByLabel(/Участник 4/).check();
    await sampleDialog
      .getByRole("button", { name: "Сохранить новую версию" })
      .click();
    await app.getByRole("heading", { name: /Младшая группа · v2/ }).waitFor();
    assert.equal(samples[0].members.length, 4);
    await page.screenshot({
      path: process.env.TEMP + "/statistics-samples-desktop.png",
      fullPage: true,
    });
    await app
      .getByRole("button", { name: "Рассчитать", exact: true })
      .first()
      .click();
    await app
      .getByRole("button", { name: "Проверить данные", exact: true })
      .click();
    await app
      .getByRole("heading", { name: "Проверка перед запуском" })
      .waitFor();
    await page.screenshot({
      path: process.env.TEMP + "/statistics-preview-desktop.png",
      fullPage: true,
    });
    await app
      .locator(".input-tables > details")
      .first()
      .locator("summary")
      .click();
    assert(
      !/[0-9a-f]{8}-[0-9a-f]{4}-/.test(
        await app.locator(".input-tables").innerText(),
      ),
    );
    const confirmation = app.locator(".calculation-confirmation");
    assert(
      (await confirmation.evaluate((el) =>
        parseFloat(getComputedStyle(el).marginBottom),
      )) >= 16,
    );
    await app.getByRole("button", { name: "Рассчитать и сохранить" }).click();
    await app
      .getByText("Шаг 3 из 3 · Готово", { exact: true })
      .waitFor({ timeout: 15000 });
    await app.getByRole("button", { name: "Excel-отчёт" }).waitFor();
    assert(polls > 0);
    await app
      .getByRole("button", { name: "Как рассчитано", exact: true })
      .click();
    await app.getByText("M = Σx / n;").first().waitFor();
    await page.screenshot({
      path: process.env.TEMP + "/statistics-report-desktop.png",
      fullPage: true,
    });
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      app.getByRole("button", { name: "Excel-отчёт" }).click(),
    ]);
    await download.saveAs(process.env.TEMP + "/statistics-pilot-report.xlsx");
    downloads++;
    const ExcelJS = require(root + "/node_modules/exceljs");
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(
      process.env.TEMP + "/statistics-pilot-report.xlsx",
    );
    assert.deepEqual(
      workbook.worksheets.map((s) => s.name),
      ["Результат", "Данные", "Расчёт", "Настройки"],
    );
    assert.equal(workbook.getWorksheet("Данные").getCell("E2").value, 21);

    await app.getByRole("tab", { name: "Новый расчёт", exact: true }).click();
    await app.getByLabel("Метод расчёта").click();
    await page
      .getByRole("option", {
        name: methods.find((m) => m.id === "pearson").label,
        exact: true,
      })
      .click();
    await app.getByLabel("Числовой показатель").nth(1).click();
    await page.getByRole("textbox").last().fill(variables[1].label);
    await page
      .getByRole("option", {
        name: variables[1].label + " \u00b7 v1",
        exact: true,
      })
      .click();
    await app
      .getByRole("button", { name: "Проверить данные", exact: true })
      .click();
    await app.getByRole("button", { name: "Рассчитать и сохранить" }).click();
    await app
      .getByText("Шаг 3 из 3 · Готово", { exact: true })
      .waitFor({ timeout: 15000 });
    await app
      .getByRole("checkbox", {
        name: "Сопоставить: Описательная статистика",
        exact: true,
      })
      .check();
    await app
      .getByRole("checkbox", {
        name: "Сопоставить: Корреляция Пирсона",
        exact: true,
      })
      .check();
    await app
      .getByRole("button", { name: "Сопоставить (2)", exact: true })
      .click();
    await app
      .getByRole("heading", { name: "Сопоставление отчётов", exact: true })
      .waitFor();
    assert.equal(
      await app.locator("table").first().locator("thead th").count(),
      3,
    );
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({
      path: process.env.TEMP + "/statistics-report-mobile.png",
      fullPage: true,
    });
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
    await app.getByRole("tab", { name: "Выборки · 3", exact: true }).click();
    await page.screenshot({
      path: process.env.TEMP + "/statistics-samples-mobile.png",
      fullPage: true,
    });
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
    researcher = true;
    await page.reload();
    await page
      .getByRole("heading", {
        name: "Проверка статистического анализа",
        exact: true,
      })
      .waitFor();
    await page.waitForTimeout(350);
    assert.equal(
      await page
        .getByRole("button", { name: "Статистический анализ", exact: true })
        .count(),
      0,
    );
    assert.deepEqual(errors, []);
    console.log(
      "PASS: save 8 members, candidate selection, version 2, preview, 2 Python calculations, polling, formulas, XLSX, comparison, mobile, researcher hidden. Downloads:",
      downloads,
    );
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
