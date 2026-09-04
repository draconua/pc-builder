const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('http://localhost:8000');
  await page.waitForTimeout(1000);

  // Load balanced preset (starts with RTX 4070 Super)
  await page.click('button[data-preset="balanced"]');
  await page.waitForTimeout(400);

  console.log('Initial GPU:', await page.locator('#slot-gpu .slot-selected-name').textContent());

  // Click the first analog chip (RTX 5070)
  const firstChip = page.locator('.analog-chip-btn').first();
  console.log('Clicking analog chip:', await firstChip.innerText());
  await firstChip.click();
  await page.waitForTimeout(400);

  console.log('Replaced GPU:', await page.locator('#slot-gpu .slot-selected-name').textContent());

  await browser.close();
})();
