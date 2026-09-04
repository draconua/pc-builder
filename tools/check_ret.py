import re

def check_returns(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        js = f.read()

    # Extremely simple check: find returns that might be orphaned
    # Let's just print the context of all returns that start on column 0 or 2, 
    # but the best way is to let node tell us where the error is.
    print(f"Checking {filename}...")

check_returns("js/app.js")
