import type { DiagramNode } from '../content/types'

/** Vertical offset where the text block may start, per kind. */
export function textTop(node: DiagramNode): number {
  if (node.kind === 'person') return node.y + 30
  if (node.kind === 'database') return node.y + 16
  if (node.kind === 'ui') return node.y + 16
  return node.y + 6
}

export function textBottom(node: DiagramNode): number {
  if (node.kind === 'database') return node.y + node.h - 12
  return node.y + node.h - 6
}
