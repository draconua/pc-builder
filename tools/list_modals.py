with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

import re
modals = re.findall(r'<div[^>]*class="[^"]*modal[^"]*"[^>]*id="([^"]+)"', html)
print("Modals in index.html:", modals)
