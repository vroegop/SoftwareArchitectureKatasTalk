import { useId, useMemo, type ReactNode } from 'react'
import { NODE_KIND_LABELS, type DiagramEdge, type DiagramNode, type DiagramSpec, type NodeKind } from '../content/types'
import { DIAGRAM_WIDTH } from '../content/diagram-helpers'
import { edgeGeometry, polylinePath, type Point } from './geometry'
import { NodeShape } from './shapes'
import { textBottom, textTop } from './textLayout'
import { estimateWidth, wrapText } from './wrapText'

export interface OverlayTarget {
  type: 'node' | 'edge'
  id: string
  /** Anchor point: top-right corner of a node, midpoint of an edge. */
  x: number
  y: number
}

export interface DiagramRendererProps {
  spec: DiagramSpec
  /** Dim everything not directly connected to this element. */
  focusId?: string
  /** Accent ring on these elements. */
  highlightIds?: string[]
  selectedId?: string
  onElementClick?: (id: string, type: 'node' | 'edge') => void
  /** Extra SVG rendered per element, in diagram coordinates. */
  overlay?: (target: OverlayTarget) => ReactNode
  showTitle?: boolean
  showLegend?: boolean
  showEdgeLabels?: boolean
  showTech?: boolean
  showDescriptions?: boolean
  /** Thumbnail mode: shapes and lines only, no text at all. */
  hideText?: boolean
  className?: string
  /** Any CSS max-height, e.g. `var(--stage-diagram-max)` to fit the stage. */
  maxHeight?: string
}

const LABEL_SIZE = 15
const SMALL_SIZE = 12
const LABEL_LINE = 18
const SMALL_LINE = 15

interface TextBlock {
  lines: { text: string; cls: string; size: number; line: number }[]
  height: number
}

function textBlock(node: DiagramNode, showTech: boolean, showDescriptions: boolean, available: number): TextBlock {
  const labelChars = Math.max(6, Math.floor((node.w - 20) / (LABEL_SIZE * 0.56)))
  const smallChars = Math.max(8, Math.floor((node.w - 20) / (SMALL_SIZE * 0.56)))
  const label: TextBlock['lines'] = wrapText(node.label, labelChars, 3).map((text) => ({
    text,
    cls: 'dg-label',
    size: LABEL_SIZE,
    line: LABEL_LINE,
  }))
  const tech: TextBlock['lines'] =
    showTech && node.tech ? wrapText(`[${node.tech}]`, smallChars, 2).map((text) => ({ text, cls: 'dg-tech', size: SMALL_SIZE, line: SMALL_LINE })) : []
  const desc: TextBlock['lines'] =
    showDescriptions && node.description
      ? wrapText(node.description, smallChars, 3).map((text) => ({ text, cls: 'dg-desc', size: SMALL_SIZE, line: SMALL_LINE }))
      : []
  const height = (lines: TextBlock['lines']) => lines.reduce((sum, l) => sum + l.line, 0)
  // Never overflow the box: drop description lines first, then the technology line.
  while (desc.length > 0 && height([...label, ...tech, ...desc]) > available) desc.pop()
  while (tech.length > 0 && height([...label, ...tech]) > available) tech.pop()
  const lines = [...label, ...tech, ...desc]
  return { lines, height: height(lines) }
}

