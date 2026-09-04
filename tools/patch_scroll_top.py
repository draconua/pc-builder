with open("js/app.js", "r", encoding="utf-8") as f:
    js = f.read()

target = "  // Theme toggle\n  elements.themeToggle.addEventListener('click', toggleTheme);"

replacement = """  // Scroll to top button in footer
  const btnScrollTop = document.getElementById('btn-scroll-top');
  if (btnScrollTop) {
    btnScrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Theme toggle
  elements.themeToggle.addEventListener('click', toggleTheme);"""

if target in js:
    js = js.replace(target, replacement, 1)
    print("Added btnScrollTop listener in setupEventListeners.")
else:
    print("Warning: target not found.")

with open("js/app.js", "w", encoding="utf-8") as f:
    f.write(js)
