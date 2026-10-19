const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const assert = require("assert/strict");
// Run against the local production preview; requests use synthetic data only.
(async () => {
  const browser = await chromium.launch({channel:"msedge",headless:true});
  try {
    const page=await browser.newPage();
    let posts=0, reject=false, payload;
    await page.route("**/api/**",async route=>{
      const path=new URL(route.request().url()).pathname;
      if(path==="/api/auth/refresh") return route.fulfill({json:{token:"fixture"}});
      if(path==="/api/account/me") return route.fulfill({json:{id:"test",role:"researcher",name:"Test"}});
      if(path==="/api/account/instrument-submissions" && route.request().method()==="POST") {
        posts++;payload=route.request().postDataJSON();
        await new Promise(resolve=>setTimeout(resolve,500));
        return route.fulfill(reject ? {status:500,json:{message:"Тестовая ошибка отправки"}} : {status:201,json:{id:"synthetic-request"}});
      }
      return route.fulfill({json:[]});
    });
    const open=async()=>{
      await page.goto("http://127.0.0.1:5199/app/methodologies/suggest");
      await page.getByRole("button",{name:"Отправить запрос"}).waitFor();
    };
    const fill=async()=>{
      await page.locator('input').nth(0).fill("Тестовая методика");
      await page.locator('input').nth(1).fill("Тестовый автор");
      await page.locator('input').nth(2).fill("2000");
    };
    await open();
    await page.getByRole("button",{name:"Отправить запрос"}).click();
    assert.equal(posts,0,"empty required fields must prevent a request");
    await fill();
    await page.getByRole("button",{name:"Отправить запрос"}).click();
    await page.getByText("Запрос отправлен администраторам.",{exact:true}).waitFor();
    assert.equal(posts,1);
    assert.deepEqual(payload,{title:"Тестовая методика",originalAuthor:"Тестовый автор",publicationYear:2000,hasRussianAdaptation:null});
    await page.getByRole("heading",{name:"Мои запросы"}).waitFor();
    await open();await fill();reject=true;
    await page.locator('input').nth(1).press("Enter");
    await page.getByText("Тестовая ошибка отправки",{exact:true}).waitFor();
    assert.equal(posts,2);
    assert(await page.getByRole("button",{name:"Отправить запрос"}).isEnabled());
    reject=false;
    await page.getByRole("button",{name:"Отправить запрос"}).click();
    await page.getByText("Запрос отправлен администраторам.",{exact:true}).waitFor();
    assert.equal(posts,3);
    console.log("PASS: required validation, submit click, Enter, request payload, error recovery, success history.");
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exit(1)});
