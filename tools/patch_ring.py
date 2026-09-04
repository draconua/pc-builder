import re

with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Make the SVG visualization pop
ring_css = '''
.progress-ring-circle {
  filter: drop-shadow(0 0 6px var(--accent-subtle));
}
[data-theme="dark"] .progress-ring-circle {
  filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.3));
}
'''
css = css + '\n' + ring_css

with open('css/style.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("Ring glow applied")
