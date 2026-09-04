with open("js/app.js", "r", encoding="utf-8") as f:
    js = f.read()

dev_cabinet_js = """
// =============================================================
// DEV CABINET & LIVE PRICE PARSER INTEGRATION
// =============================================================

let devPollInterval = null;

function initDevCabinet() {
  const devModal = document.getElementById('dev-prices-modal');
  const devBtn = document.getElementById('dev-modal-btn');
  const devClose = document.getElementById('dev-modal-close');
  const btnStart = document.getElementById('btn-start-sync');
  const btnStop = document.getElementById('btn-stop-sync');
  const btnApply = document.getElementById('btn-apply-prices');
  const btnClearLogs = document.getElementById('btn-clear-logs');

  if (!devModal) return;

  function openDevModal() {
    devModal.classList.add('active');
    checkDevSyncStatus();
  }

  function closeDevModal() {
    devModal.classList.remove('active');
    if (devPollInterval) {
      clearInterval(devPollInterval);
      devPollInterval = null;
    }
  }

  if (devBtn) devBtn.addEventListener('click', openDevModal);
  if (devClose) devClose.addEventListener('click', closeDevModal);

  // Modal backdrop click
  devModal.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-backdrop')) closeDevModal();
  });

  // Global hotkey: Ctrl + Shift + D
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && (e.key === 'D' || e.key === 'd' || e.key === 'В' || e.key === 'в')) {
      e.preventDefault();
      if (devModal.classList.contains('active')) closeDevModal();
      else openDevModal();
    }
  });

  if (btnClearLogs) {
    btnClearLogs.addEventListener('click', () => {
      const term = document.getElementById('dev-terminal-logs');
      if (term) term.innerHTML = '<div class="log-line text-muted">[Лог очищен]</div>';
    });
  }

  if (btnStart) {
    btnStart.addEventListener('click', async () => {
      const catSelect = document.getElementById('dev-category-select');
      const category = catSelect ? catSelect.value : 'all';

      btnStart.classList.add('hidden');
      if (btnStop) btnStop.classList.remove('hidden');

      try {
        const res = await fetch('/api/sync-prices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category })
        });
        const data = await res.json();
        if (!data.ok) {
          alert('Ошибка запуска: ' + (data.error || 'Неизвестная ошибка'));
          btnStart.classList.remove('hidden');
          if (btnStop) btnStop.classList.add('hidden');
          return;
        }

        // Start polling
        startDevPolling();
      } catch (err) {
        console.error('Failed to start sync:', err);
        btnStart.classList.remove('hidden');
        if (btnStop) btnStop.classList.add('hidden');
      }
    });
  }

  if (btnStop) {
    btnStop.addEventListener('click', async () => {
      try {
        await fetch('/api/stop-sync', { method: 'POST' });
      } catch (e) {}
    });
  }

  if (btnApply) {
    btnApply.addEventListener('click', async () => {
      await loadAndApplyCachedPrices(true);
    });
  }

  // Auto-load cached prices on startup
  loadAndApplyCachedPrices(false);
}

function startDevPolling() {
  if (devPollInterval) clearInterval(devPollInterval);
  checkDevSyncStatus();
  devPollInterval = setInterval(checkDevSyncStatus, 1200);
}

async function checkDevSyncStatus() {
  try {
    const res = await fetch('/api/sync-status');
    if (!res.ok) return;
    const { status, cachedInfo } = await res.json();

    const statusEl = document.getElementById('dev-progress-status');
    const countEl = document.getElementById('dev-progress-count');
    const fillEl = document.getElementById('dev-progress-bar-fill');
    const statUpdated = document.getElementById('dev-stat-updated');
    const statNotFound = document.getElementById('dev-stat-notfound');
    const statCached = document.getElementById('dev-stat-cached');
    const statDate = document.getElementById('dev-stat-date');
    const termLogs = document.getElementById('dev-terminal-logs');
    const tbody = document.getElementById('dev-diff-tbody');
    const btnStart = document.getElementById('btn-start-sync');
    const btnStop = document.getElementById('btn-stop-sync');

    if (statCached) statCached.textContent = cachedInfo.count || 0;
    if (statDate) {
      statDate.textContent = cachedInfo.lastUpdated 
        ? new Date(cachedInfo.lastUpdated).toLocaleDateString('pl-PL') + ' ' + new Date(cachedInfo.lastUpdated).toLocaleTimeString('pl-PL')
        : '—';
    }

    if (status.isRunning) {
      if (btnStart) btnStart.classList.add('hidden');
      if (btnStop) btnStop.classList.remove('hidden');
      if (statusEl) statusEl.textContent = `Парсинг: ${status.currentItem || 'Запрос к Ceneo...'}`;
    } else {
      if (btnStart) btnStart.classList.remove('hidden');
      if (btnStop) btnStop.classList.add('hidden');
      if (statusEl) {
        statusEl.textContent = status.total > 0 ? 'Парсинг завершён' : 'Готов к запуску';
      }
      if (devPollInterval && !status.isRunning && status.total > 0) {
        clearInterval(devPollInterval);
        devPollInterval = null;
      }
    }

    if (countEl) countEl.textContent = `${status.current} / ${status.total}`;
    if (fillEl) {
      const pct = status.total > 0 ? Math.round((status.current / status.total) * 100) : 0;
      fillEl.style.width = `${pct}%`;
    }

    if (statUpdated) statUpdated.textContent = status.updatedCount;
    if (statNotFound) statNotFound.textContent = status.notFoundCount;

    // Render terminal logs
    if (termLogs && status.logs && status.logs.length > 0) {
      termLogs.innerHTML = status.logs.map(l => `<div class="log-line">${escapeHtml(l)}</div>`).join('');
      termLogs.scrollTop = termLogs.scrollHeight;
    }

    // Render diff table
    if (tbody && status.results && status.results.length > 0) {
      tbody.innerHTML = status.results.map(r => {
        let diffClass = 'diff-neutral';
        let diffText = '0 zł';
        if (r.diff < 0) {
          diffClass = 'diff-negative';
          diffText = `${r.diff} zł ↓`;
        } else if (r.diff > 0) {
          diffClass = 'diff-positive';
          diffText = `+${r.diff} zł ↑`;
        }

        return `
          <tr>
            <td><strong>${escapeHtml(r.name)}</strong></td>
            <td><span class="slack-code-tag">${r.category}</span></td>
            <td>${r.oldPrice} zł</td>
            <td><strong>${r.newPrice} zł</strong></td>
            <td class="${diffClass}">${diffText}</td>
            <td><a href="${r.url}" target="_blank" rel="noopener noreferrer" class="dev-table-link">Ceneo ↗</a></td>
          </tr>
        `;
      }).join('');
    }
  } catch (err) {
    console.error('Error polling sync status:', err);
  }
}

async function loadAndApplyCachedPrices(showNotification = false) {
  try {
    const res = await fetch('/api/cached-prices');
    if (!res.ok) return;
    const data = await res.json();
    if (!data || !data.prices) return;

    let appliedCount = 0;
    const ratePLN = EXCHANGE_RATES['PLN'] || 4.05;

    // Apply to PARTS_DATABASE
    CATEGORIES.forEach(cat => {
      const list = PARTS_DATABASE[cat] || [];
      list.forEach(part => {
        const cached = data.prices[part.id];
        if (cached && cached.pricePLN) {
          // Convert PLN back to base USD price so multi-currency works
          part.price = Math.round(cached.pricePLN / ratePLN);
          part.pricePLN = cached.pricePLN;
          if (cached.ceneoUrl) {
            if (!part.buyLinks) part.buyLinks = {};
            part.buyLinks.ceneo = cached.ceneoUrl;
          }
          appliedCount++;
        }
      });
    });

    if (appliedCount > 0) {
      console.log(`[Dev] Применено ${appliedCount} актуальных цен из кэша Ceneo.`);
      updateUI();
      if (showNotification) {
        alert(`Успешно! Актуализировано ${appliedCount} цен с Ceneo.pl на сайте.`);
      }
    }
  } catch (e) {
    console.warn('Could not load cached prices:', e.message);
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
"""

if 'initDevCabinet()' not in js:
    # Append before window.addEventListener('DOMContentLoaded', init);
    pos = js.find("window.addEventListener('DOMContentLoaded', init);")
    if pos != -1:
        js = js[:pos] + dev_cabinet_js + "\n" + js[pos:]
        print("Injected dev cabinet logic.")
    else:
        print("WARNING: Could not find DOMContentLoaded.")

# In init() function, call initDevCabinet()
if 'initDevCabinet();' not in js:
    js = js.replace('setupEventListeners();', 'setupEventListeners();\n  initDevCabinet();')
    print("Added initDevCabinet() to init().")

with open("js/app.js", "w", encoding="utf-8") as f:
    f.write(js)

print("Saved js/app.js successfully.")
