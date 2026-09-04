with open("css/style.css", "r", encoding="utf-8") as f:
    css = f.read()

import re
for m in re.finditer(r'(\.details-grid[^{]*\{[^}]+\})', css):
    print(m.start(), m.group(0))
