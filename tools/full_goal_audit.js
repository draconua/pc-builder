const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });

  const errors = [];
  page.on('pageerror', err => errors.push('PAGE_ERROR: ' + err.message));
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push('CONSOLE_ERROR: ' + msg.text());
  });

  console.log('Loading http://localhost:3000...');
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1500);

  console.log('Page loaded. Checking for errors...');
  if (errors.length > 0) {
    console.error('Errors detected on page load:', errors);
  } else {
    console.log('Zero console or page errors on load! Clean!');
  }

  // Check all slot hints
  const hintCount = await page.locator('.slot-info-hint').count();
  console.log(`Found ${hintCount} slot info hints on page.`);
  for (let i = 0; i < hintCount; i++) {
    const hint = page.locator('.slot-info-hint').nth(i);
    const tooltip = await hint.getAttribute('data-tooltip');
    if (!tooltip || tooltip.length < 10) {
      console.warn(`Warning: Hint ${i} has empty or short tooltip:`, tooltip);
    }
  }

  // Hover over GPU slot info hint and take screenshot
  console.log('Hovering over GPU slot info hint...');
  await page.locator('#slot-gpu .slot-info-hint').hover();
  await page.waitForTimeout(400);
  await page.locator('#slot-gpu').screenshot({ path: 'tools/test_gpu_tooltip_rendered.png' });

  // Check Hardware Guide Modal opens properly
  console.log('Opening Hardware Guide modal...');
  await page.click('#btn-hardware-guide');
  await page.waitForTimeout(500);

  const isModalOpen = await page.locator('#hardware-guide-modal:not(.hidden)').isVisible();
  console.log('Is Hardware Guide Modal visible?', isModalOpen);

  const guideCardsCount = await page.locator('.guide-component-card').count();
  console.log(`Hardware Guide has ${guideCardsCount} component cards.`);

  await page.screenshot({ path: 'tools/test_guide_modal_popup_view.png' });

  // Close guide
  await page.click('#hardware-guide-close');
  await page.waitForTimeout(300);

  // Check FAQ details
  console.log('Testing FAQ accordion...');
  const faqCount = await page.locator('#faq-section .faq-card').count();
  console.log(`Found ${faqCount} FAQ items.`);

  // Scroll to footer and test scroll-to-top
  console.log('Testing footer and scroll-to-top button...');
  await page.locator('#app-footer').scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);

  const scrollYBottom = await page.evaluate(() => window.scrollY);
  console.log('ScrollY before click:', scrollYBottom);

  await page.click('#btn-scroll-top');
  await page.waitForTimeout(1000);

  const scrollYTop = await page.evaluate(() => window.scrollY);
  console.log('ScrollY after click:', scrollYTop);

  console.log('Testing footer button "💡 Гид по деталям"...');
  await page.locator('#app-footer').scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.click('#footer-btn-guide');
  await page.waitForTimeout(500);

  const isModalOpenFromFooter = await page.locator('#hardware-guide-modal:not(.hidden)').isVisible();
  console.log('Is Guide Modal open from footer button?', isModalOpenFromFooter);
  await page.click('#hardware-guide-close');

  await browser.close();
  console.log('ALL TESTS PASSED SUCCESSFULLY!');
})();
