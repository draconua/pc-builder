with open("js/app.js", "r", encoding="utf-8") as f:
    js = f.read()

# 1. Add initProChat() and initAiSynergyCheck() into init()
old_init = """function init() {
  initI18n();
  initTheme();
  initCurrency();
  setupEventListeners();
  initDevCabinet();"""

new_init = """function init() {
  initI18n();
  initTheme();
  initCurrency();
  setupEventListeners();
  initDevCabinet();
  initProChat();
  initAiSynergyCheck();"""

if old_init in js:
    js = js.replace(old_init, new_init, 1)
    print("Added initProChat and initAiSynergyCheck directly into init().")
else:
    print("Warning: old_init not found.")

# 2. Fix startup trigger
old_start = "window.addEventListener('DOMContentLoaded', init);"
new_start = """if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', init);
} else {
  init();
}"""

if old_start in js:
    js = js.replace(old_start, new_start, 1)
    print("Fixed startup readyState trigger.")
else:
    print("Warning: old_start not found.")

# 3. Clean up duplicate DOMContentLoaded listener around line 2830
old_dupe = """// Ensure initProChat runs on startup
document.addEventListener('DOMContentLoaded', () => {
  initProChat();
  initAiSynergyCheck();
});"""

if old_dupe in js:
    js = js.replace(old_dupe, "// PRO Chat & AI Synergy initialized in init()", 1)
    print("Removed duplicate DOMContentLoaded listener.")

with open("js/app.js", "w", encoding="utf-8") as f:
    f.write(js)
