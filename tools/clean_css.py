import re

with open("css/style.css", "r", encoding="utf-8") as f:
    css = f.read()

# 1. Remove 15% scaling !important section
css = re.sub(r'/\* =============================================================\s*15% SCALED PROPORTIONS.*?\*/(.*?)/\* =============================================================', '/* =============================================================', css, flags=re.DOTALL)

# 2. Remove v1 Header leftovers (Lines 175-235, etc)
dead_classes = [
    r'\.header\b', r'\.header-left\b', r'\.title-row\b', r'\.subtitle\b', r'\.header-right\b', r'\.data-date-badge\b',
    r'\.lang-group\b', r'\.currency-group\b',
    r'\.toolbar\b', r'\.toolbar-left\b', r'\.toolbar-center\b', r'\.toolbar-right\b', r'\.progress-ring-container\b', r'\.progress-ring\b', r'\.progress-primary\b',
    r'\.main-grid\b', r'\.checklist\b',
    r'\.summary-panel\b', r'\.summary-row\b',
    r'\.fps-grid\b', r'\.fps-item\b', r'\.fps-left\b', r'\.fps-game\b', r'\.fps-tier-badge\b', r'\.fps-tier-ultra\b', r'\.fps-tier-high\b', r'\.fps-tier-medium\b', r'\.fps-tier-playable\b',
    r'\.visualizer-panel\b',
    r'\.drawer-toolbar\b', r'\.toggle-compat-label\b', r'\.select-sm\b',
    r'\.export-textarea\b',
    r'\.app-header\b', r'\.header-presets\b', r'\.header-actions\b', r'\.header-divider\b', r'\.header-controls\b',
    r'\.gpu-analogs-box\b', r'\.analogs-label\b', r'\.analogs-chips\b',
    r'\.retailer-jump-btn\b', r'\.retailer-card-header\b'
]

# We will just remove any CSS rule block that STARTS with these classes, or only contains them.
# A regex to match a rule: selector { body }
# Since selectors can be comma separated, this is tricky. Let's not break it.
# Actually, the 15% scaled proportions removal removes 36 !importants.
# Let's also remove the "Full-Width Pro Workbench" !importants section if it exists.
css = re.sub(r'/\* =============================================================\s*MODERN UNIFIED HEADER & AUTO-BUILD POPOVER.*?/\* =============================================================', '/* =============================================================', css, flags=re.DOTALL)

with open("css/style.css", "w", encoding="utf-8") as f:
    f.write(css)

print("Cleaned up CSS.")
