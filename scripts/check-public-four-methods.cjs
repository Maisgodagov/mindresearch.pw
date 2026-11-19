// Only synthetic loopback assessments. Never use production for this scenario.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');const fs=require('node:fs');const {resolve}=require('node:path');
const base='http://127.0.0.1:5181';const out=resolve('.work/public-four');fs.mkdirSync(out,{recursive:true});
const expected={'achievement-motivation':[13],'alexithymia-paq-short':[6],'self-development':[14,4,4,6],'metacognitive-regulation':[1,5,5,1]};
const methods=JSON.parse(fs.readFileSync('apps/api/src/public-methods/catalog.json','utf8')).filter(m=>expected[m.slug]&&(!process.env.PUBLIC_FOUR_ONLY||process.env.PUBLIC_FOUR_ONLY.split(',').includes(m.slug)));
(async()=>{const browser=await chromium.launch({channel:'msedge'});try{
 for(const width of [1440,390]){
  const context=await browser.newContext({viewport:{width,height:900},hasTouch:width===390,isMobile:width===390,acceptDownloads:true});const page=await context.newPage();const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  for(const [index,m] of methods.entries()){
   await page.goto(base+'/methods/'+m.slug+'/');
   if(index===0)await page.getByRole('button',{name:'Отказаться',exact:true}).click();
   await page.getByRole('heading',{name:m.name,exact:true}).waitFor();
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   await page.screenshot({path:resolve(out,`${width}-${m.slug}-article.png`),fullPage:true});
   await page.getByRole('link',{name:'Пройти тест',exact:true}).first().click();
   await page.locator('.pm-consent input').check();await page.getByRole('button',{name:'Начать',exact:true}).click();
   const first=page.getByText(/^Вопрос 1 из \d+$/,{exact:true});await first.waitFor();const count=Number((await first.innerText()).match(/из (\d+)/)[1]);
   for(let i=0;i<count;i++){
    await page.getByText(`Вопрос ${i+1} из ${count}`,{exact:true}).waitFor();
    const options=page.locator('.respondent-option, .rating-buttons button');
    assert(await options.evaluateAll(els=>els.every(el=>el.getAttribute('aria-pressed')==='false')));
    if(width===390)await options.first().tap();else await options.first().click();
   }
   const image=page.locator('.pm-story-image');await image.waitFor();await image.evaluate(img=>img.decode());
   const id=new URL(page.url()).searchParams.get('id');const data=await(await context.request.get(base+'/api/public/assessments/'+id)).json();
   assert.deepEqual(data.result.scales.map(s=>s.value),expected[m.slug]);
   assert.equal(await image.evaluate(img=>img.naturalWidth),1080);assert.equal(await image.evaluate(img=>img.naturalHeight),1920);
   await page.evaluate(()=>Object.defineProperty(navigator,'canShare',{configurable:true,value:()=>false}));
   const [download]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Поделиться',exact:true}).click()]);
   await download.saveAs(resolve(out,`${width}-${m.slug}-card.png`));
   await page.screenshot({path:resolve(out,`${width}-${m.slug}-result.png`),fullPage:true});
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   assert.equal(await page.locator('meta[name=robots]').getAttribute('content'),'noindex,nofollow');
   console.log(`PASS ${width} ${m.slug}: ${count} answers, score, PNG, privacy, no overflow`);
  }
  await page.goto(base+'/methods/');await page.getByRole('heading',{name:'Все тесты(23)',exact:true}).waitFor();
  assert.equal(await page.locator('.tc-test').count(),20);const links=await page.locator('.tc-test h3 a').evaluateAll(els=>els.map(e=>e.getAttribute('href')));
  await page.getByRole('link',{name:'Страница 2',exact:true}).click();await page.waitForFunction(()=>document.querySelectorAll('.tc-test').length===3);
  const rest=await page.locator('.tc-test h3 a').evaluateAll(els=>els.map(e=>e.getAttribute('href')));assert.equal(new Set([...links,...rest]).size,23);
  await page.reload();await page.waitForFunction(()=>document.querySelectorAll('.tc-test').length===3);
  assert.deepEqual(errors,[]);await context.close();console.log(`PASS ${width} catalogue: 20+3, no duplicates, reload page 2`);
 }
 const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();
 for(const m of methods){await page.goto(base+'/methods/'+m.slug+'/');await page.getByRole('heading',{name:m.name,exact:true}).waitFor();assert(await page.getByRole('heading',{name:'Как рассчитывается результат',exact:true}).isVisible());}
 await context.close();console.log('PASS four no-JavaScript articles');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
