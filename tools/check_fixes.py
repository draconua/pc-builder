import re
with open("js/compatibility.js", "r", encoding="utf-8") as f:
    content = f.read()

for match in re.finditer(r'fixes\s*:', content):
    start = max(0, match.start() - 50)
    end = min(len(content), match.end() + 200)
    print(content[start:end])
    print("-" * 40)
