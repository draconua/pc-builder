with open("js/app.js", "r", encoding="utf-8") as f:
    js = f.read()

old_elements = """  // Drawer
  drawerOverlay: document.getElementById('drawer-overlay'),
  drawer: document.getElementById('drawer'),
  drawerTitle: document.getElementById('drawer-title'),
  drawerClose: document.getElementById('drawer-close'),
  partsSearch: document.getElementById('parts-search'),
  toggleCompat: document.getElementById('toggle-compat'),
  sortSelect: document.getElementById('sort-select'),
  partsList: document.getElementById('parts-list'),

  // Modals
  exportModal: document.getElementById('export-modal'),
  exportCloseBtn: document.getElementById('modal-close-btn'),
  exportTextarea: document.getElementById('export-textarea'),
  btnCopySpec: document.getElementById('btn-copy-spec'),
  btnPrint: document.getElementById('btn-print'),

  saveModal: document.getElementById('save-modal'),
  saveCloseBtn: document.getElementById('save-close-btn'),
  saveNameInput: document.getElementById('save-name-input'),
  saveConfirmBtn: document.getElementById('save-confirm-btn'),

  comparisonModal: document.getElementById('comparison-modal'),
  comparisonClose: document.getElementById('comparison-close'),
  comparisonContent: document.getElementById('comparison-content')"""

new_elements = """  // Drawer
  drawerOverlay: document.getElementById('drawer-overlay'),
  drawer: document.getElementById('drawer'),
  drawerTitle: document.getElementById('drawer-title'),
  drawerClose: document.getElementById('drawer-close'),
  partsSearch: document.getElementById('parts-search'),
  toggleCompat: document.getElementById('toggle-compat') || document.getElementById('filter-compat'),
  sortSelect: document.getElementById('sort-select'),
  partsList: document.getElementById('parts-list'),

  // Modals
  exportModal: document.getElementById('export-modal'),
  exportCloseBtn: document.getElementById('export-modal-close') || document.getElementById('modal-close-btn'),
  exportTextarea: document.getElementById('export-text') || document.getElementById('export-textarea'),
  btnCopySpec: document.getElementById('export-modal-copy') || document.getElementById('btn-copy-spec'),
  btnPrint: document.getElementById('btn-print'),

  saveModal: document.getElementById('save-modal'),
  saveCloseBtn: document.getElementById('save-modal-close') || document.getElementById('save-close-btn'),
  saveNameInput: document.getElementById('save-build-name') || document.getElementById('save-name-input'),
  saveConfirmBtn: document.getElementById('save-modal-confirm') || document.getElementById('save-confirm-btn'),

  comparisonModal: document.getElementById('comparison-modal'),
  comparisonClose: document.getElementById('comparison-modal-close') || document.getElementById('comparison-close'),
  comparisonContent: document.getElementById('comparison-content')"""

js = js.replace(old_elements, new_elements)

# Ensure event listeners guard against null elements
defensive_guards = """  // Drawer events
  if (elements.drawerClose) elements.drawerClose.addEventListener('click', closeDrawer);
  if (elements.drawerOverlay) elements.drawerOverlay.addEventListener('click', closeDrawer);
  if (elements.partsSearch) {
    elements.partsSearch.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderPartsList();
    });
  }
  if (elements.toggleCompat) {
    elements.toggleCompat.addEventListener('change', (e) => {
      hideIncompatible = e.target.checked;
      renderPartsList();
    });
  }
  if (elements.sortSelect) {
    elements.sortSelect.addEventListener('change', (e) => {
      sortOrder = e.target.value;
      renderPartsList();
    });
  }

  // Modal closes
  if (elements.exportCloseBtn) elements.exportCloseBtn.addEventListener('click', () => closeModal(elements.exportModal));
  if (elements.saveCloseBtn) elements.saveCloseBtn.addEventListener('click', () => closeModal(elements.saveModal));
  if (elements.comparisonClose) elements.comparisonClose.addEventListener('click', () => closeModal(elements.comparisonModal));"""

import re
pattern_guards = r'  // Drawer events.*?elements\.comparisonClose\.addEventListener\(\'click\', \(\) => closeModal\(elements\.comparisonModal\)\);'
js = re.sub(pattern_guards, defensive_guards, js, flags=re.DOTALL)

with open("js/app.js", "w", encoding="utf-8") as f:
    f.write(js)

print("Updated elements and added defensive guards in app.js!")
