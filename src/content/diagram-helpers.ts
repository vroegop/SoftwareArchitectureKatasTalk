import type { DiagramEdge, DiagramNode, NodeKind } from './types'

/** Default diagram width; all specs use a 0..1000 horizontal coordinate space. */
export const DIAGRAM_WIDTH = 1000

/**
 * Build a node. `x`/`y` are the top-left corner in diagram units.
 * Keep labels short and boxes generous: text wraps at roughly `w / 9` characters.
 */
export function node(
  id: string,
  kind: NodeKind,
  label: string,
  x: number,
  y: number,
  w: number,
  h: number,
  extra: Partial<Omit<DiagramNode, 'id' | 'kind' | 'label' | 'x' | 'y' | 'w' | 'h'>> = {},
): DiagramNode {
  return { id, kind, label, x, y, w, h, ...extra }
}

/** Build an edge; the id defaults to `from->to`. */
export function edge(
  from: string,
  to: string,
  label?: string,
  tech?: string,
  extra: Partial<Omit<DiagramEdge, 'from' | 'to' | 'label' | 'tech'>> = {},
): DiagramEdge {
  return { id: extra.id ?? `${from}->${to}`, from, to, label, tech, ...extra }
}

/**
 * X coordinate of column `i` (0-based) when `n` boxes of width `boxW` are
 * spread evenly across the diagram width, centred.
 */
export function colX(i: number, n: number, boxW: number, width = DIAGRAM_WIDTH, padding = 20): number {
  if (n <= 1) return Math.round((width - boxW) / 2)
  const usable = width - padding * 2
  const gap = (usable - n * boxW) / (n - 1)
  return Math.round(padding + i * (boxW + gap))
}

/** Y coordinate of row `j` (0-based) with a given row pitch. */
export function rowY(j: number, pitch = 140, top = 20): number {
  return top + j * pitch
}
