import urllib.request
import json

urls_to_test = {
  'e-katalog-1': 'https://e-katalog.pl/ek-list.php?search_=RTX+5070',
  'e-katalog-2': 'https://e-katalog.pl/katalog.php?search_=RTX+5070',
  'ek-ua': 'https://ek.ua/ek-list.php?search_=RTX+5070',
  'morele': 'https://www.morele.net/wyszukiwarka/?q=RTX+5070',
  'xkom': 'https://www.x-kom.pl/szukaj?q=RTX+5070',
  'rozetka-pl': 'https://rozetka.pl/search/?text=RTX+5070',
  'rozetka-ua': 'https://rozetka.com.ua/search/?text=RTX+5070',
  'mediaexpert': 'https://www.mediaexpert.pl/szukaj?spark=RTX+5070',
  'amazon': 'https://www.amazon.pl/s?k=RTX+5070'
}

for name, u in urls_to_test.items():
    try:
        req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'})
        res = urllib.request.urlopen(req, timeout=5)
        print(f"{name}: status {res.getcode()}")
    except urllib.error.HTTPError as e:
        print(f"{name}: HTTPError {e.code}")
    except Exception as e:
        print(f"{name}: Error {e}")
