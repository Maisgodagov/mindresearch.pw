// Synthetic large catalogue in the browser; real query semantics have API tests.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ channel: 'msedge' });
  try {
    for (const width of [1440, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 } });
      const seed = await (await page.request.get('http://127.0.0.1:5181/api/public/catalog')).json();
      const requests = [];
      await page.route('**/api/public/catalog?*', async route => {
        const params = new URL(route.request().url()).searchParams;
        requests.push(params.toString());
        const total = params.get('q') ? 1 : 805;
        const pageCount = Math.ceil(total / 20);
        const current = Math.min(Number(params.get('page') || 1), pageCount);
        const start = (current - 1) * 20;
        const items = Array.from({ length: Math.min(20, total - start) }, (_, index) => ({ ...seed.items[0], name: `Fixture ${start + index + 1}`, title: `Fixture ${start + index + 1}` }));
        await route.fulfill({ json: { ...seed, items, total, catalogTotal: 805, page: current, pageCount, pageSize: 20 } });
      });
      await page.goto('http://127.0.0.1:5181/methods/?topic=one&topic=two');
      await page.getByRole('button', { name: 'Отказаться', exact: true }).click();
      await page.locator('.tc-test').first().waitFor();
      assert.equal(await page.locator('.tc-test').count(), 20);
      await page.getByRole('link', { name: 'Далее', exact: true }).click();
      await page.waitForFunction(() => document.querySelector('.tc-test h3')?.textContent === 'Fixture 21');
      assert.equal(new URL(page.url()).searchParams.get('page'), '2');
      assert.deepEqual(new URL(page.url()).searchParams.getAll('topic'), ['one', 'two']);
      await page.reload();
      await page.waitForFunction(() => document.querySelector('.tc-test h3')?.textContent === 'Fixture 21');
      await page.getByRole('link', { name: 'Страница 41', exact: true }).click();
      await page.waitForFunction(() => document.querySelectorAll('.tc-test').length === 5);
      assert.equal(await page.getByRole('link', { name: 'Далее', exact: true }).count(), 0);
      const search = page.getByRole('textbox', { name: 'Найти психологический тест' });
      const requestCount = requests.length;
      await search.fill('a'); await search.fill('ab'); await search.fill('abc');
      await page.waitForFunction(() => document.querySelectorAll('.tc-test').length === 1);
      assert.equal(new URL(page.url()).searchParams.has('page'), false);
      assert(requests.length - requestCount <= 2, 'Typing should be debounced');
      assert.equal(await page.locator('.tc-pagination').count(), 0);
      assert.equal(await page.locator('meta[name=robots]').getAttribute('content'), 'noindex,follow');
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
      console.log(`PASS ${width}px: 805 items, page links, URL/reload, repeated filters, last page, debounced search resets page`);
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
