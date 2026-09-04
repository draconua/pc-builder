with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

# 1. Add Dev-button in header-right-controls
header_target = """          <button id="theme-toggle" class="theme-toggle-btn" aria-label="Toggle theme">☀</button>
        </div>"""

header_new = """          <button id="theme-toggle" class="theme-toggle-btn" aria-label="Toggle theme">☀</button>
          <button id="dev-modal-btn" class="btn-dev-trigger" title="Dev-кабинет: Актуализация цен (Ctrl+Shift+D)">
            <span class="dev-btn-icon">⚡</span>
            <span class="dev-btn-text">Цены Ceneo</span>
          </button>
        </div>"""

if header_target in html:
    html = html.replace(header_target, header_new)
    print("Added dev-modal-btn into header.")
else:
    print("WARNING: header_target not found.")

# 2. Add dev modal markup
dev_modal_html = """
    <!-- DEV CABINET: LIVE PRICE PARSER MODAL -->
    <div id="dev-prices-modal" class="modal">
      <div class="modal-backdrop"></div>
      <div class="modal-dialog modal-dev-dialog">
        <div class="modal-header dev-modal-header">
          <div class="dev-header-left">
            <span class="dev-badge">DEV TOOL</span>
            <h2>Актуализация цен в Польше (Ceneo.pl)</h2>
          </div>
          <button id="dev-modal-close" class="modal-close-btn" aria-label="Close">×</button>
        </div>

        <div class="dev-modal-body">
          <!-- Control Strip -->
          <div class="dev-control-strip">
            <div class="dev-control-field">
              <label for="dev-category-select">Категория комплектующих:</label>
              <select id="dev-category-select" class="dev-select">
                <option value="cpu">Процессоры CPU (44 шт., ~45 сек)</option>
                <option value="gpu">Видеокарты GPU (29 шт., ~30 сек)</option>
                <option value="all">Вся база (275 шт., ~5-6 мин)</option>
                <option value="motherboard">Материнские платы (30 шт.)</option>
                <option value="cooler">Охлаждение (20 шт.)</option>
                <option value="ram">Оперативная память (17 шт.)</option>
                <option value="ssd">SSD накопители (19 шт.)</option>
                <option value="hdd">Жесткие диски (12 шт.)</option>
                <option value="psu">Блоки питания (19 шт.)</option>
                <option value="case">Корпуса (19 шт.)</option>
                <option value="monitor">Мониторы (20 шт.)</option>
              </select>
            </div>

            <div class="dev-control-actions">
              <button type="button" id="btn-start-sync" class="btn btn-primary btn-dev-start">
                <span>▶ Запустить парсинг</span>
              </button>
              <button type="button" id="btn-stop-sync" class="btn btn-dev-stop hidden">
                <span>⏹ Остановить</span>
              </button>
              <button type="button" id="btn-apply-prices" class="btn btn-dev-apply">
                <span>💾 Применить к сайту</span>
              </button>
            </div>
          </div>

          <!-- Progress and Stats Bar -->
          <div class="dev-progress-card">
            <div class="dev-progress-header">
              <span id="dev-progress-status">Готов к запуску</span>
              <span id="dev-progress-count">0 / 0</span>
            </div>
            <div class="dev-progress-bar-track">
              <div id="dev-progress-bar-fill" class="dev-progress-bar-fill" style="width: 0%;"></div>
            </div>
            <div class="dev-stats-row">
              <span class="dev-stat-pill">Обновлено: <strong id="dev-stat-updated">0</strong></span>
              <span class="dev-stat-pill">Не найдено: <strong id="dev-stat-notfound">0</strong></span>
              <span class="dev-stat-pill">В кэше сервера: <strong id="dev-stat-cached">0</strong></span>
              <span class="dev-stat-pill">Синхронизация: <span id="dev-stat-date">—</span></span>
            </div>
          </div>

          <!-- Live Terminal Output -->
          <div class="dev-terminal-wrapper">
            <div class="dev-terminal-header">
              <span>ЖИВОЙ ТЕРМИНАЛ СКРАПЕРА</span>
              <button type="button" id="btn-clear-logs" class="btn-clear-terminal">Очистить лог</button>
            </div>
            <div id="dev-terminal-logs" class="dev-terminal-logs">
              <div class="log-line text-muted">[Готов] Выберите категорию и нажмите «Запустить парсинг»...</div>
            </div>
          </div>

          <!-- Results Diff Table -->
          <div class="dev-diff-table-wrapper">
            <div class="dev-diff-header">
              <h3>Сводка изменений цен</h3>
              <span class="dev-diff-subtitle">Цены сравниваются с текущими значениями в конфигураторе</span>
            </div>
            <div class="dev-table-container">
              <table class="dev-diff-table">
                <thead>
                  <tr>
                    <th>Товар</th>
                    <th>Категория</th>
                    <th>Было (PLN)</th>
                    <th>Стало (Ceneo)</th>
                    <th>Разница</th>
                    <th>Ссылка</th>
                  </tr>
                </thead>
                <tbody id="dev-diff-tbody">
                  <tr><td colspan="6" class="text-center text-muted" style="padding: 1.5rem;">Пока нет результатов сканирования</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
"""

# Insert modal before </body>
body_pos = html.rfind("</body>")
if body_pos != -1:
    html = html[:body_pos] + dev_modal_html + "\n  " + html[body_pos:]
    print("Injected dev modal markup before </body>.")

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)

print("Saved index.html successfully.")
