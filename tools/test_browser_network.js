const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });

  page.on('console', msg => console.log('BROWSER:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err));

  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1000);

  await page.click('#btn-pro-chat');
  await page.waitForTimeout(400);

  console.log('Sending message via input...');
  await page.fill('#pro-chat-input', 'Собери тихий ПК для CS2 за 5000 злотых');
  
  const responsePromise = page.waitForResponse(res => res.url().includes('/api/ai-chat'), { timeout: 35000 });
  await page.click('#pro-chat-send-btn');

  console.log('Waiting for network response from /api/ai-chat...');
  const res = await responsePromise;
  console.log('Got response! Status:', res.status());
  const json = await res.json();
  console.log('Response JSON ok:', json.ok);
  if (json.data) {
    console.log('Reply preview:', json.data.reply.substring(0, 150));
    console.log('Selected parts:', json.data.selectedParts);
  } else {
    console.log('Error:', json.error);
  }

  await page.waitForTimeout(1000);

  // Take screenshot of chat drawer
  await page.locator('#pro-chat-drawer').screenshot({ path: 'tools/debug_chat_drawer_rendered.png' });
  await page.screenshot({ path: 'tools/debug_full_page_rendered.png' });

  await browser.close();
  console.log('TEST SUCCEEDED!');
})();
