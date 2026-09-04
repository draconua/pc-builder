import re

with open("js/app.js", "r", encoding="utf-8") as f:
    js = f.read()

vrm_fix = """
  // VRM Limit Issue
  if (issueMsg.includes('VRM Limit Warning') && build.cpu) {
    const mbOptions = PARTS_DATABASE.motherboard
      .filter(m => m.socket === build.cpu.socket && !m.name.toLowerCase().includes('h610') && !m.name.toLowerCase().includes('a520') && !m.name.toLowerCase().includes('a620') && !m.name.toLowerCase().includes('b650m-k'))
      .sort((a,b) => a.price - b.price)
      .slice(0, 3);
    if (mbOptions.length > 0) {
      fixes.push({
        title: `⚡ Надежные материнские платы под ${build.cpu.name}:`,
        category: 'motherboard',
        parts: mbOptions
      });
    }
  }

  // ATX 3.0 Standard Issue
  if (issueMsg.includes('ATX 3.0 Standard') && build.gpu) {
    const psuOptions = PARTS_DATABASE.psu
      .filter(p => p.specs && p.specs.includes('ATX 3.0'))
      .sort((a,b) => a.price - b.price)
      .slice(0, 3);
    if (psuOptions.length > 0) {
      fixes.push({
        title: `⚡ Блоки питания ATX 3.0 (прямой кабель 12VHPWR):`,
        category: 'psu',
        parts: psuOptions
      });
    }
  }
"""

# Insert before "return fixes;"
js = js.replace("return fixes;\n}", vrm_fix + "\n  return fixes;\n}")

with open("js/app.js", "w", encoding="utf-8") as f:
    f.write(js)
print("Updated app.js with VRM and ATX 3.0 fixes")
