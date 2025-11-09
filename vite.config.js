import { defineConfig } from 'vite';
import { copyFileSync } from 'fs';
import { resolve } from 'path';

export default defineConfig({
  base: '/inter-final/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        // entryFileNames tidak pakai [ext]
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name].[ext]'
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
