// Only loopback, synthetic guest assessments; reuse the same 19 snapshots on both widths.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const {readFileSync,mkdirSync,writeFileSync}=require('node:fs');
const {resolve}=require('node:path');
const assert=require('node:assert/strict');
const base='http://127.0.0.1:5181';
const only=process.env.PUBLIC_EDITORIAL_ONLY?.split(',');
const methods=JSON.parse(readFileSync('apps/api/src/public-methods/catalog.json','utf8')).filter(m=>m.resultCopy&&(!only||only.includes(m.slug)));
const output=resolve('.work/public-methods/editorial');mkdirSync(output,{recursive:true});
(async()=>{
 const browser=await chromium.launch({channel:'msedge'});
 try{
  const ctx=await browser.newContext({viewport:{width:1440,height:1000},acceptDownloads:true});
  const page=await ctx.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await ctx.addInitScript(()=>{
   window.__cardText=[];
   const fill=CanvasRenderingContext2D.prototype.fillText;
   CanvasRenderingContext2D.prototype.fillText=function(value,x,y,...rest){
    if(this.canvas.width===1080&&this.canvas.height===1920){
     const metrics=this.measureText(value);
     window.__cardText.push({value,x,y,left:x-metrics.actualBoundingBoxLeft,right:x+metrics.actualBoundingBoxRight,top:y-metrics.actualBoundingBoxAscent,bottom:y+metrics.actualBoundingBoxDescent});
    }
    return fill.call(this,value,x,y,...rest);
   };
  });
  const assessments=[];
  for(const method of methods){
   const created=await ctx.request.post(base+`/api/public/methods/${method.slug}/assessments`,{headers:{Origin:base},data:{adult:true}});
   assert.equal(created.status(),201,await created.text());
   const a=await created.json();
   const answers=Object.fromEntries(a.definition.questions.map((q,i)=>[q.code,Number(q.options[i%q.options.length].value)]));
   const completed=await ctx.request.post(base+`/api/public/assessments/${a.id}/complete`,{headers:{Origin:base},data:{answers,position:0,revision:0}});
   assert.equal(completed.status(),200,await completed.text());assessments.push(await completed.json());
  }
  for(const width of [1440,390]){
   await page.setViewportSize({width,height:900});
   for(const a of assessments){
    const m=a.definition.method;
    await page.goto(base+`/methods/${m.slug}/`);
    await page.getByRole('heading',{name:m.name,exact:true}).waitFor();
    await page.locator('summary').filter({hasText:'Как понимать результат'}).click();
    assert((await page.locator('body').innerText()).includes(m.sections.find(s=>s.title==='Как понимать результат').text));
    await page.goto(base+`/assessment/result/?id=${a.id}`);
    const img=page.locator('.pm-story-image');await img.waitFor();await img.evaluate(img=>img.decode());
    await page.getByRole('heading',{name:'Как понимать результат',exact:true}).waitFor();
    assert.equal(await img.evaluate(img=>img.naturalWidth),1080);
    assert.equal(await img.evaluate(img=>img.naturalHeight),1920);
    for(const scale of a.result.scales){
     assert((await page.locator('.pm-story-description').innerText()).includes(scale.explanation));
    }
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    const drawn=await page.evaluate(()=>window.__cardText);
    assert(drawn.length>0);
    const overflow=drawn.filter(t=>t.left<0||t.right>1080||t.top<0||t.bottom>1920);
    assert.deepEqual(overflow,[],`${m.slug}: canvas text is clipped`);
    if(width===1440){
     writeFileSync(resolve(output,`${m.slug}-text.json`),JSON.stringify(drawn,null,2));
     await page.evaluate(()=>Object.defineProperty(navigator,'canShare',{configurable:true,value:()=>false}));
     const [download]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Поделиться',exact:true}).click()]);
     await download.saveAs(resolve(output,`${m.slug}.png`));
    }
    if(['rosenberg-self-esteem','self-compassion','personality-tipi'].includes(m.slug))await page.screenshot({path:resolve(output,`${width}-${m.slug}.png`),fullPage:true});
    console.log(`PASS ${width} ${m.slug}: article, ${a.result.scales.length} explanations, PNG bounds`);
   }
  }
  const plain=await browser.newContext({javaScriptEnabled:false});const plainPage=await plain.newPage();
  for(const m of methods){
   await plainPage.goto(base+`/methods/${m.slug}/`);
   await plainPage.getByRole('heading',{name:m.name,exact:true}).waitFor();
   assert((await plainPage.locator('body').innerText()).includes(m.sections.find(s=>s.title==='Как понимать результат').text));
  }
  await plain.close();assert.deepEqual(errors,[]);await ctx.close();
  console.log(`PASS ${methods.length} articles without JavaScript; no browser errors`);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
