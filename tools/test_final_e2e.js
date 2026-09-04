const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });

  console.log('1. Loading application...');
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1000);

  // Set up a build using preset or auto-build
  console.log('2. Setting up balanced preset build...');
  await page.click('button.preset-btn[data-preset="balanced"]');
  await page.waitForTimeout(800);

  // Verify Bottleneck panel has the new AI check button
  const aiBtn = page.locator('#btn-check-ai-synergy');
  console.log('Is "Проверить сборку с AI" button visible?', await aiBtn.isVisible());

  // Scroll to bottleneck panel and take screenshot before AI check
  await aiBtn.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'tools/test_synergy_btn_ready.png' });

  // Click "Проверить сборку с AI"
  console.log('3. Clicking "Проверить сборку с AI"...');
  await aiBtn.click();
  await page.waitForTimeout(500);

  // Verify button shows loading state
  const loadingBtnText = await page.locator('#btn-check-ai-text').innerText();
  console.log('Button state during load:', loadingBtnText);

  // Wait for AI verdict card to appear
  console.log('Waiting for AI verdict card...');
  await page.waitForSelector('#ai-synergy-verdict-card:not(.hidden)', { timeout: 35000 });
  console.log('AI verdict card appeared!');

  const statusText = await page.locator('#ai-verdict-status-tag').innerText();
  const commentaryText = await page.locator('#ai-verdict-commentary').innerText();
  const fpsText = await page.locator('#ai-verdict-fps').innerText();

  console.log('\n=== AI SYNERGY VERDICT IN PANEL ===');
  console.log('Status:', statusText);
  console.log('Commentary:', commentaryText);
  console.log('FPS potential:', fpsText);
  console.log('Has question marks/diamonds?', commentaryText.includes('') || statusText.includes(''));
  console.log('===================================\n');

  await page.screenshot({ path: 'tools/test_synergy_card_verified.png' });

  // 4. Test PRO Chat rich structured formatting
  console.log('4. Opening PRO Chat...');
  await page.click('#btn-pro-chat');
  await page.waitForTimeout(500);

  // Send CS2 prompt
  console.log('5. Clicking Quick Prompt chip for CS2...');
  await page.click('.pro-prompt-chip[data-prompt*="CS2"]');

  console.log('Waiting for AI response bubble in chat...');
  await page.waitForSelector('.pro-chat-bubble.ai:nth-child(3) .pro-spec-card', { timeout: 35000 });
  console.log('Spec cards rendered in chat!');

  const specCardsCount = await page.locator('.pro-chat-bubble.ai:nth-child(3) .pro-spec-card').count();
  console.log('Rendered spec cards count:', specCardsCount);

  const bubbleText = await page.locator('.pro-chat-bubble.ai:nth-child(3) .pro-bubble-content').innerText();
  console.log('\n=== CHAT BUBBLE SAMPLE ===');
  console.log(bubbleText.substring(0, 300));
  console.log('Has question marks/diamonds?', bubbleText.includes(''));
  console.log('Has literal \\n?', bubbleText.includes('\\n'));
  console.log('==========================\n');

  await page.screenshot({ path: 'tools/test_pro_chat_cards_formatted.png' });
  await browser.close();
  console.log('TEST COMPLETE!');
})();
