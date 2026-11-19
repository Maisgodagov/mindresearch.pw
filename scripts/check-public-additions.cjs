// Synthetic end-to-end checks. Deliberately restricted to loopback, no production writes.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert=require('node:assert/strict');
const {mkdirSync,readFileSync}=require('node:fs');
const {resolve}=require('node:path');
const base='http://127.0.0.1:5181';
const output=resolve('.work/public-methods/additions');mkdirSync(output,{recursive:true});
const expected={
 'personality-tipi':[4,4,4,4,4], 'autonomous-functioning':[1,1,1], 'stress-mindset':[0,16],
 'belonging-exclusion':[36,9,22], 'cyber-aggression':[0,0], 'career-adaptability':[24,6,6,6,6],
 'self-compassion':[3,1,1,1,1,1,1], 'acceptance-action':[7], 'anxiety-gad7':[0], 'anxiety-depression-phq4':[0,0]
};
const only = process.env.PUBLIC_METHODS_ONLY?.split(',');
const catalog=JSON.parse(readFileSync('apps/api/src/public-methods/catalog.json','utf8')).filter(m=>expected[m.slug] && (!only || only.includes(m.slug)));
(async()=>{
 const browser=await chromium.launch({channel:'msedge'});const errors=[];
 try{
  for(const viewport of [{width:1440,height:1000},{width:390,height:844}]){
   const ctx=await browser.newContext({viewport,acceptDownloads:true});const page=await ctx.newPage();
   page.on('pageerror',e=>errors.push(e.message));
   for(const [index,m] of catalog.entries()){
    await page.goto(base+'/methods/'+m.slug+'/');
    if(index===0)await page.getByRole('button',{name:'Отказаться',exact:true}).click();
    await page.getByRole('heading',{name:m.name,exact:true}).waitFor();
    assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'),'https://mindresearch.pro/methods/'+m.slug+'/');
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    await page.getByRole('link',{name:'Пройти тест',exact:true}).first().click();
    await page.locator('.pm-consent input').check();
    await page.getByRole('button',{name:'Начать',exact:true}).click();
    const heading=page.getByText(/^Вопрос 1 из \d+$/, {exact:true});await heading.waitFor();
    const count=Number((await heading.innerText()).match(/из (\d+)/)[1]);
    for(let i=0;i<count;i++){
     await page.getByText(`Вопрос ${i+1} из ${count}`,{exact:true}).waitFor();
     await page.locator('.respondent-option, .rating-buttons button').first().click();
     if(i<count-1)await page.getByText(`Вопрос ${i+2} из ${count}`,{exact:true}).waitFor();
    }
    const image=page.locator('.pm-story-image');await image.waitFor({timeout:15000});await image.evaluate(img=>img.decode());
    const id=new URL(page.url()).searchParams.get('id');
    const data=await(await ctx.request.get(base+'/api/public/assessments/'+id)).json();
    assert.deepEqual(data.result.scales.map(s=>s.value),expected[m.slug]);
    assert.equal(await image.evaluate(img=>img.naturalWidth),1080);
    assert.equal(await image.evaluate(img=>img.naturalHeight),1920);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    assert.equal(await page.locator('meta[name=robots]').getAttribute('content'),'noindex,nofollow');
    await page.evaluate(()=>Object.defineProperty(navigator,'canShare',{configurable:true,value:()=>false}));
    const [download]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Поделиться',exact:true}).click()]);
    await download.saveAs(resolve(output,`${viewport.width}-${m.slug}-card.png`));
    await page.screenshot({path:resolve(output,`${viewport.width}-${m.slug}-result.png`),fullPage:true});
    console.log(`PASS ${viewport.width} ${m.slug}: ${count} answers, exact scores, PNG, privacy, no overflow`);
   }
   await ctx.close();
  }
  const ctx=await browser.newContext({javaScriptEnabled:false});const page=await ctx.newPage();
  for(const m of catalog){
   await page.goto(base+'/methods/'+m.slug+'/');
   await page.getByRole('heading',{name:m.name,exact:true}).waitFor();
   assert(await page.getByRole('heading',{name:'Как рассчитывается результат',exact:true}).isVisible());
   assert((await page.content()).includes(m.sources[0].url.replaceAll('&','&amp;')));
  }
  await ctx.close();assert.deepEqual(errors,[]);console.log(`PASS ${catalog.length} no-JavaScript articles; no browser exceptions`);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
