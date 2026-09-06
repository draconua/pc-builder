const fs = require('fs');
let code = fs.readFileSync('js/data.js', 'utf8');
const start = code.indexOf('export const PARTS_DATABASE');
if(start > -1) {
  const newCode = code.slice(0, start) + `export let PARTS_DATABASE = {};

try {
  const res = await fetch('/data/hardware.json');
  if(res.ok) PARTS_DATABASE = await res.json();
} catch(e) {
  console.error(e);
}
`;
  fs.writeFileSync('js/data.js', newCode);
  console.log('Replaced successfully.');
} else {
  console.log('Not found');
}
