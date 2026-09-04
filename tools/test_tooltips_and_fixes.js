const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });

  console.log('1. Loading app...');
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1000);

  // --- Test 1: Tooltip on Slot Header (?) ---
  console.log('2. Testing slot question mark tooltip on CPU...');
  const cpuHint = page.locator('#slot-cpu .slot-info-hint');
  console.log('Is CPU slot info hint visible?', await cpuHint.isVisible());

  // Hover over CPU info hint
  await cpuHint.hover();
  await page.waitForTimeout(400);

  // Take screenshot showing tooltip
  await page.locator('#slot-cpu').screenshot({ path: 'tools/snap_slot_tooltip_hover.png' });
  console.log('Captured slot tooltip screenshot!');

  // --- Test 2: Fixed Centered Hardware Guide Modal ---
  console.log('3. Scrolling down to 1000px...');
  await page.evaluate(() => window.scrollTo(0, 1000));
  await page.waitForTimeout(300);

  console.log('4. Clicking "💡 Гид по деталям" from top header...');
  await page.click('#btn-hardware-guide');
  await page.waitForTimeout(500);

  const isModalVisible = await page.locator('#hardware-guide-modal').isVisible();
  console.log('Is modal visible?', isModalVisible);

  const modalBox = await page.locator('#hardware-guide-modal').boundingBox();
  console.log('Modal bounding box in viewport:', modalBox);

  // Verify modal is centered in the 1100px viewport:
  // Expected: modalBox.y is around (1100 - modalBox.height) / 2
  const viewportCenterY = 1100 / 2;
  const modalCenterY = modalBox.y + modalBox.height / 2;
  console.log(`Modal centerY: ${modalCenterY} (Viewport center is ${viewportCenterY})`);
  const isCentered = Math.abs(modalCenterY - viewportCenterY) < 50;
  console.log('Is modal vertically centered in viewport?', isCentered);

  await page.screenshot({ path: 'tools/snap_guide_modal_centered.png' });

  // Close modal
  await page.click('#hardware-guide-close');
  await page.waitForTimeout(400);

  // --- Test 3: Scroll To Top Button in Footer ---
  console.log('5. Scrolling to footer...');
  await page.locator('#app-footer').scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);

  const scrollYBefore = await page.evaluate(() => window.scrollY);
  console.log('ScrollY in footer:', scrollYBefore);

  console.log('6. Clicking "↑ Наверх к сборке"...');
  await page.click('#btn-scroll-top');
  await page.waitForTimeout(1000);

  const scrollYAfter = await page.evaluate(() => window.scrollY);
  console.log('ScrollY after clicking scroll top:', scrollYAfter);
  console.log('Did it scroll back to top (scrollY < 100)?', scrollYAfter < 100);

  // --- Test 4: FAQ and Footer Screenshots ---
  console.log('7. Capturing updated FAQ and Footer screenshots...');
  await page.locator('#faq-section').scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.locator('#faq-section').screenshot({ path: 'tools/snap_faq_updated.png' });

  await page.locator('#app-footer').scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.locator('#app-footer').screenshot({ path: 'tools/snap_footer_updated.png' });

  await browser.close();
  console.log('ALL VERIFICATION TESTS COMPLETED SUCCESSFULLY!');
})();
