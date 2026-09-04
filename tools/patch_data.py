import re

with open('js/data.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Update Cases
def update_case(match):
    line = match.group(0)
    ff = re.search(r"formFactor:\s*'([^']+)'", line)
    form_factor = ff.group(1) if ff else 'ATX'
    
    # Determine mbSizes and psuTypes
    if form_factor == 'ATX':
        mb = "mbSizes: ['ATX', 'Micro-ATX', 'Mini-ITX']"
        psu = "psuTypes: ['ATX']"
    elif form_factor == 'Micro-ATX':
        mb = "mbSizes: ['Micro-ATX', 'Mini-ITX']"
        psu = "psuTypes: ['ATX', 'SFX']"
    else: # Mini-ITX
        mb = "mbSizes: ['Mini-ITX']"
        psu = "psuTypes: ['SFX']"
        if 'NR200P' in line: psu = "psuTypes: ['SFX', 'SFX-L']"
        if 'O11 Air Mini' in line: psu = "psuTypes: ['ATX', 'SFX']"

    # Default sizes
    max_gpu = "maxGpuLength: 360"
    if 'ITX' in form_factor: max_gpu = "maxGpuLength: 320"
    if 'Torrent' in line or 'Lancool' in line or 'O11' in line: max_gpu = "maxGpuLength: 400"
    
    max_cooler = "maxCoolerHeight: 165"
    if 'ITX' in form_factor: max_cooler = "maxCoolerHeight: 145"
    if 'Terra' in line: max_cooler = "maxCoolerHeight: 70"
    if 'A4-H2O' in line: max_cooler = "maxCoolerHeight: 55"
    
    # Insert before specs:
    return re.sub(r"(specs:\s*')", f"{mb}, {max_gpu}, {max_cooler}, {psu}, \\1", line)

content = re.sub(r"\{\s*id:\s*'case-[^}]+}", update_case, content)

# Update GPUs
def update_gpu(match):
    line = match.group(0)
    tier_match = re.search(r"tier:\s*(\d+)", line)
    tier = int(tier_match.group(1)) if tier_match else 5
    
    length = 280
    if tier <= 3: length = 220
    elif tier <= 6: length = 260
    elif tier <= 8: length = 310
    else: length = 340
    
    return re.sub(r"(specs:\s*')", f"length: {length}, \\1", line)

content = re.sub(r"\{\s*id:\s*'gpu-[^}]+}", update_gpu, content)
content = re.sub(r"\{\s*id:\s*'a580'[^}]+}", update_gpu, content)
content = re.sub(r"\{\s*id:\s*'b580'[^}]+}", update_gpu, content)

with open('js/data.js', 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated data.js with constraints.')
