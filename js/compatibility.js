// =============================================================
// compatibility.js — Validation logic for PC component builds
// =============================================================

/**
 * Checks compatibility of the current build configuration.
 * Supports 10 categories (cpu, motherboard, cooler, ram, gpu, ssd, hdd, psu, case, monitor)
 * ignores hdd and monitor for constraints.
 * 
 * @param {Object} build - Object containing selected parts.
 * @returns {Array<{type: 'success'|'warning'|'error', message: string}>}
 */
export function checkCompatibility(build) {
  const status = [];
  const { cpu, motherboard, cooler, ram, gpu, ssd, psu, case: pcCase } = build;

  // 1. Socket Check: CPU + Motherboard
  if (cpu && motherboard) {
    if (cpu.socket !== motherboard.socket) {
      status.push({
        type: 'error',
        message: `Socket Mismatch: CPU uses socket ${cpu.socket}, but motherboard uses ${motherboard.socket}.`
      });
    } else {
      status.push({
        type: 'success',
        message: `Socket Match: Both use ${cpu.socket}.`
      });
    }

    // VRM Check (Approximation based on chipset if not strictly defined)
    const mbChipset = motherboard.name.toLowerCase();
    let maxVrmTdp = 300; // default for high-end
    if (mbChipset.includes('h610') || mbChipset.includes('h510') || mbChipset.includes('a520') || mbChipset.includes('a620')) maxVrmTdp = 120;
    else if (mbChipset.includes('b660') || mbChipset.includes('b760') || mbChipset.includes('b550') || mbChipset.includes('b650m-k') || mbChipset.includes('b450') || mbChipset.includes('b560') || mbChipset.includes('b860') || mbChipset.includes('b850')) maxVrmTdp = 180;
    
    const actualCpuTdp = cpu.maxTdp || cpu.tdp || 65;
    if (actualCpuTdp > maxVrmTdp) {
      status.push({
        type: 'warning',
        message: `VRM Limit Warning: CPU peak power (${actualCpuTdp}W) exceeds the safe limit for budget VRMs (~${maxVrmTdp}W) on this motherboard. It will work, but may throttle under heavy load.`
      });
    }

  }

  // 2. Memory standard check: Motherboard + RAM
  if (motherboard && ram) {
    // motherboard.ramType is 'DDR4' or 'DDR5'
    // ram.ramType is 'DDR4' or 'DDR5'
    if (motherboard.ramType !== ram.ramType) {
      status.push({
        type: 'error',
        message: `Memory Standard Mismatch: Motherboard requires ${motherboard.ramType}, but selected RAM is ${ram.ramType}.`
      });
    } else {
      status.push({
        type: 'success',
        message: `Memory Standard Match: Both use ${ram.ramType}.`
      });
    }
  }

  // 3. Socket compatibility: CPU + Cooler
  if (cpu && cooler) {
    // If sockets array is missing, treat cooler as universally compatible (e.g., uses AM5/LGA1700 bracket kit)
    if (!cooler.sockets || cooler.sockets.length === 0) {
      status.push({
        type: 'success',
        message: `Cooler: Universal mount — check bracket compatibility for socket ${cpu.socket}.`
      });
    } else {
      const isSocketSupported = cooler.sockets.includes(cpu.socket);
      if (!isSocketSupported) {
        status.push({
          type: 'error',
          message: `Cooler Bracket Mismatch: Cooler does not support socket ${cpu.socket}.`
        });
      } else {
        status.push({
          type: 'success',
          message: `Cooler Bracket Compatible: Supports socket ${cpu.socket}.`
        });
      }
    }
  }

  // 4. Motherboard Form Factor check: Case + Motherboard
  if (pcCase && motherboard) {
    if (!pcCase.mbSizes || pcCase.mbSizes.length === 0) {
      // Missing field — skip silently
    } else {
      const isSizeSupported = pcCase.mbSizes.includes(motherboard.formFactor);
      if (!isSizeSupported) {
        status.push({
          type: 'error',
          message: `Chassis Size Limit: Case does not fit motherboard size ${motherboard.formFactor} (supports: ${pcCase.mbSizes.join(', ')}).`
        });
      } else {
        status.push({
          type: 'success',
          message: `Chassis Size Compatibility: Case fits motherboard size ${motherboard.formFactor}.`
        });
      }
    }
  }

  // 5. GPU Clearance: Case + GPU
  if (pcCase && gpu) {
    if (gpu.length && pcCase.maxGpuLength) {
      if (gpu.length > pcCase.maxGpuLength) {
        status.push({
          type: 'error',
          message: `GPU Clearance Error: GPU length is ${gpu.length}mm, but case maximum clearance is ${pcCase.maxGpuLength}mm.`
        });
      } else {
        status.push({
          type: 'success',
          message: `GPU Clearance OK: GPU fits (length ${gpu.length}mm, case limit ${pcCase.maxGpuLength}mm).`
        });
      }
    }
  }

  // 6. CPU Cooler height/clearance check: Case + Cooler
  if (pcCase && cooler) {
    if (cooler.type === 'AIO' || cooler.type === 'aio') {
      const caseMaxRad = pcCase.maxRadiatorSize !== undefined ? pcCase.maxRadiatorSize : 360;
      const coolerRad = cooler.radiatorSize || 240;
      if (caseMaxRad === 0) {
        status.push({
          type: 'error',
          message: `Liquid Cooler Clearance: Selected case does not support liquid AIO radiators.`
        });
      } else if (coolerRad > caseMaxRad) {
        status.push({
          type: 'error',
          message: `Radiator Clearance Error: Cooler radiator is ${coolerRad}mm, but case maximum supported radiator is ${caseMaxRad}mm.`
        });
      } else {
        status.push({
          type: 'success',
          message: `Liquid Cooler Fit: Case supports ${coolerRad}mm AIO radiator setup.`
        });
      }
    } else if (cooler.height && pcCase.maxCoolerHeight) {
      if (cooler.height > pcCase.maxCoolerHeight) {
        status.push({
          type: 'error',
          message: `Cooler Height Clearance Error: Cooler is ${cooler.height}mm tall, but case maximum cooler height is ${pcCase.maxCoolerHeight}mm.`
        });
      } else {
        status.push({
          type: 'success',
          message: `Cooler Height OK: Fits in case (cooler height ${cooler.height}mm, case limit ${pcCase.maxCoolerHeight}mm).`
        });
      }
    }
  }

  // 7. PSU Form Factor: Case + PSU
  if (pcCase && psu) {
    if (!pcCase.psuTypes || pcCase.psuTypes.length === 0) {
      // No restriction info — skip
    } else {
      const isPsuTypeSupported = pcCase.psuTypes.includes(psu.formFactor);
      if (!isPsuTypeSupported) {
        status.push({
          type: 'error',
          message: `PSU Form Factor Mismatch: Case requires ${pcCase.psuTypes.join('/')} PSU, but selected PSU is ${psu.formFactor}.`
        });
      } else {
        status.push({
          type: 'success',
          message: `PSU Form Factor OK: Selected ${psu.formFactor} PSU fits in the case.`
        });
      }
    }
  }

  // 8. Power Supply calculation: PSU vs System TDP
  if (cpu || gpu) {
    let estTdp = 100; // Base system overhead (MB, RAM, SSDs, fans)
    if (cpu) {
      estTdp += (cpu.maxTdp || cpu.tdp);
    }
    if (gpu) {
      estTdp += gpu.tdp;
    }

    if (psu) {
      if (psu.wattage < estTdp) {
        status.push({
          type: "error",
          message: `Insufficient PSU Wattage: System estimated draw is ${estTdp}W, but PSU provides only ${psu.wattage}W.`
        });
      } else if (psu.wattage < estTdp * 1.25) {
        status.push({
          type: "warning",
          message: `Low Power Margin: PSU provides ${psu.wattage}W. Estimated system draw is ${estTdp}W. Recommending at least 25% safety margin.`
        });
      } else {
        // Efficiency curve check (50-70% is optimal)
        const loadPercentage = (estTdp / psu.wattage) * 100;
        if (loadPercentage >= 40 && loadPercentage <= 80) {
           status.push({
             type: "success",
             message: `PSU Efficiency Optimal: System load (${estTdp}W) is ~${Math.round(loadPercentage)}% of PSU capacity (${psu.wattage}W), hitting the peak efficiency curve.`
           });
        } else if (loadPercentage < 40) {
           status.push({
             type: "success",
             message: `PSU Capacity Overkill: System load (${estTdp}W) is only ~${Math.round(loadPercentage)}% of PSU capacity (${psu.wattage}W).`
           });
        } else {
           status.push({
             type: "success",
             message: `PSU Capacity OK: System load is ~${Math.round(loadPercentage)}% of PSU capacity.`
           });
        }
      }
    } else {
      if (gpu && gpu.recommendedPsu) {
        status.push({
          type: "warning",
          message: `Power Supply Needed: Recommended power supply capacity for GPU is ${gpu.recommendedPsu}W+ (Estimated draw: ${estTdp}W).`
        });
      }
    }
    
    // 9. Airflow / Thermal Warning
    if (cpu && pcCase && cooler) {
      const heatLoad = (cpu.maxTdp || cpu.tdp) + (gpu ? gpu.tdp : 0);
      if (heatLoad > 400 && cooler.type === "air" && cooler.height < 150) {
         status.push({
           type: "warning",
           message: `Thermal Warning: High system heat output (${heatLoad}W). A small air cooler might struggle. Consider a larger dual-tower or AIO liquid cooler.`
         });
      }
    }
  }

  
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
       const mbIsGen5 = mbName.includes('z790') || mbName.includes('x670') || mbName.includes('b650e') || mbName.includes('x870') || mbName.includes('z890') || mbName.includes('b850');
       const mbIsGen4 = mbName.includes('b550') || mbName.includes('b660') || mbName.includes('b760') || mbName.includes('z690') || mbName.includes('b560') || mbName.includes('z590') || mbName.includes('b860') || mbIsGen5;
       
       if (isGen5Ssd && !mbIsGen5) {
           status.push({
               type: 'warning',
               message: `PCIe Bottleneck: SSD — Gen5, но материнская плата может поддерживать только Gen4. Он будет работать, но на урезанной скорости.`
           });
       } else if (isGen4Ssd && !mbIsGen4 && (mbName.includes('a520') || mbName.includes('h610') || mbName.includes('h510') || mbName.includes('b450') || mbName.includes('a320') || mbName.includes('z390'))) {
           status.push({
               type: 'warning',
               message: `PCIe Bottleneck: SSD — Gen4, но плата поддерживает только Gen3. Скорость будет урезана вдвое.`
           });
       }
    }
  }

  return status;
}
