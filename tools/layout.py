import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace the layout
# Currently: <div class="app"> -> <div class="builder-layout"> <div class="builder-slots">...</div> <div class="builder-sidebar">...</div>
html = html.replace('<div class="app">', '<div class="app dashboard-layout">')

# Modify the toolbar to span full width
html = html.replace('<div class="toolbar">', '<div class="toolbar full-width">')

# Move the #pc-svg to the center of the screen, or keep it in the sidebar but make it bigger.
# Actually, it's easier to just apply a CSS redesign that transforms the grid into a sleek two-column dashboard.

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
