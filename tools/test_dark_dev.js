const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1000);

  // Switch to dark theme
  await page.click('#theme-toggle');
  await page.waitForTimeout(400);

  // Open modal via button
  await page.click('#dev-modal-btn');
  await page.waitForTimeout(600);

  // Take screenshot of dark mode modal
  await page.screenshot({ path: 'tools/dev_cabinet_dark.png' });

  await browser.close();
  console.log('Dark mode Dev Cabinet screenshot captured.');
})();
