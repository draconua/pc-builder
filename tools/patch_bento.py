import re

with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Bento Box Redesign
bento_css = '''
/* BENTO BOX REDESIGN */
.main-content {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem;
  max-width: 1600px;
  margin: 0 auto;
}

.column-left {
  grid-column: span 7;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
  align-content: start;
}

.column-right {
  grid-column: span 5;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  align-content: start;
}

/* Make slot cards taller and more bento-like */
.slot-card {
  flex-direction: column;
  align-items: flex-start;
  padding: 1.5rem;
  aspect-ratio: auto;
  border-radius: 20px;
  background: var(--surface-glass);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--glass-border);
}

.slot-header-row {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.slot-body {
  width: 100%;
}

.slot-category-icon {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  opacity: 0.1;
  transform: scale(2.5);
  pointer-events: none;
}

.slot-actions {
  margin-top: 1.5rem;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Panels */
.panel {
  border-radius: 24px;
  padding: 1.75rem;
}

.summary-panel {
  background: linear-gradient(135deg, var(--accent) 0%, #1e293b 100%);
  color: white;
}
.summary-panel .label, .summary-panel .power-sub {
  color: rgba(255,255,255,0.7);
}
.summary-panel .price-val {
  color: white;
}
.summary-panel .power-bar-track {
  background: rgba(255,255,255,0.2);
}
.summary-panel .power-bar-fill {
  background: #38bdf8;
}

/* Media Queries for Bento */
@media (max-width: 1200px) {
  .column-left { grid-column: span 12; }
  .column-right { grid-column: span 12; }
}
@media (max-width: 768px) {
  .column-left { grid-template-columns: 1fr; }
}
'''

# We need to overwrite the old layout rules to avoid conflicts
css = re.sub(r'\.main-content\s*\{[^}]+\}', '', css)
css = re.sub(r'\.column-left\s*\{[^}]+\}', '', css)
css = re.sub(r'\.column-right\s*\{[^}]+\}', '', css)
css = css.replace('flex-direction: row;', '') # remove generic flex directions

css += '\n' + bento_css

with open('css/style.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("Bento layout applied")
