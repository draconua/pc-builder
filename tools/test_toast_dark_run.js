const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1000);

  // Switch to dark theme
  await page.click('#theme-toggle');
  await page.waitForTimeout(300);

  // Open modal
  await page.click('#dev-modal-btn');
  await page.waitForTimeout(500);

  // Click Apply button
  await page.click('#btn-apply-prices');
  await page.waitForTimeout(600);

  // Take screenshot in dark mode
  await page.screenshot({ path: 'tools/test_toast_dark.png' });

  await browser.close();
  console.log('Dark toast screenshot taken.');
})();
