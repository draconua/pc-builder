with open("js/i18n.js", "r", encoding="utf-8") as f:
    code = f.read()

print("File length:", len(code))
print("Contains slot.gpu.analogs?", 'slot.gpu.analogs' in code)
print("Contains slot.comparePrices?", 'slot.comparePrices' in code)

# Let's see what keys are actually in translations object
import re
match = re.search(r'ru:\s*\{(.*?)\n  \},', code, re.DOTALL)
if match:
    keys = re.findall(r"'([^']+)':", match.group(1))
    print("Keys in ru count:", len(keys))
    for k in ['slot.gpu.analogs', 'slot.comparePrices', 'slot.cpu.analogs']:
        print(f" - {k}: {k in keys}")
else:
    print("Could not match ru block!")
