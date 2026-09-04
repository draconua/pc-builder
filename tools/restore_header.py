import sys
with open('tools/patch_header_style.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract header_css
start_idx = content.find('header_css = """') + len('header_css = """')
end_idx = content.rfind('"""\n\ncss = css')
if start_idx > len('header_css = """') and end_idx > start_idx:
    header_css = content[start_idx:end_idx]
    with open('css/style.css', 'a', encoding='utf-8') as f:
        f.write("\n" + header_css)
    print("Appended header_css successfully!")
else:
    print("Could not extract header_css")
