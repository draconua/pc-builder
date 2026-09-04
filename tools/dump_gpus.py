import re
with open("js/data.js", "r", encoding="utf-8") as f:
    content = f.read()
match = re.search(r'gpu:\s*\[(.*?)\],(?=\s*(?:ram|ssd|cooler|psu|case|monitor):)', content, re.DOTALL)
if match:
    gpus_text = match.group(1)
    gpus = re.findall(r"name:\s*'([^']+)'", gpus_text)
    print("GPUs in DB:")
    for g in gpus:
        print(f" - {g}")
