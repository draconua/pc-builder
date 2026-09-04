import json
import re

with open('js/data.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract PC_PARTS array
match = re.search(r'const PC_PARTS = \[(.*?)\];', content, re.DOTALL)
if match:
    parts_str = "[" + match.group(1) + "]"
    # It's JS, not strict JSON. Let's just find all names and types.
    gpus = re.findall(r"id:\s*'gpu_[^']+',\s*name:\s*'([^']+)'", content)
    cpus = re.findall(r"id:\s*'cpu_[^']+',\s*name:\s*'([^']+)'", content)
    print("GPUs:", gpus)
    print("CPUs:", cpus)
