// Loopback only: verify section tracking without production data or submissions.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({channel:'msedge'});
try{for(const width of [1440,390]){
 const page=await browser.newPage({viewport:{width,height:900}});let loads=0;
 page.on('request',request=>{if(new URL(request.url()).pathname==='/api/public/methods/brief-thriving')loads++;});
 await page.goto('http://127.0.0.1:5181/methods/brief-thriving/');
 await page.getByRole('button',{name:'Отказаться',exact:true}).click();
 await page.locator('.td-contents').waitFor();await page.evaluate(()=>document.fonts.ready);
 await page.evaluate(()=>{
  window.originalHeading=document.querySelector('h1');window.scrollModes=[];
  const original=Element.prototype.scrollIntoView;
  Element.prototype.scrollIntoView=function(options){window.scrollModes.push(options?.behavior);return original.call(this,options);};
 });
 for(const id of ['before-test','test-details','test-limits','sources','about-test']){
  await page.locator(`.td-contents a[href="#${id}"]`).click();
  await page.waitForFunction(id=>document.querySelector(`.td-contents a[href="#${id}"]`)?.getAttribute('aria-current')==='location',id,{timeout:5000}).catch(async error=>{console.log(id,await page.evaluate(()=>({y:scrollY,active:document.querySelector('.td-contents a[aria-current]')?.hash,sections:[...document.querySelectorAll('.td-article section[id]')].map(el=>[el.id,el.getBoundingClientRect().top])})));throw error;});
  assert.equal(new URL(page.url()).hash,`#${id}`);
 }
 assert((await page.evaluate(()=>window.scrollModes)).includes('smooth'));
 await page.evaluate(()=>document.querySelector('#test-limits').scrollIntoView({behavior:'instant'}));
 await page.waitForFunction(()=>document.querySelector('.td-contents a[href="#test-limits"]')?.getAttribute('aria-current')==='location');
 assert(await page.evaluate(()=>window.originalHeading===document.querySelector('h1')),'Page DOM must not remount');
 assert.equal(loads,1,'Section links must not refetch the methodology');
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.locator('.td-contents a[href="#before-test"]').click();
 assert.equal(await page.evaluate(()=>window.scrollModes.at(-1)),'instant');
 await page.goto('http://127.0.0.1:5181/methods/brief-thriving/#sources');
 await page.waitForFunction(()=>document.querySelector('.td-contents a[href="#sources"]')?.getAttribute('aria-current')==='location');
 assert.equal(await page.locator('.td-contents a[aria-current="location"]').count(),1);
 console.log(`PASS ${width}: section clicks, manual scroll, smooth/reduced motion, deep link, no refetch/remount`);
 await page.close();
}}finally{await browser.close();}})().catch(error=>{console.error(error);process.exitCode=1});
