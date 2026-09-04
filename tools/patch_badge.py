with open("css/style.css", "a", encoding="utf-8") as f:
    f.write("""
/* Neon Status Badge overrides for Schematic */
.status-badge {
  font-family: var(--font-mono) !important;
  text-transform: uppercase !important;
  letter-spacing: 0.05em !important;
  background: transparent !important;
  font-weight: 800 !important;
  border-radius: 4px !important;
}
.status-badge[style*="--success-bg"] {
  color: #10b981 !important;
  border: 1px solid rgba(16, 185, 129, 0.4) !important;
  background: rgba(16, 185, 129, 0.08) !important;
}
.status-badge[style*="--error-bg"] {
  color: #ef4444 !important;
  border: 1px solid rgba(239, 68, 68, 0.4) !important;
  background: rgba(239, 68, 68, 0.08) !important;
}
.status-badge[style*="--warning-bg"] {
  color: #f59e0b !important;
  border: 1px solid rgba(245, 158, 11, 0.4) !important;
  background: rgba(245, 158, 11, 0.08) !important;
}
""")
print("Patched status badge styles")
