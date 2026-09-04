with open("js/performance.js", "r", encoding="utf-8") as f:
    perf = f.read()

import re

# Find orphaned else
orphan_start = perf.find(" else if (resolution === '1080p') {")
if orphan_start != -1:
    # We want to remove from the previous } that caused the orphan
    # Let's just find where my new analyzeBottleneck ends.
    # It ends with: "return { text, advice, score, isGpuBound, isCpuBound, ratio };\n}"
    end_of_new = perf.find("return { text, advice, score, isGpuBound, isCpuBound, ratio };\n}") + len("return { text, advice, score, isGpuBound, isCpuBound, ratio };\n}")
    
    # Let's delete everything from end_of_new to the actual end of the orphaned code.
    # Orphaned code ends with: "return { text, advice, score, isGpuBound, isCpuBound, ratio };\n}" (from the old function)
    end_of_orphan = perf.find("return { text, advice, score, isGpuBound, isCpuBound, ratio };\n}", end_of_new) + len("return { text, advice, score, isGpuBound, isCpuBound, ratio };\n}")
    
    if end_of_orphan > end_of_new:
        orphaned_code = perf[end_of_new:end_of_orphan]
        print("Removing orphaned code in performance.js:\n" + orphaned_code[:200] + "...")
        perf = perf[:end_of_new] + perf[end_of_orphan:]
        with open("js/performance.js", "w", encoding="utf-8") as f:
            f.write(perf)
        print("Fixed performance.js")
    else:
        print("Could not find end of orphan")
else:
    print("Could not find orphaned else")
