const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('http://localhost:8000');
  await page.waitForTimeout(1000);

  // Click ✨ Auto-Build to open popover
  await page.click('#btn-auto-builder');
  await page.waitForTimeout(300);

  // Take screenshot with popover open
  await page.screenshot({ path: 'autobuild_popover_open.png' });
  console.log('Saved autobuild_popover_open.png');

  await browser.close();
})();
