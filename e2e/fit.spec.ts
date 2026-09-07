import { expect, test, type Page } from '@playwright/test'
import { pages } from '../src/content/pages'

/** Pixels the stage would have to scroll; 0 means it fits. */
async function overflow(page: Page): Promise<number> {
  return page.evaluate(() => {
    const stage = document.querySelector('.stage') as HTMLElement | null
    return stage ? stage.scrollHeight - stage.clientHeight : 0
  })
}

const SLACK = 4

test('every page fits a Full HD stage, at most after collapsing the hero', async ({ page }) => {
  test.setTimeout(10 * 60_000)
  // The live-round pages show the picked kata; measure them with one of the longest.
  await page.addInitScript(() => {
    if (!localStorage.getItem('akc4.live')) {
      localStorage.setItem('akc4.live', JSON.stringify({ kataId: 'check-your-work', participants: 16, usedKataIds: ['check-your-work'], checks: {}, pins: [] }))
    }
  })
  const collapsedFor: string[] = []
  const stillScrolling: string[] = []
  for (const p of pages) {
    for (const search of ['', '?at=end']) {
      await page.goto(`.${p.path === '/' ? '/' : p.path}${search}`)
      await page.locator('h1').waitFor()
      await page.waitForTimeout(120)
      let over = await overflow(page)
      const alreadyCollapsed = (await page.locator('.page.hero-collapsed').count()) > 0
      if (over > SLACK && !alreadyCollapsed) {
        await page.keyboard.press('h')
        await page.waitForTimeout(120)
        over = await overflow(page)
        collapsedFor.push(`${p.id}${search}`)
      } else if (alreadyCollapsed) {
        collapsedFor.push(`${p.id}${search} (auto)`)
      }
      if (over > SLACK) stillScrolling.push(`${p.id}${search}: ${over}px too tall`)
    }
  }
  console.log(`hero collapsed for: ${collapsedFor.join(', ') || 'no page'}`)
  expect(stillScrolling, 'pages that still scroll with the hero collapsed').toEqual([])
})
