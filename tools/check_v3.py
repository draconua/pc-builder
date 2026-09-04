import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
with open('tools/patch_header_style.py', 'r', encoding='utf-8') as f:
    content = f.read()
    print("End of file:")
    print(content[-300:])
