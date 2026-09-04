with open("js/i18n.js", "r", encoding="utf-8") as f:
    js = f.read()

import re
# extract languages
langs = ['ru', 'en', 'pl', 'ua']
lang_keys = {}
for lang in langs:
    match = re.search(rf'{lang}:\s*\{{(.*?)\n  \}}', js, re.DOTALL)
    if match:
        keys = re.findall(r"'([^']+)':", match.group(1))
        lang_keys[lang] = set(keys)
        print(f"Language {lang}: {len(keys)} keys")
    else:
        print(f"Language {lang}: NOT FOUND")

# Compare keys
all_keys = set().union(*lang_keys.values())
print(f"Total unique keys: {len(all_keys)}")
for lang in langs:
    missing = all_keys - lang_keys[lang]
    if missing:
        print(f"Missing in {lang} ({len(missing)}):", missing)
    else:
        print(f"{lang} has ALL {len(all_keys)} keys!")
