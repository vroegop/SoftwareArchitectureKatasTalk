import { mkdirSync } from 'node:fs'
import { test } from '@playwright/test'
import { pages } from '../src/content/pages'

const dir = 'e2e/screenshots'
mkdirSync(dir, { recursive: true })

test.describe('@screenshots', () => {
  test('every page, dark, 1920×1080', async ({ page }) => {
    test.setTimeout(10 * 60_000)
    for (const [i, p] of pages.entries()) {
      await page.goto(`.${p.path === '/' ? '/' : p.path}`)
      await page.waitForLoadState('networkidle')
      await page.screenshot({ path: `${dir}/${String(i + 1).padStart(2, '0')}-${p.id}-dark.png` })
    }
  })

  test('main pages, light, phone', async ({ browser }) => {
    test.setTimeout(10 * 60_000)
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: 'light', deviceScaleFactor: 2 })
    await context.addInitScript(() => {
      localStorage.setItem('akc4.settings', JSON.stringify({ theme: 'light', notes: false, sound: false }))
    })
    const page = await context.newPage()
    for (const [i, p] of pages.filter((x) => x.track === 'main').entries()) {
      await page.goto(`.${p.path === '/' ? '/' : p.path}`)
      await page.waitForLoadState('networkidle')
      await page.screenshot({ path: `${dir}/phone-${String(i + 1).padStart(2, '0')}-${p.id}-light.png`, fullPage: true })
    }
    await context.close()
  })
})
