import { defineConfig } from 'vite';
import { copyFileSync } from 'fs';
import { resolve } from 'path';

export default defineConfig({
  base: '/inter-final/', // ← ini WAJIB ADA
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    cssCodeSplit: false,
    rollupOptions: {
      input: resolve(__dirname, 'index.html'),
      output: {
        assetFileNames: 'assets/[name].[ext]',
        entryFileNames: 'assets/[name].[ext]',
      },
    },
  },
  plugins: [
    {
      name: 'copy-sw',
      closeBundle() {
        try {
          copyFileSync(resolve('sw.js'), resolve('dist/sw.js'));
        } catch (e) {
          console.warn('Could not copy sw.js:', e);
        }
      },
    },
  ],
});
