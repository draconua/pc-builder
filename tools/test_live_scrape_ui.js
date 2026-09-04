const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1000);

  // Open modal
  await page.click('#dev-modal-btn');
  await page.waitForTimeout(500);

  // Select GPU category (29 parts)
  await page.selectOption('#dev-category-select', 'gpu');
  await page.waitForTimeout(300);

  console.log('Clicking Start Sync for GPU...');
  await page.click('#btn-start-sync');

  // Wait 12 seconds to observe live scraping of first 4-5 GPUs
  console.log('Waiting for live scraper to process first few GPUs...');
  await page.waitForTimeout(12000);

  // Inspect terminal log and status
  const statusText = await page.locator('#dev-progress-status').innerText();
  const countText = await page.locator('#dev-progress-count').innerText();
  const logContent = await page.locator('#dev-terminal-logs').innerText();
  console.log('Progress Status:', statusText);
  console.log('Progress Count:', countText);
  console.log('Logs preview:\n' + logContent.slice(0, 500));

  // Stop scraper to keep test fast
  await page.click('#btn-stop-sync');
  await page.waitForTimeout(1000);

  // Take screenshot of live scraper UI
  await page.screenshot({ path: 'tools/dev_cabinet_live_scraping.png' });

  await browser.close();
  console.log('Scraper test completed and stopped safely.');
})();
