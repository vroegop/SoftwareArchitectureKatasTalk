import { Link } from 'react-router-dom'
import type { PageProps } from '../app/pageComponents'
import { useSearchParamState } from '../app/useSearchParamState'
import { characteristicById } from '../content/characteristics'
import { westhavenAdr, westhavenC2, westhavenChosenStyles, westhavenPicks, westhavenQuanta, westhavenShortlist, westhavenUndecided } from '../content/example'
import { styleById } from '../content/styles'
import { DiagramRenderer } from '../diagrams/DiagramRenderer'
import { PageShell } from '../components/shell/PageShell'
import { AdrView } from '../components/widgets/AdrView'
import { SegmentedControl } from '../components/widgets/SegmentedControl'
import { StarRating } from '../components/widgets/StarRating'
import { Tabs } from '../components/widgets/Tabs'

const VERDICT_ORDER = { chosen: 0, considered: 1, rejected: 2 } as const
const drivers = westhavenPicks[0]

function Drivers() {
  const rows = [...westhavenShortlist].sort((a, b) => VERDICT_ORDER[a.verdict] - VERDICT_ORDER[b.verdict])
  return (
    <div className="stack">
      <div className="row">
        <span className="eyebrow">Driving characteristics</span>
        {drivers.top3.map((id) => (
          <span key={id} className="chip chip-accent">
            {characteristicById[id].label}
          </span>
        ))}
        <span className="small muted">{drivers.contextDescription}</span>
      </div>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Style</th>
              <th scope="col">Verdict</th>
              {drivers.top3.map((id) => (
                <th key={id} scope="col">
                  {characteristicById[id].short}
                </th>
              ))}
              <th scope="col">Why</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((entry) => {
              const style = styleById[entry.styleId]
              return (
                <tr key={entry.styleId}>
                  <td>
                    <Link to={`/styles/${style.id}`}>{style.name}</Link>
                  </td>
                  <td>
                    <span className={`chip verdict-${entry.verdict}`}>{entry.verdict}</span>
                  </td>
                  {drivers.top3.map((id) => (
                    <td key={id}>
                      <StarRating value={style.ratings[id]} size="sm" label={`${style.name} ${characteristicById[id].label}`} />
                    </td>
                  ))}
                  <td className="small">{entry.reason}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Decision() {
  const [quantum, setQuantum] = useSearchParamState('quantum', 'all')
  const active = westhavenQuanta.find((q) => q.name === quantum)
  return (
    <div className="stage-split">
      <DiagramRenderer spec={westhavenC2} highlightIds={active?.nodeIds} focusId={undefined} maxHeight="var(--stage-diagram-max)" showDescriptions={false} />
      <div className="stack">
        <div className="stack-sm">
          <p className="eyebrow">The combination</p>
          {westhavenChosenStyles.map((id) => {
            const style = styleById[id]
            const entry = westhavenShortlist.find((s) => s.styleId === id)
            return (
              <div key={id} className="card card-sm">
                <p className="card-title">
                  <Link to={`/styles/${id}`}>{style.name}</Link>
                </p>
                <p className="small">{entry?.reason}</p>
              </div>
            )
          })}
        </div>
        <div className="stack-sm">
          <p className="eyebrow">Quanta: highlight one</p>
          <SegmentedControl
            options={[{ id: 'all', label: 'None' }, ...westhavenQuanta.map((q) => ({ id: q.name, label: q.name }))]}
            value={active ? active.name : 'all'}
            onChange={setQuantum}
            ariaLabel="Quantum"
          />
          {active ? (
            <div className="card card-sm stack-sm fade-in" key={active.name}>
              <p>
                <strong>Needs:</strong> {active.needs}
              </p>
              <p className="small muted">{active.contains.join(' · ')}</p>
            </div>
          ) : (
            <p className="small muted">Two quanta with different availability needs, joined by a replayable seam.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CaseDesignPage({ page }: PageProps) {
  const [tab, setTab] = useSearchParamState('tab', 'drivers')
  return (
    <PageShell page={page}>
      <Tabs
        active={tab}
        onChange={setTab}
        tabs={[
          { id: 'drivers', label: 'Drivers and shortlist', render: () => <Drivers /> },
          { id: 'decision', label: 'Decision and quanta', render: () => <Decision /> },
          { id: 'adr', label: 'The ADR', render: () => <AdrView adr={westhavenAdr} /> },
          {
            id: 'undecided',
            label: 'Deliberately undecided',
            render: () => (
              <div className="stack measure">
                <p className="level-question">Why before how: what we wrote down as open on purpose.</p>
                <ul className="bullets">
                  {westhavenUndecided.map((u) => (
                    <li key={u}>{u}</li>
                  ))}
                </ul>
              </div>
            ),
          },
        ]}
      />
    </PageShell>
  )
}
