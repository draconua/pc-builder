import re, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

with open("js/app.js", "r", encoding="utf-8") as f:
    content = f.read()

match = re.search(r'function getSuggestedFixesForIssue.*?\n\}', content, re.DOTALL)
if match:
    print(match.group(0))
