import { copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vitest/config'

/**
 * GitHub Pages serves `404.html` for unknown paths. Copying `index.html` to
 * `404.html` makes deep links (QR codes, the table of contents) work with the
 * history router on a project site.
 */
function spaFallback(): Plugin {
  let outDir = 'dist'
  return {
    name: 'spa-404-fallback',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir)
    },
    closeBundle() {
      const index = resolve(outDir, 'index.html')
      if (existsSync(index)) copyFileSync(index, resolve(outDir, '404.html'))
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: '/SoftwareArchitectureKatasTalk/',
  plugins: [react(), spaFallback()],
  build: {
    target: 'es2022',
  },
  test: {
    include: ['src/test/**/*.test.ts'],
    environment: 'node',
  },
})
