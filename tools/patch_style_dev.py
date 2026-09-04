with open("css/style.css", "r", encoding="utf-8") as f:
    css = f.read()

dev_styles = """
/* =============================================================
   DEV CABINET & LIVE PRICE PARSER STYLES
   ============================================================= */

.btn-dev-trigger {
  font-family: var(--font-sans);
  font-size: 0.76rem;
  font-weight: 700;
  padding: 0.3rem 0.75rem;
  border-radius: 9999px;
  border: 1px solid rgba(99, 102, 241, 0.4);
  background: rgba(99, 102, 241, 0.12);
  color: #818cf8;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  transition: all 0.15s var(--ease);
}

.btn-dev-trigger:hover {
  background: rgba(99, 102, 241, 0.25);
  border-color: #818cf8;
  transform: translateY(-1px);
  box-shadow: 0 0 12px rgba(99, 102, 241, 0.3);
}

/* Modal Dialog Sizing */
.modal-dev-dialog {
  max-width: 900px !important;
  width: 92% !important;
  max-height: 88vh !important;
  display: flex !important;
  flex-direction: column !important;
  padding: 0 !important;
  overflow: hidden !important;
}

.dev-modal-header {
  padding: 1.2rem 1.5rem;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--surface);
}

.dev-header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.dev-badge {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  background: #6366f1;
  color: #ffffff;
}

.dev-modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Control Strip */
.dev-control-strip {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 1rem 1.25rem;
  flex-wrap: wrap;
}

.dev-control-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex: 1;
  min-width: 260px;
}

.dev-control-field label {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.dev-select {
  font-family: var(--font-sans);
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.5rem 0.8rem;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-primary);
  cursor: pointer;
  outline: none;
}

.dev-control-actions {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.btn-dev-start {
  font-weight: 700 !important;
  padding: 0.55rem 1.1rem !important;
}

.btn-dev-stop {
  background: #ef4444 !important;
  color: #fff !important;
  border: 1px solid #dc2626 !important;
  font-weight: 700 !important;
  padding: 0.55rem 1.1rem !important;
  border-radius: 6px !important;
  cursor: pointer;
}

.btn-dev-apply {
  background: #10b981 !important;
  color: #ffffff !important;
  border: 1px solid #059669 !important;
  font-weight: 700 !important;
  padding: 0.55rem 1.1rem !important;
  border-radius: 6px !important;
  cursor: pointer;
  transition: all 0.15s var(--ease);
}

.btn-dev-apply:hover {
  background: #059669 !important;
  transform: translateY(-1px);
}

/* Progress Card */
.dev-progress-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.dev-progress-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-primary);
}

.dev-progress-bar-track {
  height: 8px;
  background: var(--bg-subtle);
  border-radius: 9999px;
  overflow: hidden;
}

.dev-progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #3b82f6);
  border-radius: 9999px;
  transition: width 0.3s var(--ease);
}

.dev-stats-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.3rem;
}

.dev-stat-pill {
  font-size: 0.75rem;
  color: var(--text-secondary);
  background: var(--bg-subtle);
  padding: 0.2rem 0.55rem;
  border-radius: 4px;
  border: 1px solid var(--border-subtle);
}

/* Terminal */
.dev-terminal-wrapper {
  background: #0a0d14;
  border: 1px solid #1e293b;
  border-radius: var(--radius-md);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.dev-terminal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.45rem 1rem;
  background: #111827;
  border-bottom: 1px solid #1e293b;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.05em;
}

.btn-clear-terminal {
  background: transparent;
  border: none;
  color: #64748b;
  font-size: 0.68rem;
  cursor: pointer;
}

.btn-clear-terminal:hover {
  color: #cbd5e1;
}

.dev-terminal-logs {
  font-family: var(--font-mono);
  font-size: 0.76rem;
  line-height: 1.6;
  padding: 0.85rem 1rem;
  max-height: 180px;
  min-height: 120px;
  overflow-y: auto;
  color: #38bdf8;
  background: #090d16;
}

.log-line {
  white-space: pre-wrap;
  word-break: break-all;
}

/* Diff Table */
.dev-diff-table-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.dev-diff-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
}

.dev-diff-header h3 {
  font-size: 0.88rem;
  font-weight: 700;
  margin: 0;
}

.dev-diff-subtitle {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.dev-table-container {
  max-height: 240px;
  overflow-y: auto;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--surface);
}

.dev-diff-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.78rem;
}

.dev-diff-table th {
  position: sticky;
  top: 0;
  background: var(--bg-subtle);
  padding: 0.6rem 0.8rem;
  text-align: left;
  font-weight: 700;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border);
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.dev-diff-table td {
  padding: 0.55rem 0.8rem;
  border-bottom: 1px solid var(--border-subtle);
}

.diff-positive {
  color: #ef4444;
  font-weight: 700;
}

.diff-negative {
  color: #10b981;
  font-weight: 700;
}

.diff-neutral {
  color: var(--text-tertiary);
}

.dev-table-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 600;
}

.dev-table-link:hover {
  text-decoration: underline;
}
"""

css = css + "\n" + dev_styles

with open("css/style.css", "w", encoding="utf-8") as f:
    f.write(css)

print("Appended Dev Cabinet styles to css/style.css.")
