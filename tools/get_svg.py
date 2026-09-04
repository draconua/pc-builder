with open("index.html", "r", encoding="utf-8") as f:
    text = f.read()

import re
svg = re.search(r'<svg id="pc-svg".*?</svg>', text, re.DOTALL)
if svg:
    with open("svg_backup.html", "w", encoding="utf-8") as f:
        f.write(svg.group(0))
    print("Found SVG, length:", len(svg.group(0)))
else:
    print("SVG not found")
