import re

# 1. UPDATE index.html
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Remove slot-monitor from stage-col-right
# Find slot-monitor block
slot_monitor_pattern = r'<!-- 10\. Monitor \(Optional\) -->[\s\S]*?<div class="slot-card" data-category="monitor" id="slot-monitor">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>'
# Replace with just </section>
match = re.search(slot_monitor_pattern, html)
if match:
    html = html[:match.start()] + '</section>' + html[match.end():]
    print("Removed slot-monitor from main stage column.")
else:
    print("WARNING: Could not find slot-monitor with regex, trying alternate search.")
    # Alternate search
    start_pos = html.find('id="slot-monitor"')
    if start_pos != -1:
        card_start = html.rfind('<div class="slot-card"', 0, start_pos)
        comment_start = html.rfind('<!-- 10. Monitor', 0, card_start)
        if comment_start == -1: comment_start = card_start
        # Find closing </div> of slot-monitor
        # count braces or find next </section>
        sec_end = html.find('</section>', start_pos)
        html = html[:comment_start].rstrip() + '\n      </section>' + html[sec_end + len('</section>'):]
        print("Removed slot-monitor via alternate search.")

# Add monitor-panel into details-grid
monitor_panel_html = """
        <!-- 3. Recommended Monitor Panel -->
        <div class="panel monitor-panel" id="monitor-panel">
          <div class="panel-header">
            <h3 data-i18n="dash.monitor.title">РЕКОМЕНДУЕМЫЙ МОНИТОР</h3>
            <span class="monitor-tier-badge" id="monitor-tier-badge">Подбор под GPU</span>
          </div>
          <div class="monitor-panel-body">
            <!-- Dynamic Recommendation Box based on GPU -->
            <div class="monitor-recommendation-box" id="monitor-rec-box">
              <div class="monitor-rec-header">
                <span class="monitor-rec-icon" id="monitor-rec-icon">🖥️</span>
                <div class="monitor-rec-info">
                  <h4 class="monitor-rec-title" id="monitor-rec-title">Подбор под видеокарту</h4>
                  <p class="monitor-rec-desc" id="monitor-rec-desc">Выберите видеокарту для расчета оптимального разрешения и частоты обновления.</p>
                </div>
              </div>
            </div>

            <!-- Current Selected Monitor (or Empty State) -->
            <div class="monitor-selection-wrapper" id="monitor-selection-wrapper">
              <div class="monitor-empty-state" id="monitor-empty-state">
                <p class="monitor-empty-text">Монитор пока не добавлен к сборке (опционально)</p>
                <button type="button" class="btn btn-sm btn-select" id="btn-select-monitor">Выбрать из каталога</button>
              </div>
              
              <div class="monitor-selected-card hidden" id="monitor-selected-card">
                <div class="monitor-card-header-row">
                  <span class="monitor-selected-name" id="monitor-selected-name">Монитор</span>
                  <span class="monitor-selected-price" id="monitor-selected-price">0 zł</span>
                </div>
                <div class="monitor-selected-specs" id="monitor-selected-specs">
                  <!-- Slack code tags -->
                </div>
                <div class="monitor-card-actions">
                  <button type="button" class="btn-store-hub" id="monitor-store-hub-btn" title="Сравнить цены в магазинах">
                    <span class="store-hub-icon">🏪</span><span class="store-hub-text" data-i18n="slot.comparePrices">Цены в магазинах</span><span class="store-hub-arrow">↗</span>
                  </button>
                  <button type="button" class="btn btn-sm btn-select" id="btn-change-monitor" data-i18n="slot.select">Изменить</button>
                  <button type="button" class="btn-remove" id="btn-remove-monitor" title="Убрать монитор">×</button>
                </div>
              </div>
            </div>

            <!-- Quick Recommended Picks (One-click equip) -->
            <div class="monitor-quick-picks" id="monitor-quick-picks">
              <span class="quick-picks-label">Оптимальные модели под вашу сборку:</span>
              <div class="quick-picks-list" id="monitor-quick-picks-list">
                <!-- Dynamically populated chips -->
              </div>
            </div>
          </div>
        </div>
"""

# Insert monitor_panel_html after compatibility-panel in details-grid
compat_end = html.find('</div>\n\n        <!-- Saved Builds -->')
if compat_end == -1:
    compat_end = html.find('<!-- Saved Builds -->')

if compat_end != -1:
    html = html[:compat_end] + monitor_panel_html + "\n" + html[compat_end:]
    print("Injected monitor-panel into details-grid.")
else:
    print("WARNING: Could not find insert location for monitor-panel.")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Updated index.html successfully.")
