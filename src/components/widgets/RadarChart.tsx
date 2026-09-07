import type { Characteristic, CharacteristicId } from '../../content/types'

export type RadarRole = 'primary' | 'secondary' | 'tertiary' | 'reference'

export interface RadarSeries {
  id: string
  label: string
  values: Record<CharacteristicId, number>
  role?: RadarRole
}

const ROLES: RadarRole[] = ['primary', 'secondary', 'tertiary']

function Marker({ role, x, y }: { role: RadarRole; x: number; y: number }) {
  if (role === 'secondary') return <rect x={x - 4.5} y={y - 4.5} width={9} height={9} className="radar-marker" />
  if (role === 'tertiary') return <polygon points={`${x},${y - 5.5} ${x + 5},${y + 4} ${x - 5},${y + 4}`} className="radar-marker" />
  if (role === 'reference') return null
  return <circle cx={x} cy={y} r={4.5} className="radar-marker" />
}

/**
 * Radar of up to three styles over the eleven characteristics. Series are told
 * apart by stroke pattern and marker shape, not by hue, so the single accent
 * colour and a colour-blind reader both work.
 */
export function RadarChart({ series, axes, size = 440, max = 5 }: { series: RadarSeries[]; axes: Characteristic[]; size?: number; max?: number }) {
  const cx = size / 2
  const cy = size / 2
  const r = size * 0.33
  const n = axes.length
  const angle = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n
  const point = (i: number, v: number) => ({ x: cx + Math.cos(angle(i)) * r * (v / max), y: cy + Math.sin(angle(i)) * r * (v / max) })
  const ring = (v: number) => axes.map((_, i) => point(i, v)).map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')

  return (
    <figure className="radar">
      <svg viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`Radar chart of ${series.map((s) => s.label).join(', ')}`} className="radar-svg">
        {Array.from({ length: max }, (_, i) => (
          <polygon key={i} points={ring(i + 1)} className={`radar-ring${i + 1 === max ? ' radar-ring-outer' : ''}`} />
        ))}
        {axes.map((a, i) => {
          const end = point(i, max)
          const lab = point(i, max + 0.75)
          const cos = Math.cos(angle(i))
          const anchor = cos > 0.2 ? 'start' : cos < -0.2 ? 'end' : 'middle'
          return (
            <g key={a.id}>
              <line x1={cx} y1={cy} x2={end.x} y2={end.y} className="radar-axis" />
              <text x={lab.x} y={lab.y + 4} textAnchor={anchor} className="radar-axis-label">
                {a.short}
              </text>
            </g>
          )
        })}
        {series.map((s, si) => {
          const role = s.role ?? ROLES[si] ?? 'tertiary'
          const pts = axes.map((a, i) => point(i, s.values[a.id] ?? 0))
          return (
            <g key={s.id} className={`radar-series radar-${role}`}>
              <polygon points={pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')} className="radar-area" />
              {pts.map((p, i) => (
                <g key={axes[i].id}>
                  <title>
                    {s.label}: {axes[i].label} {s.values[axes[i].id]} of {max}
                  </title>
                  <Marker role={role} x={p.x} y={p.y} />
                </g>
              ))}
            </g>
          )
        })}
      </svg>
      {series.length > 1 ? (
        <figcaption className="radar-legend">
          {series.map((s, si) => {
            const role = s.role ?? ROLES[si] ?? 'tertiary'
            return (
              <span key={s.id} className={`radar-legend-item radar-${role}`}>
                <svg viewBox="0 0 36 12" width="36" height="12" aria-hidden="true">
                  <line x1="0" y1="6" x2="36" y2="6" className="radar-area" />
                  <Marker role={role} x={18} y={6} />
                </svg>
                {s.label}
              </span>
            )
          })}
        </figcaption>
      ) : null}
    </figure>
  )
}
