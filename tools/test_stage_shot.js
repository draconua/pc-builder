const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1000);

  // Load Balanced Preset
  await page.click('button[data-preset="balanced"]');
  await page.waitForTimeout(600);

  // Take screenshot of main stage
  await page.locator('.main-stage').screenshot({ path: 'tools/test_main_stage_9slots.png' });

  await browser.close();
})();
