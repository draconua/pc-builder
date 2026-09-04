const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('pageerror', err => console.log('PAGE ERROR STACK:\n', err.stack));
  await page.goto('http://localhost:8000');
  await page.waitForTimeout(1000);
  await browser.close();
})();
