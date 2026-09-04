# 1. Append Toast CSS to css/style.css
with open("css/style.css", "r", encoding="utf-8") as f:
    css = f.read()

toast_css = """
/* =============================================================
   ELEGANT TOAST NOTIFICATION SYSTEM
   ============================================================= */

.toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 100000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
  max-width: 420px;
  width: calc(100vw - 32px);
}

.toast-item {
  pointer-events: auto;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-radius: var(--radius-md);
  background: var(--surface);
  border: 1px solid var(--border);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.22), 0 2px 6px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  transform: translateX(115%);
  opacity: 0;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease;
}

.toast-item.toast-show {
  transform: translateX(0);
  opacity: 1;
}

.toast-item.toast-hide {
  transform: translateX(115%);
  opacity: 0;
}

.toast-success {
  border-left: 4px solid #10b981;
}
.toast-success .toast-icon-box {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
}

.toast-error {
  border-left: 4px solid #ef4444;
}
.toast-error .toast-icon-box {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

.toast-warning {
  border-left: 4px solid #f59e0b;
}
.toast-warning .toast-icon-box {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
}

.toast-info {
  border-left: 4px solid #3b82f6;
}
.toast-info .toast-icon-box {
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
}

.toast-icon-box {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.toast-title {
  font-family: var(--font-sans);
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.3;
}

.toast-message {
  font-family: var(--font-sans);
  font-size: 0.78rem;
  color: var(--text-secondary);
  line-height: 1.4;
  word-break: break-word;
}

.toast-close {
  background: transparent;
  border: none;
  color: var(--text-tertiary);
  font-size: 1.1rem;
  line-height: 1;
  cursor: pointer;
  padding: 0 4px;
  transition: color 0.15s;
}

.toast-close:hover {
  color: var(--text-primary);
}
"""

css += "\n" + toast_css
with open("css/style.css", "w", encoding="utf-8") as f:
    f.write(css)
print("Added toast CSS styles.")

# 2. Update js/app.js to define showToast and replace alert()
with open("js/app.js", "r", encoding="utf-8") as f:
    js = f.read()

show_toast_js = """
// =============================================================
// TOAST NOTIFICATIONS
// =============================================================

function showToast({ title = 'Уведомление', message, type = 'success', duration = 4500 }) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast-item toast-${type}`;

  const icons = {
    success: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    error: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    warning: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    info: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`
  };

  toast.innerHTML = `
    <div class="toast-icon-box">${icons[type] || icons.info}</div>
    <div class="toast-body">
      ${title ? `<div class="toast-title">${escapeHtml(title)}</div>` : ''}
      <div class="toast-message">${escapeHtml(message)}</div>
    </div>
    <button type="button" class="toast-close" aria-label="Close">&times;</button>
  `;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('toast-show');
  });

  const removeToast = () => {
    toast.classList.remove('toast-show');
    toast.classList.add('toast-hide');
    setTimeout(() => {
      if (toast.parentElement) toast.parentElement.removeChild(toast);
    }, 350);
  };

  toast.querySelector('.toast-close').addEventListener('click', removeToast);
  if (duration > 0) {
    setTimeout(removeToast, duration);
  }
}
"""

# Insert showToast function before initDevCabinet
js = js.replace("function initDevCabinet() {", show_toast_js + "\nfunction initDevCabinet() {")

# Replace the alert in loadAndApplyCachedPrices
old_alert_code = """      if (showNotification) {
        alert(`Успешно! Актуализировано ${appliedCount} цен с Ceneo.pl на сайте.`);
      }"""

new_toast_code = """      if (showNotification) {
        showToast({
          title: 'Цены обновлены ✨',
          message: `Успешно актуализировано ${appliedCount} цен с Morele и Ceneo. Конфигуратор и альтернативы пересчитаны.`,
          type: 'success',
          duration: 4500
        });
      }"""

if old_alert_code in js:
    js = js.replace(old_alert_code, new_toast_code)
    print("Replaced alert() with showToast() in loadAndApplyCachedPrices.")
else:
    # Try regex/partial match
    import re
    js = re.sub(
        r'if\s*\(showNotification\)\s*\{\s*alert\([^)]+\);\s*\}',
        new_toast_code,
        js
    )
    print("Replaced alert via regex.")

with open("js/app.js", "w", encoding="utf-8") as f:
    f.write(js)
print("Updated js/app.js with showToast().")
