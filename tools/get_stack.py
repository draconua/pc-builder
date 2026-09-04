with open("test_browser.js", "r") as f:
    pass

# We can run test_browser with full error stack trace
code = """
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('pageerror', err => console.log('FULL_STACK:', err.stack));
  await page.goto('http://localhost:8000');
  await page.waitForTimeout(1000);
  await browser.close();
})();
"""
with open("test_stack.js", "w") as f:
    f.write(code)
