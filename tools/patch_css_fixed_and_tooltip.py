with open("css/style.css", "r", encoding="utf-8") as f:
    css = f.read()

# Replace the previous .hardware-guide-modal block with proper fixed centering
old_modal_css = """.hardware-guide-modal {
  max-width: 960px;
  width: 92%;
  max-height: 88vh;
  border-radius: 18px;
  background: var(--surface);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 10005;
}"""

new_modal_css = """/* HARDWARE ENCYCLOPEDIA FIXED POPUP MODAL */
#hardware-guide-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.72);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 10004;
  transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

#hardware-guide-overlay.hidden {
  opacity: 0;
  pointer-events: none;
  display: none;
}

.hardware-guide-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 980px;
  width: 94%;
  max-height: 86vh;
  border-radius: 20px;
  background: var(--surface);
  border: 1px solid var(--border);
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.45);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 10005;
  animation: modalCenterPop 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.hardware-guide-modal.hidden {
  display: none !important;
}

@keyframes modalCenterPop {
  from {
    opacity: 0;
    transform: translate(-50%, -46%) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}"""

if old_modal_css in css:
    css = css.replace(old_modal_css, new_modal_css, 1)
    print("Fixed modal fixed positioning and backdrop overlay.")
else:
    print("Warning: old_modal_css not found directly.")

# Add Tooltip and Scroll-Top Styles
tooltip_and_scroll_css = """

/* ============================================================= */
/* SLOT HEADER QUESTION MARK TOOLTIP (?)                         */
/* ============================================================= */

.slot-header-row {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.slot-info-hint {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 17px;
  height: 17px;
  border-radius: 50%;
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  font-size: 0.68rem;
  font-weight: 700;
  cursor: help;
  position: relative;
  transition: all 0.15s ease;
  user-select: none;
  line-height: 1;
  flex-shrink: 0;
}

.slot-info-hint:hover,
.slot-info-hint:focus {
  background: #3b82f6;
  border-color: #3b82f6;
  color: #ffffff;
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

/* Tooltip popup box */
.slot-info-hint::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%) translateY(4px);
  padding: 0.55rem 0.75rem;
  border-radius: 9px;
  background: #0f172a;
  color: #f8fafc;
  font-size: 0.74rem;
  font-weight: 500;
  line-height: 1.4;
  white-space: normal;
  width: 240px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.14);
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 99999;
}

/* Tooltip downward pointer arrow */
.slot-info-hint::before {
  content: '';
  position: absolute;
  bottom: calc(100% + 2px);
  left: 50%;
  transform: translateX(-50%) translateY(4px);
  border-width: 6px 6px 0 6px;
  border-style: solid;
  border-color: #0f172a transparent transparent transparent;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 99999;
}

.slot-info-hint:hover::after,
.slot-info-hint:focus::after,
.slot-info-hint:hover::before,
.slot-info-hint:focus::before {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}

/* Scroll top button in footer */
#btn-scroll-top {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  transition: all 0.15s ease;
}

#btn-scroll-top:hover {
  color: #3b82f6;
  transform: translateY(-1px);
}
"""

css += tooltip_and_scroll_css

with open("css/style.css", "w", encoding="utf-8") as f:
    f.write(css)
print("Updated css/style.css successfully.")
