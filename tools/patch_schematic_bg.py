with open("css/style.css", "r", encoding="utf-8") as f:
    css = f.read()

import re

# Clean .center-schematic background
pattern = r'/\* High-Tech Technical Blueprint Schematic Box \*/\s*\.center-schematic\s*\{[^}]*\}\s*\[data-theme="dark"\]\s*\.center-schematic\s*\{[^}]*\}'

replacement = """/* Clean Studio Schematic Box */
.center-schematic {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 1rem 1.25rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  position: relative;
  overflow: hidden;
  min-height: 320px;
}

[data-theme="dark"] .center-schematic {
  background: #101622;
  border-color: #243044;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);
}"""

css = re.sub(pattern, replacement, css, flags=re.DOTALL)

with open("css/style.css", "w", encoding="utf-8") as f:
    f.write(css)

print("Removed all math notebook grid patterns from .center-schematic!")
