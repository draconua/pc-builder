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
  <title>PC Builder 2026 — Профессиональный конфигуратор ПК</title>
  <meta name="description" content="Умный интерактивный конфигуратор ПК с детальным расчетом синергии, FPS на всех разрешениях и фильтрами платформ.">
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='%233b82f6'/><text x='16' y='21' font-family='sans-serif' font-size='13' font-weight='bold' fill='%23ffffff' text-anchor='middle'>PC</text></svg>">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css?v=20260903_v3">
</head>
<body>
  <div class="app">
    <!-- TOP NAVIGATION BAR -->
    <header class="app-header-main">
      <div class="header-inner">
        <!-- Brand -->
        <div class="header-brand">
          <div class="brand-logo">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/></svg>
          </div>
          <span class="brand-title">PC BUILDER <span class="brand-badge">2026</span></span>
        </div>

        <!-- Presets & Auto-Build -->
        <div class="header-center-controls">
          <div class="autobuild-container">
            <button id="btn-auto-builder" class="auto-builder-pill" type="button">
              ✨ Умный авто-подбор
            </button>
            
            <!-- Floating Auto-Build Popover -->
            <div class="autobuild-popover hidden" id="autobuild-popover">
              <div class="popover-header">
                <span class="popover-title">✨ Параметры авто-подбора ПК</span>
                <button id="autobuild-popover-close" class="popover-close-btn" type="button">×</button>
              </div>
              <div class="popover-body">
                <!-- Budget -->
                <div class="popover-field">
                  <div class="popover-label-row">
                    <span class="field-title">Желаемый бюджет:</span>
                    <div style="display:flex;align-items:center;gap:0.35rem;">
                      <span id="budget-display-val" class="budget-tag">5000 zł</span>
                      <span class="budget-buffer-badge">допуск +5%</span>
                    </div>
                  </div>
                  <input type="range" id="auto-budget-range" min="2000" max="16000" step="100" value="5000" class="budget-slider">
                  <div class="quick-budgets">
                    <button type="button" class="quick-budget-btn" data-val="3000">3000 zł</button>
                    <button type="button" class="quick-budget-btn active" data-val="5000">5000 zł</button>
                    <button type="button" class="quick-budget-btn" data-val="7500">7500 zł</button>
                    <button type="button" class="quick-budget-btn" data-val="10000">10000 zł</button>
                  </div>
                </div>

                <!-- CPU Platform Choice -->
                <div class="popover-field">
                  <span class="field-title">Платформа процессора:</span>
                  <div class="choice-chips" id="cpu-brand-group">
                    <button type="button" class="choice-chip active" data-cpu-brand="all">Все</button>
                    <button type="button" class="choice-chip" data-cpu-brand="AMD">AMD Ryzen</button>
                    <button type="button" class="choice-chip" data-cpu-brand="Intel">Intel Core</button>
                  </div>
                </div>

                <!-- GPU Brand Choice -->
                <div class="popover-field">
                  <span class="field-title">Платформа видеокарты:</span>
                  <div class="choice-chips" id="gpu-brand-group">
                    <button type="button" class="choice-chip active" data-gpu-brand="all">Все</button>
                    <button type="button" class="choice-chip" data-gpu-brand="NVIDIA">NVIDIA RTX</button>
                    <button type="button" class="choice-chip" data-gpu-brand="AMD">AMD Radeon</button>
                  </div>
                </div>

                <!-- Target Gaming -->
                <div class="popover-field">
                  <span class="field-title">Целевой гейминг:</span>
                  <div class="res-chips">
                    <button type="button" class="res-chip" data-res="1080p">1080p FHD</button>
                    <button type="button" class="res-chip active" data-res="1440p">1440p 2K</button>
                    <button type="button" class="res-chip" data-res="4k">4K Ultra</button>
                  </div>
                </div>

                <button type="button" id="auto-build-confirm-btn" class="btn btn-primary popover-action-btn">
                  Собрать конфигурацию ✨
                </button>
              </div>
            </div>
          </div>

          <div class="presets-segmented">
            <button class="preset-btn" data-preset="budget">Бюджетная</button>
            <button class="preset-btn" data-preset="balanced">Оптимальная</button>
            <button class="preset-btn" data-preset="ultimate">Топовая</button>
          </div>
        </div>

        <!-- Controls Right -->
        <div class="header-right-controls">
          <div class="segmented-control currency-control">
            <button class="currency-btn active" data-currency="PLN">PLN</button>
            <button class="currency-btn" data-currency="USD">USD</button>
          </div>
          <div class="segmented-control lang-control">
            <button class="lang-btn active" data-lang="ru">RU</button>
            <button class="lang-btn" data-lang="en">EN</button>
            <button class="lang-btn" data-lang="pl">PL</button>
            <button class="lang-btn" data-lang="ua">UA</button>
          </div>
          <button id="theme-toggle" class="theme-toggle-btn" aria-label="Toggle theme">☀</button>
        </div>
      </div>
    </header>

    <!-- SUB-HEADER / COMMAND BAR -->
    <div class="app-command-bar">
      <div class="command-bar-inner">
        <!-- Progress Indicator -->
        <div class="progress-indicator-box">
          <div class="progress-ring-mini">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <circle stroke="var(--border)" stroke-width="2.5" fill="transparent" r="9" cx="12" cy="12"/>
              <circle id="progress-ring-circle" stroke="#3b82f6" stroke-width="2.5" fill="transparent" r="9" cx="12" cy="12" stroke-dasharray="56.5" stroke-dashoffset="56.5"/>
            </svg>
          </div>
          <span class="progress-text-label"><strong id="progress-text">0 / 8</strong> <span class="progress-sub" id="progress-sub">компонентов</span></span>
        </div>

        <!-- Action Tools -->
        <div class="command-actions">
          <button id="btn-clear" class="btn-tool" type="button" title="Очистить всё">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
            <span>Очистить</span>
          </button>
          <button id="btn-save" class="btn-tool" type="button" title="Сохранить в избранное">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            <span>Сохранить</span>
          </button>
          <button id="btn-compare" class="btn-tool" type="button" title="Сравнить сборки">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            <span>Сравнить</span>
          </button>
          <button id="btn-timelapse" class="btn-tool" type="button" title="Анимация сборки">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            <span>Анимация</span>
          </button>
          <button id="btn-export" class="btn-tool" type="button" title="Экспорт конфигурации">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span>Экспорт</span>
          </button>
          <button id="btn-share" class="btn-share-accent" type="button" title="Поделиться ссылкой">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            <span>Поделиться</span>
          </button>
        </div>
      </div>
    </div>

    <!-- MAIN SINGLE-SCREEN STAGE -->
    <main class="main-stage">
      <!-- LEFT COLUMN: Core Engine (CPU, Motherboard, Cooler, RAM, GPU) -->
      <section class="stage-col stage-col-left">
        <!-- 1. CPU -->
        <div class="slot-card" data-category="cpu" id="slot-cpu">
          <span class="slot-num">01</span>
          <span class="slot-category-icon">{icons['cpu']}</span>
          <div class="slot-body">
            <div class="slot-header-row">
              <span class="slot-category" data-i18n="cat.cpu">Processor</span>
            </div>
            <p class="slot-placeholder" data-i18n="slot.cpu.hint">Choose Processor</p>
            <div class="slot-selected hidden">
              <span class="slot-selected-name"></span>
              <span class="slot-selected-specs"></span>
            </div>
            <!-- CPU Analogs Box -->
            <div class="analogs-box hidden" id="cpu-analogs-box">
              <span class="analogs-title">Альтернативы процессора:</span>
              <div class="analogs-list" id="cpu-analogs-list"></div>
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
            <!-- GPU Analogs Box -->
            <div class="analogs-box hidden" id="gpu-analogs-box">
              <span class="analogs-title">Аналоги по мощности:</span>
              <div class="analogs-list" id="gpu-analogs-list"></div>
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

      <!-- CENTER COLUMN: Visual Blueprint, Live Cost & Synergy -->
      <section class="stage-col stage-col-center">
        <!-- Top Summary Bar -->
        <div class="stage-panel center-summary">
          <div class="center-price-row">
            <span class="center-summary-label" data-i18n="dash.total">TOTAL</span>
            <span class="center-price-val" id="total-price">0 zł</span>
          </div>
          <div class="center-power-row">
            <div class="power-left">
              <span class="power-label" data-i18n="dash.power">Est. Power</span>
              <strong class="power-val" id="power-value">0W</strong>
            </div>
            <div class="power-track">
              <div class="power-bar-fill" id="power-bar" style="width: 0%;"></div>
            </div>
            <span class="power-sub" id="power-limit-text">БП не выбран</span>
          </div>
        </div>

        <!-- Center Schematic / Blueprint -->
        <div class="stage-panel center-schematic">
          <div class="schematic-header">
            <span class="schematic-title">Схема сборки (Интерактивная)</span>
            <span class="status-badge" id="chassis-status" data-i18n="status.waiting">Waiting</span>
          </div>
          <div class="svg-container">
            {pc_svg}
          </div>
        </div>

        <!-- Balance & Synergy Gauge -->
        <div class="stage-panel center-bottleneck" id="bottleneck-panel">
          <div id="bottleneck-placeholder" class="placeholder-text" data-i18n="dash.bottleneck.select">Выберите процессор и видеокарту для проверки баланса</div>
          <div id="bottleneck-result" class="bottleneck-result hidden">
            <div class="bottleneck-labels-row">
              <span class="bottleneck-side-label">Баланс и синергия системы</span>
              <span id="bottleneck-score-badge" class="bottleneck-score-badge">98%</span>
            </div>
            <div class="bottleneck-bar-track">
              <div class="bottleneck-bar-fill" id="bottleneck-bar" style="width: 98%;"></div>
            </div>
            <div class="bottleneck-info-box">
              <span id="bottleneck-text" class="bottleneck-text">Идеальный баланс (Золотой стандарт)</span>
              <p id="bottleneck-advice" class="bottleneck-advice"></p>
            </div>
          </div>
        </div>

        <!-- Scroll down indicator -->
        <a href="#details-section" class="scroll-down-hint">
          <span>Подробная аналитика (FPS во всех разрешениях, Совместимость) ↓</span>
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
              <span class="slot-category" data-i18n="cat.ssd">SSD Drive</span>
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

        <!-- 7. HDD (Optional) -->
        <div class="slot-card" data-category="hdd" id="slot-hdd">
          <span class="slot-num">07</span>
          <span class="slot-category-icon">{icons['hdd']}</span>
          <div class="slot-body">
            <div class="slot-header-row">
              <span class="slot-category" data-i18n="cat.hdd">Hard Drive</span>
              <span class="optional-badge" data-i18n="badge.optional">Optional</span>
            </div>
            <p class="slot-placeholder" data-i18n="slot.hdd.hint">Choose HDD (Optional)</p>
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

        <!-- 10. Monitor (Optional) -->
        <div class="slot-card" data-category="monitor" id="slot-monitor">
          <span class="slot-num">10</span>
          <span class="slot-category-icon">{icons['monitor']}</span>
          <div class="slot-body">
            <div class="slot-header-row">
              <span class="slot-category" data-i18n="cat.monitor">Monitor</span>
              <span class="optional-badge" data-i18n="badge.optional">Optional</span>
            </div>
            <p class="slot-placeholder" data-i18n="slot.monitor.hint">Choose Monitor (Optional)</p>
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

    <!-- BELOW THE FOLD: ANALYTICS & SAVED BUILDS -->
    <section class="details-section" id="details-section">
      <div class="details-header">
        <h2>Детальная аналитика системы</h2>
        <p>Игровой потенциал во всех разрешениях, совместимость стандартов и сохранённые сборки</p>
      </div>

      <div class="details-grid">
        <!-- ALL-RESOLUTIONS FPS MATRIX -->
        <div class="panel fps-matrix-panel" id="fps-panel">
          <div class="panel-header">
            <h3 data-i18n="dash.fps.title">ОЦЕНКА FPS В ИГРАХ (ВСЕ РАЗРЕШЕНИЯ)</h3>
            <span class="fps-benchmark-note">Ультра настройки • Без генерации кадров</span>
          </div>
          <div id="fps-placeholder" class="placeholder-text" data-i18n="dash.fps.select">Выберите процессор и видеокарту для расчета FPS</div>
          <div id="fps-table-container" class="fps-table-container hidden">
            <table class="fps-matrix-table">
              <thead>
                <tr>
                  <th class="col-game">Игра / Жанр</th>
                  <th class="col-res col-1080">1080p Full HD</th>
                  <th class="col-res col-1440">1440p 2K QHD</th>
                  <th class="col-res col-4k">4K Ultra UHD</th>
                </tr>
              </thead>
              <tbody id="fps-matrix-tbody">
                <!-- Dynamically populated -->
              </tbody>
            </table>
          </div>
        </div>

        <!-- Compatibility Check -->
        <div class="panel" id="compatibility-panel">
          <div class="panel-header">
            <h3 data-i18n="dash.compat.title">СОВМЕСТИМОСТЬ</h3>
          </div>
          <div id="compatibility-list" class="compatibility-list">
            <div class="compat-item info" data-i18n="dash.compat.empty">
              Выберите компоненты для проверки физической и электрической совместимости
            </div>
          </div>
        </div>

        <!-- Saved Builds -->
        <div class="panel" id="saved-builds-panel">
          <div class="panel-header">
            <h3 data-i18n="dash.saved.title">СОХРАНЁННЫЕ СБОРКИ</h3>
          </div>
          <div id="saved-builds-list" class="saved-builds-list">
            <div class="placeholder-text" data-i18n="dash.saved.empty">Нет сохранённых конфигураций</div>
          </div>
        </div>
      </div>
    </section>

    <!-- DRAWER FOR COMPONENT SELECTION -->
    <div id="drawer-overlay" class="drawer-overlay"></div>
    <aside id="drawer" class="drawer">
      <div class="drawer-header">
        <div class="drawer-header-left">
          <h2 id="drawer-title" data-i18n="drawer.title">Select Component</h2>
          <span class="drawer-count-badge" id="drawer-parts-count">0 доступно</span>
        </div>
        <button id="drawer-close" class="drawer-close-btn" aria-label="Close drawer">×</button>
      </div>
      <div class="drawer-controls">
        <div class="search-input-wrapper">
          <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" id="parts-search" placeholder="Поиск по названию или бренду...">
        </div>
        <div class="drawer-filters">
          <select id="sort-select" class="control-select">
            <option value="price-asc" data-i18n="sort.priceAsc">Сначала дешевле</option>
            <option value="price-desc" data-i18n="sort.priceDesc">Сначала дороже</option>
            <option value="name" data-i18n="sort.name">По имени</option>
          </select>
          <label class="filter-checkbox-label">
            <input type="checkbox" id="filter-compat" checked>
            <span data-i18n="filter.compatOnly">Только совместимые</span>
          </label>
        </div>
      </div>
      <div id="parts-list" class="parts-list">
        <!-- Rendered by JS -->
      </div>
    </aside>

    <!-- MODAL: SAVE BUILD -->
    <div id="save-modal" class="modal-overlay">
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 data-i18n="modal.save.title">Сохранить сборку</h3>
          <button class="modal-close" id="save-modal-close">×</button>
        </div>
        <div class="modal-body">
          <label for="save-build-name" class="modal-label" data-i18n="modal.save.label">Название конфигурации:</label>
          <input type="text" id="save-build-name" class="modal-input" placeholder="Мой игровой ПК 2026">
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="save-modal-cancel" data-i18n="action.cancel">Отмена</button>
          <button class="btn btn-primary" id="save-modal-confirm" data-i18n="action.save">Сохранить</button>
        </div>
      </div>
    </div>

    <!-- MODAL: EXPORT BUILD -->
    <div id="export-modal" class="modal-overlay">
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 data-i18n="modal.export.title">Экспорт конфигурации</h3>
          <button class="modal-close" id="export-modal-close">×</button>
        </div>
        <div class="modal-body">
          <textarea id="export-text" class="modal-textarea" readonly></textarea>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="export-modal-copy" data-i18n="action.copy">Копировать</button>
          <button class="btn btn-primary" id="export-modal-ok">Закрыть</button>
        </div>
      </div>
    </div>

    <!-- MODAL: COMPARISON -->
    <div id="comparison-modal" class="modal-overlay">
      <div class="modal-dialog modal-lg">
        <div class="modal-header">
          <h3 data-i18n="modal.compare.title">Сравнение конфигураций</h3>
          <button class="modal-close" id="comparison-modal-close">×</button>
        </div>
        <div class="modal-body">
          <div id="comparison-content" class="comparison-container"></div>
        </div>
      </div>
    </div>
  </div>

  <script type="module" src="js/app.js?v=20260903_v3"></script>
</body>
</html>
"""

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)

print("Generated clean, pristine index.html with 2-tier header, multi-resolution FPS and platform choices!")
