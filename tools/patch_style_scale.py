with open("css/style.css", "r", encoding="utf-8") as f:
    css = f.read()

# Scale up layout and typography by ~15%
scale_css = """
/* =============================================================
   15% SCALED PROPORTIONS & SYNERGY GAUGE (2026)
   ============================================================= */

.app-header {
  height: 64px !important;
  padding: 0 1.8rem !important;
}

.brand-logo {
  width: 36px !important;
  height: 36px !important;
}

.brand-title {
  font-size: 1.08rem !important;
}

.brand-badge {
  font-size: 0.68rem !important;
  padding: 0.12rem 0.4rem !important;
}

.progress-inline-pill {
  font-size: 0.82rem !important;
  padding: 0.25rem 0.65rem !important;
}

.auto-builder-pill {
  font-size: 0.84rem !important;
  padding: 0.42rem 0.95rem !important;
}

.presets-segmented .preset-btn {
  font-size: 0.84rem !important;
  padding: 0.36rem 0.75rem !important;
}

.btn-tool {
  font-size: 0.82rem !important;
  padding: 0.36rem 0.72rem !important;
}

.btn-share-accent {
  font-size: 0.82rem !important;
  padding: 0.36rem 0.85rem !important;
}

.main-stage {
  grid-template-columns: minmax(430px, 490px) minmax(400px, 1fr) minmax(430px, 490px) !important;
  gap: 1.5rem !important;
  max-width: 1720px !important;
  padding: 1rem 1.8rem !important;
}

.stage-col {
  gap: 0.7rem !important;
}

.slot-card {
  min-height: 82px !important;
  padding: 0.8rem 1.15rem !important;
  gap: 1rem !important;
  border-radius: 14px !important;
}

.slot-num {
  font-size: 0.80rem !important;
  width: 22px !important;
}

.slot-category-icon {
  width: 40px !important;
  height: 40px !important;
  border-radius: 10px !important;
}

.slot-category-icon svg {
  width: 24px !important;
  height: 24px !important;
}

.slot-category {
  font-size: 0.80rem !important;
  letter-spacing: 0.07em !important;
}

.slot-selected-name {
  font-size: 0.96rem !important;
  line-height: 1.3 !important;
}

.slot-selected-specs {
  font-size: 0.80rem !important;
}

.slot-price {
  font-size: 1.02rem !important;
}

.select-btn {
  font-size: 0.80rem !important;
  padding: 0.34rem 0.75rem !important;
}

.analog-chip-btn {
  font-size: 0.80rem !important;
  padding: 0.28rem 0.65rem !important;
}

/* Center Column */
.center-summary {
  padding: 1rem 1.6rem !important;
  border-radius: 16px !important;
}

.center-price-val {
  font-size: 2.45rem !important;
}

.center-summary-label {
  font-size: 0.88rem !important;
}

.center-power-row .power-label, .center-power-row .power-sub {
  font-size: 0.80rem !important;
}

.center-power-row .power-val {
  font-size: 0.90rem !important;
}

.center-schematic {
  padding: 1.25rem 1.5rem !important;
  min-height: 350px !important;
  border-radius: 18px !important;
}

.schematic-title {
  font-size: 0.85rem !important;
}

#pc-svg {
  max-height: 345px !important;
}

/* Synergy & Bottleneck Gauge Upgrades */
.center-bottleneck {
  padding: 0.9rem 1.5rem !important;
  border-radius: 14px !important;
}

.bottleneck-labels-row {
  font-size: 0.82rem !important;
  margin-bottom: 0.45rem !important;
}

.bottleneck-side-label {
  font-weight: 800 !important;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
}

.bottleneck-score-badge {
  font-family: var(--font-mono);
  font-size: 0.82rem;
  font-weight: 800;
  padding: 0.15rem 0.5rem;
  border-radius: 6px;
  background: rgba(16, 185, 129, 0.12);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.25);
}

.bottleneck-score-badge.cpu_bound {
  background: rgba(239, 68, 68, 0.12);
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.25);
}

.bottleneck-score-badge.gpu_bound {
  background: rgba(245, 158, 11, 0.12);
  color: #f59e0b;
  border-color: rgba(245, 158, 11, 0.25);
}

.bottleneck-bar-track {
  height: 9px !important;
  border-radius: 5px !important;
  margin-bottom: 0.5rem !important;
  background: var(--bg-subtle);
  overflow: hidden;
  position: relative;
}

.bottleneck-bar-fill {
  height: 100% !important;
  border-radius: 5px !important;
  transition: all 0.4s var(--ease) !important;
}

.bottleneck-text {
  font-size: 0.86rem !important;
  font-weight: 800 !important;
}

.bottleneck-advice {
  font-size: 0.80rem !important;
  line-height: 1.35 !important;
}
"""

css = css + "\n" + scale_css

with open("css/style.css", "w", encoding="utf-8") as f:
    f.write(css)

print("Scaled up UI elements by ~15% and added polished synergy badge styling!")
