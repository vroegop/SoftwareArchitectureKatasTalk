import { useMemo, useState } from 'react'
import type { DiagramSpec, RiskLevel, RiskSticky, SeedRisk } from '../../content/types'
import { DiagramRenderer, type OverlayTarget } from '../../diagrams/DiagramRenderer'
import { riskBand, riskScore, risks, useRisks } from '../../app/stores/riskStore'

const LEVELS: { value: RiskLevel; label: string }[] = [
  { value: 1, label: 'low' },
  { value: 2, label: 'medium' },
  { value: 3, label: 'high' },
]

function useElementNames(spec: DiagramSpec): Map<string, string> {
  return useMemo(() => {
    const names = new Map<string, string>()
    const nodeLabel = new Map(spec.nodes.map((n) => [n.id, n.label]))
    spec.nodes.forEach((n) => names.set(n.id, n.label))
    spec.edges.forEach((e) => names.set(e.id, `${nodeLabel.get(e.from) ?? e.from} → ${nodeLabel.get(e.to) ?? e.to}${e.label ? ` (${e.label})` : ''}`))
    return names
  }, [spec])
}

function Sticky({ sticky, index, x, y, onClick }: { sticky: RiskSticky; index: number; x: number; y: number; onClick: () => void }) {
  const score = riskScore(sticky)
  const band = riskBand(score)
  const size = 30
  const ox = x - size + 6 - index * 10
  const oy = y - size / 2 + index * 6
  return (
    <g
      className={`risk-sticky risk-${band}`}
      transform={`rotate(${index % 2 === 0 ? -6 : 5} ${ox + size / 2} ${oy + size / 2})`}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
    >
      <title>
        {sticky.note} (probability {sticky.probability} × impact {sticky.impact} = {score})
      </title>
      <rect x={ox} y={oy} width={size} height={size} rx={3} />
      <text x={ox + size / 2} y={oy + size / 2 + 5} textAnchor="middle">
        {score}
      </text>
    </g>
  )
}

