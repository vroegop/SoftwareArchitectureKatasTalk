import type { PageProps } from '../app/pageComponents'
import { useSearchParamNumber, useSearchParamState } from '../app/useSearchParamState'
import { timer } from '../app/stores/timerStore'
import { facilitatorRole, feedbackRules, sessionPhases, whenToSkipFacilitator } from '../content/session'
import { PageShell } from '../components/shell/PageShell'
import { SegmentedControl } from '../components/widgets/SegmentedControl'
import { Stepper } from '../components/widgets/Stepper'
import { Tabs } from '../components/widgets/Tabs'

const LENGTHS = [60, 90, 180]

function Loop() {
  const [length, setLength] = useSearchParamNumber('length', 90)
  const [step, setStep] = useSearchParamNumber('phase', 0)
  const factor = length / 90
  const scaled = (minutes: number) => Math.max(1, Math.round(minutes * factor))
  const total = sessionPhases.reduce((sum, p) => sum + scaled(p.minutes), 0)
  const active = Math.min(step, sessionPhases.length - 1)

  return (
    <div className="stack">
      <div className="row-between">
        <div className="row">
          <span className="eyebrow">Session length</span>
          <SegmentedControl
            options={LENGTHS.map((l) => ({ id: String(l), label: `${l} min` }))}
            value={String(length)}
            onChange={(id) => setLength(Number(id))}
            ariaLabel="Session length"
          />
        </div>
        <span className="small muted">
          Phases add up to {total} min; the rest is intro, breaks and questions. Hatched phases are optional.
        </span>
      </div>
      <ol className="phase-bar" aria-label="Phases">
        {sessionPhases.map((phase, i) => (
          <li key={phase.id} style={{ flexGrow: scaled(phase.minutes) }} className="phase-seg-wrap">
            <button
              type="button"
              className={`phase-seg${i === active ? ' is-active' : ''}${phase.optional ? ' is-optional' : ''}`}
              onClick={() => setStep(i)}
              title={`${phase.title} · ${scaled(phase.minutes)} min`}
              style={{ width: '100%' }}
            >
              <span>{scaled(phase.minutes)}'</span>
            </button>
          </li>
        ))}
      </ol>
      <Stepper
        steps={sessionPhases.map((phase) => ({
          id: phase.id,
          title: `${phase.title}${phase.optional ? ' (optional)' : ''}`,
          render: () => (
            <div className="phase-panel">
              <p className="level-question">{phase.goal}</p>
              <div className="phase-meta">
                <div className="card card-sm stack-sm">
                  <p className="eyebrow">Deliverable</p>
                  <p>{phase.deliverable}</p>
                </div>
                <div className="card card-sm stack-sm">
                  <p className="eyebrow">Facilitator</p>
                  <p>{phase.facilitator}</p>
                </div>
                <div className="card card-sm stack-sm">
                  <p className="eyebrow">Timebox</p>
                  <p>
                    <strong>{scaled(phase.minutes)} minutes</strong> in a {length}-minute session
                  </p>
                  <button
                    type="button"
                    className="btn btn-sm"
                    onClick={() => timer.start(scaled(phase.minutes) * 60, phase.title)}
                  >
                    ⏱ Start {scaled(phase.minutes)} min
                  </button>
                </div>
              </div>
              <ul className="bullets">
                {phase.tips.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          ),
        }))}
        active={active}
        onChange={setStep}
      />
    </div>
  )
}

export default function SessionFormatPage({ page }: PageProps) {
  const [tab, setTab] = useSearchParamState('tab', 'loop')
  return (
    <PageShell page={page}>
      <Tabs
        active={tab}
        onChange={setTab}
        tabs={[
          { id: 'loop', label: 'The loop', render: () => <Loop /> },
          {
            id: 'rules',
            label: 'Feedback rules and the facilitator',
            render: () => (
              <div className="stage-split-even stage-split">
                <section className="stack-sm">
                  <p className="eyebrow">Feedback rules</p>
                  <ol className="big-list">
                    {feedbackRules.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ol>
                </section>
                <section className="stack-sm">
                  <p className="eyebrow">The facilitator</p>
                  <ul className="bullets">
                    {facilitatorRole.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                  <p className="card card-sm small">
                    <strong>When can you skip the facilitator?</strong> {whenToSkipFacilitator}
                  </p>
                </section>
              </div>
            ),
          },
        ]}
      />
    </PageShell>
  )
}
