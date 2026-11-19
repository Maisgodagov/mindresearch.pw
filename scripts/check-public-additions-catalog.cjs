const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert=require('node:assert/strict');
const total=require('../apps/api/src/public-methods/catalog.json').length;
(async()=>{
 const browser=await chromium.launch({channel:'msedge'});
 try{
  for(const viewport of [{width:1440,height:1000},{width:390,height:844}]){
   const page=await browser.newPage({viewport});
   await page.goto('http://127.0.0.1:5181/methods/');
   await page.getByRole('button',{name:'Отказаться',exact:true}).click();
   await page.getByRole('heading',{name:`Все тесты(${total})`,exact:true}).waitFor();
   assert.equal(await page.locator('.tc-test').count(),Math.min(20,total));
   const search=page.getByPlaceholder('Найти тест или тему');
   await search.fill('GAD-7');
   await page.waitForFunction(()=>document.querySelectorAll('.tc-test').length===1);
   assert((await page.locator('.tc-test').innerText()).includes('GAD-7'));
   await page.reload();
   await page.waitForFunction(()=>document.querySelectorAll('.tc-test').length===1);
   assert.equal(await search.inputValue(),'GAD-7');
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   console.log(`PASS ${viewport.width}: catalogue ${total}, server search GAD-7, URL reload, no overflow`);
   await page.close();
  }
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
