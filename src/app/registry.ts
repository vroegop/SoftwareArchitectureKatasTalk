import { pages } from '../content/pages'
import { SECTION_LABELS, type PageDef, type SectionId } from '../content/types'

export const byId: Record<string, PageDef> = Object.fromEntries(pages.map((p) => [p.id, p]))
export const byPath: Record<string, PageDef> = Object.fromEntries(pages.map((p) => [p.path, p]))

export const mainTrack: PageDef[] = pages.filter((p) => p.track === 'main')

export function subTrackOf(parentId: string): PageDef[] {
  return pages.filter((p) => p.track === 'sub' && p.parent === parentId)
}

export function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1)
  return pathname || '/'
}

export function pageForPath(pathname: string): PageDef | undefined {
  return byPath[normalizePath(pathname)]
}

export interface Neighbours {
  next?: PageDef
  prev?: PageDef
  up?: PageDef
  down?: PageDef
}

/**
 * Navigation lanes: main pages move along the main track; sub pages move
 * within their own sub-track (clamped at the ends), `up` returns to the parent
 * and `down` dives into the first sub page of a main page.
 */
export function neighbours(id: string): Neighbours {
  const page = byId[id]
  if (!page) return {}
  const lane = page.track === 'main' ? mainTrack : subTrackOf(page.parent ?? '')
  const i = lane.indexOf(page)
  return {
    next: lane[i + 1],
    prev: lane[i - 1],
    up: page.parent ? byId[page.parent] : undefined,
    down: page.track === 'main' ? subTrackOf(page.id)[0] : undefined,
  }
}

/** 0-based index on the main track of a page or of its parent. */
export function progressIndex(id: string): number {
  const page = byId[id]
  if (!page) return 0
  const main = page.parent ? byId[page.parent] : page
  return Math.max(0, mainTrack.indexOf(main))
}

/** Human position such as "9" for a main page or "9.3" for the third sub page. */
export function positionLabel(id: string): string {
  const page = byId[id]
  if (!page) return ''
  const main = progressIndex(id) + 1
  if (!page.parent) return `${main}`
  const lane = subTrackOf(page.parent)
  return `${main}.${lane.indexOf(page) + 1}`
}

export interface SectionGroup {
  id: SectionId
  label: string
  pages: PageDef[]
}

/** Main pages grouped by section, in track order. */
export function sectionGroups(): SectionGroup[] {
  const groups: SectionGroup[] = []
  for (const page of mainTrack) {
    const last = groups[groups.length - 1]
    if (last && last.id === page.section) last.pages.push(page)
    else groups.push({ id: page.section, label: SECTION_LABELS[page.section], pages: [page] })
  }
  return groups
}
