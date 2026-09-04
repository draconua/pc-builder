with open("css/style.css", "r", encoding="utf-8") as f:
    css = f.read()

import re
matches = re.findall(r'\.toast[a-zA-Z_-]*', css)
print("Toast classes in CSS:", set(matches))

with open("js/app.js", "r", encoding="utf-8") as f:
    js = f.read()

matches_js = re.findall(r'toast[a-zA-Z_-]*', js, re.IGNORECASE)
print("Toast mentions in JS:", set(matches_js))
