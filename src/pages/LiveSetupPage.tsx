import { Link } from 'react-router-dom'
import type { PageProps } from '../app/pageComponents'
import { live, suggestGroups, useLive } from '../app/stores/liveStore'
import { kataById } from '../content/katas'
import { groupRules, materials } from '../content/live'
import type { DiagramSpec } from '../content/types'
import { node, edge } from '../content/diagram-helpers'
import { DiagramRenderer } from '../diagrams/DiagramRenderer'
import { PageShell } from '../components/shell/PageShell'

const legendSpec: DiagramSpec = {
  id: 'c4-legend',
  title: 'C4 legend for the wall',
  level: 'C1',
  height: 150,
  nodes: [
    node('person', 'person', 'Person', 20, 20, 150, 110, { description: 'role, not a name' }),
    node('system', 'system', 'Your system', 240, 30, 220, 90, { emphasis: true, description: 'one box at C1' }),
    node('external', 'external', 'External system', 530, 30, 200, 90, { description: 'you do not own it' }),
    node('container', 'container', 'Container', 790, 30, 190, 90, { tech: 'technology', description: 'at C2' }),
  ],
  edges: [edge('person', 'system', 'uses', undefined, { labelAt: 0.5 }), edge('system', 'external', 'sends X to', 'protocol')],
  legend: [],
}

export default function LiveSetupPage({ page }: PageProps) {
  const state = useLive()
  const suggestion = suggestGroups(state.participants)
  const picked = state.kataId ? kataById[state.kataId] : undefined

  const headcount = (
    <div className="headcount" data-keys="local">
      <label htmlFor="participants" className="eyebrow">
        People in the room
      </label>
      <input id="participants" type="number" min={2} max={200} value={state.participants} onChange={(e) => live.setParticipants(Number(e.target.value) || 2)} />
      <span className="headcount-result">
        {suggestion.groups} {suggestion.groups === 1 ? 'group' : 'groups'} of {suggestion.size}
      </span>
    </div>
  )

  return (
    <PageShell page={page} heroAside={headcount}>
      <div className="live-grid">
        <section className="stack">
          <ol className="big-list">
            {groupRules.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ol>
          <div className="stack-sm">
            <p className="eyebrow">On every table</p>
            <ul className="bullets">
              {materials.map((m) => (
                <li key={m.item}>
                  {m.item}
                  {m.note ? <span className="muted small"> · {m.note}</span> : null}
                </li>
              ))}
            </ul>
          </div>
        </section>
        <section className="stack">
          <div className="card card-sm legend-card">
            <DiagramRenderer spec={legendSpec} showLegend={false} />
          </div>
          <div className={`card card-sm stack-sm${picked ? ' is-selected' : ''}`}>
            <p className="eyebrow">Kata of the round</p>
            {picked ? (
              <>
                <p className="card-title">{picked.title}</p>
                <div className="btn-group">
                  <Link className="btn btn-sm btn-primary" to="/live/c1">
                    Start round 1 →
                  </Link>
                  <Link className="btn btn-sm btn-ghost" to="/library">
                    Change
                  </Link>
                </div>
              </>
            ) : (
              <>
                <p className="muted">No kata picked yet.</p>
                <Link className="btn btn-sm btn-primary" to="/library">
                  Pick a kata →
                </Link>
              </>
            )}
          </div>
        </section>
      </div>
    </PageShell>
  )
}
