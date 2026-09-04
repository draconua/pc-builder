const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });

  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1000);

  // Check what GPU price is in UI
  const gpuPrice = await page.locator('#slot-gpu .slot-price').innerText();
  const totalPrice = await page.locator('#total-price-val').innerText();
  console.log('Default GPU price:', gpuPrice);
  console.log('Default Total price:', totalPrice);

  // Open Dev modal to check cached prices
  await page.click('#dev-modal-btn');
  await page.waitForTimeout(500);

  // Check cached table
  const diffs = await page.$$eval('#dev-diff-tbody tr', rows => rows.map(r => r.innerText));
  console.log('Cached diffs count:', diffs.length);
  if (diffs.length > 0) {
    console.log('First 3 diffs:', diffs.slice(0, 3));
  }

  await browser.close();
})();
