import { defineConfig } from 'vite';

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
});

