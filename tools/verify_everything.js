const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });

  console.log('1. Loading http://localhost:3000...');
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1000);

  // Set balanced preset
  await page.click('button.preset-btn[data-preset="balanced"]');
  await page.waitForTimeout(600);

  // Take screenshot of Bottleneck panel before AI check
  const checkBtn = page.locator('#btn-check-ai-synergy');
  await checkBtn.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);

  console.log('2. Clicking "Проверить сборку с AI"...');
  await checkBtn.click();

  // Wait for AI verdict card
  await page.waitForSelector('#ai-synergy-verdict-card:not(.hidden)', { timeout: 25000 });
  console.log('Synergy AI verdict card is visible!');

  // Take screenshot of Bottleneck section
  await page.locator('#bottleneck-panel').screenshot({ path: 'tools/screenshot_ai_synergy_card.png' });

  // Open PRO Chat
  console.log('3. Opening PRO Chat...');
  await page.click('#btn-pro-chat');
  await page.waitForTimeout(600);

  // Click CS2 quick prompt
  console.log('4. Clicking CS2 prompt...');
  await page.click('.pro-prompt-chip[data-prompt*="CS2"]');

  // Wait for AI response bubble to render
  console.log('Waiting for AI response in chat (up to 30s)...');
  await page.waitForSelector('#pro-chat-messages .pro-chat-bubble.ai:nth-child(3) .pro-spec-card', { timeout: 30000 });
  console.log('Spec cards successfully rendered in chat!');

  await page.waitForTimeout(500);

  // Take full screenshot of PRO Chat drawer
  await page.locator('#pro-chat-drawer').screenshot({ path: 'tools/screenshot_pro_chat_cards.png' });
  await page.screenshot({ path: 'tools/screenshot_full_page.png' });

  await browser.close();
  console.log('ALL VERIFICATIONS PASSED 100%!');
})();
