with open("js/app.js", "r", encoding="utf-8") as f:
    js = f.read()

old_block = """  // Save Modal Confirm
  elements.saveConfirmBtn.addEventListener('click', confirmSaveBuild);

  // Copy Specification
  elements.btnCopySpec.addEventListener('click', copySpecification);
  elements.btnPrint.addEventListener('click', () => window.print());

  // FPS Resolution selector change
  elements.fpsResolution.addEventListener('change', () => {
    updateFpsPanel();
  });
  
  // Close modals clicking outside
  [elements.exportModal, elements.saveModal, elements.comparisonModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });"""

new_block = """  // Save Modal Confirm
  if (elements.saveConfirmBtn) elements.saveConfirmBtn.addEventListener('click', confirmSaveBuild);

  // Copy Specification & Print
  if (elements.btnCopySpec) elements.btnCopySpec.addEventListener('click', copySpecification);
  if (elements.btnPrint) elements.btnPrint.addEventListener('click', () => window.print());

  // FPS Resolution selector change (if present)
  if (elements.fpsResolution) {
    elements.fpsResolution.addEventListener('change', () => {
      updateFpsPanel();
    });
  }
  
  // Close modals clicking outside
  [elements.exportModal, elements.saveModal, elements.comparisonModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modal);
      });
    }
  });"""

js = js.replace(old_block, new_block)

with open("js/app.js", "w", encoding="utf-8") as f:
    f.write(js)

print("Protected saveConfirmBtn, btnCopySpec, btnPrint, fpsResolution and modal listeners!")
