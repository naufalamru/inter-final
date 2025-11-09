import { defineConfig } from 'vite';
import { copyFileSync } from 'fs';
import { resolve } from 'path';

export default defineConfig({
  base: '/inter-final/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    cssCodeSplit: false, // Ensure CSS is bundled into single file
    rollupOptions: {
      output: {
        // Preserve inline styles
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
  plugins: [
    {
      name: 'copy-sw',
      closeBundle() {
        // Copy service worker to dist root
        try {
          copyFileSync(resolve('sw.js'), resolve('dist/sw.js'));
        } catch (e) {
          console.warn('Could not copy sw.js:', e);
        }
      },
    },
  ],
});

