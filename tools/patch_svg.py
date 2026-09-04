import re

with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Make the SVG visualization pop
svg_css = '''
/* Glowing SVG */
#pc-svg {
  filter: drop-shadow(0 0 8px rgba(0,0,0,0.05));
  transition: all 0.4s var(--ease);
}
.vis-component.active {
  filter: drop-shadow(0 4px 12px rgba(15, 23, 42, 0.15));
}
[data-theme="dark"] .vis-component.active {
  filter: drop-shadow(0 4px 12px rgba(255, 255, 255, 0.15));
}
'''
css = css + '\n' + svg_css

with open('css/style.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("SVG glow applied")
