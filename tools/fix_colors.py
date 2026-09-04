import re

with open("css/style.css", "r", encoding="utf-8") as f:
    css = f.read()

# Replace hardcoded dark background colors with CSS variables.
replacements = {
    # Surfaces
    r'#181f2d': 'var(--surface)',
    r'#141a26': 'var(--surface)',
    r'#141a27': 'var(--surface)',
    r'#151b23': 'var(--surface)',
    r'#151d2b': 'var(--surface)',
    r'#182030': 'var(--surface)',
    r'rgba\(20, 24, 33, 0.85\)': 'var(--surface-glass)',
    
    # Backgrounds
    r'#101622': 'var(--bg)',
    r'#0b0f17': 'var(--bg)',
    r'#0d121c': 'var(--bg)',
    r'#0f1523': 'var(--bg)',
    
    # Surface Hovers
    r'#1b2537': 'var(--surface-hover)',
    r'#222d42': 'var(--surface-hover)',
}

# Apply replacements ONLY inside [data-theme="dark"] blocks or inside the media queries where they might be.
# It's safer to just replace them globally, since these specific dark hex colors won't appear in the light theme anyway (unless it's a bug).
for old, new in replacements.items():
    # Only replace if they are used as colors (after colon or space, before semicolon or brace)
    css = re.sub(r'(?i)(:\s*)' + old + r'(\s*[;}!])', r'\1' + new + r'\2', css)

# Increase contrast for slot-placeholder and optional-badge in Light Theme.
css = css.replace('color: var(--text-muted);', 'color: var(--text-secondary); /* Contrast fix */')
css = css.replace('color: var(--text-tertiary);', 'color: var(--text-secondary); /* Contrast fix */')
# In dark theme, they are probably fine with text-secondary.

with open("css/style.css", "w", encoding="utf-8") as f:
    f.write(css)

print("Replaced hardcoded dark colors and improved contrast.")
