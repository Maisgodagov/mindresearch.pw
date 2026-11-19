// Loopback only. No production account or research data required.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const { mkdirSync } = require('node:fs');
(async () => {
  const browser = await chromium.launch({ channel: 'msedge' });
  mkdirSync('.work/page-gutters', { recursive: true });
  try {
    for (const width of [390, 1024, 1920]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 } });
      for (const [route, selector] of [
        ['/methods/', '.test-catalog'],
        ['/for-researchers/', '.landing-hero'],
        ['/methods/self-esteem/', '.test-document'],
      ]) {
        await page.goto('http://127.0.0.1:5181' + route);
        // Catalogue's actual article link avoids relying on a guessed slug.
        if (route.includes('self-esteem')) {
          await page.goto('http://127.0.0.1:5181/methods/');
          const href = await page.locator('.tc-test h3 a').first().getAttribute('href');
          await page.goto('http://127.0.0.1:5181' + href);
        }
        await page.locator(selector).waitFor();
        const bounds = await page.locator(selector).evaluate(el => {
          const rect = el.getBoundingClientRect();
          const main = el.closest('main').getBoundingClientRect();
          return { left: rect.left - main.left, right: main.right - rect.right,
            overflow: document.documentElement.scrollWidth > innerWidth + 1 };
        });
        assert.equal(bounds.left, width <= 760 ? 24 : 32, route);
        assert.equal(bounds.right, bounds.left, route);
        assert.equal(bounds.overflow, false, route);
      }
      // Verify the same primitive in standalone and embedded results/profile.
      const styles = await page.evaluate(async () => {
        const reactModule = await import('/node_modules/.vite/deps/react.js');
        const React = reactModule.default || reactModule;
        const domModule = await import('/node_modules/.vite/deps/react-dom_client.js');
        const { createRoot } = domModule.default || domModule;
        const { Wrap } = await import('/src/containers/SurveyDashboard/styles.ts');
        const { ProfileShell } = await import('/src/containers/PublicProfile/styles.ts');
        const host = document.createElement('div'); document.body.append(host);
        const root = createRoot(host);
        root.render(React.createElement(React.Fragment, null,
          ...[Wrap, ProfileShell].flatMap(Component => [false, true].map(embedded =>
            React.createElement(Component, { $embedded: embedded, 'data-probe': String(embedded) }, 'probe')))));
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        const values = [...host.children].map(el => ({ embedded: el.dataset.probe === 'true',
          left: parseFloat(getComputedStyle(el).paddingLeft), right: parseFloat(getComputedStyle(el).paddingRight) }));
        root.unmount(); host.remove(); return values;
      });
      assert.equal(styles.length, 4);
      for (const value of styles) {
        assert.equal(value.left, value.embedded ? 0 : width <= 760 ? 24 : 32);
        assert.equal(value.right, value.left);
      }
      console.log(`PASS ${width}px: catalogue, landing, article, standalone/embedded results and profile gutters`);
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
