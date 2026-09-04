with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

target = """            <div class="bottleneck-info-box">
              <span id="bottleneck-text" class="bottleneck-text">Идеальный баланс (Золотой стандарт)</span>
              <p id="bottleneck-advice" class="bottleneck-advice"></p>
            </div>"""

replacement = """            <div class="bottleneck-info-box">
              <span id="bottleneck-text" class="bottleneck-text">Идеальный баланс (Золотой стандарт)</span>
              <p id="bottleneck-advice" class="bottleneck-advice"></p>
            </div>

            <!-- AI Synergy Check Action -->
            <div class="bottleneck-ai-action-bar">
              <button type="button" class="btn-check-ai-synergy" id="btn-check-ai-synergy">
                <span class="btn-ai-icon">✨</span>
                <span id="btn-check-ai-text">Проверить сборку с AI</span>
              </button>
            </div>

            <!-- Detailed AI Synergy Verdict (Shown after clicking check button) -->
            <div id="ai-synergy-verdict-card" class="ai-synergy-verdict-card hidden">
              <div class="ai-verdict-header-row">
                <div class="ai-badge-group">
                  <span class="ai-brain-icon">🧠</span>
                  <span class="ai-badge-label">Вердикт Gemini AI</span>
                </div>
                <span class="ai-verdict-status-tag" id="ai-verdict-status-tag">Идеальный баланс</span>
              </div>
              <p class="ai-verdict-commentary" id="ai-verdict-commentary"></p>
              <div class="ai-verdict-fps-row" id="ai-verdict-fps-row">
                <span class="ai-fps-icon">⚡</span>
                <span id="ai-verdict-fps" class="ai-verdict-fps"></span>
              </div>
            </div>"""

if target in html:
    html = html.replace(target, replacement, 1)
    print("Added AI Synergy button and verdict card to index.html.")
else:
    print("Warning: target not found in index.html.")

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)
