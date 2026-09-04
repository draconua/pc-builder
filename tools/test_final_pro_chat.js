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

  console.log('3. Clicking Quick Prompt chip for CS2...');
  await page.click('.pro-prompt-chip[data-prompt*="CS2"]');

  console.log('4. Waiting for real Gemini response in chat...');
  await page.waitForSelector('.pro-chat-bubble.ai:nth-child(3)', { timeout: 30000 });

  const aiText = await page.locator('.pro-chat-bubble.ai:nth-child(3) .pro-bubble-content').innerText();
  console.log('\n=============================================');
  console.log('🎉 LIVE GEMINI RESPONSE IN PRO CHAT:');
  console.log(aiText);
  console.log('=============================================\n');

  await page.screenshot({ path: 'tools/test_live_chat_final.png' });
  await browser.close();
  console.log('SUCCESS!');
})();
