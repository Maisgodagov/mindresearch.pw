// Read-only visual/interaction checks against the isolated loopback preview.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');const {mkdirSync}=require('node:fs');
(async()=>{const browser=await chromium.launch({channel:'msedge'});
mkdirSync('.work/public-methods/intro',{recursive:true});
try{for(const width of [1440,390]){
 const page=await browser.newPage({viewport:{width,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:5181/methods/');await page.getByRole('button',{name:'Отказаться',exact:true}).click();
 const methods=await(await page.request.get('http://127.0.0.1:5181/api/public/methods')).json();
 for(const method of methods){
  await page.goto(`http://127.0.0.1:5181/methods/${method.slug}/`);
  await page.getByRole('heading',{name:method.name,exact:true,level:1}).waitFor();
  const start=page.locator('.td-actions').getByRole('link',{name:'Пройти тест',exact:true});
  assert.equal(await start.getAttribute('href'),`/methods/${method.slug}/start/`);
  assert.equal(await page.locator('.td-result-overview li').count(),3);
  assert.equal(await page.locator('.td-test-passport, .td-outcomes').count(),0);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),method.slug);
  if(['brief-thriving','perceived-social-support'].includes(method.slug)){
   await page.evaluate(()=>document.fonts.ready);
   await page.screenshot({path:`.work/public-methods/intro/${method.slug}-${width}.png`,fullPage:false});
  }
 }
 await page.getByRole('link',{name:'О методике',exact:true}).click();assert.equal(new URL(page.url()).hash,'#about-test');
 assert.deepEqual(errors,[]);console.log(`PASS ${width}: all 9 official headings, start links, result overview, anchor and no overflow/errors`);
 await page.close();
}}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
