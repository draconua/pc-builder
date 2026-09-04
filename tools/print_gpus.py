import re

with open("js/data.js", "r", encoding="utf-8") as f:
    content = f.read()

match = re.search(r'gpu:\s*\[(.*?)\],(?=\s*(?:ram|ssd|cooler|psu|case|monitor):)', content, re.DOTALL)
if match:
    gpus_text = match.group(1)
    gpus = re.findall(r"name:\s*'([^']+)',\s*brand:\s*'[^']+',\s*price:\s*\d+,\s*tdp:\s*\d+,\s*vram:\s*\d+,\s*tier:\s*\d+,\s*gpuScore:\s*(\d+)", gpus_text)
    for g in gpus:
        print(f"{g[0]:<30} | Score: {g[1]}")
