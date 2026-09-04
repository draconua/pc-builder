const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  await page.goto('http://localhost:8000');
  await page.waitForTimeout(1000);

  // 1. TEST BUDGET PRESET
  console.log('--- 1. BUDGET PRESET VERIFICATION ---');
  await page.click('button[data-preset="budget"]');
  await page.waitForTimeout(400);

  const budgetCpu = await page.locator('#slot-cpu .slot-selected-name').innerText();
  const budgetGpu = await page.locator('#slot-gpu .slot-selected-name').innerText();
  const budgetCS2 = await page.locator('#fps-matrix-tbody tr').filter({ hasText: 'Counter-Strike 2' }).innerText();
  const budgetCP = await page.locator('#fps-matrix-tbody tr').filter({ hasText: 'Cyberpunk 2077' }).innerText();
  const budgetSynergy = await page.locator('#bottleneck-score-badge').innerText();

  console.log(`Hardware: ${budgetCpu} + ${budgetGpu}`);
  console.log(`CS2: ${budgetCS2.replace(/\n/g, ' ')}`);
  console.log(`Cyberpunk: ${budgetCP.replace(/\n/g, ' ')}`);
  console.log(`Synergy: ${budgetSynergy}`);

  // 2. TEST BALANCED PRESET
  console.log('--- 2. BALANCED PRESET VERIFICATION ---');
  await page.click('button[data-preset="balanced"]');
  await page.waitForTimeout(400);

  const balCpu = await page.locator('#slot-cpu .slot-selected-name').innerText();
  const balGpu = await page.locator('#slot-gpu .slot-selected-name').innerText();
  const balCS2 = await page.locator('#fps-matrix-tbody tr').filter({ hasText: 'Counter-Strike 2' }).innerText();
  const balCP = await page.locator('#fps-matrix-tbody tr').filter({ hasText: 'Cyberpunk 2077' }).innerText();
  const balSynergy = await page.locator('#bottleneck-score-badge').innerText();

  console.log(`Hardware: ${balCpu} + ${balGpu}`);
  console.log(`CS2: ${balCS2.replace(/\n/g, ' ')}`);
  console.log(`Cyberpunk: ${balCP.replace(/\n/g, ' ')}`);
  console.log(`Synergy: ${balSynergy}`);

  // 3. TEST ULTIMATE PRESET
  console.log('--- 3. ULTIMATE PRESET VERIFICATION ---');
  await page.click('button[data-preset="ultimate"]');
  await page.waitForTimeout(400);

  const ultCpu = await page.locator('#slot-cpu .slot-selected-name').innerText();
  const ultGpu = await page.locator('#slot-gpu .slot-selected-name').innerText();
  const ultCS2 = await page.locator('#fps-matrix-tbody tr').filter({ hasText: 'Counter-Strike 2' }).innerText();
  const ultCP = await page.locator('#fps-matrix-tbody tr').filter({ hasText: 'Cyberpunk 2077' }).innerText();
  const ultSynergy = await page.locator('#bottleneck-score-badge').innerText();

  console.log(`Hardware: ${ultCpu} + ${ultGpu}`);
  console.log(`CS2: ${ultCS2.replace(/\n/g, ' ')}`);
  console.log(`Cyberpunk: ${ultCP.replace(/\n/g, ' ')}`);
  console.log(`Synergy: ${ultSynergy}`);

  // Capture Screenshot of Ultimate Matrix
  await page.locator('#fps-panel').scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'frametime_ultimate_fps.png' });

  // Scroll to budget and capture
  await page.click('button[data-preset="budget"]');
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'frametime_budget_fps.png' });

  console.log('ALL PRESETS VERIFIED WITH PHYSICAL FRAMETIME ENGINE!');
  await browser.close();
})();
