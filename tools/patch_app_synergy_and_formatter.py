with open("js/app.js", "r", encoding="utf-8") as f:
    js = f.read()

# 1. Replace automatic fetch in updateBottleneckUI with instant formula + card reset
old_bt_ui = """  // 2. Fetch Deep AI Hardware Synergy in background
  const currentReqKey = `${buildState.cpu.id}_${buildState.gpu.id}_${resVal}`;
  window._lastSynergyKey = currentReqKey;

  fetch('/api/ai-synergy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cpu: buildState.cpu,
      gpu: buildState.gpu,
      motherboard: buildState.motherboard,
      ram: buildState.ram,
      resolution: resVal
    })
  })
  .then(res => res.json())
  .then(data => {
    // Ensure this response is still for the current build
    if (window._lastSynergyKey !== currentReqKey || !data.ok || !data.data) return;
    const ai = data.data;

    scoreBadge.textContent = ai.score + '%';
    textEl.innerHTML = `<span style="color: #60a5fa; font-weight: 600;">✨ Gemini AI:</span> ${escapeHtml(ai.status)}`;
    adviceEl.innerHTML = `<strong>${escapeHtml(ai.fpsPotential || '')}</strong> — ${escapeHtml(ai.commentary || '')}`;
    applyBottleneckStyles(ai.score, ai.bottleneckType === 'cpu');
  })
  .catch(() => {});"""

new_bt_ui = """  // Reset AI Verdict Card and Button on component change (On-Demand AI model)
  const aiCard = document.getElementById('ai-synergy-verdict-card');
  const btnCheckAi = document.getElementById('btn-check-ai-synergy');
  const btnText = document.getElementById('btn-check-ai-text');
  if (aiCard) aiCard.classList.add('hidden');
  if (btnCheckAi) {
    btnCheckAi.disabled = false;
    if (btnText) btnText.innerHTML = 'Проверить сборку с AI';
  }"""

if old_bt_ui in js:
    js = js.replace(old_bt_ui, new_bt_ui, 1)
    print("Replaced automatic AI bottleneck request with clean on-demand reset.")
else:
    print("Warning: old_bt_ui not found.")

