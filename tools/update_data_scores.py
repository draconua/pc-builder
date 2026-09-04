import re

CPU_SCORES = {
  'cpu-r7-9800x3d': 108,
  'cpu-r7-7800x3d': 100,
  'cpu-r9-9950x3d': 104,
  'cpu-r9-9950x': 92,
  'cpu-r9-9900x': 90,
  'cpu-r7-9700x': 88,
  'cpu-r5-9600x': 86,
  'cpu-r9-7950x3d': 98,
  'cpu-r9-7950x': 90,
  'cpu-r9-7900x3d': 94,
  'cpu-r9-7900x': 88,
  'cpu-r7-7700x': 86,
  'cpu-r7-7700': 84,
  'cpu-r5-7600x': 85,
  'cpu-r5-7600': 84,
  'cpu-r5-7500f': 82,
  'cpu-r9-5950x': 78,
  'cpu-r9-5900x': 76,
  'cpu-r7-5800x3d': 86,
  'cpu-r7-5700x3d': 84,
  'cpu-r7-5700x': 74,
  'cpu-r5-5600x': 72,
  'cpu-r5-5600': 71,
  'cpu-r5-5500': 61,
  'cpu-r5-4500': 52,
  'cpu-r3-4100': 45,
  'cpu-u9-285k': 91,
  'cpu-u7-265k': 89,
  'cpu-u7-265kf': 89,
  'cpu-u5-245k': 85,
  'cpu-u5-245kf': 85,
  'cpu-i9-14900ks': 96,
  'cpu-i9-14900k': 94,
  'cpu-i9-13900k': 93,
  'cpu-i7-14700k': 92,
  'cpu-i7-13700k': 90,
  'cpu-i5-14600k': 89,
  'cpu-i5-13600k': 88,
  'cpu-i5-13500': 80,
  'cpu-i5-14400f': 78,
  'cpu-i5-13400f': 77,
  'cpu-i5-12400f': 72,
  'cpu-i3-13100f': 69,
  'cpu-i3-12100f': 68
}

GPU_SCORES = {
  'gpu-rtx5090': 135,
  'gpu-rtx5080': 95,
  'gpu-rtx4090': 100,
  'gpu-rtx4080s': 82,
  'gpu-rx7900xtx': 80,
  'gpu-rtx4070tis': 72,
  'gpu-rx7900xt': 74,
  'gpu-rtx5070': 68,
  'gpu-rtx4070s': 64,
  'gpu-rx7900gre': 62,
  'gpu-rx7800xt': 60,
  'gpu-rtx4070': 55,
  'gpu-rx7700xt': 50,
  'gpu-rtx4060ti-16g': 44,
  'gpu-rtx4060ti-8g': 43,
  'gpu-rx6750xt': 41,
  'gpu-rtx3060ti': 38,
  'gpu-rx7600xt': 36,
  'gpu-rtx4060': 34,
  'gpu-rx7600': 34,
  'gpu-b580': 33,
  'gpu-rx6600xt': 31,
  'gpu-rtx3060-12g': 29,
  'gpu-rx6600': 26,
  'gpu-a580': 23,
  'gpu-rtx3050': 18,
  'gpu-rx6500xt': 12
}

with open("js/data.js", "r", encoding="utf-8") as f:
    content = f.read()

# For CPUs: add cpuScore right after tier
for cid, score in CPU_SCORES.items():
    # find `{ id: 'cid', ... }`
    pattern = rf"(\{{\s*id:\s*'{cid}'[^}}]*?tier:\s*\d+)"
    def repl(m):
        if 'cpuScore' in m.group(1):
            return m.group(1)
        return m.group(1) + f", cpuScore: {score}"
    content = re.sub(pattern, repl, content)

# For GPUs: add gpuScore right after tier
for gid, score in GPU_SCORES.items():
    pattern = rf"(\{{\s*id:\s*'{gid}'[^}}]*?tier:\s*\d+)"
    def repl_gpu(m):
        if 'gpuScore' in m.group(1):
            return m.group(1)
        return m.group(1) + f", gpuScore: {score}"
    content = re.sub(pattern, repl_gpu, content)

with open("js/data.js", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated data.js with authoritative cpuScore and gpuScore for all hardware!")
