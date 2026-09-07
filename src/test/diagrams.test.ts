import { describe, expect, it } from 'vitest'
import type { DiagramNode } from '../content/types'
import { anchorOnRect, edgeGeometry } from '../diagrams/geometry'
import { wrapText } from '../diagrams/wrapText'

const a: DiagramNode = { id: 'a', kind: 'container', label: 'A', x: 0, y: 0, w: 100, h: 50 }
const b: DiagramNode = { id: 'b', kind: 'container', label: 'B', x: 300, y: 200, w: 100, h: 50 }

describe('geometry', () => {
  it('anchors on the box border towards the target', () => {
    const p = anchorOnRect(a, { x: 500, y: 25 })
    expect(p).toEqual({ x: 100, y: 25 })
    const q = anchorOnRect(a, { x: 50, y: 500 })
    expect(q).toEqual({ x: 50, y: 50 })
  })

  it('places the label at the requested fraction of the longest segment', () => {
    const mid = edgeGeometry({ id: 'e', from: 'a', to: 'b' }, a, b).mid
    const early = edgeGeometry({ id: 'e', from: 'a', to: 'b', labelAt: 0.25 }, a, b).mid
    expect(early.x).toBeLessThan(mid.x)
    expect(early.y).toBeLessThan(mid.y)
  })

  it('routes orthogonal edges with one bend', () => {
    const geo = edgeGeometry({ id: 'e', from: 'a', to: 'b', route: 'orthogonal' }, a, b)
    expect(geo.points).toHaveLength(3)
    expect(geo.points[1]).toEqual({ x: 350, y: 25 })
  })
})

describe('wrapText', () => {
  it('wraps on words and caps the number of lines', () => {
    expect(wrapText('Equipment control service', 12)).toEqual(['Equipment', 'control', 'service'])
    expect(wrapText('one two three four five six', 9, 2)).toEqual(['one two', 'three…'])
  })

  it('hard-breaks words longer than the limit', () => {
    expect(wrapText('Supercalifragilistic', 8)).toEqual(['Superca-', 'lifragi-', 'listic'])
  })
})
