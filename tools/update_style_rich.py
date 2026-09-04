with open("css/style.css", "r", encoding="utf-8") as f:
    css = f.read()

# Replace main-stage and single screen layout with perfected proportions and rich color
idx = css.find("/* =============================================================\n   SINGLE-SCREEN COMPACT STAGE")
if idx != -1:
    css = css[:idx]

new_css = """/* =============================================================
   SINGLE-SCREEN COMPACT STAGE & ENRICHED AESTHETICS (2026)
   ============================================================= */

/* Enriched Background with Ambient Lighting & Tech Dot Grid */
body {
  background-color: var(--bg);
  background-image: 
    radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.12) 0px, transparent 45%),
    radial-gradient(at 100% 0%, rgba(14, 165, 233, 0.10) 0px, transparent 40%),
    radial-gradient(at 50% 100%, rgba(168, 85, 247, 0.08) 0px, transparent 50%),
    radial-gradient(circle, rgba(148, 163, 184, 0.18) 1px, transparent 1px);
  background-size: 100% 100%, 100% 100%, 100% 100%, 24px 24px;
  background-attachment: fixed;
  color: var(--text-primary);
  font-family: var(--font-sans);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}

[data-theme="dark"] body {
  background-color: #090b10;
  background-image: 
    radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.18) 0px, transparent 50%),
    radial-gradient(at 100% 0%, rgba(14, 165, 233, 0.14) 0px, transparent 45%),
    radial-gradient(at 50% 100%, rgba(168, 85, 247, 0.12) 0px, transparent 55%),
    radial-gradient(circle, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
  background-size: 100% 100%, 100% 100%, 100% 100%, 24px 24px;
}

/* Category Accent Palette */
.slot-card[data-category="cpu"] .slot-category { color: #3b82f6; }
.slot-card[data-category="cpu"] .slot-category-icon { color: #3b82f6; background: rgba(59, 130, 246, 0.1); }
.slot-card[data-category="cpu"].filled { border-left-color: #3b82f6; }

.slot-card[data-category="motherboard"] .slot-category { color: #6366f1; }
.slot-card[data-category="motherboard"] .slot-category-icon { color: #6366f1; background: rgba(99, 102, 241, 0.1); }
.slot-card[data-category="motherboard"].filled { border-left-color: #6366f1; }

.slot-card[data-category="cooler"] .slot-category { color: #06b6d4; }
.slot-card[data-category="cooler"] .slot-category-icon { color: #06b6d4; background: rgba(6, 182, 212, 0.1); }
.slot-card[data-category="cooler"].filled { border-left-color: #06b6d4; }

.slot-card[data-category="ram"] .slot-category { color: #8b5cf6; }
.slot-card[data-category="ram"] .slot-category-icon { color: #8b5cf6; background: rgba(139, 92, 246, 0.1); }
.slot-card[data-category="ram"].filled { border-left-color: #8b5cf6; }

.slot-card[data-category="gpu"] .slot-category { color: #10b981; }
.slot-card[data-category="gpu"] .slot-category-icon { color: #10b981; background: rgba(16, 185, 129, 0.1); }
.slot-card[data-category="gpu"].filled { border-left-color: #10b981; }

.slot-card[data-category="ssd"] .slot-category { color: #f59e0b; }
.slot-card[data-category="ssd"] .slot-category-icon { color: #f59e0b; background: rgba(245, 158, 11, 0.1); }
.slot-card[data-category="ssd"].filled { border-left-color: #f59e0b; }

.slot-card[data-category="hdd"] .slot-category { color: #d97706; }
.slot-card[data-category="hdd"] .slot-category-icon { color: #d97706; background: rgba(217, 119, 6, 0.1); }
.slot-card[data-category="hdd"].filled { border-left-color: #d97706; }

.slot-card[data-category="psu"] .slot-category { color: #f97316; }
.slot-card[data-category="psu"] .slot-category-icon { color: #f97316; background: rgba(249, 115, 22, 0.1); }
.slot-card[data-category="psu"].filled { border-left-color: #f97316; }

.slot-card[data-category="case"] .slot-category { color: #64748b; }
.slot-card[data-category="case"] .slot-category-icon { color: #64748b; background: rgba(100, 116, 139, 0.1); }
.slot-card[data-category="case"].filled { border-left-color: #64748b; }

.slot-card[data-category="monitor"] .slot-category { color: #ec4899; }
.slot-card[data-category="monitor"] .slot-category-icon { color: #ec4899; background: rgba(236, 72, 153, 0.1); }
.slot-card[data-category="monitor"].filled { border-left-color: #ec4899; }

/* Main Stage Dimensions: Balanced Proportions across 3 Columns */
.main-stage {
  display: grid;
  grid-template-columns: minmax(400px, 460px) minmax(380px, 1fr) minmax(400px, 460px);
  gap: 1.25rem;
  padding: 0.75rem 1.5rem;
  max-width: 1620px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
  align-items: stretch;
}

.stage-col {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

/* Wider, Spacious Slot Cards */
.slot-card {
  padding: 0.65rem 1rem;
  min-height: 72px;
  display: flex;
  align-items: center;
  gap: 0.85rem;
  border-radius: 12px;
  background: var(--surface);
  border: 1px solid var(--border);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03), 0 1px 2px rgba(0, 0, 0, 0.02);
  transition: all 0.2s var(--ease);
  position: relative;
  box-sizing: border-box;
}

[data-theme="dark"] .slot-card {
  background: rgba(20, 24, 33, 0.85);
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.slot-card:hover {
  transform: translateY(-2px);
  border-color: var(--border-hover);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
}

.slot-num {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--text-tertiary);
  width: 18px;
}

.slot-category-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.slot-category-icon svg {
  width: 20px;
  height: 20px;
}

.slot-body {
  flex: 1;
  min-width: 0;
}

.slot-header-row {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin-bottom: 0.2rem;
}

.slot-category {
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.slot-optional-badge {
  font-size: 0.6rem;
  padding: 0.1rem 0.35rem;
  border-radius: var(--radius-pill);
  background: var(--bg-subtle);
  color: var(--text-muted);
  font-weight: 600;
}

.slot-placeholder {
  font-size: 0.82rem;
  color: var(--text-muted);
}

/* Multi-line, un-truncated full component title */
.slot-selected-name {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: normal;
  line-height: 1.25;
  font-size: 0.86rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.15rem;
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
  gap: 0.3rem;
  flex-shrink: 0;
  margin-left: 0.5rem;
}

.slot-price {
  font-family: var(--font-mono);
  font-size: 0.88rem;
  font-weight: 800;
  color: var(--text-primary);
}

.select-btn {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.28rem 0.65rem;
  border-radius: 6px;
}

/* GPU Analogs Chips Box - Horizontal, Clean, High Contrast */
.gpu-analogs-box {
  margin-top: 0.5rem;
  padding: 0.4rem 0.65rem;
  background: rgba(99, 102, 241, 0.07);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

[data-theme="dark"] .gpu-analogs-box {
  background: rgba(99, 102, 241, 0.12);
  border-color: rgba(99, 102, 241, 0.3);
}

.analogs-label {
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  color: #6366f1;
  letter-spacing: 0.05em;
}

.analogs-chips {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.analog-chip-btn {
  font-family: var(--font-sans);
  font-size: 0.74rem;
  font-weight: 600;
  padding: 0.22rem 0.55rem;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-primary);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  transition: all 0.15s var(--ease);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.analog-chip-btn:hover {
  background: var(--accent);
  color: var(--accent-contrast);
  border-color: var(--accent);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.analog-chip-price {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 700;
  opacity: 0.85;
}

/* -------------------------------------------------------------
   CENTER COLUMN: Balanced, Technical Blueprint Aesthetic
   ------------------------------------------------------------- */
.stage-col-center {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.center-summary {
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 0.85rem 1.4rem;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

[data-theme="dark"] .center-summary {
  background: rgba(20, 24, 33, 0.85);
  border-color: rgba(255, 255, 255, 0.08);
}

.center-summary-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.45rem;
}

.center-summary-label {
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-secondary);
}

.center-price-val {
  font-family: var(--font-mono);
  font-size: 2.1rem;
  font-weight: 900;
  color: var(--accent);
  letter-spacing: -0.02em;
}

.center-power-row {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.center-power-row .power-meta {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-shrink: 0;
}

.center-power-row .power-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-tertiary);
}

.center-power-row .power-val {
  font-family: var(--font-mono);
  font-size: 0.82rem;
  font-weight: 800;
  color: #3b82f6;
}

.center-power-row .power-bar-track {
  flex: 1;
  height: 7px;
  background: var(--bg-subtle);
  border-radius: 4px;
  overflow: hidden;
}

.center-power-row .power-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #06b6d4);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.center-power-row .power-sub {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text-tertiary);
  flex-shrink: 0;
}

/* High-Tech Technical Blueprint Schematic Box */
.center-schematic {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: 
    radial-gradient(circle at center, rgba(99, 102, 241, 0.04) 0%, transparent 70%),
    linear-gradient(to right, rgba(148, 163, 184, 0.08) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(148, 163, 184, 0.08) 1px, transparent 1px),
    var(--surface);
  background-size: 100% 100%, 20px 20px, 20px 20px, 100% 100%;
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 1rem 1.25rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  position: relative;
  overflow: hidden;
  min-height: 320px;
}

[data-theme="dark"] .center-schematic {
  background: 
    radial-gradient(circle at center, rgba(14, 165, 233, 0.08) 0%, transparent 70%),
    linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    #0c1017;
  background-size: 100% 100%, 20px 20px, 20px 20px, 100% 100%;
  border-color: rgba(255, 255, 255, 0.1);
}

.schematic-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-subtle);
  padding-bottom: 0.4rem;
}

.schematic-title {
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-secondary);
}

.center-schematic .svg-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

#pc-svg {
  height: 100%;
  max-height: 310px;
  width: auto;
  filter: drop-shadow(0 6px 20px rgba(0, 0, 0, 0.08));
  transition: all 0.3s ease;
}

/* Glowing active SVG components */
#pc-svg .vis-component {
  transition: all 0.3s var(--ease);
}
#pc-svg #vis-motherboard rect { stroke: #6366f1; fill: rgba(99, 102, 241, 0.06); }
#pc-svg #vis-cpu rect { stroke: #3b82f6; fill: rgba(59, 130, 246, 0.12); }
#pc-svg #vis-gpu rect { stroke: #10b981; fill: rgba(16, 185, 129, 0.12); }
#pc-svg #vis-ram rect { stroke: #8b5cf6; fill: rgba(139, 92, 246, 0.12); }
#pc-svg #vis-ssd rect { stroke: #f59e0b; fill: rgba(245, 158, 11, 0.12); }
#pc-svg #vis-cooler rect, #pc-svg #vis-cooler circle { stroke: #06b6d4; fill: rgba(6, 182, 212, 0.12); }

/* Bottleneck Gauge */
.center-bottleneck {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 0.75rem 1.25rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
}

[data-theme="dark"] .center-bottleneck {
  background: rgba(20, 24, 33, 0.85);
  border-color: rgba(255, 255, 255, 0.08);
}

.bottleneck-labels-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--text-tertiary);
  margin-bottom: 0.3rem;
}

.bottleneck-bar-track {
  position: relative;
  height: 8px;
  background: var(--bg-subtle);
  border-radius: 4px;
  margin-bottom: 0.4rem;
  overflow: hidden;
}

.bottleneck-center-line {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--border-hover);
  z-index: 2;
}

.bottleneck-bar-fill {
  height: 100%;
  background: var(--accent);
  border-radius: 4px;
  transition: all 0.3s ease;
}

.bottleneck-info-box {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.bottleneck-text {
  font-size: 0.78rem;
  font-weight: 800;
}

.bottleneck-advice {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.scroll-down-hint {
  text-align: center;
  font-size: 0.74rem;
  font-weight: 700;
  color: #6366f1;
  text-decoration: none;
  padding: 0.3rem 0;
  display: block;
  transition: all 0.2s;
}

.scroll-down-hint:hover {
  color: #4f46e5;
  transform: translateY(1px);
}

/* -------------------------------------------------------------
   BELOW THE FOLD: Analytics, FPS, Compatibility, Saved Builds
   ------------------------------------------------------------- */
.details-section {
  padding: 3.5rem 1.5rem 6rem;
  max-width: 1620px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
  border-top: 1px solid var(--border);
}

.details-header {
  margin-bottom: 1.75rem;
}

.details-header h2 {
  font-size: 1.4rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 0.3rem;
}

.details-header p {
  color: var(--text-secondary);
  font-size: 0.88rem;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.details-panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

[data-theme="dark"] .details-panel {
  background: rgba(20, 24, 33, 0.85);
  border-color: rgba(255, 255, 255, 0.08);
}

.details-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--border-subtle);
  padding-bottom: 0.65rem;
}

.details-panel-title {
  font-size: 0.82rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-secondary);
}

/* Responsive Breakpoints */
@media (max-width: 1350px) {
  .main-stage {
    grid-template-columns: 380px 1fr 380px;
    gap: 1rem;
  }
}
@media (max-width: 1150px) {
  .main-stage {
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

css = css + "\n" + new_css

with open("css/style.css", "w", encoding="utf-8") as f:
    f.write(css)

print("Updated style.css with rich palette, blueprint theme, and spacious cards!")
