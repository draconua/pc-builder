const fs = require('fs');

async function main() {
  const dataModule = await import('../js/data.js');
  const db = dataModule.PARTS_DATABASE;
  
  fs.writeFileSync('data/hardware.json', JSON.stringify(db, null, 2));
  console.log('Saved data/hardware.json');

  const code = fs.readFileSync('js/data.js', 'utf8');
  
  // Find start of PARTS_DATABASE
  const startIndex = code.indexOf('export const PARTS_DATABASE = {');
  // Find start of PRESETS (which follows PARTS_DATABASE)
  const presetsIndex = code.indexOf('export const PRESETS = {');
  
  if (startIndex === -1 || presetsIndex === -1) {
    console.error('Could not find PARTS_DATABASE or PRESETS');
    return;
  }
  
  const fetchCode = `export let PARTS_DATABASE = {};
try {
  const res = await fetch('/data/hardware.json');
  if(res.ok) PARTS_DATABASE = await res.json();
} catch(e) {
  console.error(e);
}

`;
  
  const newCode = code.slice(0, startIndex) + fetchCode + code.slice(presetsIndex);
  fs.writeFileSync('js/data.js', newCode);
  console.log('Successfully updated js/data.js');
}

main();
