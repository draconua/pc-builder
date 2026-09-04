const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  await page.goto('http://localhost:8000');
  await page.waitForTimeout(1000);

  // Load Budget preset (which has i3-12100F + RX 6600)
  await page.click('button[data-preset="budget"]');
  await page.waitForTimeout(500);

  const cpuName = await page.locator('#slot-cpu .slot-selected-name').innerText();
  const gpuName = await page.locator('#slot-gpu .slot-selected-name').innerText();
  console.log(`Selected Hardware: CPU: ${cpuName} | GPU: ${gpuName}`);

  // Scroll to FPS Table
  await page.locator('#fps-panel').scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);

  // Get CS2 row
  const cs2Row = await page.locator('#fps-matrix-tbody tr').filter({ hasText: 'Counter-Strike 2' }).innerText();
  console.log('CS2 Row:', cs2Row.replace(/\n/g, ' '));

  // Take screenshot of calibrated FPS matrix
  await page.screenshot({ path: 'calibrated_cs2_fps.png' });

  await browser.close();
})();
