import re
with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

# Replace inline SVG font sizes
svg_fonts = {
    r'style="font-size: 7px;"': 'font-size="7"',
    r'style="font-size: 7\.5px;"': 'font-size="7.5"',
    r'style="font-size: 5\.5px;"': 'font-size="5.5"',
    r'style="font-size: 6px;"': 'font-size="6"',
    r'style="font-size: 8px;"': 'font-size="8"',
}
for k, v in svg_fonts.items():
    html = re.sub(k, v, html)

# Replace display:none on inputs
html = html.replace('style="display: none;"', 'class="hidden"')

# Remove fixed inline style from bottleneck-bar (width: 98%)
html = html.replace('style="width: 98%;"', '')

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)
print("Cleaned inline styles from HTML.")
