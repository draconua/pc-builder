with open("css/style.css", "r", encoding="utf-8") as f:
    css = f.read()

# Replace the 3-column details-grid with responsive 3-column + full width FPS
old_grid = """.details-grid {
  width: 100% !important;
  max-width: 100% !important;
  display: grid !important;
  grid-template-columns: 1.6fr 1.3fr 0.9fr !important;
  gap: 1.8rem !important;
}"""

new_grid = """.details-grid {
  width: 100% !important;
  max-width: 100% !important;
  display: grid !important;
  grid-template-columns: repeat(3, 1fr) !important;
  gap: 1.6rem !important;
}

.fps-matrix-panel {
  grid-column: 1 / -1 !important;
}

@media (max-width: 1150px) {
  .details-grid {
    grid-template-columns: 1fr !important;
  }
  .fps-matrix-panel {
    grid-column: 1 !important;
  }
}"""

if old_grid in css:
    css = css.replace(old_grid, new_grid)
    print("Replaced .details-grid layout.")
else:
    print("WARNING: Exact old_grid string not found.")

monitor_and_chips_css = """
/* =============================================================
   MONITOR RECOMMENDATION PANEL & ANALOG CHIP BUTTONS
   ============================================================= */

.monitor-panel {
  display: flex;
  flex-direction: column;
  background: var(--surface-glass);
  backdrop-filter: var(--glass-blur);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 1.1rem;
  box-shadow: var(--shadow-xs);
  transition: border-color var(--duration-normal) var(--ease);
}

.monitor-panel:hover {
  border-color: var(--border-hover);
}

.monitor-tier-badge {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  letter-spacing: 0.03em;
}

.rec-badge-neutral {
  background: rgba(100, 116, 139, 0.15);
  color: var(--text-secondary);
  border: 1px solid rgba(100, 116, 139, 0.25);
}

.rec-badge-ultra {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.35);
  box-shadow: 0 0 10px rgba(239, 68, 68, 0.15);
}

.rec-badge-balanced {
  background: rgba(14, 165, 233, 0.15);
  color: #38bdf8;
  border: 1px solid rgba(14, 165, 233, 0.35);
}

.rec-badge-budget {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.35);
}

.monitor-panel-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 0.8rem;
}

.monitor-recommendation-box {
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 0.85rem 1rem;
  transition: all 0.2s var(--ease);
}

.monitor-rec-header {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
}

.monitor-rec-icon {
  font-size: 1.5rem;
  line-height: 1;
}

.monitor-rec-info {
  flex: 1;
}

.monitor-rec-title {
  font-size: 0.86rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.monitor-rec-desc {
  font-size: 0.78rem;
  line-height: 1.45;
  color: var(--text-secondary);
  margin: 0;
}

/* Selected Monitor Card */
.monitor-selected-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 0.85rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.monitor-card-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.monitor-selected-name {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-primary);
}

.monitor-selected-price {
  font-family: var(--font-mono);
  font-size: 0.92rem;
  font-weight: 700;
  color: #10b981;
}

.monitor-selected-specs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.monitor-card-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.4rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--border-subtle);
}

/* Empty State */
.monitor-empty-state {
  border: 1px dashed var(--border);
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
}

.monitor-empty-text {
  font-size: 0.8rem;
  color: var(--text-tertiary);
  margin: 0;
}

/* Quick Picks */
.monitor-quick-picks {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 0.4rem;
  border-top: 1px solid var(--border-subtle);
}

.quick-picks-label {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-tertiary);
}

.quick-picks-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.monitor-quick-chip {
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.35rem 0.65rem;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-primary);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.6rem;
  transition: all 0.15s var(--ease);
}

.monitor-quick-chip:hover {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.08);
  transform: translateY(-1px);
}

.monitor-quick-chip.active {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}

.quick-mon-name {
  font-weight: 600;
}

.quick-mon-price {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 700;
  color: #10b981;
}

/* Analog Chip Buttons */
.analogs-box {
  margin-top: 0.5rem;
  padding: 0.45rem 0.7rem;
  background: var(--bg-subtle);
  border-radius: 8px;
  border: 1px solid var(--border);
}

.analogs-title {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-tertiary);
  display: block;
  margin-bottom: 0.35rem;
}

.analogs-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.35rem;
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
  gap: 0.4rem;
  transition: all 0.15s var(--ease);
}

.analog-chip-btn:hover {
  background: #3b82f6 !important;
  color: #ffffff !important;
  border-color: #3b82f6 !important;
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(59, 130, 246, 0.25);
}

.analog-chip-btn:hover strong,
.analog-chip-btn:hover span {
  color: #ffffff !important;
}

.analog-chip-price {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 700;
  color: #10b981;
}
"""

css = css + "\n" + monitor_and_chips_css

with open("css/style.css", "w", encoding="utf-8") as f:
    f.write(css)

print("Updated style.css with Monitor panel and analog chip buttons.")
