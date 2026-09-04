import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    js = f.read()

# 1. Add History state variables
history_vars = '''
// History State for Undo
const historyStack = [];
let isUndoAction = false;

function pushHistory() {
  if (isUndoAction) {
    isUndoAction = false;
    return;
  }
  const snapshot = {
    cpu: buildState.cpu?.id,
    motherboard: buildState.motherboard?.id,
    cooler: buildState.cooler?.id,
    ram: buildState.ram?.id,
    gpu: buildState.gpu?.id,
    ssd: buildState.ssd?.id,
    hdd: buildState.hdd?.id,
    psu: buildState.psu?.id,
    case: buildState.case?.id,
    monitor: buildState.monitor?.id
  };
  historyStack.push(snapshot);
  if (historyStack.length > 20) historyStack.shift();
}

function undo() {
  if (historyStack.length < 2) return;
  historyStack.pop(); // remove current state
  const prevState = historyStack[historyStack.length - 1];
  isUndoAction = true;
  
  // Load previous state
  Object.keys(buildState).forEach(cat => {
    buildState[cat] = null;
    if (prevState[cat]) {
      const part = PARTS_DATABASE[cat].find(p => p.id === prevState[cat]);
      if (part) buildState[cat] = part;
    }
  });
  updateUI();
}
'''
js = js.replace('// Application State', history_vars + '\n// Application State')

# 2. Add pushHistory() call inside updateUI() at the very beginning
js = js.replace('function updateUI() {', 'function updateUI() {\n  pushHistory();')

# 3. Add Undo button to toolbar
# Actually, I'll bind Ctrl+Z to undo.
keys_listener = '''
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'z') {
      undo();
    }
  });
'''
js = js.replace('  // Drawer events', keys_listener + '\n  // Drawer events')

# 4. Auto-Builder Logic
auto_builder_logic = '''
  // Auto-Builder Modal Events
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
        alert('Please enter a budget of at least .');
        return;
      }
      generateAutoBuild(budget);
      closeModal(autoBuilderModal);
    });
  }

  function generateAutoBuild(budgetUSD) {
    // A simple heuristic-based auto-builder
    // GPU gets ~40% of budget, CPU ~20%, MB ~12%, RAM ~8%, SSD ~8%, PSU ~8%, Case ~8%
    
    const getBest = (cat, maxPrice) => {
      const parts = PARTS_DATABASE[cat].filter(p => p.price <= maxPrice).sort((a, b) => b.price - a.price);
      return parts.length > 0 ? parts[0] : PARTS_DATABASE[cat].sort((a, b) => a.price - b.price)[0];
    };

    const gpu = getBest('gpu', budgetUSD * 0.42);
    const cpu = getBest('cpu', budgetUSD * 0.22);
    
    // Pick compatible MB
    const mbPool = PARTS_DATABASE.motherboard.filter(m => m.socket === cpu.socket && m.price <= budgetUSD * 0.15);
    const mb = mbPool.sort((a,b) => b.price - a.price)[0] || PARTS_DATABASE.motherboard.find(m => m.socket === cpu.socket);
    
    // Pick compatible RAM
    const ramPool = PARTS_DATABASE.ram.filter(r => r.ramType === mb.ramType && r.price <= budgetUSD * 0.10);
    const ram = ramPool.sort((a,b) => b.price - a.price)[0] || PARTS_DATABASE.ram.find(r => r.ramType === mb.ramType);

    const ssd = getBest('ssd', budgetUSD * 0.10);
    const psu = getBest('psu', budgetUSD * 0.10);
    const pcCase = getBest('case', budgetUSD * 0.10);
    const cooler = getBest('cooler', budgetUSD * 0.08);

    buildState = { cpu, motherboard: mb, cooler, ram, gpu, ssd, psu, case: pcCase, hdd: null, monitor: null };
    updateUI();
  }
'''
js = js.replace('// Initialize Application', auto_builder_logic + '\n// Initialize Application')

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("app.js updated")
