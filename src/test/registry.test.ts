import { describe, expect, it } from 'vitest'
import { byId, mainTrack, neighbours, pageForPath, positionLabel, progressIndex, sectionGroups, subTrackOf } from '../app/registry'

describe('navigation lanes', () => {
  it('moves along the main track and skips sub pages', () => {
    const styles = byId['styles']
    const n = neighbours(styles.id)
    expect(n.next?.id).toBe('case-design')
    expect(n.prev?.id).toBe('star-ratings')
    expect(n.down?.id).toBe('style-layered')
    expect(n.up).toBeUndefined()
  })

  it('clamps inside a sub-track and returns to the parent', () => {
    const first = neighbours('style-layered')
    expect(first.prev).toBeUndefined()
    expect(first.next?.id).toBe('style-modular-monolith')
    expect(first.up?.id).toBe('styles')
    const last = neighbours('style-microservices')
    expect(last.next).toBeUndefined()
    expect(subTrackOf('styles')).toHaveLength(9)
    expect(subTrackOf('library')).toHaveLength(10)
  })

  it('has no neighbours before the first or after the last main page', () => {
    expect(neighbours(mainTrack[0].id).prev).toBeUndefined()
    expect(neighbours(mainTrack[mainTrack.length - 1].id).next).toBeUndefined()
  })

  it('reports progress relative to the parent for sub pages', () => {
    expect(progressIndex('style-pipeline')).toBe(progressIndex('styles'))
    expect(positionLabel('style-pipeline')).toBe(`${progressIndex('styles') + 1}.3`)
    expect(positionLabel('title')).toBe('1')
  })

  it('resolves paths with or without a trailing slash', () => {
    expect(pageForPath('/')?.id).toBe('title')
    expect(pageForPath('/styles/')?.id).toBe('styles')
    expect(pageForPath('/library/hot-diggety-dog')?.id).toBe('kata-hot-diggety-dog')
    expect(pageForPath('/nope')).toBeUndefined()
  })

  it('groups the main track by section in order', () => {
    const groups = sectionGroups()
    expect(groups.map((g) => g.id)).toEqual(['intro', 'method', 'thinking', 'styles', 'practice', 'live', 'wrapup'])
    expect(groups.flatMap((g) => g.pages)).toHaveLength(mainTrack.length)
  })
})
