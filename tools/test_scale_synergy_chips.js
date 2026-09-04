const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1536, height: 960 } });

  page.on('console', msg => console.log('LOG:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err.message));

  await page.goto('http://localhost:8000');
  await page.waitForTimeout(1000);

  // 1. Test Res-Chips in Auto-Build Popover
  console.log('--- TEST 1: Res-Chips in Popover ---');
  await page.click('#btn-auto-builder');
  await page.waitForTimeout(300);

  // Click 1080p
  const chip1080 = page.locator('.res-chip[data-res="1080p"]');
  await chip1080.click();
  await page.waitForTimeout(200);
  console.log('1080p active:', await chip1080.evaluate(el => el.classList.contains('active')));

  // Click 4k
  const chip4k = page.locator('.res-chip[data-res="4k"]');
  await chip4k.click();
  await page.waitForTimeout(200);
  console.log('4K active:', await chip4k.evaluate(el => el.classList.contains('active')));
  console.log('1080p inactive after 4k click:', !(await chip1080.evaluate(el => el.classList.contains('active'))));

  // Close popover
  await page.click('#autobuild-popover-close');
  await page.waitForTimeout(300);

  // 2. Test Synergy in Ultimate Preset (7800X3D + 4090)
  console.log('--- TEST 2: Ultimate Preset Synergy ---');
  await page.click('button[data-preset="ultimate"]');
  await page.waitForTimeout(500);

  const ultScore = await page.locator('#bottleneck-score-badge').innerText();
  const ultText = await page.locator('#bottleneck-text').innerText();
  const ultAdvice = await page.locator('#bottleneck-advice').innerText();
  console.log('Ultimate Synergy Score:', ultScore);
  console.log('Ultimate Synergy Title:', ultText);
  console.log('Ultimate Synergy Advice:', ultAdvice);

  // 3. Test Synergy in Balanced Preset
  console.log('--- TEST 3: Balanced Preset Synergy ---');
  await page.click('button[data-preset="balanced"]');
  await page.waitForTimeout(500);

  const balScore = await page.locator('#bottleneck-score-badge').innerText();
  const balText = await page.locator('#bottleneck-text').innerText();
  console.log('Balanced Synergy Score:', balScore);
  console.log('Balanced Synergy Title:', balText);

  // Take screenshot of scaled 15% UI
  await page.screenshot({ path: 'scaled_synergy_ui.png' });
  console.log('Saved scaled_synergy_ui.png');

  await browser.close();
})();
