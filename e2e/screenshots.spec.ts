import { mkdirSync } from 'node:fs'
import { test } from '@playwright/test'
import { pages } from '../src/content/pages'

const dir = 'e2e/screenshots'
mkdirSync(dir, { recursive: true })

test.describe('@screenshots', () => {
  test('every page, dark, 1920×1080', async ({ page }) => {
    test.setTimeout(10 * 60_000)
    await page.addInitScript(() => {
      if (!localStorage.getItem('akc4.live')) {
        localStorage.setItem('akc4.live', JSON.stringify({ kataId: 'check-your-work', participants: 16, usedKataIds: ['check-your-work'], checks: {}, pins: [] }))
      }
    })
    for (const [i, p] of pages.entries()) {
      await page.goto(`.${p.path === '/' ? '/' : p.path}`)
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(120)
      // What the presenter sees after the first forward click on a page that needs the room.
      if ((await page.locator('.hero-toggle.is-needed').count()) > 0) {
        await page.keyboard.press('h')
        await page.waitForTimeout(120)
      }
      await page.screenshot({ path: `${dir}/${String(i + 1).padStart(2, '0')}-${p.id}-dark.png` })
    }
    // A few interactive states worth eyeballing.
    for (const [name, url] of [
      ['case-questions', './case?view=1&at=end'],
      ['c4-sloppy', './c4?step=3'],
      ['references-all', './references?at=end'],
      ['style-tradeoffs', './styles/event-driven?tab=tradeoffs'],
    ]) {
      await page.goto(url)
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(150)
      if ((await page.locator('.hero-toggle.is-needed').count()) > 0) {
        await page.keyboard.press('h')
        await page.waitForTimeout(120)
      }
      await page.screenshot({ path: `${dir}/state-${name}-dark.png` })
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
