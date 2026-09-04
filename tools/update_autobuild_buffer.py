with open("js/app.js", "r", encoding="utf-8") as f:
    js = f.read()

# Update generateAutoBuild to include 5% buffer
old_logic = """    let gpu = sortedGpus.find(g => g.price <= budgetUSD * 0.44) || sortedGpus[sortedGpus.length - 1];
    let cpu = sortedCpus.find(c => c.price <= budgetUSD * 0.23) || sortedCpus[sortedCpus.length - 1];"""

new_logic = """    const maxBudget = budgetUSD * 1.05; // Allow up to 5% buffer over target budget for optimal tiering
    let gpu = sortedGpus.find(g => g.price <= maxBudget * 0.44) || sortedGpus[sortedGpus.length - 1];
    let cpu = sortedCpus.find(c => c.price <= maxBudget * 0.23) || sortedCpus[sortedCpus.length - 1];"""

js = js.replace(old_logic, new_logic)

old_while = """    // Iteratively downgrade GPU/CPU if over user's budget
    while (total > budgetUSD && sortedGpus.indexOf(gpu) < sortedGpus.length - 1) {
      const nextGpuIdx = sortedGpus.indexOf(gpu) + 1;
      gpu = sortedGpus[nextGpuIdx];
      build = assemble(cpu, gpu);
      total = Object.values(build).reduce((sum, p) => sum + (p ? p.price : 0), 0);
    }

    while (total > budgetUSD && sortedCpus.indexOf(cpu) < sortedCpus.length - 1) {
      const nextCpuIdx = sortedCpus.indexOf(cpu) + 1;
      cpu = sortedCpus[nextCpuIdx];
      build = assemble(cpu, gpu);
      total = Object.values(build).reduce((sum, p) => sum + (p ? p.price : 0), 0);
    }"""

new_while = """    // Iteratively downgrade GPU/CPU if over user's budget (+5% tolerance buffer)
    while (total > maxBudget && sortedGpus.indexOf(gpu) < sortedGpus.length - 1) {
      const nextGpuIdx = sortedGpus.indexOf(gpu) + 1;
      gpu = sortedGpus[nextGpuIdx];
      build = assemble(cpu, gpu);
      total = Object.values(build).reduce((sum, p) => sum + (p ? p.price : 0), 0);
    }

    while (total > maxBudget && sortedCpus.indexOf(cpu) < sortedCpus.length - 1) {
      const nextCpuIdx = sortedCpus.indexOf(cpu) + 1;
      cpu = sortedCpus[nextCpuIdx];
      build = assemble(cpu, gpu);
      total = Object.values(build).reduce((sum, p) => sum + (p ? p.price : 0), 0);
    }"""

js = js.replace(old_while, new_while)

with open("js/app.js", "w", encoding="utf-8") as f:
    f.write(js)

print("Updated generateAutoBuild with 5% over-budget buffer!")
