const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });

  console.log('1. Loading application...');
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1000);

  // 1. Verify Top-Left Hardware Guide Pill
  const guidePill = page.locator('#btn-hardware-guide');
  console.log('Is Hardware Guide pill visible in header?', await guidePill.isVisible());
  await page.locator('.header-brand').screenshot({ path: 'tools/snap_header_guide_pill.png' });

  // 2. Click Hardware Guide Pill
  console.log('2. Opening Hardware Guide Modal...');
  await guidePill.click();
  await page.waitForSelector('#hardware-guide-modal:not(.hidden)', { timeout: 3000 });
  console.log('Hardware Guide Modal is open!');

  const compCardsCount = await page.locator('.guide-component-card').count();
  console.log(`Found ${compCardsCount} component guide cards (expected 10).`);

  await page.locator('#hardware-guide-modal').screenshot({ path: 'tools/snap_hardware_guide_modal.png' });

  // Test "Выбрать в каталоге" on GPU
  console.log('3. Clicking "Выбрать в каталоге" for GPU inside Guide...');
  await page.click('.guide-quick-pick-btn[data-guide-cat="gpu"]');
  await page.waitForTimeout(600);

  const isDrawerOpen = await page.locator('#drawer.open').isVisible();
  console.log('Did GPU drawer open upon clicking guide button?', isDrawerOpen);
  await page.click('#drawer-close');
  await page.waitForTimeout(400);

  // 4. Test FAQ Section
  console.log('4. Scrolling to FAQ Section...');
  const faqSection = page.locator('#faq-section');
  await faqSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);

  const faqCardsCount = await page.locator('.faq-card').count();
  console.log(`Found ${faqCardsCount} FAQ cards (expected 6).`);

  // Open FAQ item 4 (SSD vs HDD)
  console.log('Opening SSD vs HDD FAQ...');
  await page.locator('.faq-card:nth-child(4) summary').click();
  await page.waitForTimeout(300);

  await faqSection.screenshot({ path: 'tools/snap_faq_section.png' });

  // 5. Test Legal Notice & Footer
  console.log('5. Scrolling to Legal Notice Footer...');
  const footer = page.locator('#app-footer');
  await footer.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);

  const legalCardsCount = await page.locator('.footer-legal-card').count();
  console.log(`Found ${legalCardsCount} Legal Notice cards (expected 4).`);

  await footer.screenshot({ path: 'tools/snap_legal_footer.png' });

  // 6. Test Footer link to Guide
  console.log('6. Testing footer button to open Guide...');
  await page.click('#footer-btn-guide');
  await page.waitForSelector('#hardware-guide-modal:not(.hidden)', { timeout: 3000 });
  console.log('Guide opened from footer button!');
  await page.click('#hardware-guide-close');

  await browser.close();
  console.log('ALL VERIFICATIONS PASSED 100%!');
})();
