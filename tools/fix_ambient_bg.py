with open("css/style.css", "r", encoding="utf-8") as f:
    css = f.read()

import re
# Remove any dotted or square grids on body
css = re.sub(r'body\s*\{[^}]*background-image:[^}]*\}', '', css)
css = re.sub(r'\[data-theme="dark"\]\s*body\s*\{[^}]*\}', '', css)
css = re.sub(r'\[data-theme="light"\]\s*body\s*\{[^}]*\}', '', css)

clean_body_rules = """
/* =============================================================
   CLEAN AMBIENT BACKGROUNDS (ZERO NOTEBOOK SQUARES / ZERO DOTS)
   ============================================================= */
body {
  font-family: var(--font-sans);
  background-color: var(--bg);
  color: var(--text-primary);
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  background-image: 
    radial-gradient(ellipse at 50% -12%, rgba(56, 189, 248, 0.12) 0%, transparent 60%),
    radial-gradient(circle at 92% 85%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 8% 75%, rgba(16, 185, 129, 0.05) 0%, transparent 50%);
  background-attachment: fixed;
}

[data-theme="dark"] body {
  background-color: #0b0f17 !important;
  color: #f1f5f9;
  background-image: 
    radial-gradient(ellipse at 50% -12%, rgba(56, 189, 248, 0.12) 0%, transparent 60%),
    radial-gradient(circle at 92% 85%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 8% 75%, rgba(16, 185, 129, 0.05) 0%, transparent 50%) !important;
  background-attachment: fixed;
}

[data-theme="light"] body {
  background-color: #f8fafc !important;
  color: #0f172a;
  background-image: 
    radial-gradient(ellipse at 50% -10%, rgba(219, 234, 254, 0.65) 0%, transparent 65%),
    radial-gradient(circle at 90% 90%, rgba(243, 232, 255, 0.45) 0%, transparent 50%) !important;
  background-attachment: fixed;
}
"""

css = css + "\n" + clean_body_rules

with open("css/style.css", "w", encoding="utf-8") as f:
    f.write(css)

print("Updated style.css with clean, unified ambient background rules!")