function NodeText({ node, showTech, showDescriptions }: { node: DiagramNode; showTech: boolean; showDescriptions: boolean }) {
  const block = textBlock(node, showTech, showDescriptions, textBottom(node) - textTop(node))
  if (node.kind === 'boundary') {
    return (
      <text className="dg-text dg-boundary-label" x={node.x + 14} y={node.y + node.h - 9} fontSize={SMALL_SIZE + 1}>
        {node.label}
      </text>
    )
  }
  const top = textTop(node)
  const bottom = textBottom(node)
  const available = bottom - top
  const start = top + Math.max(0, (available - block.height) / 2)
  const cx = node.x + node.w / 2
  const positioned = block.lines.reduce<{ y: number; items: { text: string; cls: string; size: number; baseline: number }[] }>(
    (acc, l) => {
      const y = acc.y + l.line
      acc.items.push({ text: l.text, cls: l.cls, size: l.size, baseline: y - (l.line - l.size) / 2 - 1 })
      return { y, items: acc.items }
    },
    { y: start, items: [] },
  ).items
  return (
    <text className="dg-text" x={cx} textAnchor="middle">
      {positioned.map((l, i) => (
        <tspan key={i} x={cx} y={l.baseline} className={l.cls} fontSize={l.size}>
          {l.text}
        </tspan>
      ))}
    </text>
  )
}

function EdgeLabel({ edge, mid, showTech }: { edge: DiagramEdge; mid: Point; showTech: boolean }) {
  const lines: { text: string; cls: string; size: number }[] = []
  if (edge.label) lines.push({ text: edge.label, cls: 'dg-edge-label', size: SMALL_SIZE })
  if (showTech && edge.tech) lines.push({ text: `[${edge.tech}]`, cls: 'dg-edge-tech', size: SMALL_SIZE - 1 })
  if (lines.length === 0) return null
  const width = Math.max(...lines.map((l) => estimateWidth(l.text, l.size))) + 12
  const height = lines.length * SMALL_LINE + 4
  return (
    <g className="dg-edge-labelbox">
      <rect x={mid.x - width / 2} y={mid.y - height / 2} width={width} height={height} rx={4} className="dg-halo" />
      <text x={mid.x} textAnchor="middle" className="dg-text">
        {lines.map((l, i) => (
          <tspan key={i} x={mid.x} y={mid.y - height / 2 + (i + 1) * SMALL_LINE - 2} className={l.cls} fontSize={l.size}>
            {l.text}
          </tspan>
        ))}
      </text>
    </g>
  )
}

