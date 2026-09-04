const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.error('BROWSER PAGE ERROR:', err.message));

  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1000);

  await page.click('#btn-pro-chat');
  await page.waitForTimeout(500);

  console.log('Clicking prompt chip...');
  await page.click('.pro-prompt-chip[data-prompt*="CS2"]');

  await page.waitForTimeout(6000);

  // Take screenshot of whatever is there right now
  await page.screenshot({ path: 'tools/debug_chat_ui_current.png' });
  await browser.close();
})();
