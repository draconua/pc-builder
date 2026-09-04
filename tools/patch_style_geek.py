with open("css/style.css", "r", encoding="utf-8") as f:
    css = f.read()

geek_css = """
/* =============================================================
   GEEK / CYBER-WORKBENCH & SLACK CODE DESIGN SYSTEM
   ============================================================= */

/* 1. Authentic Slack-Style Code Formatting */
.slack-code-tag {
  display: inline-flex;
  align-items: center;
  background: #1e2228;
  color: #e5a55d;
  border: 1px solid #383f45;
  border-radius: 5px;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 700;
  padding: 2px 7px;
  margin: 2px 3px 2px 0;
  line-height: 1.35;
  letter-spacing: 0.02em;
  white-space: nowrap;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
  transition: border-color 0.15s, transform 0.15s;
}

.slack-code-tag:hover {
  border-color: #f59e0b;
  transform: translateY(-1px);
}

[data-theme="dark"] .slack-code-tag {
  background: #151b23;
  color: #fbbf24;
  border-color: #30363d;
}

[data-theme="light"] .slack-code-tag {
  background: #22262d;
  color: #f59e0b;
  border-color: #38424f;
}

/* Part specs container with Slack pills */
.slot-selected-specs, .part-specs-pills {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.35rem;
}

/* 2. Cyber-Blueprint Background (Geek Station Texture) */
body {
  background-color: var(--bg);
  background-image: 
    radial-gradient(ellipse at 50% 0%, rgba(56, 189, 248, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 85% 90%, rgba(245, 158, 11, 0.06) 0%, transparent 45%),
    linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
  background-size: 100% 100%, 100% 100%, 36px 36px, 36px 36px;
}

[data-theme="light"] body {
  background-color: #f6f8fb;
  background-image:
    radial-gradient(ellipse at 50% 0%, rgba(37, 99, 235, 0.06) 0%, transparent 55%),
    linear-gradient(rgba(0, 0, 0, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.04) 1px, transparent 1px);
  background-size: 100% 100%, 36px 36px, 36px 36px;
}

/* 3. Slot Cards: High-Tech Hardware Blades */
.slot-card {
  position: relative;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 0.9rem 1.15rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.2s var(--ease);
}

.slot-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 10px;
  bottom: 10px;
  width: 3.5px;
  background: var(--border);
  border-radius: 0 4px 4px 0;
  transition: background 0.2s;
}

.slot-card.filled {
  border-color: rgba(56, 189, 248, 0.35);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.slot-card.filled::before {
  background: linear-gradient(180deg, #38bdf8, #818cf8);
  box-shadow: 0 0 8px rgba(56, 189, 248, 0.6);
}

[data-theme="dark"] .slot-card {
  background: #141a26;
  border-color: #232c3d;
}

[data-theme="dark"] .slot-card:hover {
  border-color: #38bdf8;
  box-shadow: 0 6px 22px rgba(56, 189, 248, 0.12);
}

/* 4. Multi-Retailer Store Aggregator Modal */
.modal-md {
  max-width: 680px !important;
  width: 92% !important;
}

.retailer-modal-header-info {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.retailer-modal-header-info h3 {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--text-primary);
}

.retailer-sub-hint {
  font-size: 0.84rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.retailer-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.85rem;
}

@media (max-width: 600px) {
  .retailer-grid {
    grid-template-columns: 1fr;
  }
}

.retailer-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0.95rem 1.1rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.18s var(--ease);
  color: var(--text-primary);
}

.retailer-card:hover {
  transform: translateY(-2px);
  border-color: #38bdf8;
  background: var(--surface-hover);
  box-shadow: 0 6px 20px rgba(56, 189, 248, 0.2);
}

.retailer-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.4rem;
}

.retailer-icon {
  font-size: 1.3rem;
}

.retailer-badge {
  font-size: 0.7rem;
  font-weight: 800;
  padding: 0.15rem 0.5rem;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.retailer-name {
  font-size: 1rem;
  font-weight: 800;
  color: var(--text-primary);
}

.retailer-jump-btn {
  font-size: 0.76rem;
  font-weight: 700;
  color: #38bdf8;
  margin-top: 0.65rem;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

/* 5. Geek Drawer Controls */
.geek-drawer-controls {
  padding: 1rem 1.4rem;
  background: var(--bg-subtle);
  border-bottom: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.geek-search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.geek-search-wrapper input {
  width: 100%;
  padding: 0.65rem 4.5rem 0.65rem 2.4rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 0.88rem;
  font-weight: 600;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.geek-search-wrapper input:focus {
  border-color: #38bdf8;
  box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.2);
}

.geek-kbd {
  position: absolute;
  right: 12px;
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 2px 6px;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--text-muted);
  font-weight: 700;
  pointer-events: none;
}

/* Dynamic Brand Chips in Drawer */
.drawer-brand-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.geek-brand-chip {
  font-family: var(--font-mono);
  font-size: 0.74rem;
  font-weight: 700;
  padding: 0.25rem 0.65rem;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s var(--ease);
}

.geek-brand-chip:hover {
  border-color: #38bdf8;
  color: #38bdf8;
  transform: translateY(-1px);
}

.geek-brand-chip.active {
  background: #1e2430;
  color: #fbbf24;
  border-color: #fbbf24;
  box-shadow: 0 2px 8px rgba(251, 191, 36, 0.25);
}

/* Geek Filters Bar */
.geek-filters-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
}

.geek-sort-group {
  display: inline-flex;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 2px;
  gap: 2px;
}

.geek-sort-chip {
  background: transparent;
  border: none;
  font-size: 0.76rem;
  font-weight: 700;
  padding: 0.35rem 0.7rem;
  border-radius: 6px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s;
}

.geek-sort-chip:hover {
  color: var(--text-primary);
}

.geek-sort-chip.active {
  background: #38bdf8;
  color: #0b0f17;
  font-weight: 800;
}

.geek-compat-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-primary);
  font-size: 0.76rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
}

.geek-compat-toggle .led-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #64748b;
  transition: all 0.2s;
}

.geek-compat-toggle.active .led-dot {
  background: #10b981;
  box-shadow: 0 0 8px #10b981;
}

.part-store-btn {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.25rem 0.55rem;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--bg-subtle);
  color: #38bdf8;
  cursor: pointer;
  transition: all 0.15s;
}

.part-store-btn:hover {
  background: #38bdf8;
  color: #0b0f17;
  border-color: #38bdf8;
}

.footer-left-tags {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
"""

css = css + "\n" + geek_css

with open("css/style.css", "w", encoding="utf-8") as f:
    f.write(css)

print("Injected Slack Code, Geek Cyber-Blueprint, Retailer Popover, and Filter styles into style.css!")
