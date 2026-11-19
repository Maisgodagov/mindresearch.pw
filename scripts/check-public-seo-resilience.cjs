// Read-only on any target: no assessments or account changes.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert=require('node:assert/strict');
const base=process.env.PUBLIC_SEO_TARGET || 'http://127.0.0.1:5181';
(async()=>{const browser=await chromium.launch({channel:'msedge'});try{
 for(const width of [1440,390]){
  const context=await browser.newContext({viewport:{width,height:900}});const page=await context.newPage();
  const catalogue=await(await context.request.get(base+'/api/public/catalog')).json();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',r=>new URL(r.request().url()).pathname.startsWith('/api/')?r.abort():r.continue());
  for(const [path,count,robots] of [['/methods/',Math.min(catalogue.total,catalogue.pageSize),'index,follow,max-image-preview:large'],['/methods/anxiety-gad7/',null,'index,follow,max-image-preview:large'],['/methods/?q=GAD-7',1,'noindex,follow']]){
   const response=await page.goto(base+path);assert.equal(response.status(),200);
   assert((await response.text()).includes('id="public-methods-data"'));
   if(count!==null)await page.waitForFunction(count=>document.querySelectorAll('.tc-test').length===count,count);
   else await page.getByRole('heading',{name:'Шкала генерализованного тревожного расстройства',exact:true}).waitFor();
   await page.waitForTimeout(1100); // Authentication retries must not erase public content.
   assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'),robots);
   assert.equal(await page.locator('.pm-error').count(),0);
   assert.equal(await page.locator('h1').count(),1);
  }
  assert.deepEqual(errors,[]);await context.close();
  console.log(`PASS ${width}: article, catalogue and server-filtered snapshot survive blocked API, no accidental noindex`);
 }
 const context=await browser.newContext();const page=await context.newPage();
 await page.route('**/api/auth/**',r=>r.abort());
 await page.goto(base+'/methods/');
 const consent=page.getByRole('button',{name:'Отказаться',exact:true});if(await consent.isVisible())await consent.click();
 await page.locator('.tc-test h3 a[href="/methods/anxiety-gad7/"]').click();
 await page.getByRole('heading',{name:'Шкала генерализованного тревожного расстройства',exact:true}).waitFor();
 assert.equal(await page.locator('.pm-error').count(),0);
 console.log('PASS client navigation: published article loads even when auth refresh is blocked');
 await context.close();
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
