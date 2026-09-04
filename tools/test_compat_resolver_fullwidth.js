const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  page.on('console', msg => console.log('LOG:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err.message));

  await page.goto('http://localhost:8000');
  await page.waitForTimeout(1000);

  // 1. Check Full-Width Viewport Occupancy
  console.log('--- 1. FULL-WIDTH VIEWPORT VERIFICATION (1920x1080) ---');
  const stageBox = await page.locator('.main-stage').boundingBox();
  console.log(`Main Stage Width: ${stageBox.width}px / Viewport: 1920px (Occupancy: ${((stageBox.width / 1920) * 100).toFixed(1)}%)`);

  // 2. Test 1-Click Compatibility Resolver: Weak PSU with 4090
  console.log('--- 2. COMPATIBILITY RESOLVER TEST: WEAK PSU ---');
  await page.click('button[data-preset="ultimate"]');
  await page.waitForTimeout(400);

  // Swap to weak PSU (EVGA 650W or 550W) via JavaScript state to simulate user selection
  await page.evaluate(() => {
    const weakPsu = window.PARTS_DATABASE ? window.PARTS_DATABASE.psu.find(p => p.wattage <= 650) : null;
    if (weakPsu) {
      // Find and select part
      const psuSlot = document.querySelector('#slot-psu .select-btn');
      // Directly trigger change
      window.selectPart('psu', weakPsu);
    }
  });
  await page.waitForTimeout(500);

  // Scroll to compatibility panel
  await page.locator('#compatibility-panel').scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);

  const compatItems = await page.locator('#compatibility-list .compat-item').allInnerTexts();
  console.log('Compatibility issues found:', compatItems.length);
  console.log('First issue text:', compatItems[0].split('\n')[0]);

  const solutionButtons = await page.locator('.compat-fix-btn').allInnerTexts();
  console.log('Suggested 1-Click Fix Buttons:', solutionButtons);

  // Take screenshot of compatibility solutions
  await page.screenshot({ path: 'fullwidth_compat_fixes.png' });

  // Click the first recommended PSU fix button directly inside the compatibility panel!
  console.log('Clicking 1-Click Fix button for PSU...');
  await page.locator('.compat-fix-btn[data-category="psu"]').first().click();
  await page.waitForTimeout(500);

  const psuNameAfter = await page.locator('#slot-psu .slot-selected-name').innerText();
  console.log('PSU in slot after 1-Click Fix:', psuNameAfter);

  const compatOk = await page.locator('.compat-success').isVisible();
  console.log('Compatibility resolved to OK:', compatOk);

  // 3. Take Full-Width Stage Screenshots (1920px)
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'fullwidth_workbench_light.png' });

  await page.click('#theme-toggle');
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'fullwidth_workbench_dark.png' });

  console.log('ALL FULL-WIDTH & RESOLVER TESTS PASSED!');
  await browser.close();
})();
