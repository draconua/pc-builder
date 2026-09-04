const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });

  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1000);
  await page.click('#btn-pro-chat');
  await page.waitForTimeout(500);

  await page.click('.pro-prompt-chip[data-prompt*="CS2"]');
  console.log('Clicked CS2 chip...');

  // Wait for loading bubble to be removed
  await page.waitForSelector('#pro-chat-messages [id^="loading-"]', { state: 'attached', timeout: 5000 });
  console.log('Loading bubble attached...');
  await page.waitForSelector('#pro-chat-messages [id^="loading-"]', { state: 'detached', timeout: 45000 });
  console.log('Loading bubble detached!');

  // Check the HTML of the last bubble
  const lastBubbleHtml = await page.locator('.pro-chat-bubble.ai').last().innerHTML();
  console.log('\n=== LAST AI BUBBLE INNER HTML ===');
  console.log(lastBubbleHtml);
  console.log('=================================\n');

  await page.screenshot({ path: 'tools/test_chat_bubbles_rendered.png' });
  await browser.close();
})();
