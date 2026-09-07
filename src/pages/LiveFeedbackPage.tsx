import { useState } from 'react'
import type { PageProps } from '../app/pageComponents'
import { live, useLive } from '../app/stores/liveStore'
import { feedbackPrompts, feedbackRotation } from '../content/live'
import { feedbackRules } from '../content/session'
import { timerPresetById } from '../content/timers'
import { PageShell } from '../components/shell/PageShell'
import { BigTimer } from '../components/widgets/BigTimer'

const LEVELS: { id: 'C1' | 'C2' | 'any'; label: string }[] = [
  { id: 'C1', label: 'For a C1' },
  { id: 'C2', label: 'For a C2' },
  { id: 'any', label: 'For any diagram' },
]

export default function LiveFeedbackPage({ page }: PageProps) {
  const state = useLive()
  const [parked, setParked] = useState('')
  const parkedPins = state.pins.filter((p) => p.group === 'parked')
  return (
    <PageShell page={page} heroAside={<BigTimer preset={timerPresetById[page.timerPreset ?? 'feedback']} />}>
      <div className="live-grid">
        <section className="stack">
          <ol className="big-list">
            {feedbackRules.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ol>
          <div className="card card-sm stack-sm">
            <p className="eyebrow">Rotation</p>
            <ul className="bullets small">
              {feedbackRotation.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
        </section>
        <section className="stack">
          {LEVELS.map((level) => (
            <div key={level.id} className="stack-sm">
              <p className="eyebrow">{level.label}</p>
              <div className="prompt-cards">
                {feedbackPrompts
                  .filter((p) => p.level === level.id)
                  .map((p) => (
                    <div key={p.prompt} className="prompt-card">
                      {p.prompt}
                    </div>
                  ))}
              </div>
            </div>
          ))}
          <div className="stack-sm" data-keys="local">
            <p className="eyebrow">Parked for the facilitator</p>
            <form
              className="row"
              onSubmit={(e) => {
                e.preventDefault()
                if (!parked.trim()) return
                live.addPin('parked', parked.trim())
                setParked('')
              }}
            >
              <input type="text" value={parked} onChange={(e) => setParked(e.target.value)} placeholder="An open question from the room" aria-label="Parked question" style={{ flex: 1 }} />
              <button type="submit" className="btn btn-sm">
                Park it
              </button>
            </form>
            {parkedPins.length > 0 ? (
              <ul className="pin-list">
                {parkedPins.map((p) => (
                  <li key={p.id} className="pin">
                    <span style={{ flex: 1 }}>{p.text}</span>
                    <button type="button" className="btn btn-sm btn-ghost" onClick={() => live.removePin(p.id)} aria-label="Remove">
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </section>
      </div>
    </PageShell>
  )
}
