const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1536, height: 960 } });

  await page.goto('http://localhost:8000');
  await page.waitForTimeout(500);

  await page.click('button[data-preset="ultimate"]');
  await page.waitForTimeout(300);

  await page.click('#theme-toggle');
  await page.waitForTimeout(300);

  await page.screenshot({ path: 'scaled_dark_mode.png' });
  console.log('Saved scaled_dark_mode.png');

  await browser.close();
})();
