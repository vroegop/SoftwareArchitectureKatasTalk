import type { DiagramNode } from '../content/types'

const R = 10

/** Outline geometry per node kind; text is layered on top by the renderer. */
export function NodeShape({ node }: { node: DiagramNode }) {
  const { x, y, w, h, kind } = node
  switch (kind) {
    case 'person':
      return (
        <>
          <rect className="dg-shape" x={x} y={y + 26} width={w} height={h - 26} rx={R} />
          <circle className="dg-shape dg-head" cx={x + w / 2} cy={y + 18} r={15} />
        </>
      )
    case 'database':
      return (
        <>
          <path
            className="dg-shape"
            d={`M${x},${y + 10} a${w / 2},10 0 0 0 ${w},0 v${h - 20} a${w / 2},10 0 0 1 -${w},0 z`}
          />
          <ellipse className="dg-shape dg-lid" cx={x + w / 2} cy={y + 10} rx={w / 2} ry={10} />
        </>
      )
    case 'queue':
      return (
        <>
          <rect className="dg-shape" x={x} y={y} width={w} height={h} rx={6} />
          <line className="dg-shape-detail" x1={x + 12} y1={y + 4} x2={x + 12} y2={y + h - 4} />
          <line className="dg-shape-detail" x1={x + w - 12} y1={y + 4} x2={x + w - 12} y2={y + h - 4} />
        </>
      )
    case 'plugin':
      return (
        <path
          className="dg-shape"
          d={`M${x + 8},${y + 10} h24 v-10 h16 v10 h${w - 56} a8,8 0 0 1 8,8 v${h - 26} a8,8 0 0 1 -8,8 h${-(w - 16)} a8,8 0 0 1 -8,-8 v${-(h - 26)} a8,8 0 0 1 8,-8 z`}
        />
      )
    case 'gateway': {
      const c = 14
      return (
        <polygon
          className="dg-shape"
          points={`${x + c},${y} ${x + w - c},${y} ${x + w},${y + c} ${x + w},${y + h - c} ${x + w - c},${y + h} ${x + c},${y + h} ${x},${y + h - c} ${x},${y + c}`}
        />
      )
    }
    case 'ui':
      return (
        <>
          <rect className="dg-shape" x={x} y={y} width={w} height={h} rx={R} />
          <path className="dg-shape-detail" d={`M${x + 1},${y + 14} h${w - 2}`} />
          <circle className="dg-shape-dot" cx={x + 12} cy={y + 7} r={2.5} />
          <circle className="dg-shape-dot" cx={x + 21} cy={y + 7} r={2.5} />
          <circle className="dg-shape-dot" cx={x + 30} cy={y + 7} r={2.5} />
        </>
      )
    case 'note': {
      const f = 14
      return (
        <path
          className="dg-shape"
          d={`M${x},${y} h${w - f} l${f},${f} v${h - f} h${-w} z M${x + w - f},${y} v${f} h${f}`}
        />
      )
    }
    case 'boundary':
    case 'space':
      return <rect className="dg-shape" x={x} y={y} width={w} height={h} rx={14} />
    case 'layer':
      return <rect className="dg-shape" x={x} y={y} width={w} height={h} rx={6} />
    case 'filter':
      return <rect className="dg-shape" x={x} y={y} width={w} height={h} rx={h / 2} />
    case 'component':
      return (
        <>
          <rect className="dg-shape" x={x} y={y} width={w} height={h} rx={R} />
          <rect className="dg-shape-detail" x={x + w - 22} y={y + 8} width={12} height={5} />
          <rect className="dg-shape-detail" x={x + w - 22} y={y + 16} width={12} height={5} />
        </>
      )
    case 'core':
      return <rect className="dg-shape" x={x} y={y} width={w} height={h} rx={16} />
    default:
      return <rect className="dg-shape" x={x} y={y} width={w} height={h} rx={R} />
  }
}
