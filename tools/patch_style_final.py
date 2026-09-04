import re

with open("css/style.css", "r", encoding="utf-8") as f:
    css = f.read()

# Strip any previous DASHBOARD REDESIGN or BENTO blocks
idx = css.find("/* DASHBOARD REDESIGN */")
if idx != -1:
    css = css[:idx]

new_stage_css = """/* =============================================================
   SINGLE-SCREEN COMPACT STAGE & ANALYTICS LAYOUT (2026)
   ============================================================= */

html, body {
  overflow-x: hidden;
  scroll-behavior: smooth;
}

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Compact Header */
.header {
  padding: 0.65rem 1.5rem;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--surface-glass);
  backdrop-filter: var(--glass-blur);
  position: sticky;
  top: 0;
  z-index: 40;
}
.header-left .title-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.header-left h1 {
  font-size: 1.15rem;
  font-weight: 800;
  letter-spacing: 0.02em;
}
.data-date-badge {
  font-size: 0.65rem;
  padding: 0.15rem 0.4rem;
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  font-weight: 600;
  color: var(--text-secondary);
}
.subtitle {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  margin-top: 0.1rem;
}

/* Compact Toolbar */
.toolbar {
  padding: 0.5rem 1.5rem;
  border-bottom: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  background: var(--surface-glass);
  backdrop-filter: var(--glass-blur);
}
.toolbar-center {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.auto-builder-btn {
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(99, 102, 241, 0.15)) !important;
  border-color: rgba(99, 102, 241, 0.3) !important;
  font-weight: 700 !important;
  color: var(--accent) !important;
}
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}
.btn-sm, .btn {
  font-size: 0.78rem;
  padding: 0.35rem 0.65rem;
}

/* -------------------------------------------------------------
   MAIN STAGE: Exactly 1 Screen Viewport
   ------------------------------------------------------------- */
.main-stage {
  display: grid;
  grid-template-columns: 330px 1fr 330px;
  gap: 1rem;
  padding: 0.75rem 1.25rem;
  max-width: 1750px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
  height: calc(100vh - 110px);
  min-height: 580px;
  align-items: stretch;
}

.stage-col {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.5rem;
}

.stage-col-left, .stage-col-right {
  overflow: visible;
}

/* Slot Cards */
.slot-card {
  padding: 0.6rem 0.85rem;
  min-height: 72px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-radius: 10px;
  background: var(--surface-glass);
  backdrop-filter: blur(10px);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
  transition: all 0.2s var(--ease);
  position: relative;
  box-sizing: border-box;
}
.slot-card:hover {
  transform: translateY(-2px);
  border-color: var(--border-hover);
  box-shadow: var(--shadow-md);
}
.slot-card.filled {
  border-left: 3px solid var(--accent);
}
.slot-num {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--text-tertiary);
}
.slot-category-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  color: var(--text-secondary);
}
.slot-category-icon svg {
  width: 22px;
  height: 22px;
}
.slot-body {
  flex: 1;
  min-width: 0;
}
.slot-header-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.15rem;
}
.slot-category {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-tertiary);
}
.slot-optional-badge {
  font-size: 0.6rem;
  padding: 0.05rem 0.3rem;
  border-radius: var(--radius-pill);
  background: var(--bg-subtle);
  color: var(--text-muted);
}
.slot-placeholder {
  font-size: 0.8rem;
  color: var(--text-muted);
}
.slot-selected-name {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.slot-selected-specs {
  display: block;
  font-size: 0.72rem;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.slot-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
  flex-shrink: 0;
}
.slot-price {
  font-family: var(--font-mono);
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text-primary);
}
.select-btn {
  font-size: 0.72rem;
  padding: 0.25rem 0.55rem;
  border-radius: 6px;
}
.remove-btn {
  background: transparent;
  border: none;
  color: var(--text-tertiary);
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  padding: 0.1rem;
}
.remove-btn:hover {
  color: var(--error);
}

/* GPU Analogs Chips Box */
.gpu-analogs-box {
  margin-top: 0.4rem;
  padding: 0.35rem 0.5rem;
  background: var(--bg-subtle);
  border-radius: 6px;
  border-left: 2px solid var(--accent);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.analogs-label {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-tertiary);
  letter-spacing: 0.04em;
}
.analogs-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}
.analog-chip-btn {
  font-family: var(--font-sans);
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-primary);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  transition: all 0.15s var(--ease);
}
.analog-chip-btn:hover {
  background: var(--accent);
  color: var(--accent-contrast);
  border-color: var(--accent);
  transform: translateY(-1px);
}
.analog-chip-price {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  opacity: 0.8;
}

/* -------------------------------------------------------------
   CENTER COLUMN: Total Price, "Воображаемый ПК" (Schematic), Synergy
   ------------------------------------------------------------- */
.stage-col-center {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.65rem;
}

.center-summary {
  background: var(--surface-glass);
  backdrop-filter: var(--glass-blur);
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
}
.center-summary-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.4rem;
}
.center-summary-label {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
}
.center-price-val {
  font-family: var(--font-mono);
  font-size: 1.85rem;
  font-weight: 800;
  color: var(--accent);
}
.center-power-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.center-power-row .power-meta {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  flex-shrink: 0;
}
.center-power-row .power-label {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}
.center-power-row .power-val {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 700;
}
.center-power-row .power-bar-track {
  flex: 1;
  height: 6px;
  background: var(--bg-subtle);
  border-radius: 3px;
  overflow: hidden;
}
.center-power-row .power-bar-fill {
  height: 100%;
  background: #3b82f6;
  border-radius: 3px;
  transition: width 0.3s ease;
}
.center-power-row .power-sub {
  font-size: 0.7rem;
  color: var(--text-tertiary);
  flex-shrink: 0;
}

/* Schematic Visualizer */
.center-schematic {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--surface-glass);
  backdrop-filter: var(--glass-blur);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 0.75rem;
  box-shadow: var(--shadow-sm);
  position: relative;
  overflow: hidden;
  min-height: 250px;
}
.schematic-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}
.schematic-title {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
}
.center-schematic .svg-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
#pc-svg {
  max-height: 270px;
  width: auto;
  filter: drop-shadow(0 4px 16px rgba(0,0,0,0.06));
  transition: all 0.3s ease;
}

/* Bottleneck Gauge */
.center-bottleneck {
  background: var(--surface-glass);
  backdrop-filter: var(--glass-blur);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 0.65rem 1rem;
  box-shadow: var(--shadow-sm);
}
.bottleneck-labels-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.68rem;
  color: var(--text-tertiary);
  margin-bottom: 0.25rem;
}
.bottleneck-bar-track {
  position: relative;
  height: 6px;
  background: var(--bg-subtle);
  border-radius: 3px;
  margin-bottom: 0.35rem;
}
.bottleneck-center-line {
  position: absolute;
  left: 50%;
  top: -2px;
  bottom: -2px;
  width: 2px;
  background: var(--border);
  z-index: 2;
}
.bottleneck-bar-fill {
  height: 100%;
  background: var(--accent);
  border-radius: 3px;
  transition: all 0.3s ease;
}
.bottleneck-info-box {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}
.bottleneck-text {
  font-size: 0.75rem;
  font-weight: 700;
}
.bottleneck-advice {
  font-size: 0.72rem;
  color: var(--text-secondary);
}

.scroll-down-hint {
  text-align: center;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text-tertiary);
  text-decoration: none;
  padding: 0.2rem 0;
  display: block;
  transition: color 0.2s;
}
.scroll-down-hint:hover {
  color: var(--accent);
}

/* -------------------------------------------------------------
   BELOW THE FOLD: Analytics, FPS, Compatibility, Saved Builds
   ------------------------------------------------------------- */
.details-section {
  padding: 3rem 1.5rem 5rem;
  max-width: 1750px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
  border-top: 1px solid var(--border);
}
.details-header {
  margin-bottom: 1.5rem;
}
.details-header h2 {
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 0.25rem;
}
.details-header p {
  color: var(--text-secondary);
  font-size: 0.85rem;
}
.details-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}
.details-panel {
  background: var(--surface-glass);
  backdrop-filter: var(--glass-blur);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 1.25rem;
  box-shadow: var(--shadow-sm);
}
.details-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.85rem;
  border-bottom: 1px solid var(--border-subtle);
  padding-bottom: 0.5rem;
}
.details-panel-title {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
}

/* Responsive Overrides */
@media (max-width: 1300px) {
  .main-stage {
    grid-template-columns: 280px 1fr 280px;
  }
}
@media (max-width: 1080px) {
  .main-stage {
    height: auto;
    grid-template-columns: 1fr 1fr;
  }
  .stage-col-center {
    grid-column: span 2;
    order: -1;
  }
  .details-grid {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 768px) {
  .main-stage {
    grid-template-columns: 1fr;
  }
  .stage-col-center {
    grid-column: span 1;
  }
}
"""

css = css + "\n" + new_stage_css

with open("css/style.css", "w", encoding="utf-8") as f:
    f.write(css)

print("Updated style.css with sleek single-screen stage layout!")
