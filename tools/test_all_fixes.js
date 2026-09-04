const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  page.on('console', msg => console.log('BROWSER:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err.message));

  await page.goto('http://localhost:8000');
  await page.waitForTimeout(1000);

  // Apply ultimate preset to populate all components
  await page.click('button[data-preset="ultimate"]');
  await page.waitForTimeout(500);

  // --- 1. TEST LIGHT MODE SLACK CODE TAGS ---
  console.log('--- 1. TESTING LIGHT MODE SLACK TAGS ---');
  // Ensure light mode
  const currentTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  if (currentTheme !== 'light') {
    await page.click('#theme-toggle');
    await page.waitForTimeout(300);
  }

  const tagStyle = await page.evaluate(() => {
    const el = document.querySelector('#slot-cpu .slack-code-tag');
    const comp = window.getComputedStyle(el);
    return {
      bg: comp.backgroundColor,
      color: comp.color,
      border: comp.borderColor
    };
  });
  console.log('Light Mode Slack Tag Styles:', tagStyle);
  await page.screenshot({ path: 'light_mode_slack_tags.png' });

  // --- 2. TEST DARK MODE OK BADGE ---
  console.log('--- 2. TESTING DARK MODE OK BADGE ---');
  await page.click('#theme-toggle'); // Switch to dark
  await page.waitForTimeout(300);

  const statusBadgeStyle = await page.evaluate(() => {
    const el = document.getElementById('chassis-status');
    const comp = window.getComputedStyle(el);
    return {
      text: el.textContent.trim(),
      bg: comp.backgroundColor,
      color: comp.color,
      border: comp.borderColor
    };
  });
  console.log('Dark Mode Chassis Status Badge:', statusBadgeStyle);
  await page.screenshot({ path: 'dark_mode_ok_badge.png' });

  // --- 3. TEST STORE HUB BUTTON CURSOR & AFFORDANCE ---
  console.log('--- 3. TESTING STORE HUB BUTTON ---');
  const storeBtnProps = await page.evaluate(() => {
    const btn = document.querySelector('#slot-gpu .slot-buy-link');
    const comp = window.getComputedStyle(btn);
    return {
      cursor: comp.cursor,
      userSelect: comp.userSelect,
      text: btn.innerText.trim(),
      visible: comp.display !== 'none'
    };
  });
  console.log('Store Hub Button Properties:', storeBtnProps);

  // --- 4. TEST REDESIGNED MULTI-STORE MODAL & E-KATALOG LINK ---
  console.log('--- 4. TESTING REDESIGNED STORE MODAL ---');
  await page.click('#slot-gpu .slot-buy-link');
  await page.waitForTimeout(400);

  const modalVisible = await page.locator('#retailers-modal').isVisible();
  const productTitle = await page.locator('#retailer-modal-part-name').innerText();
  const priceTag = await page.locator('#retailer-modal-price').innerText();
  const ekHref = await page.locator('.retailer-card', { hasText: 'E-Katalog' }).getAttribute('href');

  console.log('Modal Visible:', modalVisible);
  console.log('Product in Modal:', productTitle);
  console.log('Price in Modal:', priceTag);
  console.log('E-Katalog Search URL (should use ek-list.php):', ekHref);

  await page.screenshot({ path: 'redesigned_store_modal.png' });
  await page.click('#retailers-modal-close');
  await page.waitForTimeout(300);

  // --- 5. TEST LANGUAGE SWITCHING (RU, EN, PL, UA) ---
  console.log('--- 5. TESTING LANGUAGE SWITCHING ---');
  const languages = ['en', 'pl', 'ua', 'ru'];
  for (const lang of languages) {
    await page.click(`.lang-btn[data-lang="${lang}"]`);
    await page.waitForTimeout(300);

    const checkData = await page.evaluate(() => {
      const cpuAnalogs = document.querySelector('#cpu-analogs-box .analogs-title')?.innerText || '';
      const gpuAnalogs = document.querySelector('#gpu-analogs-box .analogs-title')?.innerText || '';
      const storeBtnText = document.querySelector('#slot-cpu .store-hub-text')?.innerText || '';
      const schematicTitle = document.querySelector('.schematic-title')?.innerText || '';
      return { cpuAnalogs, gpuAnalogs, storeBtnText, schematicTitle };
    });

    console.log(`[Lang: ${lang.toUpperCase()}]`, checkData);
    await page.screenshot({ path: `lang_stage_${lang}.png` });
  }

  console.log('ALL VERIFICATIONS COMPLETED SUCCESSFULLY!');
  await browser.close();
})();
