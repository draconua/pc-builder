with open("css/style.css", "r", encoding="utf-8") as f:
    css = f.read()

old_tooltip = """/* Tooltip popup box */
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
}"""

new_tooltip = """/* Tooltip popup box (opens downwards so never clipped by top header) */
.slot-info-hint::after {
  content: attr(data-tooltip);
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  transform: translateY(-4px);
  padding: 0.55rem 0.75rem;
  border-radius: 9px;
  background: #0f172a;
  color: #f8fafc;
  font-size: 0.74rem;
  font-weight: 500;
  line-height: 1.45;
  white-space: normal;
  width: 260px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.16);
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 99999;
}

/* Tooltip upward pointer arrow */
.slot-info-hint::before {
  content: '';
  position: absolute;
  top: calc(100% + 2px);
  left: 5px;
  transform: translateY(-4px);
  border-width: 0 6px 6px 6px;
  border-style: solid;
  border-color: transparent transparent #0f172a transparent;
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
  transform: translateY(0);
}"""

if old_tooltip in css:
    css = css.replace(old_tooltip, new_tooltip, 1)
    print("Updated tooltip orientation to open downward reliably.")
else:
    print("Warning: old_tooltip not found.")

with open("css/style.css", "w", encoding="utf-8") as f:
    f.write(css)
