import re

with open("js/data.js", "r", encoding="utf-8") as f:
    js = f.read()

# Accurate 2026 real-world price updates
price_updates = {
    # CPUs
    'cpu-r7-7800x3d': 359,
    'cpu-r5-7600': 189,
    'cpu-r5-7600x': 199,
    'cpu-r7-7700x': 269,
    'cpu-r9-7900x': 349,
    'cpu-r9-7950x3d': 529,
    'cpu-r5-5600': 119,
    'cpu-r5-5600x': 129,
    'cpu-r7-5700x3d': 199,
    'cpu-r5-9600x': 249,
    'cpu-r7-9700x': 329,
    'cpu-r7-9800x3d': 449,
    'cpu-r9-9900x': 429,
    'cpu-r9-9950x': 599,
    'cpu-i3-12100f': 85,
    'cpu-i5-12400f': 129,
    'cpu-i5-13400f': 179,
    'cpu-i5-13600k': 249,
    'cpu-i5-14400f': 189,
    'cpu-i5-14600k': 279,
    'cpu-i7-14700k': 369,
    'cpu-i9-14900k': 499,
    'cpu-u5-245k': 289,
    'cpu-u7-265k': 379,
    'cpu-u9-285k': 569,

    # GPUs
    'gpu-rx6500xt': 139,
    'gpu-rx6600': 189,
    'gpu-rx6600xt': 219,
    'gpu-rx7600': 249,
    'gpu-rx7600xt': 299,
    'gpu-rx6750xt': 319,
    'gpu-rx7700xt': 399,
    'gpu-rx7800xt': 479,
    'gpu-rx7900gre': 529,
    'gpu-rx7900xt': 679,
    'gpu-rx7900xtx': 849,
    'gpu-rtx3060': 259,
    'gpu-rtx4060': 289,
    'gpu-rtx4060ti-8': 369,
    'gpu-rtx4060ti-16': 439,
    'gpu-rtx4070': 519,
    'gpu-rtx4070s': 589,
    'gpu-rtx4070tis': 749,
    'gpu-rtx4080s': 899,
    'gpu-rtx4090': 1699,
    'gpu-rtx5070': 649,
    'gpu-rtx5080': 1249,
    'gpu-rtx5090': 1999,
    'a580': 159,
    'b580': 249,

    # SSDs
    'ssd-nv2-1tb': 55,
    'ssd-sn580-1tb': 65,
    'ssd-sn580-2tb': 119,
    'ssd-sn850x-1tb': 89,
    'ssd-sn850x-2tb': 149,
    'ssd-990pro-1tb': 99,
    'ssd-990pro-2tb': 169,
    'ssd-990pro-4tb': 299,
    'ssd-kc3000-2tb': 145,

    # RAM
    'ram-cv16g-3200': 38,
    'ram-rip32g-3200': 59,
    'ram-grs32g-6000': 99,
    'ram-gtz32g-6400': 119,
    'ram-dom32g-6000': 139,
    'ram-gtz64g-6400': 219,

    # PSUs
    'psu-cv550': 52,
    'psu-rm750e': 99,
    'psu-focus-750': 109,
    'psu-pp12m-850': 129,
    'psu-rm1000e': 159,
    'psu-prime-1000': 239,

    # Cases
    'case-cc560': 55,
    'case-air903': 69,
    'case-4000d': 89,
    'case-north': 139,
    'case-o11devo': 159,
    'case-h9flow': 159,
    'case-terra': 179
}

count = 0
for part_id, new_price in price_updates.items():
    pattern = rf"(id:\s*'{part_id}',[^}}]*?price:\s*)\d+"
    if re.search(pattern, js):
        js = re.sub(pattern, rf"\g<1>{new_price}", js)
        count += 1
    else:
        # Check without quotes around id if any
        pattern2 = rf'(id:\s*"{part_id}",[^}}]*?price:\s*)\d+'
        if re.search(pattern2, js):
            js = re.sub(pattern2, rf"\g<1>{new_price}", js)
            count += 1

with open("js/data.js", "w", encoding="utf-8") as f:
    f.write(js)

print(f"Successfully updated real-world prices for {count} components in data.js!")
