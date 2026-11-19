// Loopback-only touch regression: answer appearance, saved answers, route scroll.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert=require('node:assert/strict');
const base='http://127.0.0.1:5181';
(async()=>{const browser=await chromium.launch({channel:'msedge'});try{
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
 const page=await context.newPage();
 await page.goto(base+'/methods/');
 await page.getByRole('button',{name:'Отказаться',exact:true}).click();
 const link=page.locator('.tc-test h3 a').nth(4);await link.scrollIntoViewIfNeeded();
 const href=await link.getAttribute('href');assert(await page.evaluate(()=>scrollY)>100);
 await link.tap();await page.waitForURL(base+href);
 await page.getByRole('link',{name:'Пройти тест',exact:true}).first().waitFor();
 assert.equal(await page.evaluate(()=>scrollY),0);
 console.log('PASS touch: scrolled catalogue → article opens at top');
 for(const slug of ['rosenberg-self-esteem','personality-tipi']){
  await page.goto(base+'/methods/'+slug+'/start/');
  await page.locator('.pm-consent input').check();await page.getByRole('button',{name:'Начать',exact:true}).tap();
  await page.getByText('Вопрос 1 из 10',{exact:true}).waitFor();
  const selector='.respondent-option, .rating-buttons button';
  await page.locator(selector).first().evaluate(el=>window.oldAnswer=el);
  await page.locator(selector).first().tap();
  await page.getByText('Вопрос 2 из 10',{exact:true}).waitFor();
  const buttons=await page.locator(selector).evaluateAll(els=>els.map(el=>({pressed:el.getAttribute('aria-pressed'),same:el===window.oldAnswer,color:getComputedStyle(el).backgroundColor})));
  assert(buttons.every(b=>b.pressed==='false' && !b.same));
  assert.equal(new Set(buttons.map(b=>b.color)).size,1);
  await page.getByRole('button',{name:'Назад',exact:true}).tap();
  await page.getByText('Вопрос 1 из 10',{exact:true}).waitFor();
  assert.equal(await page.locator(selector).first().getAttribute('aria-pressed'),'true');
  console.log('PASS touch '+slug+': fresh unselected options, no inherited color, Back retains saved answer');
 }
 await context.close();
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
