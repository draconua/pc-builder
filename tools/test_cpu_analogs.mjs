import { PARTS_DATABASE } from './js/data.js';

const cpu = PARTS_DATABASE.cpu.find(c => c.name.includes('14600K'));
console.log('Target CPU:', cpu);

const alternatives = PARTS_DATABASE.cpu.filter(p => {
  if (p.id === cpu.id) return false;
  const isOtherBrand = p.brand !== cpu.brand;
  const tierDiff = Math.abs((p.tier || 5) - (cpu.tier || 5));
  const priceRatio = p.price / cpu.price;
  console.log(`Checking ${p.name}: brand=${p.brand}, tier=${p.tier}, diff=${tierDiff}, ratio=${priceRatio.toFixed(2)}`);
  return (isOtherBrand && tierDiff <= 1) || (tierDiff === 0 && priceRatio >= 0.75 && priceRatio <= 1.35);
});

console.log('Matched alternatives count:', alternatives.length);
alternatives.forEach(a => console.log(' ->', a.name, a.price));
