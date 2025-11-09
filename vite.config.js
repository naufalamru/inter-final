import { defineConfig } from 'vite'
import { copyFileSync, existsSync, mkdirSync } from 'fs'
import { resolve } from 'path'

export default defineConfig({
  base: '/inter-final/', // sangat penting untuk GitHub Pages subpath
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
  plugins: [
    {
      name: 'copy-static-files',
      closeBundle() {
        try {
          // pastikan folder dist ada
          if (!existsSync('dist')) mkdirSync('dist')

          // file penting dari public ke dist root
          const filesToCopy = ['manifest.json', 'favicon.ico']
          filesToCopy.forEach(file => {
            if (existsSync(resolve('public', file))) {
              copyFileSync(resolve('public', file), resolve('dist', file))
            }
          })

          // folder icons
          const srcIcons = resolve('public', 'icons')
          const destIcons = resolve('dist', 'icons')
          if (existsSync(srcIcons)) {
            mkdirSync(destIcons, { recursive: true })
            const fs = require('fs')
            fs.readdirSync(srcIcons).forEach(f =>
              copyFileSync(resolve(srcIcons, f), resolve(destIcons, f))
            )
          }

          // service worker
          if (existsSync('sw.js')) {
            copyFileSync(resolve('sw.js'), resolve('dist/sw.js'))
          }

          console.log('✅ Static files copied to dist/')
        } catch (e) {
          console.warn('⚠️ Could not copy static files:', e)
        }
      },
    },
  ],
})
