with open("css/style.css", "r", encoding="utf-8") as f:
    css = f.read()

deck_frame_css = """
/* =============================================================
   RETAILER STORE AGGREGATOR DECK PANEL & CONTROLS
   ============================================================= */

/* 1. Large Expressive Close Button */
.retailer-modal-close-btn {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  font-size: 1.35rem;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer !important;
  user-select: none !important;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  outline: none;
}

.retailer-modal-close-btn:hover {
  background: rgba(239, 68, 68, 0.15);
  border-color: #ef4444;
  color: #ef4444;
  transform: scale(1.08);
  box-shadow: 0 0 14px rgba(239, 68, 68, 0.35);
}

.retailer-modal-close-btn:active {
  transform: scale(0.96);
}

[data-theme="dark"] .retailer-modal-close-btn {
  background: #182030;
  border-color: #2b3850;
  color: #94a3b8;
}

[data-theme="dark"] .retailer-modal-close-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: #f87171;
  color: #f87171;
}

/* 2. Top Badges Row */
.retailer-badge-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.3rem;
}

.retailer-status-pill {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 700;
  color: #10b981;
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.3);
  padding: 0.15rem 0.55rem;
  border-radius: 6px;
  letter-spacing: 0.04em;
}

/* 3. Framed Deck Panel Container (The Box for Buttons) */
.retailers-deck-frame {
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 1.15rem;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.06), 0 4px 16px rgba(0, 0, 0, 0.04);
}

[data-theme="dark"] .retailers-deck-frame {
  background: #0f1523;
  border: 1px solid #222d42;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.4);
}

.deck-frame-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.9rem;
  padding-bottom: 0.55rem;
  border-bottom: 1px solid var(--border);
}

.deck-frame-title {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--text-secondary);
  letter-spacing: 0.04em;
}

.deck-frame-badge {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 800;
  color: #0284c7;
  background: rgba(2, 132, 199, 0.1);
  padding: 0.15rem 0.5rem;
  border-radius: 5px;
}

[data-theme="dark"] .deck-frame-badge {
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.15);
}

/* 4. Retailer Cards inside the Frame */
.retailer-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.85rem;
}

@media (max-width: 660px) {
  .retailer-grid {
    grid-template-columns: 1fr;
  }
}

.retailer-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.95rem 1.15rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 11px;
  text-decoration: none;
  cursor: pointer !important;
  user-select: none !important;
  transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
  color: var(--text-primary);
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}

[data-theme="dark"] .retailer-card {
  background: #151d2b;
  border-color: #263349;
}

.retailer-card:hover {
  transform: translateY(-2px);
  border-color: #38bdf8;
  background: var(--surface-hover);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.14);
}

[data-theme="dark"] .retailer-card:hover {
  background: #1b2537;
  border-color: #38bdf8;
  box-shadow: 0 0 20px rgba(56, 189, 248, 0.25);
}
"""

css = css + "\n" + deck_frame_css

with open("css/style.css", "w", encoding="utf-8") as f:
    f.write(css)

print("Updated style.css with retailer-modal-close-btn and retailers-deck-frame styles!")
