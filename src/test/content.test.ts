import { describe, expect, it } from 'vitest'
import { characteristics } from '../content/characteristics'
import { westhavenC1, westhavenC2, westhavenC3, westhavenSeedRisks, westhavenShortlist } from '../content/example'
import { katas } from '../content/katas'
import { mainPages } from '../content/main-pages'
import { pages } from '../content/pages'
import { references } from '../content/references'
import { architectureStyles } from '../content/styles'
import { timerPresetById } from '../content/timers'
import type { DiagramSpec, PageComponentId, StyleId } from '../content/types'

const STYLE_IDS: StyleId[] = [
  'layered',
  'modular-monolith',
  'pipeline',
  'microkernel',
  'service-based',
  'event-driven',
  'space-based',
  'orchestration-soa',
  'microservices',
]

const COMPONENT_IDS: PageComponentId[] = [
  'title',
  'why',
  'shared-language',
  'katas',
  'case',
  'c4',
  'session-format',
  'laws',
  'characteristics',
  'star-ratings',
  'styles',
  'style',
  'case-design',
  'risk-storming',
  'live-setup',
  'library',
  'kata',
  'live-c1',
  'live-feedback',
  'live-c2',
  'live-debrief',
  'playbook',
  'story',
  'references',
  'closing',
]

function checkDiagram(spec: DiagramSpec): void {
  const width = spec.width ?? 1000
  const ids = spec.nodes.map((n) => n.id)
  expect(new Set(ids).size, `${spec.id}: duplicate node ids`).toBe(ids.length)
  for (const n of spec.nodes) {
    expect(n.x, `${spec.id}/${n.id} x`).toBeGreaterThanOrEqual(0)
    expect(n.y, `${spec.id}/${n.id} y`).toBeGreaterThanOrEqual(0)
    expect(n.x + n.w, `${spec.id}/${n.id} right edge`).toBeLessThanOrEqual(width)
    expect(n.y + n.h, `${spec.id}/${n.id} bottom edge`).toBeLessThanOrEqual(spec.height)
    expect(n.label.trim().length, `${spec.id}/${n.id} label`).toBeGreaterThan(0)
  }
  const edgeIds = spec.edges.map((e) => e.id)
  expect(new Set(edgeIds).size, `${spec.id}: duplicate edge ids`).toBe(edgeIds.length)
  for (const e of spec.edges) {
    expect(ids, `${spec.id}/${e.id} from`).toContain(e.from)
    expect(ids, `${spec.id}/${e.id} to`).toContain(e.to)
    if (e.labelAt !== undefined) {
      expect(e.labelAt).toBeGreaterThan(0)
      expect(e.labelAt).toBeLessThan(1)
    }
  }
}

describe('page registry', () => {
  it('has 23 main pages in run-of-show order with non-decreasing minutes', () => {
    expect(mainPages).toHaveLength(23)
    let last = -1
    for (const p of mainPages) {
      expect(p.track).toBe('main')
      expect(p.minute ?? 0).toBeGreaterThanOrEqual(last)
      last = p.minute ?? last
    }
  })

  it('has unique ids and absolute unique paths', () => {
    const ids = pages.map((p) => p.id)
    const paths = pages.map((p) => p.path)
    expect(new Set(ids).size).toBe(ids.length)
    expect(new Set(paths).size).toBe(paths.length)
    for (const p of pages) expect(p.path.startsWith('/')).toBe(true)
  })

  it('gives every page a hero title and at least three speaker notes', () => {
    for (const p of pages) {
      expect(p.hero.title.trim().length, p.id).toBeGreaterThan(0)
      expect(p.notes.length, p.id).toBeGreaterThanOrEqual(3)
      for (const n of p.notes) expect(n.trim().length, p.id).toBeGreaterThan(0)
    }
  })

  it('places every sub page directly after its main parent', () => {
    const mainIds = new Set(mainPages.map((p) => p.id))
    pages.forEach((p, i) => {
      if (p.track === 'sub') {
        expect(p.parent && mainIds.has(p.parent), p.id).toBe(true)
        const prev = pages[i - 1]
        expect(prev.id === p.parent || prev.parent === p.parent, `${p.id} follows ${prev.id}`).toBe(true)
      }
    })
  })

  it('uses only known components and valid timer presets', () => {
    for (const p of pages) {
      expect(COMPONENT_IDS, p.id).toContain(p.component)
      if (p.timerPreset) expect(timerPresetById[p.timerPreset], p.id).toBeDefined()
    }
    const used = new Set(pages.map((p) => p.component))
    for (const id of COMPONENT_IDS) expect(used.has(id), `component ${id} unused`).toBe(true)
  })

  it('keeps sections contiguous on the main track', () => {
    const seen: string[] = []
    for (const p of mainPages) {
      if (seen[seen.length - 1] !== p.section) {
        expect(seen, `section ${p.section} appears twice`).not.toContain(p.section)
        seen.push(p.section)
      }
    }
  })
})

