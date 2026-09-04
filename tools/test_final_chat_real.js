const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });

  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1000);
  await page.click('#btn-pro-chat');
  await page.waitForTimeout(500);

  // Send message
  await page.fill('#pro-chat-input', 'Привет! Назови 2 лучших процессора под сокет AM5');
  await page.click('#pro-chat-send-btn');

  // Wait until loading bubble disappears
  await page.waitForSelector('#pro-chat-messages [id^="loading-"]', { state: 'attached', timeout: 5000 });
  console.log('Thinking bubble appeared...');
  await page.waitForSelector('#pro-chat-messages [id^="loading-"]', { state: 'detached', timeout: 35000 });
  console.log('Thinking bubble finished!');

  const allAiBubbles = await page.locator('.pro-chat-bubble.ai .pro-bubble-content').allInnerTexts();
  console.log('\n--- FINAL AI CHAT BUBBLE ---');
  console.log(allAiBubbles[allAiBubbles.length - 1]);
  console.log('----------------------------\n');

  await page.screenshot({ path: 'tools/test_live_chat_finished.png' });
  await browser.close();
})();
