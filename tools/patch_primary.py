with open("tools/gemini_engine.js", "r", encoding="utf-8") as f:
    js = f.read()

# Change candidateModels to put gemini-3.5-flash FIRST
js = js.replace("const candidateModels = [preferredModel, 'gemini-3.5-flash', 'gemini-3.7-flash', 'gemini-flash-lite-latest'];", 
                "const candidateModels = ['gemini-3.5-flash', 'gemini-3.7-flash', 'gemini-3.5-flash-lite'];")

with open("tools/gemini_engine.js", "w", encoding="utf-8") as f:
    f.write(js)
print("Set gemini-3.5-flash as primary model.")