# 2. Add formatProChatMessage and AI check button event listener
formatter_and_btn_code = """
// =============================================================
// RICH MARKDOWN & COMPONENT SPEC-CARD FORMATTER FOR PRO CHAT
// =============================================================

function formatProChatMessage(text) {
  if (!text) return '';
  
  // 1. Normalize line breaks (handle both actual newlines and literal \\n sequences)
  let raw = text.replace(/\\r\\n/g, '\\n').replace(/\\\\n/g, '\\n');

  // 2. Category mapping for component spec cards
  const categoryIcons = [
    { regex: /^(?:\\d+\\.\\s*)?\\*\\*(?:Процессор|CPU):?\\*\\*/i, icon: '💻', cat: 'CPU' },
    { regex: /^(?:\\d+\\.\\s*)?\\*\\*(?:Материнская плата|Плата|Motherboard):?\\*\\*/i, icon: '🖲️', cat: 'MB' },
    { regex: /^(?:\\d+\\.\\s*)?\\*\\*(?:Кулер|Охлаждение|Cooler):?\\*\\*/i, icon: '❄️', cat: 'COOLER' },
    { regex: /^(?:\\d+\\.\\s*)?\\*\\*(?:Оперативная память|ОЗУ|RAM):?\\*\\*/i, icon: '⚡', cat: 'RAM' },
    { regex: /^(?:\\d+\\.\\s*)?\\*\\*(?:Видеокарта|GPU):?\\*\\*/i, icon: '🎮', cat: 'GPU' },
    { regex: /^(?:\\d+\\.\\s*)?\\*\\*(?:SSD|Накопитель|SSD накопитель):?\\*\\*/i, icon: '🚀', cat: 'SSD' },
    { regex: /^(?:\\d+\\.\\s*)?\\*\\*(?:HDD|Жесткий диск):?\\*\\*/i, icon: '💾', cat: 'HDD' },
    { regex: /^(?:\\d+\\.\\s*)?\\*\\*(?:Блок питания|БП|PSU):?\\*\\*/i, icon: '🔌', cat: 'PSU' },
    { regex: /^(?:\\d+\\.\\s*)?\\*\\*(?:Корпус|Case):?\\*\\*/i, icon: '📦', cat: 'CASE' }
  ];

  function formatInline(str) {
    return escapeHtml(str)
      .replace(/\\*\\*(.*?)\\*\\*/g, '<strong class="pro-strong">$1</strong>')
      .replace(/\\*(.*?)\\*/g, '<em>$1</em>')
      .replace(/(\\d+[\\s\\u00A0]?(?:–|-)\\s?\\d+[\\s\\u00A0]?(?:PLN|zł))|(\\b\\d+[\\s\\u00A0]?(?:PLN|zł)\\b)/gi, '<span class="pro-price-tag">$1$2</span>');
  }

  const lines = raw.split('\\n');
  const htmlParts = [];
  let inSpecList = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (!line) {
      if (inSpecList) {
        htmlParts.push('</div>');
        inSpecList = false;
      }
      continue;
    }

    // Headers (### Title or ## Title)
    const headerMatch = line.match(/^#{1,4}\\s+(.+)$/);
    if (headerMatch) {
      if (inSpecList) { htmlParts.push('</div>'); inSpecList = false; }
      htmlParts.push(`<h4 class="pro-chat-heading">${formatInline(headerMatch[1])}</h4>`);
      continue;
    }

    // Component spec item (1. **Процессор:** ...)
    let matchedCat = null;
    for (const c of categoryIcons) {
      if (c.regex.test(line)) {
        matchedCat = c;
        break;
      }
    }

    if (matchedCat) {
      if (!inSpecList) {
        htmlParts.push('<div class="pro-spec-grid">');
        inSpecList = true;
      }
      const cleanLine = line.replace(/^\\d+\\.\\s*/, '');
      htmlParts.push(`
        <div class="pro-spec-card">
          <div class="pro-spec-icon-badge" title="${matchedCat.cat}">${matchedCat.icon}</div>
          <div class="pro-spec-body">${formatInline(cleanLine)}</div>
        </div>
      `);
      continue;
    }

    // Regular bullet list
    const bulletMatch = line.match(/^(?:[-*]|\\d+\\.)\\s+(.+)$/);
    if (bulletMatch) {
      if (inSpecList) { htmlParts.push('</div>'); inSpecList = false; }
      htmlParts.push(`
        <div class="pro-bullet-item">
          <span class="pro-bullet-dot">•</span>
          <span class="pro-bullet-text">${formatInline(bulletMatch[1])}</span>
        </div>
      `);
      continue;
    }

    // Regular Paragraph
    if (inSpecList) { htmlParts.push('</div>'); inSpecList = false; }
    htmlParts.push(`<p class="pro-chat-paragraph">${formatInline(line)}</p>`);
  }

  if (inSpecList) {
    htmlParts.push('</div>');
  }

  return htmlParts.join('\\n');
}

// Initializer for the "Проверить сборку с AI" button
function initAiSynergyCheck() {
  const btnCheck = document.getElementById('btn-check-ai-synergy');
  if (!btnCheck) return;

  btnCheck.addEventListener('click', async () => {
    if (!buildState.cpu || !buildState.gpu) {
      showToast({
        title: 'Комплектующие не выбраны',
        message: 'Для проверки связки выберите процессор и видеокарту.',
        type: 'warning'
      });
      return;
    }

    const btnText = document.getElementById('btn-check-ai-text');
    const aiCard = document.getElementById('ai-synergy-verdict-card');
    const scoreBadge = document.getElementById('bottleneck-score-badge');
    const cpuBar = document.getElementById('bottleneck-bar-cpu');
    const gpuBar = document.getElementById('bottleneck-bar-gpu');
    const statusTag = document.getElementById('ai-verdict-status-tag');
    const commentaryEl = document.getElementById('ai-verdict-commentary');
    const fpsEl = document.getElementById('ai-verdict-fps');
    const resVal = (typeof selectedTargetRes !== 'undefined') ? selectedTargetRes : '1440p';

    btnCheck.disabled = true;
    if (btnText) btnText.innerHTML = '<span class="ai-spark-icon">⏳</span> Gemini анализирует баланс связки...';

    try {
      const response = await fetch('/api/ai-synergy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cpu: buildState.cpu,
          gpu: buildState.gpu,
          motherboard: buildState.motherboard,
          ram: buildState.ram,
          resolution: resVal
        })
      });

      const res = await response.json();
      if (res.ok && res.data) {
        const ai = res.data;
        if (scoreBadge) scoreBadge.textContent = ai.score + '%';

        // Apply visual bars
        if (ai.score >= 90) {
          if (cpuBar) cpuBar.style.width = '50%';
          if (gpuBar) gpuBar.style.width = '50%';
          if (scoreBadge) {
            scoreBadge.style.color = '#10b981';
            scoreBadge.style.background = 'rgba(16, 185, 129, 0.15)';
          }
        } else if (ai.bottleneckType === 'cpu') {
          const gpuUsage = Math.max(10, (ai.score / 100) * 50);
          if (cpuBar) cpuBar.style.width = '50%';
          if (gpuBar) gpuBar.style.width = gpuUsage + '%';
          if (scoreBadge) {
            scoreBadge.style.color = '#f43f5e';
            scoreBadge.style.background = 'rgba(244, 63, 94, 0.15)';
          }
        } else {
          const cpuUsage = Math.max(10, (ai.score / 100) * 50);
          if (cpuBar) cpuBar.style.width = cpuUsage + '%';
          if (gpuBar) gpuBar.style.width = '50%';
          if (scoreBadge) {
            scoreBadge.style.color = '#f59e0b';
            scoreBadge.style.background = 'rgba(245, 158, 11, 0.15)';
          }
        }

        if (statusTag) statusTag.textContent = ai.status || 'Оптимально';
        if (commentaryEl) commentaryEl.textContent = ai.commentary || '';
        if (fpsEl) fpsEl.textContent = ai.fpsPotential || 'Высокая стабильность фреймрейта';
        if (aiCard) aiCard.classList.remove('hidden');

        if (btnText) btnText.innerHTML = '✓ Сборка проверена с AI';
        btnCheck.disabled = false;
      } else {
        showToast({
          title: 'Ошибка AI проверки',
          message: res.error || 'Не удалось получить вердикт от нейросети.',
          type: 'error'
        });
        if (btnText) btnText.textContent = 'Попробовать снова';
        btnCheck.disabled = false;
      }
    } catch (e) {
      showToast({
        title: 'Сетевая ошибка',
        message: 'Не удалось связаться с локальным сервером AI.',
        type: 'error'
      });
      if (btnText) btnText.textContent = 'Проверить сборку с AI';
      btnCheck.disabled = false;
    }
  });
}
"""

