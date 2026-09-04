with open("js/app.js", "r", encoding="utf-8") as f:
    js = f.read()

target = "  // 1. Checklist slots\n  CATEGORIES.forEach(category => {"
# Let's find end of CATEGORIES.forEach loop in updateUI
pos_start = js.find("function updateUI()")
pos_loop = js.find("CATEGORIES.forEach(category => {", pos_start)
pos_loop_end = js.find("  });\n\n  // 2. Summary", pos_loop)

if pos_loop_end != -1:
    addition = """  });

  // Include optional monitor in total price
  if (buildState.monitor) {
    totalPrice += buildState.monitor.price;
  }

  // 2. Summary"""
    old_block = js[pos_loop_end:pos_loop_end + len("  });\n\n  // 2. Summary")]
    js = js[:pos_loop_end] + addition + js[pos_loop_end + len("  });\n\n  // 2. Summary"):]
    with open("js/app.js", "w", encoding="utf-8") as f:
        f.write(js)
    print("Injected monitor price directly into updateUI().")
else:
    print("Could not find pos_loop_end")
