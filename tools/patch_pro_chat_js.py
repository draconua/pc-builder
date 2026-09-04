with open("js/app.js", "r", encoding="utf-8") as f:
    js = f.read()

pro_js = """
// =============================================================
// PRO AI CHAT CONSULTANT CONTROLLER
// =============================================================

function initProChat() {
  const btnProChat = document.getElementById('btn-pro-chat');
  const proDrawer = document.getElementById('pro-chat-drawer');
  const proOverlay = document.getElementById('pro-chat-overlay');
  const proClose = document.getElementById('pro-chat-close');
  const proInput = document.getElementById('pro-chat-input');
  const proSendBtn = document.getElementById('pro-chat-send-btn');
  const proMessages = document.getElementById('pro-chat-messages');
  const quickPrompts = document.querySelectorAll('.pro-prompt-chip');

  if (!btnProChat || !proDrawer) return;

  const chatHistory = [];

  function openProChat() {
    proDrawer.classList.remove('hidden');
    proOverlay.classList.remove('hidden');
    if (proInput) proInput.focus();
  }

  function closeProChat() {
    proDrawer.classList.add('hidden');
    proOverlay.classList.add('hidden');
  }

  btnProChat.addEventListener('click', openProChat);
  if (proClose) proClose.addEventListener('click', closeProChat);
  if (proOverlay) proOverlay.addEventListener('click', closeProChat);

  // Quick Prompt Chips
  quickPrompts.forEach(chip => {
    chip.addEventListener('click', () => {
      const promptText = chip.getAttribute('data-prompt');
      if (proInput && promptText) {
        proInput.value = promptText;
        sendProMessage();
      }
    });
  });

  // Send message handler
  async function sendProMessage() {
    const text = proInput.value.trim();
    if (!text) return;

    // Append user message to UI
    appendMessage('user', text);
    proInput.value = '';
    proSendBtn.disabled = true;

    // Loading indicator
    const loadingId = appendLoadingBubble();

    try {
      chatHistory.push({ role: 'user', content: text });

      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatHistory.slice(-8), // send last 8 turns
          currentBuild: buildState,
          userPrompt: text
        })
      });

      const res = await response.json();
      removeLoadingBubble(loadingId);

      if (res.ok && res.data) {
        const aiData = res.data;
        chatHistory.push({ role: 'model', content: aiData.reply });

        // If AI recommended parts, apply them to buildState!
        let appliedSummary = [];
        if (aiData.selectedParts && typeof aiData.selectedParts === 'object') {
          const findP = (cat, id) => (PARTS_DATABASE[cat] || []).find(p => p.id === id);
          for (const cat in aiData.selectedParts) {
            const partId = aiData.selectedParts[cat];
            if (partId && PARTS_DATABASE[cat]) {
              const partObj = findP(cat, partId);
              if (partObj) {
                buildState[cat] = partObj;
                appliedSummary.push(partObj.name);
              }
            }
          }
          if (appliedSummary.length > 0) {
            updateUI();
          }
        }

        appendMessage('ai', aiData.reply, appliedSummary);
      } else {
        appendMessage('ai', res.error?.includes('GEMINI_API_KEY') 
          ? 'Для работы PRO-консультанта вставьте ваш API-ключ в файл `gemini_config.json` в корневой папке проекта.'
          : `Ошибка связи с Gemini Pro: ${res.error || 'Не удалось получить ответ'}`);
      }
    } catch (err) {
      removeLoadingBubble(loadingId);
      appendMessage('ai', 'Ошибка сети при обращении к локальному AI-серверу.');
    } finally {
      proSendBtn.disabled = false;
    }
  }

  if (proSendBtn) proSendBtn.addEventListener('click', sendProMessage);
  if (proInput) {
    proInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendProMessage();
      }
    });
  }

  function appendMessage(role, text, appliedParts = []) {
    const bubble = document.createElement('div');
    bubble.className = `pro-chat-bubble ${role}`;

    const avatar = role === 'ai' ? '🧠' : '👤';
    let partsBadge = '';
    if (appliedParts && appliedParts.length > 0) {
      partsBadge = `<div class="pro-build-applied-badge">⚡ Обновлено на схеме: ${appliedParts.length} комплектующих</div>`;
    }

    // Parse simple markdown links/bold
    const formattedText = escapeHtml(text)
      .replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>')
      .replace(/\\n/g, '<br>');

    bubble.innerHTML = `
      <div class="pro-bubble-avatar">${avatar}</div>
      <div class="pro-bubble-content">
        <p>${formattedText}</p>
        ${partsBadge}
      </div>
    `;

    proMessages.appendChild(bubble);
    proMessages.scrollTop = proMessages.scrollHeight;
  }

  function appendLoadingBubble() {
    const id = 'loading-' + Date.now();
    const bubble = document.createElement('div');
    bubble.id = id;
    bubble.className = 'pro-chat-bubble ai';
    bubble.innerHTML = `
      <div class="pro-bubble-avatar">🧠</div>
      <div class="pro-bubble-content">
        <p style="color: var(--text-muted); font-style: italic;">Gemini Pro думает и подбирает компоненты...</p>
      </div>
    `;
    proMessages.appendChild(bubble);
    proMessages.scrollTop = proMessages.scrollHeight;
    return id;
  }

  function removeLoadingBubble(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }
}

// Ensure initProChat runs on startup
document.addEventListener('DOMContentLoaded', () => {
  initProChat();
});
"""

js += "\n" + pro_js
with open("js/app.js", "w", encoding="utf-8") as f:
    f.write(js)
print("Added initProChat controller to js/app.js.")
