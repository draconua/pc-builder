const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });

  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1000);

  // Load Balanced Preset
  await page.click('button[data-preset="balanced"]');
  await page.waitForTimeout(600);

  // Take screenshot of details-section
  await page.locator('#details-section').screenshot({ path: 'tools/test_details_section_fixed.png' });
  await page.screenshot({ path: 'tools/test_full_fixed.png' });

  await browser.close();
})();
