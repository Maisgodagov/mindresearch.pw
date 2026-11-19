// Synthetic guest acceptance checks; never point this script at production.
const { chromium }=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert=require('node:assert/strict');
const {mkdirSync}=require('node:fs');
const {resolve}=require('node:path');
const base=process.env.PUBLIC_METHODS_PREVIEW || 'http://127.0.0.1:5181';
if(!/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(base))throw Error('Local preview only');
const output=resolve('.work/public-methods/digital');mkdirSync(output,{recursive:true});
const methods=[['fear-of-missing-out',6,[6,3,3]],['nomophobia',20,[20,4,5,6,5]],['social-media-use',6,[6]]];
(async()=>{
 const browser=await chromium.launch({channel:'msedge'});const errors=[];
 try{
  for(const viewport of [{width:1440,height:1000},{width:390,height:844}]){
   const ctx=await browser.newContext({viewport,acceptDownloads:true});const page=await ctx.newPage();
   page.on('pageerror',e=>errors.push(e.message));
   for(const [slug,count,expected] of methods){
    await page.goto(base+'/methods/'+slug+'/');
    if(slug===methods[0][0])await page.getByRole('button',{name:'Отказаться',exact:true}).click();
    await page.getByRole('link',{name:'Пройти тест',exact:true}).first().waitFor();
    assert.equal(await page.locator('link[rel=canonical]').count(),1);
    assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'),'https://mindresearch.pro/methods/'+slug+'/');
    await page.screenshot({path:resolve(output,`${viewport.width}-${slug}-article.png`),fullPage:true});
    await page.getByRole('link',{name:'Пройти тест',exact:true}).first().click();
    await page.locator('.pm-consent input').check();await page.getByRole('button',{name:'Начать',exact:true}).click();
    for(let i=0;i<count;i++){
     await page.getByText(`Вопрос ${i+1} из ${count}`,{exact:true}).waitFor();
     await page.locator('.respondent-option, .rating-buttons button').first().click();
     if(i<count-1)await page.getByText(`Вопрос ${i+2} из ${count}`,{exact:true}).waitFor();
    }
    const image=page.locator('.pm-story-image');await image.waitFor();await image.evaluate(img=>img.decode());
    const id=new URL(page.url()).searchParams.get('id');
    const data=await(await ctx.request.get(base+'/api/public/assessments/'+id)).json();
    assert.deepEqual(data.result.scales.map(s=>s.value),expected);
    assert.equal(await image.evaluate(img=>img.naturalWidth),1080);
    assert.equal(await image.evaluate(img=>img.naturalHeight),1920);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    assert.equal(await page.locator('meta[name=robots]').getAttribute('content'),'noindex,nofollow');
    await page.evaluate(()=>Object.defineProperty(navigator,'canShare',{configurable:true,value:()=>false}));
    const [download]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Поделиться',exact:true}).click()]);
    await download.saveAs(resolve(output,`${viewport.width}-${slug}-card.png`));
    await page.screenshot({path:resolve(output,`${viewport.width}-${slug}-result.png`),fullPage:true});
    console.log(`PASS ${viewport.width} ${slug}: guest answers, score profile, PNG, private metadata`);
   }
   await ctx.close();
  }
  const nojs=await browser.newContext({javaScriptEnabled:false});const page=await nojs.newPage();
  for(const [slug] of methods){await page.goto(base+'/methods/'+slug+'/');assert(await page.getByRole('heading',{name:'Как рассчитывается результат',exact:true}).isVisible());}
  await nojs.close();assert.deepEqual(errors,[]);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
