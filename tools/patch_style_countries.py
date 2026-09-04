with open("css/style.css", "r", encoding="utf-8") as f:
    css = f.read()

import re

# 1. Replace Cyber-Blueprint Grid with Smooth Ambient Battlestation Studio Background
grid_pattern = r'body\s*\{[^}]*background-image:[^}]*36px 36px;[^}]*\}'

new_body_bg = """body {
  background-color: var(--bg);
  background-image: 
    radial-gradient(ellipse at 50% -12%, rgba(56, 189, 248, 0.12) 0%, transparent 60%),
    radial-gradient(circle at 92% 85%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 8% 75%, rgba(16, 185, 129, 0.05) 0%, transparent 50%);
  background-attachment: fixed;
}

[data-theme="light"] body {
  background-color: #f8fafc;
  background-image: 
    radial-gradient(ellipse at 50% -10%, rgba(219, 234, 254, 0.7) 0%, transparent 65%),
    radial-gradient(circle at 90% 90%, rgba(243, 232, 255, 0.5) 0%, transparent 50%);
  background-attachment: fixed;
}"""

# Also replace any other linear-gradient 32px or 36px in style.css
css = re.sub(r'background-image:[^;]*36px 36px;', 'background-image: radial-gradient(ellipse at 50% -12%, rgba(56, 189, 248, 0.12) 0%, transparent 60%);', css)
css = re.sub(r'background-image:[^;]*32px 32px;', 'background-image: radial-gradient(ellipse at 50% -12%, rgba(56, 189, 248, 0.12) 0%, transparent 60%);', css)

# Append country tabs styling and clean background
country_tabs_css = """
/* Country Selector Tabs in Retailer Modal */
.retailer-country-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin: 0.85rem 0 1rem 0;
}

.retailer-country-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-secondary);
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer !important;
  user-select: none !important;
  transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
}

.retailer-country-chip:hover {
  border-color: #38bdf8;
  color: var(--text-primary);
  transform: translateY(-1px);
}

.retailer-country-chip.active {
  background: #0284c7;
  border-color: #0284c7;
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(2, 132, 199, 0.35);
}

[data-theme="dark"] .retailer-country-chip.active {
  background: #38bdf8;
  border-color: #38bdf8;
  color: #0b0f17;
  box-shadow: 0 0 16px rgba(56, 189, 248, 0.45);
}

.country-flag {
  font-size: 1.05rem;
  line-height: 1;
}
"""

css = css + "\n" + new_body_bg + "\n" + country_tabs_css

with open("css/style.css", "w", encoding="utf-8") as f:
    f.write(css)

print("Updated style.css with smooth ambient background and country tabs styling!")
