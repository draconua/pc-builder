import re
with open("js/compatibility.js", "r", encoding="utf-8") as f:
    js = f.read()

# Insert before "return status;"
ssd_logic = """
  // 10. SSD PCIe Gen & QLC Check
  if (ssd) {
    if (ssd.nandType === 'QLC' || (ssd.specs && ssd.specs.includes('QLC'))) {
       status.push({
           type: 'warning',
           message: `QLC Warning: Выбранный SSD (${ssd.name}) использует QLC NAND. Скорость записи может падать при заполнении SLC-кэша. Для ОС и тяжелых задач рекомендуется TLC.`
       });
    }
    if (motherboard && ssd.interface) {
       const isGen5Ssd = ssd.interface.includes('Gen5');
       const isGen4Ssd = ssd.interface.includes('Gen4');
       const mbName = motherboard.name.toLowerCase();
       const mbIsGen5 = mbName.includes('z790') || mbName.includes('x670') || mbName.includes('b650e') || mbName.includes('x870');
       const mbIsGen4 = mbName.includes('b550') || mbName.includes('b660') || mbName.includes('b760') || mbName.includes('z690') || mbIsGen5;
       
       if (isGen5Ssd && !mbIsGen5) {
           status.push({
               type: 'warning',
               message: `PCIe Bottleneck: SSD — Gen5, но материнская плата может поддерживать только Gen4. Он будет работать, но на урезанной скорости.`
           });
       } else if (isGen4Ssd && !mbIsGen4 && (mbName.includes('a520') || mbName.includes('h610'))) {
           status.push({
               type: 'warning',
               message: `PCIe Bottleneck: SSD — Gen4, но бюджетная плата поддерживает только Gen3. Скорость будет урезана вдвое.`
           });
       }
    }
  }
"""

if "10. SSD PCIe Gen & QLC Check" not in js:
    js = js.replace("return status;", ssd_logic + "\n  return status;")
    with open("js/compatibility.js", "w", encoding="utf-8") as f:
        f.write(js)
    print("Injected SSD checks into compatibility.js.")
else:
    print("Already injected.")
