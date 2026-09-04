import urllib.request

urls = [
  'https://e-katalog.pl/ek-list.php?search_=RTX+4070',
  'https://e-katalog.pl/katalog.php?search_=RTX+4070',
  'https://e-katalog.pl/list.php?search_=RTX+4070',
  'https://ek.ua/ek-list.php?search_=RTX+4070',
  'https://cenowarka.pl/?fs=RTX+4070',
  'https://www.ceneo.pl/;szukaj-RTX+4070'
]

for u in urls:
    try:
        req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'})
        resp = urllib.request.urlopen(req, timeout=5)
        print(f"OK {resp.getcode()} -> {u} -> URL was {resp.geturl()}")
    except urllib.error.HTTPError as e:
        print(f"HTTPError {e.code} -> {u}")
    except Exception as e:
        print(f"Err {e} -> {u}")
