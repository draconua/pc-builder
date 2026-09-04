const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  page.on('console', msg => console.log('BROWSER:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err.message));

  await page.goto('http://localhost:8000');
  await page.waitForTimeout(1000);

  // 1. VERIFY UPDATED PRESETS (2026 Current-Gen)
  console.log('--- 1. PRESETS 2026 VERIFICATION ---');
  await page.click('button[data-preset="balanced"]');
  await page.waitForTimeout(400);

  const balGpu = await page.locator('#slot-gpu .slot-selected-name').innerText();
  console.log('Balanced GPU (should be RTX 5070):', balGpu);

  await page.click('button[data-preset="ultimate"]');
  await page.waitForTimeout(400);

  const ultCpu = await page.locator('#slot-cpu .slot-selected-name').innerText();
  console.log('Ultimate CPU (should be Ryzen 7 9800X3D):', ultCpu);

  // 2. VERIFY SLACK CODE TAGS
  console.log('--- 2. SLACK CODE TAGS VERIFICATION ---');
  const slackTags = await page.locator('#slot-cpu .slack-code-tag').allInnerTexts();
  console.log('Slack Code Tags on CPU Slot:', slackTags);

  // 3. VERIFY MULTI-STORE BUY POPOVER
  console.log('--- 3. MULTI-STORE BUY POPOVER VERIFICATION ---');
  await page.locator('#slot-gpu .slot-buy-link').click();
  await page.waitForTimeout(400);

  const modalVisible = await page.locator('#retailers-modal').isVisible();
  console.log('Retailers Modal visible:', modalVisible);

  const storeNames = await page.locator('.retailer-name').allInnerTexts();
  console.log('Available Stores in Popover:', storeNames);

  // Take screenshot of Store Popover
  await page.screenshot({ path: 'geek_store_popover.png' });

  // Close modal
  await page.click('#retailers-modal-close');
  await page.waitForTimeout(300);

  // 4. VERIFY GEEK DRAWER FILTERS
  console.log('--- 4. GEEK DRAWER FILTERS VERIFICATION ---');
  await page.locator('#slot-cpu .select-btn').click();
  await page.waitForTimeout(400);

  const drawerVisible = await page.locator('#drawer').isVisible();
  console.log('Drawer visible:', drawerVisible);

  const brandChips = await page.locator('.geek-brand-chip').allInnerTexts();
  console.log('Brand Chips in Drawer:', brandChips);

  // Click AMD AM5 chip
  await page.locator('.geek-brand-chip', { hasText: 'AMD AM5' }).click();
  await page.waitForTimeout(300);

  const filteredCpus = await page.locator('.part-card .part-name').allInnerTexts();
  console.log('Filtered AM5 CPUs count:', filteredCpus.length);
  console.log('First 3 AM5 CPUs:', filteredCpus.slice(0, 3));

  // Take screenshot of Geek Drawer
  await page.screenshot({ path: 'geek_drawer_filters.png' });

  // Close drawer
  await page.click('#drawer-close');
  await page.waitForTimeout(300);

  // 5. TAKE FULL-PAGE GEEK STATION SCREENSHOTS (Light & Dark)
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'geek_station_light.png' });

  await page.click('#theme-toggle');
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'geek_station_dark.png' });

  console.log('ALL GEEK STATION TESTS COMPLETED SUCCESSFULLY!');
  await browser.close();
})();
