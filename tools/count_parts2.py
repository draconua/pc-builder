import re
with open('js/data.js', 'r', encoding='utf-8') as f:
    js = f.read()

for cat in ['mb', 'cool', 'mon']:
    count = len(re.findall(rf"id:\s*'{cat}", js))
    print(f'{cat}: {count} parts')
