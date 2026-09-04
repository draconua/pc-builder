import re

with open('js/data.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Dictionary mapping common SSD names to their NAND types
nand_map = {
    'Crucial P3': 'QLC',
    'Kingston NV2': 'QLC',
    'Samsung 990 PRO': 'TLC',
    'Samsung 980 PRO': 'TLC',
    'Samsung 870 EVO': 'TLC',
    'WD Blue 3D NAND': 'TLC',
    'Kingston A400': 'TLC',
    'Crucial MX500': 'TLC',
    'WD Blue SN580': 'TLC',
    'WD Black SN850X': 'TLC',
    'Sabrent Rocket 4 Plus': 'TLC',
    'Crucial T700': 'TLC',
    'Corsair MP700 PRO': 'TLC',
    'AORUS Gen5 12000': 'TLC',
}

def inject_nand(match):
    full_line = match.group(0)
    name_match = re.search(r"name:\s*'([^']+)'", full_line)
    if name_match:
        name = name_match.group(1)
        nand = 'TLC' # Default to TLC if not explicitly matched
        for k, v in nand_map.items():
            if k in name:
                nand = v
                break
        
        # Inject nandType before buyLinks or at the end
        if 'buyLinks:' in full_line:
            full_line = full_line.replace('buyLinks:', f"nandType: '{nand}', buyLinks:")
        else:
            full_line = full_line.rstrip(' },\n') + f", nandType: '{nand}' }}" + (',' if full_line.strip().endswith(',') else '')
    return full_line

# Find the SSD array and replace lines inside it
ssd_match = re.search(r'ssd:\s*\[([\s\S]*?)\]\s*,', js)
if ssd_match:
    ssd_block = ssd_match.group(1)
    new_ssd_block = re.sub(r'\{\s*id:\s*\'ssd-[^\}]+\},?', inject_nand, ssd_block)
    js = js.replace(ssd_block, new_ssd_block)

    with open('js/data.js', 'w', encoding='utf-8') as f:
        f.write(js)
    print("Injected nandType into SSDs.")
else:
    print("Could not find ssd array.")
