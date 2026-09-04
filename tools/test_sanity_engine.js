const { chromium } = require('playwright');

const NEGATIVE_KEYWORDS = {
  cpu: ['komputer', 'actina', 'g4m3r', 'mad dog', 'zestaw', 'desktop', 'laptop', 'notebook', 'chłodzenie', 'cooler', 'pasta'],
  gpu: ['komputer', 'actina', 'g4m3r', 'mad dog', 'zestaw', 'desktop', 'laptop', 'kabel', 'uchwyt', 'wspornik', 'riser', 'obudowa na'],
  motherboard: ['komputer', 'actina', 'zestaw', 'laptop'],
  ram: ['komputer', 'laptop', 'dysk'],
  ssd: ['obudowa na dysk', 'kieszeń', 'adapter', 'komputer'],
  psu: ['komputer', 'przedłużka', 'kabel'],
  cooler: ['komputer', 'laptop'],
  case: ['zasilacz do obudowy', 'wentylator'],
  monitor: ['ramię', 'uchwyt', 'uchwyt do monitora', 'osłona']
};

function isSanityPriceValid(itemTitle, itemPrice, baselinePLN, category) {
  if (!itemPrice || itemPrice <= 0) return { valid: false, reason: 'zero_price' };
  const titleLower = (itemTitle || '').toLowerCase();

  // 1. Negative keywords
  const negs = NEGATIVE_KEYWORDS[category] || [];
  for (const word of negs) {
    if (titleLower.includes(word)) {
      return { valid: false, reason: `negative_keyword_${word}` };
    }
  }

  // 2. Deviation sanity check: price cannot be > 2.2x or < 0.35x of baseline
  if (baselinePLN && baselinePLN > 0) {
    if (itemPrice > baselinePLN * 2.2) {
      return { valid: false, reason: `price_too_high (${itemPrice} vs base ${baselinePLN})` };
    }
    if (itemPrice < baselinePLN * 0.35) {
      return { valid: false, reason: `price_too_low (${itemPrice} vs base ${baselinePLN})` };
    }
  }

  return { valid: true };
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    locale: 'pl-PL'
  });

  const testCases = [
    { name: 'AMD Ryzen 7 7800X3D', category: 'cpu', basePLN: 1450 },
    { name: 'AMD Ryzen 5 5500', category: 'cpu', basePLN: 380 }
  ];

  for (const tc of testCases) {
    console.log(`\n--- Testing ${tc.name} (Base: ${tc.basePLN} zł) ---`);
    await page.goto('https://www.ceneo.pl/;szukaj-' + encodeURIComponent(tc.name), { timeout: 15000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000); // Wait for meta refresh

    const items = await page.$$eval('.cat-prod-row, .grid-item, .category-list-body .cat-prod-row', rows => {
      return rows.slice(0, 8).map(r => ({
        title: r.querySelector('.cat-prod-row__name, a.js_search-link, strong')?.innerText?.trim(),
        priceStr: r.querySelector('.price-format .value, .price .value')?.innerText?.trim(),
        pennyStr: r.querySelector('.price-format .penny, .price .penny')?.innerText?.trim() || ''
      }));
    });

    let chosen = null;
    for (const item of items) {
      const p = item.priceStr ? parseFloat(item.priceStr.replace(/\s+/g, '').replace(',', '.')) : null;
      const check = isSanityPriceValid(item.title, p, tc.basePLN, tc.category);
      console.log(`Candidate: "${item.title}" | ${p} zł -> ${check.valid ? 'VALID' : 'REJECT: ' + check.reason}`);
      if (check.valid && !chosen) {
        chosen = { title: item.title, price: p };
      }
    }

    console.log(`🏆 RESULT for ${tc.name}:`, chosen ? `${chosen.price} zł ("${chosen.title}")` : 'NONE FOUND');
  }

  await browser.close();
})();
