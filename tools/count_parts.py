import re
with open('js/data.js', 'r', encoding='utf-8') as f:
    js = f.read()

for cat in ['cpu', 'gpu', 'motherboard', 'cooler', 'ram', 'ssd', 'hdd', 'psu', 'case', 'monitor']:
    count = len(re.findall(rf"id:\s*'{cat}-", js))
    print(f'{cat}: {count} parts')
print(f'Total: {len(re.findall(r"id:", js))} entries')
