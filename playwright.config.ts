import { existsSync } from 'node:fs'
import { defineConfig } from '@playwright/test'

// The remote environment ships Chromium under /opt/pw-browsers; use it when present.
if (!process.env.PLAYWRIGHT_BROWSERS_PATH && existsSync('/opt/pw-browsers')) {
  process.env.PLAYWRIGHT_BROWSERS_PATH = '/opt/pw-browsers'
}

const base = '/SoftwareArchitectureKatasTalk/'

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  retries: 0,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: `http://localhost:4173${base}`,
    browserName: 'chromium',
    viewport: { width: 1920, height: 1080 },
    colorScheme: 'dark',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run build && npm run preview',
    url: `http://localhost:4173${base}`,
    reuseExistingServer: true,
    timeout: 120_000,
  },
})
