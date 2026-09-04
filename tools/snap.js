const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });

  console.log('Loading app...');
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1000);

  // Set balanced preset and verify bottleneck check button
  await page.click('button.preset-btn[data-preset="balanced"]');
  await page.waitForTimeout(600);

  const checkBtn = page.locator('#btn-check-ai-synergy');
  await checkBtn.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);

  console.log('Clicking "Проверить сборку с AI"...');
  await checkBtn.click();
  await page.waitForSelector('#ai-synergy-verdict-card:not(.hidden)', { timeout: 25000 });
  console.log('Synergy AI verdict card is visible!');
  await page.locator('#bottleneck-panel').screenshot({ path: 'tools/screenshot_ai_synergy_card.png' });

  // Open PRO Chat
  console.log('Opening PRO Chat...');
  await page.click('#btn-pro-chat');
  await page.waitForTimeout(500);

  console.log('Clicking CS2 prompt...');
  await page.click('.pro-prompt-chip[data-prompt*="CS2"]');
  
  console.log('Waiting for .pro-spec-card in chat...');
  await page.waitForSelector('.pro-spec-card', { timeout: 45000 });
  console.log('FOUND .pro-spec-card!');

  const count = await page.locator('.pro-spec-card').count();
  console.log('Spec cards count:', count);

  const firstCard = await page.locator('.pro-spec-card').first().innerText();
  console.log('First card preview:', firstCard);

  await page.waitForTimeout(600);
  await page.locator('#pro-chat-drawer').screenshot({ path: 'tools/screenshot_pro_chat_cards.png' });
  await page.screenshot({ path: 'tools/screenshot_full_page.png' });
  await browser.close();
  console.log('ALL SCREENSHOTS CAPTURED SUCCESSFULLY!');
})();
