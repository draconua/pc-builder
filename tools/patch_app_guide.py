with open("js/app.js", "r", encoding="utf-8") as f:
    js = f.read()

# 1. Add initHardwareGuide() to init()
old_init = """  initProChat();
  initAiSynergyCheck();"""

new_init = """  initProChat();
  initAiSynergyCheck();
  initHardwareGuide();"""

if old_init in js:
    js = js.replace(old_init, new_init, 1)
    print("Added initHardwareGuide into init().")
else:
    print("Warning: old_init not found.")

# 2. Append initHardwareGuide implementation
guide_code = """
// =============================================================
// HARDWARE ENCYCLOPEDIA & GUIDE MODAL
// =============================================================

function initHardwareGuide() {
  const btnGuide = document.getElementById('btn-hardware-guide');
  const footerBtnGuide = document.getElementById('footer-btn-guide');
  const modal = document.getElementById('hardware-guide-modal');
  const overlay = document.getElementById('hardware-guide-overlay');
  const closeBtn = document.getElementById('hardware-guide-close');

  if (!modal || !overlay) return;

  function openGuide() {
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeGuide() {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
    document.body.style.overflow = '';
  }

  if (btnGuide) btnGuide.addEventListener('click', openGuide);
  if (footerBtnGuide) footerBtnGuide.addEventListener('click', openGuide);
  if (closeBtn) closeBtn.addEventListener('click', closeGuide);
  overlay.addEventListener('click', closeGuide);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeGuide();
    }
  });

  // Handle "Выбрать в каталоге →" buttons inside guide cards
  modal.querySelectorAll('.guide-quick-pick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-guide-cat');
      closeGuide();
      if (cat && typeof openDrawer === 'function') {
        setTimeout(() => openDrawer(cat), 150);
      }
    });
  });
}
"""

js += "\n" + guide_code

with open("js/app.js", "w", encoding="utf-8") as f:
    f.write(js)
print("Updated js/app.js with initHardwareGuide.")
