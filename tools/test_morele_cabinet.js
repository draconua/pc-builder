const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1000);

  // Open modal
  await page.click('#dev-modal-btn');
  await page.waitForTimeout(500);

  // Select CPU category
  await page.selectOption('#dev-category-select', 'cpu');
  // Ensure Hybrid is selected
  await page.selectOption('#dev-source-select', 'hybrid');
  await page.waitForTimeout(300);

  console.log('Starting sync for CPUs with Morele + Ceneo Sanity Check...');
  await page.click('#btn-start-sync');

  // Wait 12 seconds to observe live scraping of CPUs (7800X3D, 5500, etc.)
  await page.waitForTimeout(12000);

  // Stop sync safely
  await page.click('#btn-stop-sync');
  await page.waitForTimeout(1000);

  // Screenshot the results
  await page.screenshot({ path: 'tools/dev_cabinet_morele_sanity.png' });

  const logSample = await page.locator('#dev-terminal-logs').innerText();
  console.log('Live Log snippet:\n', logSample);

  await browser.close();
  console.log('Test completed successfully.');
})();
