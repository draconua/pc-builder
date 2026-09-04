const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });

  console.log('1. Loading app...');
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1000);

  console.log('2. Opening PRO Chat...');
  await page.click('#btn-pro-chat');
  await page.waitForTimeout(500);

  console.log('3. Typing message...');
  await page.fill('#pro-chat-input', 'Привет! Назови 3 лучших процессора 2026 года');
  await page.click('#pro-chat-send-btn');

  console.log('4. Waiting for AI response bubble...');
  await page.waitForSelector('.pro-chat-bubble.ai:nth-child(2)', { timeout: 25000 });

  const aiText = await page.locator('.pro-chat-bubble.ai:nth-child(2) .pro-bubble-content').innerText();
  console.log('\n=== REAL GEMINI AI RESPONSE IN PRO CHAT ===');
  console.log(aiText);
  console.log('===========================================\n');

  await page.screenshot({ path: 'tools/test_live_pro_chat_success.png' });
  await browser.close();
})();
