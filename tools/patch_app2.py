import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Add GPU alternatives logic inside updateUI
gpu_alt_logic = '''
    // Update GPU Alternatives
    const gpuAltContainer = document.getElementById('gpu-alternatives');
    if (gpuAltContainer) {
      if (cat === 'gpu' && buildState.gpu) {
        const currentPrice = buildState.gpu.price;
        const currentTier = buildState.gpu.tier;
        // Find analogs: same or adjacent tier, within 20% price, not the same ID
        const analogs = PARTS_DATABASE.gpu.filter(g => 
          g.id !== buildState.gpu.id && 
          Math.abs(g.tier - currentTier) <= 1 && 
          g.price >= currentPrice * 0.8 && g.price <= currentPrice * 1.3
        ).slice(0, 2);
        
        if (analogs.length > 0) {
          gpuAltContainer.innerHTML = <span data-i18n="misc.analogs">Analogs:</span>  + 
            analogs.map(a => <button class="gpu-alt-btn" onclick="window.selectAltGPU('')"> ({Math.round(a.price * EXCHANGE_RATES[currentCurrency])})</button>).join(' ');
          gpuAltContainer.classList.remove('hidden');
        } else {
          gpuAltContainer.classList.add('hidden');
        }
      } else if (cat === 'gpu' && !buildState.gpu) {
        gpuAltContainer.classList.add('hidden');
      }
    }
'''

# Inject right after updating standard slot stuff
js = js.replace('        const buyLink = slotCard.querySelector(\'.slot-buy-link\');', gpu_alt_logic + '\n        const buyLink = slotCard.querySelector(\'.slot-buy-link\');')

# Add window.selectAltGPU globally
select_alt_logic = '''
window.selectAltGPU = function(id) {
  const part = PARTS_DATABASE.gpu.find(p => p.id === id);
  if (part) {
    pushHistory();
    buildState.gpu = part;
    updateUI();
  }
};
'''
js += '\n' + select_alt_logic

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("GPU alternatives logic injected")
