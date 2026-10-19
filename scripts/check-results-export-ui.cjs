const fs = require("node:fs");
const Module = require("node:module");
// Reuse the synthetic survey/auth routes; no production respondent data is requested.
const filename = process.cwd() + "/scripts/check-statistics-ui.cjs";
let source = fs.readFileSync(filename, "utf8").replace(/\r\n/g, "\n");
source = source.replace('sections: [],\n          respondents: people.map', `sections: [
  { id: "verified", code: "test_fixture", title: "Проверенная методика", sectionKind: "verified" },
  { id: "custom", code: "custom-fixture", title: "Мои вопросы", sectionKind: "custom" }
], exportSections: [
  { id: "respondent", code: "respondent", title: "О респонденте", sectionKind: "custom" },
  { id: "verified", code: "test_fixture", title: "Проверенная методика", sectionKind: "verified" },
  { id: "custom", code: "custom-fixture", title: "Мои вопросы", sectionKind: "custom" }
], respondents: people.map`);
source = source.replace('detailsLoaded: true,', `detailsLoaded: true,
 groups: [
  { id: "respondent", code: "respondent", title: "О респонденте", result: null, answers: [
   { code: "alias", question: "Имя", displayValue: p.alias, value: p.alias },
   { questionId: "education", code: "education", question: "Образование", displayValue: "Высшее", value: "Высшее" }
  ]},
  { id: "verified", code: "test_fixture", title: "Проверенная методика", result: { values: { score: 7 } }, answers: [] },
  { id: "custom", code: "custom-fixture", title: "Мои вопросы", result: null, answers: [
   { questionId: "custom-number", code: "q1", question: "Количество занятий", type: "number", value: 3, displayValue: "3" }
  ]}
 ],`);
source = source.replace('questions: [],\n          hasAge:', `questions: [
 { sectionId: "respondent", sectionCode: "respondent", questionId: "alias", code: "alias", text: "Имя", type: "text" },
 { sectionId: "respondent", sectionCode: "respondent", questionId: "education", code: "education", text: "Образование", type: "text" },
 { sectionId: "custom", sectionCode: "custom-fixture", questionId: "custom-number", code: "q1", text: "Количество занятий", type: "number" }
], hasAge:`);
source = source.replace('await page.waitForTimeout(1500);', `
await page.waitForTimeout(1500);
{
await page.getByRole("button", { name: /^Экспортировать/ }).click();
const dialog=page.getByRole("dialog");
await dialog.getByRole("heading", { name: "Методики и свои блоки вопросов", exact: true }).waitFor();
await dialog.getByRole("checkbox", { name: /О респонденте/ }).waitFor();
await dialog.getByRole("checkbox", { name: /Мои вопросы/ }).waitFor();
await dialog.getByRole("button", { name: "Снять выбор", exact: true }).click();
await dialog.getByRole("checkbox", { name: /О респонденте/ }).check();
await dialog.getByRole("checkbox", { name: /Мои вопросы/ }).check();
const [file]=await Promise.all([page.waitForEvent("download"), dialog.getByRole("button", { name: "Скачать Excel · 8", exact: true }).click()]);
const target=process.env.TEMP+"/results-custom-blocks.xlsx";await file.saveAs(target);
const ExcelJS=require(process.cwd()+"/node_modules/exceljs");const book=new ExcelJS.Workbook();await book.xlsx.readFile(target);
const sheet=book.worksheets[0];
assert.equal(sheet.columnCount,6);assert.equal(sheet.getCell("E1").value,"О респонденте");
assert.equal(sheet.getCell("F1").value,"Мои вопросы");assert.equal(sheet.getCell("E2").value,"Образование");
assert.equal(sheet.getCell("E3").value,"Высшее");assert.equal(sheet.getCell("F3").value,3);
assert(!JSON.stringify(sheet.model).includes("Проверенная методика"));
assert.deepEqual(errors,[]);console.log("PASS: custom and respondent blocks selectable, independent Excel headers, numeric answers, unchecked methodology excluded");
return;
}
`);
const script = new Module(filename, module);
script.filename = filename;
script.paths = Module._nodeModulePaths(process.cwd() + "/scripts");
script._compile(source, filename);
