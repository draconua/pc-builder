# -*- coding: utf-8 -*-
import json

with open("svg_backup.html", "r", encoding="utf-8") as f:
    pc_svg = f.read()

with open("icons.json", "r", encoding="utf-8") as f:
    icons = json.load(f)

html = f"""<!DOCTYPE html>
<html lang="ru" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PC Builder — Конфигуратор ПК</title>
  <meta name="description" content="Утилитарный минималистичный конструктор для подбора совместимых комплектующих ПК с визуализацией схемы сборки и оценкой FPS.">
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='%23111318'/><text x='16' y='21' font-family='sans-serif' font-size='13' font-weight='bold' fill='%23ffffff' text-anchor='middle'>PC</text></svg>">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div class="app">
    <!-- Header -->
    <header class="header">
      <div class="header-left">
        <div class="title-row">
          <h1>PC BUILDER</h1>
          <span class="data-date-badge">2026 Catalog</span>
        </div>
        <p class="subtitle">Интерактивный утилитарный конфигуратор</p>
      </div>
      <div class="header-right">
        <div class="lang-group">
          <button class="lang-btn active" data-lang="ru">RU</button>
          <button class="lang-btn" data-lang="en">EN</button>
          <button class="lang-btn" data-lang="pl">PL</button>
          <button class="lang-btn" data-lang="ua">UA</button>
        </div>
        <div class="currency-group">
          <button class="currency-btn active" data-currency="PLN">zł PLN</button>
          <button class="currency-btn" data-currency="USD">$ USD</button>
        </div>
        <button id="theme-toggle" class="theme-toggle-btn" aria-label="Toggle theme">☀</button>
      </div>
    </header>

    <!-- Toolbar -->
    <div class="toolbar">
      <div class="toolbar-left">
        <div class="progress-ring-container">
          <svg class="progress-ring" width="34" height="34">
            <circle class="progress-ring-circle-bg" stroke="var(--border)" stroke-width="3" fill="transparent" r="13" cx="17" cy="17"/>
            <circle id="progress-ring-circle" class="progress-ring-circle" stroke="var(--accent)" stroke-width="3" fill="transparent" r="13" cx="17" cy="17"/>
          </svg>
          <div class="progress-labels">
            <span id="progress-text" class="progress-primary">0 / 8</span>
            <span id="progress-sub" class="progress-sub">0 opt</span>
          </div>
        </div>
      </div>
      <div class="toolbar-center">
        <button id="btn-auto-builder" class="preset-btn auto-builder-btn">✨ Auto-Build</button>
        <button class="preset-btn" data-preset="budget" data-i18n="preset.budget">Budget 1080p</button>
        <button class="preset-btn" data-preset="balanced" data-i18n="preset.balanced">Balanced 1440p</button>
        <button class="preset-btn" data-preset="ultimate" data-i18n="preset.ultimate">Ultimate 4K</button>
      </div>
      <div class="toolbar-right">
        <button id="btn-clear" class="btn btn-secondary" data-i18n="action.clear">Clear</button>
        <button id="btn-save" class="btn btn-secondary" data-i18n="action.save">Save</button>
        <button id="btn-compare" class="btn btn-secondary" data-i18n="action.compare">Compare</button>
        <button id="btn-timelapse" class="btn btn-secondary" data-i18n="action.timelapse">▶ Animate</button>
        <button id="btn-export" class="btn btn-secondary" data-i18n="action.export">Export</button>
        <button id="btn-share" class="btn btn-primary" data-i18n="action.share">Share</button>
      </div>
    </div>

    <!-- MAIN SCREEN STAGE: Fits entirely on one screen -->
    <main class="main-stage">
      <!-- LEFT COLUMN: Core components (CPU, MB, Cooler, RAM, GPU) -->
      <section class="stage-col stage-col-left">
        <!-- 1. CPU -->
        <div class="slot-card" data-category="cpu" id="slot-cpu">
          <span class="slot-num">01</span>
          <span class="slot-category-icon">{icons['cpu']}</span>
          <div class="slot-body">
            <div class="slot-header-row">
              <span class="slot-category" data-i18n="cat.cpu">Processor</span>
            </div>
            <p class="slot-placeholder" data-i18n="slot.cpu.hint">Choose CPU</p>
            <div class="slot-selected hidden">
              <span class="slot-selected-name"></span>
              <span class="slot-selected-specs"></span>
            </div>
          </div>
          <div class="slot-actions">
            <span class="slot-price hidden"></span>
            <a class="slot-buy-link hidden" target="_blank" title="Buy link">↗</a>
            <button class="btn btn-sm btn-select select-btn" data-i18n="slot.select">Select</button>
            <button class="btn-remove remove-btn hidden" title="Remove">×</button>
          </div>
        </div>

        <!-- 2. Motherboard -->
        <div class="slot-card" data-category="motherboard" id="slot-motherboard">
          <span class="slot-num">02</span>
          <span class="slot-category-icon">{icons['motherboard']}</span>
          <div class="slot-body">
            <div class="slot-header-row">
              <span class="slot-category" data-i18n="cat.motherboard">Motherboard</span>
            </div>
            <p class="slot-placeholder" data-i18n="slot.motherboard.hint">Choose Motherboard</p>
            <div class="slot-selected hidden">
              <span class="slot-selected-name"></span>
              <span class="slot-selected-specs"></span>
            </div>
          </div>
          <div class="slot-actions">
            <span class="slot-price hidden"></span>
            <a class="slot-buy-link hidden" target="_blank" title="Buy link">↗</a>
            <button class="btn btn-sm btn-select select-btn" data-i18n="slot.select">Select</button>
            <button class="btn-remove remove-btn hidden" title="Remove">×</button>
          </div>
        </div>

        <!-- 3. Cooler -->
        <div class="slot-card" data-category="cooler" id="slot-cooler">
          <span class="slot-num">03</span>
          <span class="slot-category-icon">{icons['cooler']}</span>
          <div class="slot-body">
            <div class="slot-header-row">
              <span class="slot-category" data-i18n="cat.cooler">Cooling</span>
            </div>
            <p class="slot-placeholder" data-i18n="slot.cooler.hint">Choose Cooler</p>
            <div class="slot-selected hidden">
              <span class="slot-selected-name"></span>
              <span class="slot-selected-specs"></span>
            </div>
          </div>
          <div class="slot-actions">
            <span class="slot-price hidden"></span>
            <a class="slot-buy-link hidden" target="_blank" title="Buy link">↗</a>
            <button class="btn btn-sm btn-select select-btn" data-i18n="slot.select">Select</button>
            <button class="btn-remove remove-btn hidden" title="Remove">×</button>
          </div>
        </div>

        <!-- 4. RAM -->
        <div class="slot-card" data-category="ram" id="slot-ram">
          <span class="slot-num">04</span>
          <span class="slot-category-icon">{icons['ram']}</span>
          <div class="slot-body">
            <div class="slot-header-row">
              <span class="slot-category" data-i18n="cat.ram">Memory</span>
            </div>
            <p class="slot-placeholder" data-i18n="slot.ram.hint">Choose RAM</p>
            <div class="slot-selected hidden">
              <span class="slot-selected-name"></span>
              <span class="slot-selected-specs"></span>
            </div>
          </div>
          <div class="slot-actions">
            <span class="slot-price hidden"></span>
            <a class="slot-buy-link hidden" target="_blank" title="Buy link">↗</a>
            <button class="btn btn-sm btn-select select-btn" data-i18n="slot.select">Select</button>
            <button class="btn-remove remove-btn hidden" title="Remove">×</button>
          </div>
        </div>

        <!-- 5. GPU -->
        <div class="slot-card" data-category="gpu" id="slot-gpu">
          <span class="slot-num">05</span>
          <span class="slot-category-icon">{icons['gpu']}</span>
          <div class="slot-body">
            <div class="slot-header-row">
              <span class="slot-category" data-i18n="cat.gpu">Graphics Card</span>
            </div>
            <p class="slot-placeholder" data-i18n="slot.gpu.hint">Choose GPU</p>
            <div class="slot-selected hidden">
              <span class="slot-selected-name"></span>
              <span class="slot-selected-specs"></span>
            </div>
            <!-- GPU Analogs / Alternatives -->
            <div id="gpu-analogs-box" class="gpu-analogs-box hidden">
              <span class="analogs-label">Аналоги по мощности:</span>
              <div id="gpu-analogs-list" class="analogs-chips"></div>
            </div>
          </div>
          <div class="slot-actions">
            <span class="slot-price hidden"></span>
            <a class="slot-buy-link hidden" target="_blank" title="Buy link">↗</a>
            <button class="btn btn-sm btn-select select-btn" data-i18n="slot.select">Select</button>
            <button class="btn-remove remove-btn hidden" title="Remove">×</button>
          </div>
        </div>
      </section>

      <!-- CENTER STAGE: Schematic "Воображаемый ПК" + Total Price + Bottleneck -->
      <section class="stage-col stage-col-center">
        <!-- Summary Card -->
        <div class="stage-panel center-summary">
          <div class="center-summary-header">
            <span class="center-summary-label" data-i18n="dash.total">Total Price</span>
            <span id="total-price" class="center-price-val">0</span>
          </div>
          <div class="center-power-row">
            <div class="power-meta">
              <span class="power-label" data-i18n="dash.power">Est. Power</span>
              <span id="power-value" class="power-val">0W</span>
            </div>
            <div class="power-bar-track">
              <div class="power-bar-fill" id="power-bar" style="width: 15%;"></div>
            </div>
            <span class="power-sub" id="power-limit-text" data-i18n="dash.psu.none">No PSU selected</span>
          </div>
        </div>

        <!-- Virtual PC Schematic Visualizer ("Воображаемый ПК") -->
        <div class="stage-panel center-schematic">
          <div class="schematic-header">
            <span class="schematic-title">Схема сборки</span>
            <span class="status-badge" id="chassis-status" data-i18n="status.waiting">Waiting</span>
          </div>
          <div class="svg-container">
            {pc_svg}
          </div>
        </div>

        <!-- Bottleneck Quick Gauge -->
        <div class="stage-panel center-bottleneck" id="bottleneck-panel">
          <div id="bottleneck-placeholder" class="placeholder-text" data-i18n="dash.bottleneck.select">Select CPU and GPU for balance check</div>
          <div id="bottleneck-result" class="bottleneck-result hidden">
            <div class="bottleneck-labels-row">
              <span class="bottleneck-side-label">CPU Bound</span>
              <span class="bottleneck-side-label">Balanced</span>
              <span class="bottleneck-side-label">GPU Bound</span>
            </div>
            <div class="bottleneck-bar-track">
              <div class="bottleneck-center-line"></div>
              <div class="bottleneck-bar-fill" id="bottleneck-bar" style="width: 50%;"></div>
            </div>
            <div class="bottleneck-info-box">
              <span id="bottleneck-text" class="bottleneck-text">Synergy</span>
              <p id="bottleneck-advice" class="bottleneck-advice"></p>
            </div>
          </div>
        </div>

        <!-- Scroll down indicator -->
        <a href="#details-section" class="scroll-down-hint">
          <span>Подробная аналитика (FPS, Совместимость) ↓</span>
        </a>
      </section>

      <!-- RIGHT COLUMN: Storage & Peripherals (SSD, HDD, PSU, Case, Monitor) -->
      <section class="stage-col stage-col-right">
        <!-- 6. SSD -->
        <div class="slot-card" data-category="ssd" id="slot-ssd">
          <span class="slot-num">06</span>
          <span class="slot-category-icon">{icons['ssd']}</span>
          <div class="slot-body">
            <div class="slot-header-row">
              <span class="slot-category" data-i18n="cat.ssd">SSD Storage</span>
            </div>
            <p class="slot-placeholder" data-i18n="slot.ssd.hint">Choose SSD</p>
            <div class="slot-selected hidden">
              <span class="slot-selected-name"></span>
              <span class="slot-selected-specs"></span>
            </div>
          </div>
          <div class="slot-actions">
            <span class="slot-price hidden"></span>
            <a class="slot-buy-link hidden" target="_blank" title="Buy link">↗</a>
            <button class="btn btn-sm btn-select select-btn" data-i18n="slot.select">Select</button>
            <button class="btn-remove remove-btn hidden" title="Remove">×</button>
          </div>
        </div>

        <!-- 7. HDD -->
        <div class="slot-card" data-category="hdd" id="slot-hdd">
          <span class="slot-num">07</span>
          <span class="slot-category-icon">{icons['hdd']}</span>
          <div class="slot-body">
            <div class="slot-header-row">
              <span class="slot-category" data-i18n="cat.hdd">Hard Drive</span>
              <span class="slot-optional-badge" data-i18n="misc.optional">optional</span>
            </div>
            <p class="slot-placeholder" data-i18n="slot.hdd.hint">Hard Drive (optional)</p>
            <div class="slot-selected hidden">
              <span class="slot-selected-name"></span>
              <span class="slot-selected-specs"></span>
            </div>
          </div>
          <div class="slot-actions">
            <span class="slot-price hidden"></span>
            <a class="slot-buy-link hidden" target="_blank" title="Buy link">↗</a>
            <button class="btn btn-sm btn-select select-btn" data-i18n="slot.select">Select</button>
            <button class="btn-remove remove-btn hidden" title="Remove">×</button>
          </div>
        </div>

        <!-- 8. PSU -->
        <div class="slot-card" data-category="psu" id="slot-psu">
          <span class="slot-num">08</span>
          <span class="slot-category-icon">{icons['psu']}</span>
          <div class="slot-body">
            <div class="slot-header-row">
              <span class="slot-category" data-i18n="cat.psu">Power Supply</span>
            </div>
            <p class="slot-placeholder" data-i18n="slot.psu.hint">Choose Power Supply</p>
            <div class="slot-selected hidden">
              <span class="slot-selected-name"></span>
              <span class="slot-selected-specs"></span>
            </div>
          </div>
          <div class="slot-actions">
            <span class="slot-price hidden"></span>
            <a class="slot-buy-link hidden" target="_blank" title="Buy link">↗</a>
            <button class="btn btn-sm btn-select select-btn" data-i18n="slot.select">Select</button>
            <button class="btn-remove remove-btn hidden" title="Remove">×</button>
          </div>
        </div>

        <!-- 9. Case -->
        <div class="slot-card" data-category="case" id="slot-case">
          <span class="slot-num">09</span>
          <span class="slot-category-icon">{icons['case']}</span>
          <div class="slot-body">
            <div class="slot-header-row">
              <span class="slot-category" data-i18n="cat.case">Case</span>
            </div>
            <p class="slot-placeholder" data-i18n="slot.case.hint">Choose Case</p>
            <div class="slot-selected hidden">
              <span class="slot-selected-name"></span>
              <span class="slot-selected-specs"></span>
            </div>
          </div>
          <div class="slot-actions">
            <span class="slot-price hidden"></span>
            <a class="slot-buy-link hidden" target="_blank" title="Buy link">↗</a>
            <button class="btn btn-sm btn-select select-btn" data-i18n="slot.select">Select</button>
            <button class="btn-remove remove-btn hidden" title="Remove">×</button>
          </div>
        </div>

        <!-- 10. Monitor -->
        <div class="slot-card" data-category="monitor" id="slot-monitor">
          <span class="slot-num">10</span>
          <span class="slot-category-icon">{icons['monitor']}</span>
          <div class="slot-body">
            <div class="slot-header-row">
              <span class="slot-category" data-i18n="cat.monitor">Monitor</span>
              <span class="slot-optional-badge" data-i18n="misc.optional">optional</span>
            </div>
            <p class="slot-placeholder" data-i18n="slot.monitor.hint">Monitor (optional)</p>
            <div class="slot-selected hidden">
              <span class="slot-selected-name"></span>
              <span class="slot-selected-specs"></span>
            </div>
          </div>
          <div class="slot-actions">
            <span class="slot-price hidden"></span>
            <a class="slot-buy-link hidden" target="_blank" title="Buy link">↗</a>
            <button class="btn btn-sm btn-select select-btn" data-i18n="slot.select">Select</button>
            <button class="btn-remove remove-btn hidden" title="Remove">×</button>
          </div>
        </div>
      </section>
    </main>

    <!-- BELOW THE FOLD DETAILS: Scrolled down for in-depth insights -->
    <section class="details-section" id="details-section">
      <div class="details-header">
        <h2>Детальная аналитика системы</h2>
        <p>Игровой потенциал, энергопотребление, совместимость и сохранённые сборки</p>
      </div>

      <div class="details-grid">
        <!-- 1. Gaming FPS Panel -->
        <div class="details-panel" id="fps-panel">
          <div class="details-panel-header">
            <span class="details-panel-title" data-i18n="dash.fps">Estimated Gaming FPS</span>
            <select id="fps-resolution" class="select-sm">
              <option value="1080p">1080p Full HD</option>
              <option value="1440p" selected>1440p QHD (2K)</option>
              <option value="4k">4K UHD</option>
            </select>
          </div>
          <div id="fps-placeholder" class="placeholder-text" data-i18n="dash.fps.select">Select CPU and GPU to estimate performance</div>
          <div id="fps-grid" class="fps-grid hidden"></div>
        </div>

        <!-- 2. Compatibility Inspector -->
        <div class="details-panel" id="compatibility-panel">
          <div class="details-panel-header">
            <span class="details-panel-title" data-i18n="dash.compat">Compatibility Check</span>
          </div>
          <ul id="compatibility-list" class="compatibility-list">
            <li class="compat-info-item" data-i18n="dash.compat.empty">Add components to check compatibility</li>
          </ul>
        </div>

        <!-- 3. Saved Builds Panel -->
        <div class="details-panel" id="saved-builds-panel">
          <div class="details-panel-header">
            <span class="details-panel-title" data-i18n="dash.saved">Saved Builds</span>
          </div>
          <div id="saved-builds-list" class="saved-builds-list">
            <!-- Populated by JS -->
          </div>
        </div>
      </div>
    </section>
  </div>

  <!-- Drawer (Slide-out panel for selecting parts) -->
  <div class="drawer-overlay" id="drawer-overlay"></div>
  <aside class="drawer" id="drawer">
    <div class="drawer-header">
      <div class="drawer-header-left">
        <h3 id="drawer-title">Выбор детали</h3>
        <span class="drawer-count-badge" id="drawer-count-badge">0</span>
      </div>
      <button id="drawer-close" class="btn-close">×</button>
    </div>
    <div class="drawer-toolbar">
      <input id="parts-search" type="text" placeholder="Search..." data-i18n="[placeholder]drawer.search">
      <div class="drawer-filters">
        <label class="toggle-compat-label">
          <input id="toggle-compat" type="checkbox" checked>
          <span class="toggle-text" data-i18n="drawer.compatible">Compatible only</span>
        </label>
        <select id="sort-select" class="select-sm">
          <option value="default" data-i18n="drawer.sort.default">Default</option>
          <option value="price-asc" data-i18n="drawer.sort.priceAsc">Price ↑</option>
          <option value="price-desc" data-i18n="drawer.sort.priceDesc">Price ↓</option>
        </select>
      </div>
    </div>
    <div class="parts-list" id="parts-list">
      <!-- Populated by JS -->
    </div>
  </aside>

  <!-- Auto-Builder Modal -->
  <div class="modal-overlay" id="auto-builder-modal">
    <div class="modal">
      <div class="modal-header">
        <h3 data-i18n="modal.autobuild.title">Magic Auto-Builder</h3>
        <button class="btn-close" id="auto-builder-close-btn">×</button>
      </div>
      <div class="modal-body">
        <p style="margin-bottom: 1rem; color: var(--text-secondary); font-size: 0.85rem;">Укажите желаемый бюджет и целевое разрешение — алгоритм сбалансирует сборку за вас.</p>
        <div style="margin-bottom: 1rem;">
          <label style="display: block; font-size: 0.75rem; font-weight: 600; margin-bottom: 0.35rem;">Бюджет (USD $)</label>
          <input type="number" id="auto-budget-input" class="export-textarea" style="height: 40px; padding: 0.5rem 0.75rem; font-family: var(--font-sans);" placeholder="Например: 1200" value="1200">
        </div>
        <div style="margin-bottom: 1.5rem;">
          <label style="display: block; font-size: 0.75rem; font-weight: 600; margin-bottom: 0.35rem;">Разрешение монитора</label>
          <select id="auto-res-input" class="select-sm" style="width: 100%; height: 40px; padding: 0.5rem 0.75rem; font-size: 0.85rem;">
            <option value="1080p">1080p Full HD</option>
            <option value="1440p" selected>1440p QHD (2K)</option>
            <option value="4k">4K UHD</option>
          </select>
        </div>
      </div>
      <div class="modal-footer">
        <button id="auto-build-confirm-btn" class="btn btn-primary">Собрать ПК ✨</button>
      </div>
    </div>
  </div>

  <!-- Export / Share Modal -->
  <div class="modal-overlay" id="export-modal">
    <div class="modal">
      <div class="modal-header">
        <h3 data-i18n="modal.export.title">Спецификация сборки</h3>
        <button class="btn-close" id="modal-close-btn">×</button>
      </div>
      <div class="modal-body">
        <textarea id="export-textarea" class="export-textarea" readonly></textarea>
      </div>
      <div class="modal-footer">
        <button id="btn-print" class="btn btn-secondary" data-i18n="action.print">Печать</button>
        <button id="btn-copy-spec" class="btn btn-primary" data-i18n="action.copy">Копировать</button>
      </div>
    </div>
  </div>

  <!-- Save Build Modal -->
  <div class="modal-overlay" id="save-modal">
    <div class="modal">
      <div class="modal-header">
        <h3 data-i18n="modal.save.title">Сохранить сборку</h3>
        <button class="btn-close" id="save-close-btn">×</button>
      </div>
      <div class="modal-body">
        <input type="text" id="save-name-input" class="export-textarea" style="height: 40px; padding: 0.5rem 0.75rem;" placeholder="Название сборки..." data-i18n="[placeholder]modal.save.placeholder">
      </div>
      <div class="modal-footer">
        <button id="save-confirm-btn" class="btn btn-primary" data-i18n="action.save">Сохранить</button>
      </div>
    </div>
  </div>

  <!-- Comparison Modal -->
  <div class="modal-overlay" id="comparison-modal">
    <div class="modal modal-lg">
      <div class="modal-header">
        <h3 data-i18n="modal.compare.title">Сравнение сохранённых сборок</h3>
        <button class="btn-close" id="comparison-close">×</button>
      </div>
      <div class="modal-body">
        <div class="comparison-scroll" id="comparison-content">
          <!-- Populated by JS -->
        </div>
      </div>
    </div>
  </div>

  <!-- Main Application Script -->
  <script type="module" src="js/app.js"></script>
</body>
</html>
"""

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)

print("Generated clean index.html successfully!")
