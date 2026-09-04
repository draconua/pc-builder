with open("js/compatibility.js", "r", encoding="utf-8") as f:
    js = f.read()

# Add VRM check logic right after socket match block
vrm_logic = """
    // VRM Check (Approximation based on chipset if not strictly defined)
    const mbChipset = motherboard.name.toLowerCase();
    let maxVrmTdp = 300; // default for high-end
    if (mbChipset.includes('h610') || mbChipset.includes('a520') || mbChipset.includes('a620')) maxVrmTdp = 120;
    else if (mbChipset.includes('b660') || mbChipset.includes('b760') || mbChipset.includes('b550') || mbChipset.includes('b650m-k')) maxVrmTdp = 180;
    
    const actualCpuTdp = cpu.maxTdp || cpu.tdp || 65;
    if (actualCpuTdp > maxVrmTdp) {
      status.push({
        type: 'warning',
        message: `VRM Limit Warning: CPU peak power (${actualCpuTdp}W) exceeds the safe limit for budget VRMs (~${maxVrmTdp}W) on this motherboard. It will work, but may throttle under heavy load.`
      });
    }
"""

js = js.replace("message: `Socket Match: Both use ${cpu.socket}.`\n      });\n    }", "message: `Socket Match: Both use ${cpu.socket}.`\n      });\n    }\n" + vrm_logic)


# Add GPU Power Connector check right after GPU length check
connector_logic = """
  // 7. GPU Power Connector Warning
  if (gpu && psu) {
    if ((gpu.name.includes('RTX 40') || gpu.name.includes('RTX 50')) && (!psu.specs || !psu.specs.includes('ATX 3.0'))) {
      status.push({
        type: 'warning',
        message: `ATX 3.0 Standard: The ${gpu.name} uses a 12VHPWR connector. The selected PSU (${psu.name}) may require an adapter cable (included with GPU). Consider an ATX 3.0 PSU for direct connection.`
      });
    }
  }
"""

# Find end of case GPU check to insert this
js = js.replace("message: `GPU Clearance Match: GPU length is ${gpu.length}mm, Case supports up to ${pcCase.maxGpuLength}mm.`\n      });\n    }\n  }", "message: `GPU Clearance Match: GPU length is ${gpu.length}mm, Case supports up to ${pcCase.maxGpuLength}mm.`\n      });\n    }\n  }\n" + connector_logic)


with open("js/compatibility.js", "w", encoding="utf-8") as f:
    f.write(js)
print("Updated compatibility.js with VRM and ATX 3.0 checks")
