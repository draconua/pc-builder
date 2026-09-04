const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('http://localhost:8000');
  await page.waitForTimeout(1000);

  // Click budget preset
  await page.click('button[data-preset="budget"]');
  await page.waitForTimeout(400);

  const gpuName = await page.locator('#slot-gpu .slot-selected-name').textContent();
  console.log('Budget GPU Name:', gpuName);

  await page.screenshot({ path: 'budget_preset_test.png' });
  await browser.close();
})();
