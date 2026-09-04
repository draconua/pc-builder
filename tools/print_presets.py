import re

with open("js/data.js", "r", encoding="utf-8") as f:
    content = f.read()

match = re.search(r'export const PRESETS = (.*?);', content, re.DOTALL)
if match:
    print(match.group(1))
