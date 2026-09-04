import re

with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Replace Bento box css with Dashboard css
dashboard_css = '''
/* DASHBOARD REDESIGN */
.main-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 1700px;
  margin: 0 auto;
  padding: 2rem;
}

.dashboard-top {
  display: grid;
  grid-template-columns: 3fr 4fr 3fr;
  gap: 1.5rem;
  align-items: start;
}

.dashboard-bottom {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.col-left, .col-right {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.col-center {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: sticky;
  top: 100px;
}

/* Reset slot-card to be compact horizontal again */
.slot-card {
  flex-direction: row;
  align-items: center;
  padding: 1rem 1.25rem;
  border-radius: var(--radius-md);
}

.slot-header-row {
  margin-bottom: 0.25rem;
}

.slot-actions {
  margin-top: 0.5rem;
}

.slot-category-icon {
  position: relative;
  top: 0;
  right: 0;
  opacity: 1;
  transform: none;
  width: 28px;
  height: 28px;
  color: var(--text-tertiary);
}

.gpu-alternatives {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: var(--text-tertiary);
  background: var(--bg-subtle);
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  animation: fadeIn 0.3s var(--ease);
}
.gpu-alt-btn {
  background: none;
  border: 1px solid var(--border);
  color: var(--accent);
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}
.gpu-alt-btn:hover {
  background: var(--border);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 1400px) {
  .dashboard-top { grid-template-columns: 1fr 1fr; }
  .col-center { grid-column: span 2; position: static; }
}
@media (max-width: 992px) {
  .dashboard-top { grid-template-columns: 1fr; }
  .col-center { grid-column: span 1; }
  .dashboard-bottom { grid-template-columns: 1fr; }
}
'''

# Remove Bento box css
css = re.sub(r'/\* BENTO BOX REDESIGN \*/.*?@media \(max-width: 768px\) \{[^}]+\}\n\}', '', css, flags=re.DOTALL)

css += '\n' + dashboard_css

with open('css/style.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("CSS updated for Dashboard")
