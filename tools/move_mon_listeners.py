with open("js/app.js", "r", encoding="utf-8") as f:
    js = f.read()

# 1. Remove from closeModal
misplaced = """  // Monitor panel button listeners
  const btnSelectMon = document.getElementById('btn-select-monitor');
  if (btnSelectMon) {
    btnSelectMon.addEventListener('click', (e) => {
      e.stopPropagation();
      openDrawer('monitor');
    });
  }

  const btnChangeMon = document.getElementById('btn-change-monitor');
  if (btnChangeMon) {
    btnChangeMon.addEventListener('click', (e) => {
      e.stopPropagation();
      openDrawer('monitor');
    });
  }

  const btnRemoveMon = document.getElementById('btn-remove-monitor');
  if (btnRemoveMon) {
    btnRemoveMon.addEventListener('click', (e) => {
      e.stopPropagation();
      pushHistory();
      buildState.monitor = null;
      updateUI();
    });
  }

  const btnMonStore = document.getElementById('monitor-store-hub-btn');
  if (btnMonStore) {
    btnMonStore.addEventListener('click', (e) => {
      e.stopPropagation();
      if (buildState.monitor) {
        openRetailersModal(buildState.monitor);
      }
    });
  }"""

if misplaced in js:
    js = js.replace(misplaced, "")
    print("Removed misplaced listeners from closeModal.")
else:
    print("WARNING: Could not find exact misplaced block.")

# 2. Insert into setupEventListeners
target = "setupEventListeners ends at index" # let's find the closing brace of setupEventListeners
pos = js.find("function setupEventListeners()")
brace = 0
in_func = False
end_pos = -1
for i in range(pos, len(js)):
    if js[i] == '{':
        brace += 1
        in_func = True
    elif js[i] == '}':
        brace -= 1
        if in_func and brace == 0:
            end_pos = i
            break

if end_pos != -1:
    js = js[:end_pos] + "\n" + misplaced + "\n" + js[end_pos:]
    print("Injected monitor listeners into setupEventListeners().")
    with open("js/app.js", "w", encoding="utf-8") as f:
        f.write(js)
else:
    print("ERROR: could not find end of setupEventListeners")
