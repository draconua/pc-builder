with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

# 1. Add Pro AI button next to btn-auto-builder
old_button = '<button id="btn-auto-builder" class="auto-builder-pill" type="button" data-i18n="autobuild.title">✨ Умный авто-подбор</button>'
new_buttons = """<button id="btn-auto-builder" class="auto-builder-pill" type="button" data-i18n="autobuild.title">✨ Умный авто-подбор</button>
            <button id="btn-pro-chat" class="pro-chat-pill" type="button">
              <span class="pro-badge">PRO</span>
              <span>AI Чат-Консультант</span>
            </button>"""

if old_button in html:
    html = html.replace(old_button, new_buttons, 1)
    print("Added PRO Chat button in header.")
else:
    print("Warning: old_button not found.")

# 2. Add PRO Drawer and Modal before closing body tag
pro_drawer_html = """
    <!-- PRO AI CONSULTANT DOCK / DRAWER -->
    <div id="pro-chat-overlay" class="pro-chat-overlay hidden"></div>
    <aside id="pro-chat-drawer" class="pro-chat-drawer hidden">
      <div class="pro-chat-header">
        <div class="pro-chat-title-group">
          <div class="pro-ai-avatar">🧠</div>
          <div>
            <div class="pro-ai-name">
              <strong>Gemini Pro Consultant</strong>
              <span class="pro-pill-badge">PRO</span>
            </div>
            <div class="pro-ai-status" id="pro-ai-status-indicator">● Интерактивный подбор железа</div>
          </div>
        </div>
        <button type="button" class="pro-chat-close-btn" id="pro-chat-close">×</button>
      </div>

      <!-- Chat Messages Container -->
      <div class="pro-chat-messages" id="pro-chat-messages">
        <div class="pro-chat-bubble ai">
          <div class="pro-bubble-avatar">🧠</div>
          <div class="pro-bubble-content">
            <p><strong>Привет! Я ваш персональный AI-архитектор ПК на базе Gemini Pro.</strong></p>
            <p>Напишите мне свои пожелания простыми словами — для каких игр или работы нужен компьютер, какой бюджет, предпочтения по цвету, шуму или сокету. Я подберу идеальные комплектующие из нашего каталога и сразу установлю их на схему!</p>
          </div>
        </div>
      </div>

      <!-- Quick Prompt Suggestions -->
      <div class="pro-quick-prompts" id="pro-quick-prompts">
        <button type="button" class="pro-prompt-chip" data-prompt="Собери белый тихий ПК для CS2 и стримов за 5500 zł">⚪ Белый тихий ПК для CS2 (5500 zł)</button>
        <button type="button" class="pro-prompt-chip" data-prompt="Ультимативный 4K гейминг на максималках за 10000 zł">🎮 4K Гейминг Ultra (10000 zł)</button>
        <button type="button" class="pro-prompt-chip" data-prompt="Рабочая станция для монтажа в 4K и 3D рендера за 7500 zł">🎬 Монтаж и 3D рендер (7500 zł)</button>
        <button type="button" class="pro-prompt-chip" data-prompt="Компактный бюджетный ПК для танков и GTA V за 3500 zł">📦 Компактный хит (3500 zł)</button>
      </div>

      <!-- Chat Input Area -->
      <div class="pro-chat-input-area">
        <div class="pro-input-wrapper">
          <textarea id="pro-chat-input" rows="1" placeholder="Опишите свои задачи и пожелания к сборке..."></textarea>
          <button type="button" id="pro-chat-send-btn" class="pro-send-btn" title="Отправить (Enter)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
        <div class="pro-input-footer">
          <span>Gemini Pro анализирует совместимость и управляет слотами сборки на лету</span>
        </div>
      </div>
    </aside>
"""

html = html.replace('  </body>', pro_drawer_html + '\n  </body>')
print("Added PRO Chat Drawer markup.")

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)
print("Updated index.html successfully.")
