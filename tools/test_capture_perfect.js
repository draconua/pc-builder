const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1536, height: 960 } });

  await page.goto('http://localhost:8000');
  await page.waitForTimeout(500);

  // Load Balanced Preset
  await page.click('button[data-preset="balanced"]');
  await page.waitForTimeout(400);

  // Take Stage Light screenshot (at top)
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(200);
  await page.screenshot({ path: 'v3_stage_light.png' });

  // Take Stage Dark screenshot (at top)
  await page.click('#theme-toggle');
  await page.waitForTimeout(300);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(200);
  await page.screenshot({ path: 'v3_stage_dark.png' });

  // Open popover to capture platform choices
  await page.click('#btn-auto-builder');
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'v3_popover_platforms.png' });
  await page.click('#autobuild-popover-close');
  await page.waitForTimeout(200);

  // Scroll to FPS table and capture
  await page.locator('#fps-panel').scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'v3_fps_matrix.png' });

  console.log('Captured all 4 refreshed screenshots!');
  await browser.close();
})();
