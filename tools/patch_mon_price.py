with open("js/app.js", "r", encoding="utf-8") as f:
    js = f.read()

target = "  // 2. Summary"
addition = """  // Include optional monitor in total price
  if (buildState.monitor) {
    totalPrice += buildState.monitor.price;
  }

  // 2. Summary"""

if target in js and "if (buildState.monitor) {" not in js:
    js = js.replace(target, addition, 1)
    with open("js/app.js", "w", encoding="utf-8") as f:
        f.write(js)
    print("Added monitor price to totalPrice calculation.")
else:
    print("Already added or target not found.")
