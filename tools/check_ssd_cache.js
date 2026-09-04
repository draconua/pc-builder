// tools/check_ssd_cache.js
const fs = require('fs');
const prices = JSON.parse(fs.readFileSync('data/prices_pl.json', 'utf-8')).prices;
console.log('ssd-sn580-1tb in cache:', prices['ssd-sn580-1tb']);
