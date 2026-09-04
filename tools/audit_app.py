import re

with open("js/app.js", "r", encoding="utf-8") as f:
    code = f.read()

print("app.js total lines:", len(code.splitlines()))
print("app.js total bytes:", len(code.encode("utf-8")))

# Find duplicate function definitions
funcs = re.findall(r'function\s+([a-zA-Z0-9_]+)\s*\(', code)
from collections import Counter
counts = Counter(funcs)
duplicates = {k: v for k, v in counts.items() if v > 1}
print("Duplicate function definitions:", duplicates)

# Check for unused/undefined elements or dead code patterns
window_props = re.findall(r'window\.([a-zA-Z0-9_]+)', code)
print("window properties exposed:", set(window_props))
