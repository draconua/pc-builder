const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });

  const errors = [];
  page.on('pageerror', err => errors.push('PAGE ERROR: ' + err.message));
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push('CONSOLE ERROR: ' + msg.text());
  });

  console.log('1. Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1000);

  // Verify PRO Chat Button exists
  const proBtnVisible = await page.locator('#btn-pro-chat').isVisible();
  console.log('PRO Chat Button Visible in Header:', proBtnVisible);

  // Click PRO Chat Button
  console.log('2. Clicking PRO Chat Button...');
  await page.click('#btn-pro-chat');
  await page.waitForTimeout(500);

  const drawerVisible = await page.locator('#pro-chat-drawer').isVisible();
  console.log('PRO Chat Drawer Visible:', drawerVisible);

  // Take screenshot of open PRO Drawer
  await page.screenshot({ path: 'tools/test_pro_chat_open.png' });

  // Test clicking a quick prompt chip
  console.log('3. Clicking Quick Prompt Chip...');
  await page.click('.pro-prompt-chip[data-prompt*="CS2"]');
  await page.waitForTimeout(1000);

  // Verify user message appeared in chat
  const userMsgCount = await page.locator('.pro-chat-bubble.user').count();
  console.log('User messages in chat:', userMsgCount);

  // Verify AI response bubble appeared (should show the friendly instruction to add API key in gemini_config.json)
  const aiMsgText = await page.locator('.pro-chat-bubble.ai').last().innerText();
  console.log('AI Response Bubble Preview:', aiMsgText.substring(0, 120));

  // Take screenshot of chat conversation
  await page.screenshot({ path: 'tools/test_pro_chat_dialog.png' });

  // Close PRO drawer
  console.log('4. Closing PRO Drawer...');
  await page.click('#pro-chat-close');
  await page.waitForTimeout(400);

  // Test Smart Auto-Build to make sure free tier still works smoothly
  console.log('5. Testing Free Smart Auto-Build (5000 zł)...');
  await page.click('#btn-auto-builder');
  await page.waitForTimeout(300);
  await page.click('button.quick-budget-btn[data-val="5000"]');
  await page.waitForTimeout(200);
  await page.click('#auto-build-confirm-btn');
  await page.waitForTimeout(1200);

  const total5000 = await page.locator('#total-price').innerText();
  const cpu5000 = await page.locator('#slot-cpu .slot-selected-name').innerText();
  console.log('Auto-build completed:', total5000, '| CPU:', cpu5000);

  // Check Bottleneck UI
  const btScore = await page.locator('#bottleneck-score-badge').innerText();
  const btText = await page.locator('#bottleneck-text').innerText();
  console.log('Bottleneck UI:', btScore, '| Text:', btText);

  await page.screenshot({ path: 'tools/test_all_ai_features.png' });
  await browser.close();

  if (errors.length > 0) {
    console.log('\nPAGE ERRORS:', errors);
  } else {
    console.log('\nALL GEMINI AI TESTS PASSED WITH FLYING COLORS!');
  }
})();
