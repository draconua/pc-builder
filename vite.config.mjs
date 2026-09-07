import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const syncPricesHandler = require('./api/sync-prices.js');
const syncStatusHandler = require('./api/sync-status.js');

export default defineConfig({
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    target: 'esnext'
  },
  plugins: [
    {
      name: 'api-middleware',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          const parsedUrl = new URL(req.url, 'http://localhost:3000');
          const pathname = parsedUrl.pathname;

          if (pathname === '/api/sync-status') {
            return syncStatusHandler(req, res);
          }
          if (pathname === '/api/sync-prices') {
            return syncPricesHandler(req, res);
          }
          if (pathname === '/api/cached-prices') {
            const pricesPath = path.resolve('data/prices_pl.json');
            if (fs.existsSync(pricesPath)) {
              res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
              fs.createReadStream(pricesPath).pipe(res);
            } else {
              res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
              res.end(JSON.stringify({ lastUpdated: null, prices: {} }));
            }
            return;
          }
          if (pathname === '/api/stop-sync' && req.method === 'POST') {
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ ok: true, message: 'Парсер остановлен' }));
            return;
          }
          next();
        });
      }
    },
    {
      name: 'copy-data-folder',
      closeBundle() {
        const srcDir = path.resolve('data');
        const destDir = path.resolve('dist/data');
        if (fs.existsSync(srcDir)) {
          fs.mkdirSync(destDir, { recursive: true });
          fs.readdirSync(srcDir).forEach(file => {
            fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
          });
          console.log('[Vite Plugin] Successfully copied data/ to dist/data/');
        }
      }
    }
  ]
});

