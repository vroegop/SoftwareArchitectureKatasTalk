import { expect, test, type Page } from '@playwright/test'
import { pages } from '../src/content/pages'

const mainTrack = pages.filter((p) => p.track === 'main')
const base = '/SoftwareArchitectureKatasTalk'

function pathOf(page: Page): string {
  return new URL(page.url()).pathname.replace(base, '') || '/'
}

test('walks the whole main track with the arrow keys without console errors', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text())
  })
  await page.goto('./')
  for (let i = 0; i < mainTrack.length; i += 1) {
    const expected = mainTrack[i]
    await expect(page.locator('h1')).toHaveText(expected.hero.title)
    expect(pathOf(page)).toBe(expected.path)
    if (i < mainTrack.length - 1) await page.keyboard.press('ArrowRight')
  }
  await page.keyboard.press('ArrowRight')
  expect(pathOf(page)).toBe(mainTrack[mainTrack.length - 1].path)
  expect(errors).toEqual([])
})

test('dives into the style sub-track and climbs back out', async ({ page }) => {
  await page.goto('./styles')
  await page.keyboard.press('ArrowDown')
  expect(pathOf(page)).toBe('/styles/layered')
  for (let i = 0; i < 8; i += 1) await page.keyboard.press('ArrowRight')
  expect(pathOf(page)).toBe('/styles/microservices')
  await page.keyboard.press('ArrowRight')
  expect(pathOf(page)).toBe('/styles/microservices')
  await expect(page.locator('h1')).toHaveText('Microservices')
  await page.keyboard.press('Escape')
  expect(pathOf(page)).toBe('/styles')
})

test('opens the contents and the notes with their keys', async ({ page }) => {
  await page.goto('./why')
  await page.keyboard.press('t')
  const dialog = page.locator('dialog[open]')
  await expect(dialog).toBeVisible()
  await expect(dialog).toContainText('Contents')
  await page.keyboard.press('Escape')
  await expect(dialog).toHaveCount(0)
  await page.keyboard.press('n')
  await expect(page.locator('aside.notes')).toBeVisible()
  await expect(page.locator('aside.notes')).toContainText('Why this matters')
  await page.keyboard.press('n')
  await expect(page.locator('aside.notes')).toHaveCount(0)
})

test('keeps the timer running across a reload', async ({ page }) => {
  await page.goto('./live/c1')
  await page.getByRole('button', { name: /Start 15 min/ }).click()
  await expect(page.locator('.timer-pill')).toContainText(/14:5\d|15:00/)
  await page.reload()
  await expect(page.locator('.timer-pill')).toContainText(/14:\d\d/)
  await expect(page.locator('.timer-pill')).toHaveClass(/timer-running/)
})

test('persists risk stickies in the browser', async ({ page }) => {
  await page.goto('./risk-storming')
  await page.getByRole('button', { name: 'Seed demo risks' }).click()
  await expect(page.locator('.risk-register tbody tr')).toHaveCount(8)
  await expect(page.locator('.risk-sticky')).toHaveCount(8)
  await page.reload()
  await expect(page.locator('.risk-register tbody tr')).toHaveCount(8)
})

test('renders a deep link directly', async ({ page }) => {
  await page.goto('./library/hot-diggety-dog')
  await expect(page.locator('h1')).toHaveText('Hot Diggety Dog!')
  await expect(page.locator('.footer-pos')).toContainText(/\d+\.9 \/ 23/)
})

test('serves the SPA fallback for unknown deep links', async ({ page }) => {
  const response = await page.goto('./styles/event-driven')
  expect(response?.status()).toBeLessThan(500)
  await expect(page.locator('h1')).toHaveText('Event-Driven')
})
