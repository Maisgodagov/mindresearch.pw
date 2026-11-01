// Generate source-controlled Open Graph artwork; no personal assessment data.
// PLAYWRIGHT_MODULE may reference an existing local Playwright installation.
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const {readFileSync, mkdirSync, writeFileSync} = require("node:fs");
const {resolve} = require("node:path");
const root = resolve(__dirname, "..");
const methods = JSON.parse(readFileSync(resolve(root, "apps/api/src/public-methods/catalog.json"), "utf8"));
const output = resolve(root, "apps/web/public/images/tests");
const font = name => readFileSync(resolve(root, "node_modules/@fontsource-variable/manrope/files", name)).toString("base64");
(async () => {
  const browser = await chromium.launch({channel: process.env.PLAYWRIGHT_CHANNEL || "msedge"});
  try {
    const page = await browser.newPage();
    const fonts = [font("manrope-cyrillic-wght-normal.woff2"), font("manrope-latin-wght-normal.woff2")];
    mkdirSync(output, {recursive: true});
    for (const method of [{slug:"researchers",name:"Опросы и статистика для исследований",abbreviation:"",topic:"Методики · Сбор ответов · Анализ данных · Excel"}, {slug:"catalog",name:"Психологические тесты онлайн",abbreviation:"",topic:"Без регистрации · С пояснениями и источниками"}, ...methods]) {
      if (!/^[a-z0-9-]+$/.test(method.slug)) throw new Error("Unsafe image slug");
      const data = await page.evaluate(async ({method, fonts}) => {
        const faces = fonts.map((font, i) => new FontFace("Social", `url(data:font/woff2;base64,${font})`, {weight:"200 800",unicodeRange:i===0?"U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116":"U+0000-00FF,U+2000-206F"}));
        for (const face of faces) {await face.load();document.fonts.add(face);}
        const canvas = document.createElement("canvas");canvas.width=1200;canvas.height=630;
        const c=canvas.getContext("2d");
        c.fillStyle="#fff5da";c.fillRect(0,0,1200,630);
        c.strokeStyle="#d5e891";c.lineWidth=86;c.beginPath();c.arc(1140,300,250,0,Math.PI*2);c.stroke();
        c.strokeStyle="#304f3c";c.lineCap="round";c.beginPath();c.arc(1140,300,250,-Math.PI/2,Math.PI*.6);c.stroke();
        c.fillStyle="#ed855d";c.beginPath();c.arc(990,500,42,0,Math.PI*2);c.fill();
        c.fillStyle="#203e32";c.font='750 30px Social';c.fillText("mindresearch.pro",64,74);
        c.font='700 58px Social';let row="",y=225;
        for (const word of method.name.split(/\s+/)) {const candidate=(row+" "+word).trim();if(row&&c.measureText(candidate).width>830){c.fillText(row,64,y);y+=78;row=word;}else row=candidate;}
        if(row)c.fillText(row,64,y);
        c.font='600 25px Social';c.fillText(method.abbreviation ? `${method.abbreviation} · ${method.topic}` : method.topic,64,565);
        return canvas.toDataURL("image/png").split(",")[1];
      }, {method, fonts});
      writeFileSync(resolve(output, method.slug+".png"),Buffer.from(data,"base64"));
      console.log("Generated "+method.slug+".png");
    }
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exit(1)});
