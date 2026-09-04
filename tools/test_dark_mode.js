const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });

  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1000);

  // Switch to Dark mode
  await page.click('#theme-toggle');
  await page.waitForTimeout(500);

  // Load Balanced Preset
  await page.click('button[data-preset="balanced"]');
  await page.waitForTimeout(600);

  // Take screenshot of main stage and details in dark mode
  await page.locator('.main-stage').screenshot({ path: 'tools/dark_main_stage_9slots.png' });
  await page.locator('#details-section').screenshot({ path: 'tools/dark_details_section.png' });

  await browser.close();
})();
