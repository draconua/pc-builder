const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err.message));

  console.log('1. Loading app...');
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1000);

  // Set balanced build
  await page.click('button.preset-btn[data-preset="balanced"]');
  await page.waitForTimeout(600);

  // Check AI synergy button
  const checkBtn = page.locator('#btn-check-ai-synergy');
  await checkBtn.scrollIntoViewIfNeeded();
  console.log('2. Clicking "Проверить сборку с AI"...');
  await checkBtn.click();
  await page.waitForSelector('#ai-synergy-verdict-card:not(.hidden)', { timeout: 20000 });
  console.log('Synergy AI card visible!');
  await page.locator('#bottleneck-panel').screenshot({ path: 'tools/screenshot_synergy_card.png' });

  // Open PRO Chat
  console.log('3. Opening PRO Chat...');
  await page.click('#btn-pro-chat');
  await page.waitForTimeout(500);

  console.log('4. Clicking CS2 prompt...');
  await page.click('.pro-prompt-chip[data-prompt*="CS2"]');

  console.log('5. Waiting for AI reply and .pro-spec-card in chat...');
  await page.waitForSelector('.pro-spec-card', { timeout: 35000 });
  console.log('SUCCESS! Found .pro-spec-card in chat!');

  const count = await page.locator('.pro-spec-card').count();
  console.log(`Rendered ${count} component cards in chat.`);

  await page.waitForTimeout(500);
  await page.locator('#pro-chat-drawer').screenshot({ path: 'tools/screenshot_chat_drawer.png' });
  await page.screenshot({ path: 'tools/screenshot_full_app.png' });

  await browser.close();
  console.log('ALL TESTS AND SCREENSHOTS COMPLETE!');
})();
