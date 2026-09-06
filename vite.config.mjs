import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

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