export function RiskStormBoard({ spec, seeds, diagramMaxHeight = 'var(--stage-diagram-max)' }: { spec: DiagramSpec; seeds?: SeedRisk[]; diagramMaxHeight?: string }) {
  const stickies = useRisks(spec.id)
  const names = useElementNames(spec)
  const [target, setTarget] = useState<string | null>(null)
  const [probability, setProbability] = useState<RiskLevel>(2)
  const [impact, setImpact] = useState<RiskLevel>(2)
  const [note, setNote] = useState('')

  const byTarget = useMemo(() => {
    const map = new Map<string, RiskSticky[]>()
    stickies.forEach((s) => map.set(s.targetId, [...(map.get(s.targetId) ?? []), s]))
    return map
  }, [stickies])

  const sorted = useMemo(() => [...stickies].sort((a, b) => riskScore(b) - riskScore(a) || a.createdAt - b.createdAt), [stickies])
  const counts = { high: 0, medium: 0, low: 0 }
  stickies.forEach((s) => {
    counts[riskBand(riskScore(s))] += 1
  })

  function add(): void {
    if (!target) return
    risks.add(spec.id, { targetId: target, probability, impact, note: note.trim() || names.get(target) || target })
    setNote('')
  }

  function overlay(t: OverlayTarget) {
    const list = byTarget.get(t.id)
    if (!list || list.length === 0) return null
    return list.map((s, i) => <Sticky key={s.id} sticky={s} index={i} x={t.x} y={t.y} onClick={() => setTarget(s.targetId)} />)
  }

  return (
    <div className="risk-board stage-split">
      <div className="risk-diagram">
        <DiagramRenderer spec={spec} onElementClick={(id) => setTarget(id)} selectedId={target ?? undefined} overlay={overlay} showDescriptions={false} maxHeight={diagramMaxHeight} />
      </div>
      <div className="risk-panel stack" data-keys="local">
        <div className="row-between">
          <h3 className="card-title">Stickies</h3>
          <span className="row">
            <span className="chip chip-danger">{counts.high} high</span>
            <span className="chip chip-warn">{counts.medium} medium</span>
            <span className="chip chip-ok">{counts.low} low</span>
          </span>
        </div>
        {target ? (
          <div className="card card-sm stack-sm risk-form">
            <p className="eyebrow">Selected element</p>
            <p>
              <strong>{names.get(target) ?? target}</strong>
            </p>
            <div className="risk-levels">
              <span className="small muted">Probability</span>
              <div className="segmented">
                {LEVELS.map((l) => (
                  <button key={l.value} type="button" className="segmented-option" aria-pressed={probability === l.value} onClick={() => setProbability(l.value)}>
                    {l.value} {l.label}
                  </button>
                ))}
              </div>
              <span className="small muted">Impact</span>
              <div className="segmented">
                {LEVELS.map((l) => (
                  <button key={l.value} type="button" className="segmented-option" aria-pressed={impact === l.value} onClick={() => setImpact(l.value)}>
                    {l.value} {l.label}
                  </button>
                ))}
              </div>
            </div>
            <input
              type="text"
              value={note}
              placeholder="What could go wrong here?"
              onChange={(e) => setNote(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') add()
              }}
              aria-label="Risk note"
            />
            <div className="row-between">
              <span className={`chip risk-chip-${riskBand(probability * impact)}`}>
                score {probability} × {impact} = {probability * impact}
              </span>
              <span className="btn-group">
                <button type="button" className="btn btn-sm btn-ghost" onClick={() => setTarget(null)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-sm btn-primary" onClick={add}>
                  Add sticky
                </button>
              </span>
            </div>
            {(byTarget.get(target) ?? []).length > 0 ? (
              <ul className="plain-list small">
                {(byTarget.get(target) ?? []).map((s) => (
                  <li key={s.id} className="row-between">
                    <span>
                      <span className={`chip risk-chip-${riskBand(riskScore(s))}`}>{riskScore(s)}</span> {s.note}
                    </span>
                    <button type="button" className="btn btn-sm btn-ghost" onClick={() => risks.remove(spec.id, s.id)} aria-label="Remove sticky">
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : (
          <p className="muted">Click a box or a line in the diagram to add a risk sticky to it.</p>
        )}
        <div className="btn-group">
          {seeds && seeds.length > 0 ? (
            <button type="button" className="btn btn-sm" onClick={() => risks.seed(spec.id, seeds)}>
              Seed demo risks
            </button>
          ) : null}
          <button type="button" className="btn btn-sm btn-ghost" onClick={() => risks.clear(spec.id)} disabled={stickies.length === 0}>
            Clear all
          </button>
          <button
            type="button"
            className="btn btn-sm btn-ghost"
            disabled={stickies.length === 0}
            onClick={() => {
              const rows = sorted.map((s) => ({ element: names.get(s.targetId) ?? s.targetId, probability: s.probability, impact: s.impact, score: riskScore(s), note: s.note }))
              void navigator.clipboard?.writeText(JSON.stringify(rows, null, 2))
            }}
          >
            Copy register
          </button>
        </div>
        {sorted.length > 0 ? (
          <div className="table-wrap">
            <table className="table risk-register">
              <thead>
                <tr>
                  <th>Score</th>
                  <th>Element</th>
                  <th>Risk</th>
                  <th>
                    <span className="visually-hidden">Remove</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((s) => {
                  const score = riskScore(s)
                  return (
                    <tr key={s.id}>
                      <td>
                        <span className={`chip risk-chip-${riskBand(score)}`}>{score}</span>
                      </td>
                      <td>
                        <button type="button" className="link-button" onClick={() => setTarget(s.targetId)}>
                          {names.get(s.targetId) ?? s.targetId}
                        </button>
                      </td>
                      <td>{s.note}</td>
                      <td>
                        <button type="button" className="btn btn-sm btn-ghost" onClick={() => risks.remove(spec.id, s.id)} aria-label="Remove">
                          ✕
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  )
}
