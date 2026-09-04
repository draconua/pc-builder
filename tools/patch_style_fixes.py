with open("css/style.css", "r", encoding="utf-8") as f:
    css = f.read()

# 1. Update [data-theme="dark"] variables
dark_vars_target = """[data-theme="dark"] {
  --bg: #11151f;
  --bg-subtle: #19202f;
  --surface: #181f2d;
  --surface-hover: #222a3d;
  --surface-active: #2b354c;

  --border: #2c3547;
  --border-hover: #475569;
  --border-focus: #f8fafc;
  --border-subtle: #1e2638;

  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --text-tertiary: #94a3b8;
  --text-muted: #64748b;

  --accent: #f8fafc;
  --accent-hover: #e2e8f0;
  --accent-contrast: #0f172a;
  --accent-subtle: #242e42;

  --surface-glass: rgba(24, 31, 45, 0.88);
  --glass-border: rgba(255, 255, 255, 0.12);
  --shadow-drawer: -12px 0 40px rgba(0, 0, 0, 0.9);
}"""

dark_vars_replacement = """[data-theme="dark"] {
  --bg: #11151f;
  --bg-subtle: #19202f;
  --surface: #181f2d;
  --surface-hover: #222a3d;
  --surface-active: #2b354c;

  --border: #2c3547;
  --border-hover: #475569;
  --border-focus: #f8fafc;
  --border-subtle: #1e2638;

  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --text-tertiary: #94a3b8;
  --text-muted: #64748b;

  --accent: #f8fafc;
  --accent-hover: #e2e8f0;
  --accent-contrast: #0f172a;
  --accent-subtle: #242e42;

  --surface-glass: rgba(24, 31, 45, 0.88);
  --glass-border: rgba(255, 255, 255, 0.12);
  --shadow-drawer: -12px 0 40px rgba(0, 0, 0, 0.9);

  /* Status Colors in Dark Mode: luminous glass with proper dark bg */
  --success: #34d399;
  --success-bg: rgba(16, 185, 129, 0.16);
  --success-border: rgba(52, 211, 153, 0.35);

  --warning: #fbbf24;
  --warning-bg: rgba(245, 158, 11, 0.16);
  --warning-border: rgba(251, 191, 36, 0.35);

  --error: #f87171;
  --error-bg: rgba(239, 68, 68, 0.16);
  --error-border: rgba(248, 113, 113, 0.35);
}"""

css = css.replace(dark_vars_target, dark_vars_replacement)

# 2. Fix Light Mode Slack Code Tags
old_light_slack = """[data-theme="light"] .slack-code-tag {
  background: #22262d;
  color: #f59e0b;
  border-color: #38424f;
}"""

new_light_slack = """[data-theme="light"] .slack-code-tag {
  background: #f1f5f9;
  color: #b45309;
  border: 1px solid #cbd5e1;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

[data-theme="light"] .slack-code-tag:hover {
  background: #e2e8f0;
  border-color: #f59e0b;
  color: #92400e;
}"""

css = css.replace(old_light_slack, new_light_slack)

# 3. Add Store Hub Button & Redesigned Retailer Modal styles
store_css = """
/* Store Hub Interactive Button in Slot Cards */
.btn-store-hub {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.65rem;
  border-radius: 7px;
  font-size: 0.74rem;
  font-weight: 700;
  cursor: pointer !important;
  user-select: none !important;
  -webkit-user-select: none;
  border: 1px solid rgba(2, 132, 199, 0.35);
  background: rgba(2, 132, 199, 0.08);
  color: #0284c7;
  text-decoration: none;
  white-space: nowrap;
  transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.btn-store-hub:hover {
  background: #0284c7;
  color: #ffffff;
  border-color: #0284c7;
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(2, 132, 199, 0.28);
}

.btn-store-hub:active {
  transform: translateY(0);
}

[data-theme="dark"] .btn-store-hub {
  background: rgba(56, 189, 248, 0.12);
  border-color: rgba(56, 189, 248, 0.4);
  color: #38bdf8;
}

[data-theme="dark"] .btn-store-hub:hover {
  background: #38bdf8;
  color: #0b0f17;
  border-color: #38bdf8;
  box-shadow: 0 0 16px rgba(56, 189, 248, 0.5);
}

.store-hub-icon {
  font-size: 0.88rem;
  line-height: 1;
}

.store-hub-arrow {
  font-size: 0.8rem;
  font-weight: 800;
  transition: transform 0.15s;
}

.btn-store-hub:hover .store-hub-arrow {
  transform: translate(1px, -1px);
}

/* Redesigned Retailers Popover Modal */
.modal-md {
  max-width: 720px !important;
  width: 94% !important;
}

.retailer-modal-top {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.retailer-modal-badge {
  align-self: flex-start;
}

.retailer-modal-product-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.3;
}

.retailer-modal-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.2rem;
}

.retailer-est-price {
  font-family: var(--font-mono);
  font-weight: 800;
  font-size: 0.85rem;
  color: var(--success);
  background: var(--success-bg);
  border: 1px solid var(--success-border);
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
}

.retailer-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.85rem;
  margin-top: 0.75rem;
}

@media (max-width: 650px) {
  .retailer-grid {
    grid-template-columns: 1fr;
  }
}

.retailer-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.15rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  text-decoration: none;
  cursor: pointer !important;
  user-select: none !important;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  color: var(--text-primary);
  position: relative;
  overflow: hidden;
}

.retailer-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: var(--border);
  transition: background 0.2s;
}

.retailer-card:hover {
  transform: translateY(-2px);
  border-color: #38bdf8;
  background: var(--surface-hover);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.retailer-card:hover::before {
  background: #38bdf8;
  box-shadow: 0 0 10px #38bdf8;
}

.retailer-left {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding-left: 0.2rem;
}

.retailer-brand-row {
  display: flex;
  align-items: center;
  gap: 0.55rem;
}

.retailer-icon {
  font-size: 1.25rem;
  line-height: 1;
}

.retailer-name {
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.01em;
}

.retailer-desc {
  font-size: 0.76rem;
  color: var(--text-secondary);
  line-height: 1.35;
}

.retailer-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
  flex-shrink: 0;
}

.retailer-badge {
  font-size: 0.68rem;
  font-weight: 800;
  padding: 0.2rem 0.55rem;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.retailer-btn-action {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 800;
  color: #0284c7;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  background: rgba(2, 132, 199, 0.08);
  border: 1px solid rgba(2, 132, 199, 0.2);
  transition: all 0.15s;
}

[data-theme="dark"] .retailer-btn-action {
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.12);
  border-color: rgba(56, 189, 248, 0.3);
}

.retailer-card:hover .retailer-btn-action {
  background: #38bdf8;
  color: #0b0f17;
  border-color: #38bdf8;
  transform: translateX(2px);
}
"""

css = css + "\n" + store_css

with open("css/style.css", "w", encoding="utf-8") as f:
    f.write(css)

print("Updated style.css with light-mode Slack tags, dark status variables, and store hub styling!")
