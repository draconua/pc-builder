import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Hardware Database Integrity', () => {
  test('hardware database is pristine: no custom variants, valid categories, valid specs', () => {
    const dbPath = path.resolve('data/hardware.json');
    const content = fs.readFileSync(dbPath, 'utf8');
    const db = JSON.parse(content);

    const requiredCategories = ['cpu', 'motherboard', 'cooler', 'ram', 'gpu', 'ssd', 'psu', 'case', 'monitor'];
    for (const cat of requiredCategories) {
      expect(Array.isArray(db[cat])).toBe(true);
      expect(db[cat].length).toBeGreaterThan(0); // at least some items

      for (const item of db[cat]) {
        expect(item.id).toBeTruthy();
        expect(item.name).toBeTruthy();
        expect(item.price).toBeGreaterThan(0);
        
        // Crucial test: NO dummy or custom variant names!
        expect(item.name).not.toMatch(/custom\s+(cpu|gpu|motherboard|ram|ssd|psu|case|cooler|hdd|monitor)/i);
        expect(item.name).not.toMatch(/variant\s+\d+/i);
        expect(item.name).not.toMatch(/\(Legacy\s+[2-9]\)/i);
      }
    }
  });
});
