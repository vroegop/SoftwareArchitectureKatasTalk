import type { DiagramEdge, DiagramNode } from '../content/types'

export interface Point {
  x: number
  y: number
}

export function center(n: DiagramNode): Point {
  return { x: n.x + n.w / 2, y: n.y + n.h / 2 }
}

/** Point where the segment from the node centre towards `target` leaves the node box. */
export function anchorOnRect(n: DiagramNode, target: Point): Point {
  const c = center(n)
  const dx = target.x - c.x
  const dy = target.y - c.y
  if (dx === 0 && dy === 0) return c
  const hw = n.w / 2
  const hh = n.h / 2
  const scaleX = dx !== 0 ? hw / Math.abs(dx) : Number.POSITIVE_INFINITY
  const scaleY = dy !== 0 ? hh / Math.abs(dy) : Number.POSITIVE_INFINITY
  const s = Math.min(scaleX, scaleY)
  return { x: c.x + dx * s, y: c.y + dy * s }
}

export interface EdgeGeometry {
  points: Point[]
  /** Midpoint of the longest segment, used for the label. */
  mid: Point
}

export function edgeGeometry(edge: DiagramEdge, from: DiagramNode, to: DiagramNode): EdgeGeometry {
  const cf = center(from)
  const ct = center(to)
  let points: Point[]

  if (edge.via && edge.via.length > 0) {
    const first = edge.via[0]
    const last = edge.via[edge.via.length - 1]
    points = [anchorOnRect(from, first), ...edge.via, anchorOnRect(to, last)]
  } else if (edge.route === 'orthogonal') {
    const dx = ct.x - cf.x
    const dy = ct.y - cf.y
    if (Math.abs(dx) >= Math.abs(dy)) {
      // horizontal first: leave from the side, arrive at top/bottom
      const corner = { x: ct.x, y: cf.y }
      const start = { x: dx >= 0 ? from.x + from.w : from.x, y: cf.y }
      const end = { x: ct.x, y: dy >= 0 ? to.y : to.y + to.h }
      const insideTargetBand = Math.abs(dy) < to.h / 2 + 4
      points = insideTargetBand ? [start, anchorOnRect(to, start)] : [start, corner, end]
    } else {
      const corner = { x: cf.x, y: ct.y }
      const start = { x: cf.x, y: dy >= 0 ? from.y + from.h : from.y }
      const end = { x: dx >= 0 ? to.x : to.x + to.w, y: ct.y }
      const insideTargetBand = Math.abs(dx) < to.w / 2 + 4
      points = insideTargetBand ? [start, anchorOnRect(to, start)] : [start, corner, end]
    }
  } else {
    points = [anchorOnRect(from, ct), anchorOnRect(to, cf)]
  }

  let best = 0
  let bestLen = -1
  for (let i = 0; i < points.length - 1; i += 1) {
    const len = Math.hypot(points[i + 1].x - points[i].x, points[i + 1].y - points[i].y)
    if (len > bestLen) {
      bestLen = len
      best = i
    }
  }
  const a = points[best]
  const b = points[best + 1] ?? a
  const t = Math.min(0.95, Math.max(0.05, edge.labelAt ?? 0.5))
  return { points, mid: { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t } }
}

export function polylinePath(points: Point[]): string {
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
}