describe('architecture styles', () => {
  it('covers the nine styles of the 2nd edition in book order', () => {
    expect(architectureStyles.map((s) => s.id)).toEqual(STYLE_IDS)
  })

  it('rates every characteristic between 1 and 5', () => {
    for (const s of architectureStyles) {
      for (const c of characteristics) {
        const r = s.ratings[c.id]
        expect(r, `${s.id}/${c.id}`).toBeGreaterThanOrEqual(1)
        expect(r, `${s.id}/${c.id}`).toBeLessThanOrEqual(5)
      }
    }
  })

  it('has complete copy and a valid topology diagram', () => {
    for (const s of architectureStyles) {
      expect(s.tagline.length).toBeGreaterThan(10)
      expect(s.description.length).toBeGreaterThanOrEqual(2)
      expect(s.whenToUse.length).toBeGreaterThanOrEqual(3)
      expect(s.whenToAvoid.length).toBeGreaterThanOrEqual(3)
      expect(s.tradeoffs.pro.length).toBeGreaterThanOrEqual(3)
      expect(s.tradeoffs.con.length).toBeGreaterThanOrEqual(3)
      expect(s.pitfalls.length).toBeGreaterThanOrEqual(2)
      expect(s.westhaven.length).toBeGreaterThan(100)
      expect(s.topology.level).toBe('topology')
      checkDiagram(s.topology)
    }
  })

  it('has a shortlist verdict for every style', () => {
    expect(new Set(westhavenShortlist.map((s) => s.styleId))).toEqual(new Set(STYLE_IDS))
  })
})

describe('katas', () => {
  it('has ten attributed katas with complete fields', () => {
    expect(katas).toHaveLength(10)
    const ids = katas.map((k) => k.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const k of katas) {
      expect(k.sourceUrl.startsWith('https://'), k.id).toBe(true)
      expect(k.summary.length, k.id).toBeGreaterThan(20)
      expect(k.users.length, k.id).toBeGreaterThan(5)
      expect(k.requirements.length, k.id).toBeGreaterThanOrEqual(3)
      expect(k.additionalContext.length, k.id).toBeGreaterThanOrEqual(2)
      expect(k.tags.length, k.id).toBeGreaterThanOrEqual(1)
      expect(k.goodFor.length, k.id).toBeGreaterThanOrEqual(1)
      expect(k.facilitatorHints.length, k.id).toBeGreaterThanOrEqual(2)
    }
  })
})

describe('Westhaven diagrams', () => {
  it('are valid and levelled', () => {
    expect(westhavenC1.level).toBe('C1')
    expect(westhavenC2.level).toBe('C2')
    expect(westhavenC3.level).toBe('C3')
    for (const spec of [westhavenC1, westhavenC2, westhavenC3]) checkDiagram(spec)
  })

  it('seed risks point at existing C2 nodes or edges with valid scores', () => {
    const targets = new Set([...westhavenC2.nodes.map((n) => n.id), ...westhavenC2.edges.map((e) => e.id)])
    for (const r of westhavenSeedRisks) {
      expect(targets.has(r.targetId), r.targetId).toBe(true)
      expect([1, 2, 3]).toContain(r.probability)
      expect([1, 2, 3]).toContain(r.impact)
    }
  })
})

describe('references', () => {
  it('link to https URLs with at least one topic each', () => {
    expect(references.length).toBeGreaterThanOrEqual(20)
    for (const r of references) {
      expect(r.url.startsWith('https://'), r.id).toBe(true)
      expect(r.topics.length, r.id).toBeGreaterThanOrEqual(1)
    }
  })
})
