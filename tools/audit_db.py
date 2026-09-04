import json
import re

with open('js/data.js', 'r', encoding='utf-8') as f:
    data = f.read()

# Extract PARTS_DATABASE keys
parts = set()
for match in re.finditer(r"id:\s*'([^']+)'", data):
    parts.add(match.group(1))

# Extract PRESETS parts
missing = []
preset_block = data.split('export const PRESETS')[1]
for match in re.finditer(r"([a-z]+):\s*'([^']+)'", preset_block):
    cat = match.group(1)
    part_id = match.group(2)
    if part_id not in parts and cat in ['cpu','motherboard','cooler','ram','gpu','ssd','hdd','psu','case','monitor']:
        missing.append(f"{cat}: {part_id}")

if missing:
    print("MISSING IDs in PRESETS:")
    for m in missing: print(m)
else:
    print("All preset IDs perfectly match PARTS_DATABASE.")
