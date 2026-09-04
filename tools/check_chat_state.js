const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err.message));

  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1000);

  await page.click('#btn-pro-chat');
  await page.waitForTimeout(400);

  console.log('Clicking prompt chip...');
  await page.click('.pro-prompt-chip[data-prompt*="CS2"]');

  // Wait 40 seconds
  console.log('Waiting 40s for Gemini response...');
  await page.waitForTimeout(40000);

  const bubbleCount = await page.locator('.pro-chat-bubble').count();
  console.log('Total chat bubbles:', bubbleCount);

  for (let i = 0; i < bubbleCount; i++) {
    const bText = await page.locator('.pro-chat-bubble').nth(i).innerText();
    console.log(`--- BUBBLE ${i + 1} ---`);
    console.log(bText);
  }

  await page.locator('#pro-chat-drawer').screenshot({ path: 'tools/screenshot_pro_drawer_state.png' });
  await browser.close();
})();
