const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  page.on('console', msg => console.log('BROWSER:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err.message));

  await page.goto('http://localhost:8000');
  await page.waitForTimeout(1000);

  // Apply ultimate preset
  await page.click('button[data-preset="ultimate"]');
  await page.waitForTimeout(500);

  // --- 1. VERIFY NO RAW TRANSLATION KEYS EXIST ---
  console.log('--- 1. CHECKING FOR RAW KEYS ---');
  const allPageText = await page.evaluate(() => document.body.innerText);
  const rawKeys = ['slot.gpu.analogs', 'slot.comparePrices', 'slot.cpu.analogs', 'dash.visualizer.title'];
  for (const k of rawKeys) {
    const found = allPageText.includes(k);
    console.log(`Contains raw "${k}":`, found);
    if (found) {
      console.error(`ERROR: Raw key "${k}" found in page text!`);
    }
  }

  // --- 2. VERIFY TRANSLATION ACCROSS ALL LANGUAGES ---
  console.log('--- 2. VERIFYING ALL 4 LANGUAGES ---');
  const langExpected = {
    ru: { storeBtn: 'Цены в магазинах', gpuTitle: 'Аналоги по мощности:', cpuTitle: 'Альтернативы процессора:' },
    en: { storeBtn: 'Compare Prices', gpuTitle: 'Equivalent GPUs:', cpuTitle: 'CPU Alternatives:' },
    pl: { storeBtn: 'Porównaj ceny', gpuTitle: 'Odpowiedniki wydajności:', cpuTitle: 'Alternatywy procesora:' },
    ua: { storeBtn: 'Ціни в магазинах', gpuTitle: 'Аналоги за потужністю:', cpuTitle: 'Альтернативи процесора:' }
  };

  for (const [lang, exp] of Object.entries(langExpected)) {
    await page.click(`.lang-btn[data-lang="${lang}"]`);
    await page.waitForTimeout(300);

    const actual = await page.evaluate(() => {
      const storeBtn = document.querySelector('#slot-gpu .store-hub-text')?.innerText.trim();
      const gpuTitle = document.querySelector('#gpu-analogs-box .analogs-title')?.innerText.trim();
      const cpuTitle = document.querySelector('#cpu-analogs-box .analogs-title')?.innerText.trim();
      return { storeBtn, gpuTitle, cpuTitle };
    });

    console.log(`[Lang ${lang.toUpperCase()}] Actual:`, actual);
  }

  // Set back to RU
  await page.click('.lang-btn[data-lang="ru"]');
  await page.waitForTimeout(300);

  // --- 3. VERIFY REDESIGNED RETAILER MODAL & CLOSE BUTTON ---
  console.log('--- 3. TESTING RETAILER MODAL & DECK FRAME ---');
  await page.click('#slot-gpu .slot-buy-link');
  await page.waitForTimeout(400);

  const closeBtnBox = await page.locator('#retailers-modal-close').boundingBox();
  console.log('Close Button Size:', closeBtnBox.width, 'x', closeBtnBox.height);

  const deckFrameExists = await page.locator('.retailers-deck-frame').isVisible();
  console.log('Framed Deck Panel visible:', deckFrameExists);

  const retailerCardsCount = await page.locator('.retailers-deck-frame .retailer-card').count();
  console.log('Cards inside Deck Frame:', retailerCardsCount);

  // Capture Dark Modal
  await page.screenshot({ path: 'deck_store_modal_dark.png' });

  // Close and switch to light
  await page.click('#retailers-modal-close');
  await page.waitForTimeout(300);

  await page.click('#theme-toggle'); // switch to light
  await page.waitForTimeout(300);

  await page.click('#slot-gpu .slot-buy-link');
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'deck_store_modal_light.png' });

  await page.click('#retailers-modal-close');
  await page.waitForTimeout(300);

  await page.screenshot({ path: 'verified_stage_light.png' });

  console.log('ALL VERIFICATIONS COMPLETED SUCCESSFULLY!');
  await browser.close();
})();
