with open("js/app.js", "r", encoding="utf-8") as f:
    js = f.read()

old_autobuild_block = """  // Auto-Builder Modal Events
  const btnAutoBuilder = document.getElementById('btn-auto-builder');
  const autoBuilderModal = document.getElementById('auto-builder-modal');
  const autoBuilderClose = document.getElementById('auto-builder-close-btn');
  const autoBuildConfirmBtn = document.getElementById('auto-build-confirm-btn');
  const autoBudgetInput = document.getElementById('auto-budget-input');
  
  if (btnAutoBuilder) {
    btnAutoBuilder.addEventListener('click', () => {
      openModal(autoBuilderModal);
    });
  }
  if (autoBuilderClose) {
    autoBuilderClose.addEventListener('click', () => closeModal(autoBuilderModal));
  }
  if (autoBuildConfirmBtn) {
    autoBuildConfirmBtn.addEventListener('click', () => {
      const budget = parseInt(autoBudgetInput.value, 10);
      if (isNaN(budget) || budget < 500) {
        alert('Please enter a budget of at least $500.');
        return;
      }
      generateAutoBuild(budget);
      closeModal(autoBuilderModal);
    });
  }"""

new_autobuild_block = """  // Smooth Floating Popover for Auto-Builder (No intrusive modal)
  const btnAutoBuilder = document.getElementById('btn-auto-builder');
  const autobuildPopover = document.getElementById('autobuild-popover');
  const popoverCloseBtn = document.getElementById('autobuild-popover-close');
  const budgetRange = document.getElementById('auto-budget-range');
  const budgetDisplay = document.getElementById('budget-display-val');
  const autoBuildConfirmBtn = document.getElementById('auto-build-confirm-btn');
  const quickBudgetBtns = document.querySelectorAll('.quick-budget-btn');
  const resChips = document.querySelectorAll('.res-chip');

  if (btnAutoBuilder && autobuildPopover) {
    btnAutoBuilder.addEventListener('click', (e) => {
      e.stopPropagation();
      autobuildPopover.classList.toggle('hidden');
    });

    if (popoverCloseBtn) {
      popoverCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        autobuildPopover.classList.add('hidden');
      });
    }

    // Budget slider sync
    if (budgetRange && budgetDisplay) {
      budgetRange.addEventListener('input', () => {
        const val = budgetRange.value;
        budgetDisplay.textContent = `$${val}`;
        quickBudgetBtns.forEach(btn => {
          btn.classList.toggle('active', btn.getAttribute('data-val') === val);
        });
      });
    }

    // Quick budget chips
    quickBudgetBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const val = btn.getAttribute('data-val');
        if (budgetRange) budgetRange.value = val;
        if (budgetDisplay) budgetDisplay.textContent = `$${val}`;
        quickBudgetBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Resolution chips
    resChips.forEach(chip => {
      chip.addEventListener('click', (e) => {
        e.stopPropagation();
        resChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
      });
    });

    // Generate action
    if (autoBuildConfirmBtn) {
      autoBuildConfirmBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const budget = budgetRange ? parseInt(budgetRange.value, 10) : 1200;
        pushHistory();
        generateAutoBuild(budget);
        autobuildPopover.classList.add('hidden');
      });
    }

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!autobuildPopover.contains(e.target) && e.target !== btnAutoBuilder) {
        autobuildPopover.classList.add('hidden');
      }
    });
  }"""

import re
# Regex replace in case string whitespace differs
pattern = r'  // Auto-Builder Modal Events.*?closeModal\(autoBuilderModal\);\s*\}\);\s*\}'
if re.search(pattern, js, re.DOTALL):
    js = re.sub(pattern, new_autobuild_block, js, flags=re.DOTALL)
    print("Replaced old modal logic with smooth popover logic in app.js!")
else:
    print("Pattern not matched directly, appending logic...")
    js += "\n" + new_autobuild_block

with open("js/app.js", "w", encoding="utf-8") as f:
    f.write(js)

print("Updated js/app.js successfully!")