export function DiagramRenderer({
  spec,
  focusId,
  highlightIds,
  selectedId,
  onElementClick,
  overlay,
  showTitle = true,
  showLegend = true,
  showEdgeLabels = true,
  showTech = true,
  showDescriptions = true,
  hideText = false,
  className,
  maxHeight,
}: DiagramRendererProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const width = spec.width ?? DIAGRAM_WIDTH
  const nodeById = useMemo(() => Object.fromEntries(spec.nodes.map((n) => [n.id, n])), [spec.nodes])
  const interactive = Boolean(onElementClick)

  const related = useMemo(() => {
    if (!focusId) return null
    const set = new Set<string>([focusId])
    for (const e of spec.edges) {
      if (e.from === focusId || e.to === focusId) {
        set.add(e.id)
        set.add(e.from)
        set.add(e.to)
      }
    }
    return set
  }, [focusId, spec.edges])

  const highlight = useMemo(() => new Set(highlightIds ?? []), [highlightIds])
  const boundaries = spec.nodes.filter((n) => n.kind === 'boundary')
  const others = spec.nodes.filter((n) => n.kind !== 'boundary')

  const classFor = (id: string, base: string, extra?: string): string => {
    const parts = [base]
    if (extra) parts.push(extra)
    if (related && !related.has(id)) parts.push('is-dim')
    if (highlight.has(id)) parts.push('is-highlight')
    if (selectedId === id) parts.push('is-selected')
    if (interactive) parts.push('is-interactive')
    return parts.join(' ')
  }

  const handlers = (id: string, type: 'node' | 'edge') =>
    interactive
      ? {
          onClick: (e: React.MouseEvent) => {
            e.stopPropagation()
            onElementClick?.(id, type)
          },
          onKeyDown: (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              e.stopPropagation()
              onElementClick?.(id, type)
            }
          },
          role: 'button' as const,
          tabIndex: 0,
        }
      : {}

  const legendKinds: NodeKind[] = spec.legend ? spec.legend.map((l) => l.kind) : Array.from(new Set(spec.nodes.map((n) => n.kind)))
  const legendLabels = new Map<NodeKind, string>()
  if (spec.legend) spec.legend.forEach((l) => legendLabels.set(l.kind, l.label))

  const titleId = `${uid}-title`

  return (
    <figure className={`dg${className ? ` ${className}` : ''}`}>
      {showTitle ? <figcaption className="dg-title">{spec.title}</figcaption> : null}
      <svg
        viewBox={`0 0 ${width} ${spec.height}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-labelledby={titleId}
        className="dg-svg"
        style={maxHeight ? { maxHeight } : undefined}
      >
        <title id={titleId}>{spec.title}</title>
        <defs>
          <marker id={`${uid}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" className="dg-arrowhead" />
          </marker>
        </defs>
        <g className="dg-boundaries">
          {boundaries.map((n) => (
            <g key={n.id} className={classFor(n.id, 'dg-node', `dg-kind-${n.kind}`)} data-id={n.id} {...handlers(n.id, 'node')}>
              <NodeShape node={n} />
              {hideText ? null : <NodeText node={n} showTech={showTech} showDescriptions={showDescriptions} />}
            </g>
          ))}
        </g>
        <g className="dg-edges">
          {spec.edges.map((e) => {
            const from = nodeById[e.from]
            const to = nodeById[e.to]
            if (!from || !to) return null
            const geo = edgeGeometry(e, from, to)
            const d = polylinePath(geo.points)
            const direction = e.direction ?? 'forward'
            return (
              <g key={e.id} className={classFor(e.id, 'dg-edge', e.style === 'dashed' ? 'is-dashed' : undefined)} data-id={e.id} {...handlers(e.id, 'edge')}>
                <path d={d} className="dg-edge-hit" />
                <path
                  d={d}
                  className="dg-edge-line"
                  markerEnd={direction === 'none' ? undefined : `url(#${uid}-arrow)`}
                  markerStart={direction === 'both' ? `url(#${uid}-arrow)` : undefined}
                />
                {showEdgeLabels && !hideText ? <EdgeLabel edge={e} mid={geo.mid} showTech={showTech} /> : null}
              </g>
            )
          })}
        </g>
        <g className="dg-nodes">
          {others.map((n) => (
            <g
              key={n.id}
              className={classFor(n.id, 'dg-node', `dg-kind-${n.kind}${n.emphasis ? ' is-emphasis' : ''}${n.muted ? ' is-muted' : ''}`)}
              data-id={n.id}
              {...handlers(n.id, 'node')}
            >
              <NodeShape node={n} />
              {hideText ? null : <NodeText node={n} showTech={showTech} showDescriptions={showDescriptions} />}
            </g>
          ))}
        </g>
        {overlay ? (
          <g className="dg-overlays">
            {spec.nodes.map((n) => (
              <g key={n.id}>{overlay({ type: 'node', id: n.id, x: n.x + n.w, y: n.y })}</g>
            ))}
            {spec.edges.map((e) => {
              const from = nodeById[e.from]
              const to = nodeById[e.to]
              if (!from || !to) return null
              const geo = edgeGeometry(e, from, to)
              return <g key={e.id}>{overlay({ type: 'edge', id: e.id, x: geo.mid.x + 30, y: geo.mid.y - 20 })}</g>
            })}
          </g>
        ) : null}
      </svg>
      {showLegend && legendKinds.length > 0 ? (
        <ul className="dg-legend" aria-label="Legend">
          {legendKinds.map((kind) => (
            <li key={kind}>
              <span className={`dg-swatch dg-kind-${kind}`} aria-hidden="true" />
              {legendLabels.get(kind) ?? NODE_KIND_LABELS[kind]}
            </li>
          ))}
        </ul>
      ) : null}
    </figure>
  )
}