# Append helper functions
js += "\n" + formatter_and_btn_code

# Also call initAiSynergyCheck in DOMContentLoaded
js = js.replace("initProChat();", "initProChat();\n  initAiSynergyCheck();")

# 3. Update appendMessage to use formatProChatMessage
old_append = """    // Parse simple markdown links/bold
    const formattedText = escapeHtml(text)
      .replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>')
      .replace(/\\n/g, '<br>');

    bubble.innerHTML = `
      <div class="pro-bubble-avatar">${avatar}</div>
      <div class="pro-bubble-content">
        <p>${formattedText}</p>
        ${partsBadge}
      </div>
    `;"""

new_append = """    // Use our rich structured card formatter
    const formattedHtml = role === 'ai' 
      ? formatProChatMessage(text)
      : `<p class="pro-chat-paragraph">${escapeHtml(text)}</p>`;

    bubble.innerHTML = `
      <div class="pro-bubble-avatar">${avatar}</div>
      <div class="pro-bubble-content">
        ${formattedHtml}
        ${partsBadge}
      </div>
    `;"""

if old_append in js:
    js = js.replace(old_append, new_append, 1)
    print("Updated appendMessage to use formatProChatMessage.")
else:
    print("Warning: old_append not found.")

with open("js/app.js", "w", encoding="utf-8") as f:
    f.write(js)
print("Updated js/app.js successfully.")
