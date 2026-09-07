import type { PageProps } from '../app/pageComponents'
import { useStepHandler } from '../app/steps'
import { useSearchParamList, useSearchParamState } from '../app/useSearchParamState'
import { characteristics, characteristicById, CHARACTERISTIC_GROUP_LABELS } from '../content/characteristics'
import { characteristicExamples, characteristicRules } from '../content/characteristics-extra'
import { westhavenPicks } from '../content/example'
import type { CharacteristicId } from '../content/types'
import { PageShell } from '../components/shell/PageShell'
import { SegmentedControl } from '../components/widgets/SegmentedControl'

export default function CharacteristicsPage({ page }: PageProps) {
  const [picked, setPicked] = useSearchParamList('pick')
  const [contextId, setContext] = useSearchParamState('context', westhavenPicks[0].contextId)
  const [reveal, setReveal] = useSearchParamState('reveal', '0')
  const revealed = reveal === '1'
  const contextIndex = Math.max(
    0,
    westhavenPicks.findIndex((p) => p.contextId === contextId),
  )
  const pick = westhavenPicks[contextIndex]
  const matches = picked.filter((id) => (pick.top3 as string[]).includes(id)).length

  useStepHandler(
    () => {
      if (!revealed) {
        setReveal('1')
        return true
      }
      if (contextIndex < westhavenPicks.length - 1) {
        setContext(westhavenPicks[contextIndex + 1].contextId)
        return true
      }
      return false
    },
    () => {
      if (contextIndex > 0) {
        setContext(westhavenPicks[contextIndex - 1].contextId)
        return true
      }
      if (revealed) {
        setReveal(null)
        return true
      }
      return false
    },
  )

  const toggle = (id: CharacteristicId) => {
    if (picked.includes(id)) setPicked(picked.filter((x) => x !== id))
    else if (picked.length < 3) setPicked([...picked, id])
  }

  return (
    <PageShell page={page}>
      <div className="stage-split">
        <section className="stack">
          <div className="card stack">
            <p className="eyebrow">Westhaven: pick the three characteristics that should drive the design</p>
            <div className="chip-grid" data-keys="local">
              {characteristics.map((c) => {
                const on = picked.includes(c.id)
                const match = revealed && (pick.top3 as string[]).includes(c.id)
                return (
                  <button
                    key={c.id}
                    type="button"
                    className={`pick-chip${match ? ' is-match' : ''}`}
                    aria-pressed={on}
                    disabled={!on && picked.length >= 3}
                    onClick={() => toggle(c.id)}
                    title={c.description}
                  >
                    {c.label}
                  </button>
                )
              })}
            </div>
            <div className="row-between">
              <span className="small muted">{picked.length} of 3 chosen. Space reveals the worked answer.</span>
              <span className="btn-group">
                <button type="button" className="btn btn-sm btn-ghost" onClick={() => setPicked([])} disabled={picked.length === 0}>
                  Clear
                </button>
                <button type="button" className="btn btn-sm btn-primary" onClick={() => setReveal(revealed ? null : '1')}>
                  {revealed ? 'Hide the answer' : 'Reveal the worked answer'}
                </button>
              </span>
            </div>
          </div>
          {revealed ? (
            <div className="reveal-box fade-in">
              <SegmentedControl
                options={westhavenPicks.map((p) => ({ id: p.contextId, label: p.contextLabel }))}
                value={pick.contextId}
                onChange={setContext}
                ariaLabel="Context"
              />
              <p className="small muted">{pick.contextDescription}</p>
              <p className="level-question">{pick.top3.map((id) => characteristicById[id].label).join(' · ')}</p>
              <p>{pick.rationale}</p>
              {picked.length > 0 ? (
                <p className="small">
                  You matched {matches} of 3. {matches === 3 ? 'Same three, possibly for different reasons: the reasons are the point.' : 'Different answers are fine if you can explain the trade-off.'}
                </p>
              ) : null}
            </div>
          ) : null}
        </section>
        <section className="stack">
          {characteristicExamples.map((group) => (
            <div key={group.group} className="group-block">
              <p className="eyebrow">{CHARACTERISTIC_GROUP_LABELS[group.group]}</p>
              <div className="row">
                {group.examples.map((e) => (
                  <span key={e} className="chip">
                    {e}
                  </span>
                ))}
              </div>
            </div>
          ))}
          <ul className="bullets small">
            {characteristicRules.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>
      </div>
    </PageShell>
  )
}
